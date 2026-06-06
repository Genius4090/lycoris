# Project Documentation & Build Guide

This document describes everything that was built in this project — the full stack, architecture decisions, database schema, SQL to run, and file structure. Any agent or developer can use this to understand or recreate the project from scratch.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript ~6 + Vite 8 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite` plugin, no config file) |
| State | Redux Toolkit 2 (placeholder only) + TanStack React Query 5 (all server state) |
| Routing | React Router DOM v7 |
| Backend | Supabase (Postgres + Auth + RLS) |
| Auth | Supabase Auth — email/password with email confirmation |
| Font | Sora (Google Fonts, loaded in `index.css`) |

---

## Environment Variables

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJ...   # used only for admin user creation
```

Get these from **Supabase Dashboard → Settings → API**.

---

## Full Database Schema (run in order)

### 1. Products table

```sql
create table products (
  id         serial primary key,
  title      text not null,
  price      numeric(10,2) not null check (price >= 0),
  stock      integer not null default 0 check (stock >= 0),
  image_url  text,
  created_at timestamptz default now()
);

alter table products enable row level security;

create policy "Products are publicly readable"
  on products for select using (true);

create policy "Admins can insert products"
  on products for insert
  with check (
    (select role from public.profiles where id = auth.uid()) in ('admin', 'superadmin')
  );

create policy "Admins can update products"
  on products for update
  using (
    (select role from public.profiles where id = auth.uid()) in ('admin', 'superadmin')
  );

create policy "Admins can delete products"
  on products for delete
  using (
    (select role from public.profiles where id = auth.uid()) in ('admin', 'superadmin')
  );
```

### 2. Profiles table (user roles)

```sql
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  role       text not null default 'user'
               check (role in ('user', 'admin', 'superadmin')),
  created_at timestamptz default now()
);

alter table public.profiles disable row level security;

create policy "Profiles are readable by admins"
  on profiles for select using (true);

create policy "Users update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Admins can update profiles"
  on profiles for update
  using (
    (select role from public.profiles where id = auth.uid()) in ('admin', 'superadmin')
  );

create policy "Allow insert for authenticated and service role"
  on profiles for insert
  with check (true);
```

### 3. Auto-create profile on signup trigger

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    coalesce(new.email, new.phone, new.id::text),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### 4. Cart items table

```sql
create table cart_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id integer not null references products(id) on delete cascade,
  quantity   integer not null default 1 check (quantity > 0),
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

alter table cart_items enable row level security;

create policy "Users manage own cart"
  on cart_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### 5. Orders and order items tables

```sql
create table orders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  total      numeric(10,2) not null,
  status     text not null default 'pending'
               check (status in ('pending', 'cancelled')),
  created_at timestamptz default now()
);

alter table orders enable row level security;

create policy "Users see own orders"
  on orders for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins can read all orders"
  on orders for select
  using (
    (select role from public.profiles where id = auth.uid()) in ('admin', 'superadmin')
  );

create table order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders(id) on delete cascade,
  product_id integer not null references products(id),
  quantity   integer not null check (quantity > 0),
  unit_price numeric(10,2) not null
);

alter table order_items enable row level security;

create policy "Users see own order items"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "Admins can read all order items"
  on order_items for select
  using (
    (select role from public.profiles where id = auth.uid()) in ('admin', 'superadmin')
  );
```

### 6. Postgres functions

```sql
-- Add to cart (upsert — insert or increment quantity)
create or replace function upsert_cart_item(p_product_id integer)
returns void language plpgsql security definer as $$
declare v_stock integer;
begin
  select stock into v_stock from products where id = p_product_id;
  insert into cart_items (user_id, product_id, quantity)
  values (auth.uid(), p_product_id, 1)
  on conflict (user_id, product_id)
  do update set quantity = case
    when cart_items.quantity < v_stock then cart_items.quantity + 1
    else cart_items.quantity
  end;
end; $$;

-- Remove from cart (decrement or delete)
create or replace function decrement_cart_item(p_product_id integer)
returns void language plpgsql security definer as $$
declare v_id uuid; v_quantity integer;
begin
  select id, quantity into v_id, v_quantity
  from cart_items where user_id = auth.uid() and product_id = p_product_id;
  if not found then return; end if;
  if v_quantity > 1 then
    update cart_items set quantity = quantity - 1 where id = v_id;
  else
    delete from cart_items where id = v_id;
  end if;
end; $$;

