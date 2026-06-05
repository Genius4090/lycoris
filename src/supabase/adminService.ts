import { supabase } from "./supabase-client";
import { adminSupabase } from "./adminClient";
import type { Product, Profile } from "../@types";
import type { Order } from "./orderService";

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export const adminFetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });
  if (error) throw error;
  return data as Product[];
};

export const adminCreateProduct = async (
  product: Omit<Product, "id">
): Promise<void> => {
  const { error } = await supabase.from("products").insert(product);
  if (error) throw error;
};

export const adminUpdateProduct = async (
  id: number,
  updates: Partial<Omit<Product, "id">>
): Promise<void> => {
  const { error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
};

export const adminDeleteProduct = async (id: number): Promise<void> => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
};

// ─── USERS ───────────────────────────────────────────────────────────────────

export const adminFetchUsers = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Profile[];
};

export const adminUpdateUserRole = async (
  userId: string,
  role: Profile["role"]
): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  if (error) throw error;
};

export const adminDeleteUser = async (userId: string): Promise<void> => {
  const { error } = await adminSupabase.auth.admin.deleteUser(userId);
  if (error) throw error;
};

export const adminCreateUser = async (
  email: string,
  password: string,
  role: Profile["role"]
): Promise<void> => {
  // Use the admin API — creates a proper, fully-formed auth user
  const { data, error } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // mark as confirmed so they can log in immediately
  });
  if (error) throw error;

  // Set the role in profiles (trigger creates the row, we just update role)
  if (data.user) {
    await supabase
      .from("profiles")
      .update({ role })
      .eq("id", data.user.id);
  }
};

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export const adminFetchOrders = async (): Promise<
  (Order & { user_email: string })[]
> => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items (
        *,
        product:products (id, title, image_url)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const orderData = (data ?? []) as Order[];

  // Fetch emails from profiles separately (no FK between orders and profiles)
  const userIds = [...new Set(orderData.map((o) => o.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email")
    .in("id", userIds);

  const emailMap = Object.fromEntries(
    (profiles ?? []).map((p: { id: string; email: string }) => [p.id, p.email])
  );

  return orderData.map((o) => ({
    ...o,
    user_email: emailMap[o.user_id] ?? "—",
  }));
};

export const adminCancelOrder = async (orderId: string): Promise<void> => {
  const { error } = await supabase.rpc("cancel_order", {
    p_order_id: orderId,
  });
  if (error) throw error;
};

// ─── ADMINS (superadmin only) ─────────────────────────────────────────────────

export const adminFetchAdmins = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in("role", ["admin", "superadmin"])
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Profile[];
};

export const adminPromoteToAdmin = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", userId);
  if (error) throw error;
};

export const adminDemoteToUser = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .update({ role: "user" })
    .eq("id", userId);
  if (error) throw error;
};
