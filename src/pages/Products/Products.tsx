import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProducts } from "../../supabase/productService";
import { addToCart, fetchCart, removeFromCart } from "../../supabase/cartService";
import { useAuth } from "../../context/AuthContext";
import type { CartItemFull } from "../../@types";
import { Card, Input, Title } from "../../components";
import { ChevronLeft, ChevronRight, TextAlignEnd } from "lucide-react";
import useDebounce from "../../hooks/debounce";

const Products = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const PAGE_SIZE = 12;
  // ── Search / sort / page state ──────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [sortAZ, setSortAZ] = useState(false);
  const [page, setPage] = useState(1);

  // Debounce search so we don't fire on every keystroke
  const debouncedSearch = useDebounce(search, 400);

  // Reset to page 1 when search changes
  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  // Toggle sort — also reset to page 1
  const handleSort = () => {
    setSortAZ((prev) => !prev);
    setPage(1);
  };

  // ── Products query ──────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["products", debouncedSearch, sortAZ, page],
    queryFn: () => fetchProducts({ search: debouncedSearch, sortAZ, page,PAGE_SIZE }),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev, // keep old data while fetching next page
  });

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // ── Cart query ──────────────────────────────────────────────────────────
  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!user,
  });

  // ── Optimistic add ──────────────────────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: (productId: number) => addToCart(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<CartItemFull[]>(["cart"]);

      queryClient.setQueryData<CartItemFull[]>(["cart"], (old = []) => {
        const existing = old.find((c) => c.product_id === productId);
        if (existing) {
          return old.map((c) =>
            c.product_id === productId ? { ...c, quantity: c.quantity + 1 } : c
          );
        }
        const product = products.find((p) => p.id === productId);
        if (!product) return old;
        return [
          ...old,
          { id: `optimistic-${productId}`, user_id: "", product_id: productId, quantity: 1, product },
        ];
      });
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["cart"], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  // ── Optimistic remove ───────────────────────────────────────────────────
  const removeMutation = useMutation({
    mutationFn: (productId: number) => removeFromCart(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<CartItemFull[]>(["cart"]);
      queryClient.setQueryData<CartItemFull[]>(["cart"], (old = []) => {
        const existing = old.find((c) => c.product_id === productId);
        if (!existing) return old;
        if (existing.quantity > 1) {
          return old.map((c) =>
            c.product_id === productId ? { ...c, quantity: c.quantity - 1 } : c
          );
        }
        return old.filter((c) => c.product_id !== productId);
      });
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["cart"], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const getCartItem = (productId: number) =>
    cartItems.find((c) => c.product_id === productId);

  return (
    <section className="min-h-screen flex flex-col items-center containers pt-50">
      <Title extraClass="max-w-[810px]">
        Catalog of Floral Delights for Every Occasion
      </Title>

      {/* ── Controls ── */}
      <div className="flex items-center justify-between w-full mt-25 px-4">
        <Input value={search} onChange={handleSearch} />
        <button
          onClick={handleSort}
          className="cursor-pointer"
          title={sortAZ ? "Sort: A → Z (click to reset)" : "Sort by name"}
        >
          {sortAZ ? <TextAlignEnd className="rotate-180 -scale-x-100  transition-transform duration-300"/> : <TextAlignEnd className="transition-transform duration-300"/>}
         
        </button>
      </div>

      {/* ── Product grid ── */}
      {isLoading ? (
        <p className="text-gray-400 text-sm mt-16">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-400 text-sm mt-16">
          No products found{debouncedSearch ? ` for "${debouncedSearch}"` : ""}.
        </p>
      ) : (
        <ul className="flex flex-wrap justify-center gap-x-10 gap-y-8 mt-10">
          {products.map((product) => {
            const cartItem = getCartItem(product.id);
            const qty = cartItem?.quantity ?? 0;
            return (
              <Card
                key={product.id}
                product={product}
                user={user}
                addMutation={addMutation}
                removeMutation={removeMutation}
                qty={qty}
              />
            );
          })}
        </ul>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center gap-4 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-1.5 py-1.5 text-title bg-brownish text-sm disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft />
          </button>

         <div className="flex items-center gap-2">
           {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9  cursor-pointer text-title font-liter ${
                p === page
                  ? "bg-brownish"
                  : "border border-brownish"
              }`}
            >
              {p}
            </button>
          ))}
         </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-1.5 py-1.5 text-title bg-brownish text-sm disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </section>
  );
};

export default Products;