-- Place order (atomic: create order + copy cart + decrement stock + clear cart)
create or replace function place_order()
returns void language plpgsql security definer as $$
declare v_order_id uuid; v_total numeric(10,2); v_item record;
begin
  if not exists (select 1 from cart_items where user_id = auth.uid()) then
    raise exception 'Cart is empty';
  end if;
  select coalesce(sum(p.price * c.quantity), 0) into v_total
  from cart_items c join products p on p.id = c.product_id
  where c.user_id = auth.uid();
  insert into orders (user_id, total) values (auth.uid(), v_total) returning id into v_order_id;
  for v_item in
    select c.product_id, c.quantity, p.price, p.stock
    from cart_items c join products p on p.id = c.product_id
    where c.user_id = auth.uid()
  loop
    if v_item.quantity > v_item.stock then
      raise exception 'Not enough stock for product %', v_item.product_id;
    end if;
    insert into order_items (order_id, product_id, quantity, unit_price)
    values (v_order_id, v_item.product_id, v_item.quantity, v_item.price);
    update products set stock = stock - v_item.quantity where id = v_item.product_id;
  end loop;
  delete from cart_items where user_id = auth.uid();
end; $$;

-- Cancel order (set cancelled + restore stock)
create or replace function cancel_order(p_order_id uuid)
returns void language plpgsql security definer as $$
declare v_item record; v_caller_role text;
begin
  select role into v_caller_role from profiles where id = auth.uid();
  if not exists (
    select 1 from orders where id = p_order_id and status = 'pending'
    and (user_id = auth.uid() or v_caller_role in ('admin', 'superadmin'))
  ) then
    raise exception 'Order not found or already cancelled';
  end if;
  update orders set status = 'cancelled' where id = p_order_id;
  for v_item in select product_id, quantity from order_items where order_id = p_order_id
  loop
    update products set stock = stock + v_item.quantity where id = v_item.product_id;
  end loop;
end; $$;

