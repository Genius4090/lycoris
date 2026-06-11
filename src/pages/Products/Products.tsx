import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProducts } from "../../supabase/productService";
import { addToCart, fetchCart, removeFromCart } from "../../supabase/cartService";
import { useAuth } from "../../context/AuthContext";
import type { CartItemFull } from "../../@types";
import { Card, Input, Title } from "../../components";
import { ChevronLeft, ChevronRight, TextAlignEnd } from "lucide-react";
import useDebounce from "../../hooks/debounce";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

const SWIFT = [0.22, 1, 0.36, 1] as const;

const Products = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useTranslation();
  const PAGE_SIZE = 12;

  const [search, setSearch] = useState("");
  const [sortAZ, setSortAZ] = useState(false);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const handleSearch = (val: string) => { setSearch(val); setPage(1); };

  const handleSort = () => { setSortAZ((prev) => !prev); setPage(1); };

  // Scroll to top on page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products", debouncedSearch, sortAZ, page],
    queryFn: () => fetchProducts({ search: debouncedSearch, sortAZ, page, PAGE_SIZE }),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: (productId: number) => addToCart(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<CartItemFull[]>(["cart"]);
      queryClient.setQueryData<CartItemFull[]>(["cart"], (old = []) => {
        const existing = old.find((c) => c.product_id === productId);
        if (existing) return old.map((c) => c.product_id === productId ? { ...c, quantity: c.quantity + 1 } : c);
        const product = products.find((p) => p.id === productId);
        if (!product) return old;
        return [...old, { id: `optimistic-${productId}`, user_id: "", product_id: productId, quantity: 1, product }];
      });
      return { previous };
    },
    onError: (_err, _id, ctx) => { if (ctx?.previous) queryClient.setQueryData(["cart"], ctx.previous); },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: number) => removeFromCart(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<CartItemFull[]>(["cart"]);
      queryClient.setQueryData<CartItemFull[]>(["cart"], (old = []) => {
        const existing = old.find((c) => c.product_id === productId);
        if (!existing) return old;
        if (existing.quantity > 1) return old.map((c) => c.product_id === productId ? { ...c, quantity: c.quantity - 1 } : c);
        return old.filter((c) => c.product_id !== productId);
      });
      return { previous };
    },
    onError: (_err, _id, ctx) => { if (ctx?.previous) queryClient.setQueryData(["cart"], ctx.previous); },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const getCartItem = (productId: number) => cartItems.find((c) => c.product_id === productId);

  return (
    <section className="min-h-screen flex flex-col items-center containers pt-50">

      {/* ── Title ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: SWIFT }}
      >
        <Title extraClass="max-w-[860px]">{t("catalog.title")}</Title>
      </motion.div>

      {/* ── Search bar + sort button ── */}
      <motion.div
        className="flex items-center justify-between w-full mt-25 px-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: SWIFT }}
      >
       <div className="relative">
         <Input value={search} onChange={handleSearch}/>
          {/* ── Search result label ── */}
      <AnimatePresence>
        {debouncedSearch && (
          <motion.p
            className="text-textish text-xs absolute font-sora mt-3 self-start px-4"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: SWIFT }}
          >
            {total} {total === 1 ? "result" : "results"} for &ldquo;{debouncedSearch}&rdquo;
          </motion.p>
        )}
      </AnimatePresence>
       </div>
        <button
          onClick={handleSort}
          className="cursor-pointer relative w-6 h-6 flex items-center justify-center"
          title={sortAZ ? "Sort: A → Z (click to reset)" : "Sort by name"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={sortAZ ? "sorted" : "unsorted"}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <TextAlignEnd
                className={`text-title ${sortAZ ? "rotate-180 -scale-x-100" : ""}`}
              />
            </motion.span>
          </AnimatePresence>
        </button>
      </motion.div>

    

      {/* ── Product grid ── */}
      {isLoading ? (
        <motion.p
          className="text-textish text-sm mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {t("catalog.loading")}
        </motion.p>
      ) : products.length === 0 ? (
        <motion.p
          className="text-textish text-sm mt-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: SWIFT }}
        >
          {debouncedSearch
            ? `${t("catalog.noProductsFor")} "${debouncedSearch}"`
            : t("catalog.noProducts")}.
        </motion.p>
      ) : (
        <ul className="flex flex-wrap justify-center gap-x-10 gap-y-8 mt-10">
          {products.map((product, index) => {
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
                index={index}
              />
            );
          })}
        </ul>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <motion.div
          className="flex items-center gap-4 mt-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: SWIFT }}
        >
          {/* Prev */}
          <motion.button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-1.5 py-1.5 text-grayish bg-brownish text-sm disabled:opacity-40 cursor-pointer"
            whileTap={{ scale: 0.88 }}
            transition={{ duration: 0.1 }}
          >
            <ChevronLeft />
          </motion.button>

          {/* Page numbers */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <motion.button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`w-9 h-9 cursor-pointer text-title font-liter ${
                  p === page ? "bg-brownish text-grayish!" : "border border-brownish"
                }`}
                whileTap={{ scale: 0.88 }}
                transition={{ duration: 0.1 }}
                // active page indicator pulses in
                animate={p === page ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              >
                {p}
              </motion.button>
            ))}
          </div>

          {/* Next */}
          <motion.button
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-1.5 py-1.5 text-grayish bg-brownish text-sm disabled:opacity-40 cursor-pointer"
            whileTap={{ scale: 0.88 }}
            transition={{ duration: 0.1 }}
          >
            <ChevronRight />
          </motion.button>
        </motion.div>
      )}
    </section>
  );
};

export default Products;