-- Admin delete user (superadmin/admin only)
create or replace function admin_delete_user(p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if (select role from public.profiles where id = auth.uid()) not in ('admin', 'superadmin') then
    raise exception 'Forbidden';
  end if;
  delete from auth.users where id = p_user_id;
end; $$;
```

### 7. Seed products

```sql
insert into products (title, price, stock) values
  ('Flower Bouquet', 14.00, 5),
  ('Cactus', 99.00, 10),
  ('Succulent', 24.00, 8),
  ('Orchid', 49.00, 3);
```

### 8. Make yourself superadmin

```sql
-- Backfill profiles for any users registered before trigger existed
insert into public.profiles (id, email, role)
select id, email, 'user' from auth.users
where id not in (select id from public.profiles);

-- Set your account as superadmin
update public.profiles set role = 'superadmin' where email = 'your@email.com';
```

---

## File Structure

```
src/
├── @types/
│   └── index.ts              # Product, CartRow, CartItemFull, Role, Profile
├── components/
│   ├── DashboardRoute.tsx    # Guard: admin + superadmin only
│   ├── Footer.tsx
│   ├── Header.tsx            # Nav + auth state + Dashboard link for admins
│   ├── ProtectedRoute.tsx    # Guard: logged-in users only
│   └── SuperAdminRoute.tsx   # Guard: superadmin only
├── constants/
│   └── paths.ts              # All route path constants
├── context/
│   └── AuthContext.tsx       # Auth state, role fetching, signUp/signIn/signOut
├── hooks/
│   └── reduxHooks.ts         # Typed useReduxDispatch / useReduxSelector
├── layouts/
│   ├── DashboardLayout.tsx   # Sidebar layout for /dashboard/*
│   └── MainLayout.tsx        # Header + Outlet for store pages
├── pages/
│   ├── Cart.tsx              # Cart with optimistic updates
│   ├── Checkout.tsx          # Order summary + place order
│   ├── Home.tsx              # Landing page
│   ├── Login.tsx             # Email login/register + email confirmation flow
│   ├── Orders.tsx            # User order history + cancel
│   ├── Products.tsx          # Product list + add/remove cart (guest-friendly)
│   └── dashboard/
│       ├── DashboardAdmins.tsx    # superadmin: promote/demote admins
│       ├── DashboardOrders.tsx    # admin: view + cancel all orders
│       ├── DashboardProducts.tsx  # admin: CRUD products
│       └── DashboardUsers.tsx     # admin: CRUD users + create with role
├── store/
│   └── store.ts              # Redux store (placeholder, RQ owns server state)
├── supabase/
│   ├── adminClient.ts        # Service role Supabase client for admin ops
│   ├── adminService.ts       # All dashboard DB operations
│   ├── cartService.ts        # Cart DB operations (fetchCart, addToCart, etc.)
│   ├── orderService.ts       # Order DB operations (fetchOrders, placeOrder, cancelOrder)
│   ├── productService.ts     # fetchProducts
│   └── supabase-client.ts    # Anon Supabase client
├── App.tsx                   # Router — store routes + dashboard routes
├── index.css                 # Tailwind + Sora font + .active + .containers
└── main.tsx                  # Root — Provider + QueryClientProvider + AuthProvider
```

---

## Role System

| Role | Store access | Dashboard | Admins page |
|---|---|---|---|
| Guest | Browse products only | ✗ | ✗ |
| `user` | Full shopping (cart, checkout, orders, cancel own orders) | ✗ | ✗ |
| `admin` | Full shopping + Dashboard (products, users, orders CRUD) | ✓ | ✗ |
| `superadmin` | Everything + Admins page (promote/demote admins) | ✓ | ✓ |

Roles are stored in `public.profiles.role`. The `AuthContext` fetches the role on login and exposes it via `useAuth().role`. Route guards (`DashboardRoute`, `SuperAdminRoute`) check the role and redirect accordingly.

---

## Key Architecture Decisions

### React Query owns all server state
Redux is kept as a placeholder (required by react-redux Provider) but not used for any data. All products, cart, orders, and users are fetched and mutated via React Query with proper cache invalidation.

### Optimistic updates on cart
Cart add/remove/delete/clear all use React Query's `onMutate` → `onError` (rollback) → `onSettled` (refetch) pattern. The UI updates instantly with no disabled states on buttons.

### Cart is server-side per user
`cart_items` table has `unique(user_id, product_id)`. Cart persists across devices and sessions. `upsert_cart_item` and `decrement_cart_item` are Postgres functions called via RPC — single round-trip per action.

### Orders are atomic
`place_order()` Postgres function: validates stock → creates order → copies cart to order_items (with locked unit_price) → decrements stock → clears cart. Rolls back entirely if any step fails.

### Cancel order restores stock
`cancel_order()` sets `status = 'cancelled'` and loops through `order_items` to add quantity back to `products.stock`. Both user and admin/superadmin can cancel, gated by role check inside the function.

### Admin user creation uses service role key
`adminSupabase.auth.admin.createUser()` from `adminClient.ts` uses the service role key — the only correct way to programmatically create Supabase auth users. Users created this way are email-confirmed immediately. The profile row is created by the trigger + role is updated separately.

### Email confirmation flow
After register, a `pendingConfirmEmail` key is stored in `localStorage`. If the user closes the tab, the confirmation screen reappears on next visit. Rate limit errors from Supabase also show the confirmation screen instead of an error.

### Dashboard is a separate router tree
`/dashboard/*` uses `DashboardLayout` (sidebar) independently from `MainLayout` (top nav). The `DashboardRoute` wrapper handles both authentication and role checking in one component.

---

## Common Issues & Fixes

| Issue | Fix |
|---|---|
| `relation "profiles" does not exist` on signup | Trigger function needs `set search_path = public` |
| 406 on cart SELECT | Use `.maybeSingle()` not `.single()` — returns null instead of error when no rows |
| 403 on cart INSERT | Must include `user_id` explicitly in insert, or use RPC function with `security definer` |
| `gen_salt does not exist` | pgcrypto is in `extensions` schema — call `extensions.crypt()` and `extensions.gen_salt()` |
| Dashboard CRUD not working | RLS missing insert/update/delete policies for admin role on `products` table |
| `orders` join with `profiles` 400 error | No FK between tables — fetch emails separately and merge in JS |
| New user can't log in after admin creation | Old SQL direct insert into `auth.users` creates malformed rows — use `auth.admin.createUser()` API instead |
| Redux "no valid reducer" warning | `configureStore` needs at least one reducer — add a dummy `app` slice |

---

## What's Left / Possible Extensions

- Orders table persistence for admin view (currently users see orders from DB, admins see all)
- Product image upload via Supabase Storage instead of URL input
- Pagination on dashboard tables
- Order status beyond `pending`/`cancelled` (e.g. `shipped`, `delivered`)
- User profile page (change email, password)
- Search and filter on Products page
- Cart item count badge on Header Cart link
