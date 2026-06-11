import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProductById } from "../../supabase/productService";
import { addToCart, fetchCart, removeFromCart } from "../../supabase/cartService";
import { useAuth } from "../../context/AuthContext";
import type { CartItemFull } from "../../@types";
import { PATH } from "../../constants/paths";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import Popularproducts from "../../components/PopularProducts";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

const SWIFT = [0.22, 1, 0.36, 1] as const;

function ProductMore() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useTranslation();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(Number(id)),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!user,
  });

  const qty = cartItems.find((c) => c.product_id === Number(id))?.quantity ?? 0;

  const addMutation = useMutation({
    mutationFn: (productId: number) => addToCart(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<CartItemFull[]>(["cart"]);
      queryClient.setQueryData<CartItemFull[]>(["cart"], (old = []) => {
        const existing = old.find((c) => c.product_id === productId);
        if (existing) return old.map((c) => c.product_id === productId ? { ...c, quantity: c.quantity + 1 } : c);
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

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <p className="text-textish font-liter">{t("catalog.loading")}</p>
      </section>
    );
  }

  if (isError || !product) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 font-liter">{t("product.notFound")}</p>
        <button
          onClick={() => navigate(PATH.products)}
          className="font-liter text-title bg-brownish py-2 px-6"
        >
          {t("product.backToCatalogBtn")}
        </button>
      </section>
    );
  }

  return (
    <section className="min-h-screen containers pt-40 pb-20">

      {/* Back button */}
      <motion.button
        onClick={() => navigate(PATH.products)}
        className="flex items-center gap-1 text-textish font-liter mb-10 hover:opacity-70 transition-opacity cursor-pointer"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: SWIFT }}
      >
        <ChevronLeft className="w-4 h-4 mt-1" />
        {t("product.backToCatalog")}
      </motion.button>

      <div className="flex flex-col md:flex-row gap-12">

        {/* ── Product image — slides in from left ── */}
        <motion.div
          className="w-full md:w-[460px] h-[480px] bg-brownish/30 overflow-hidden shrink-0"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: SWIFT }}
        >
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">🌸</div>
          )}
        </motion.div>

        {/* ── Product details — slides in from right, staggered ── */}
        <motion.div
          className="flex flex-col gap-6 justify-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
          }}
        >
          {/* Title */}
          <motion.h1
            className="font-liter text-5xl text-title"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: SWIFT } },
            }}
          >
            {product.title}
          </motion.h1>

          {/* Price */}
          <motion.p
            className="font-liter text-xl text-textish"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: SWIFT } },
            }}
          >
            {product.price} {t("product.euro")}
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-xl font-liter text-textish max-w-[595px]"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: SWIFT } },
            }}
          >
            {t("product.description")}
          </motion.p>

          {/* Stock badge */}
          <motion.span
            className={`w-fit text-sm px-3 py-1 rounded-full font-liter ${
              product.stock === 0
                ? "bg-red-900/40 text-red-400"
                : product.stock <= 3
                ? "bg-amber-900/40 text-amber-400"
                : "bg-brownish/20 text-title"
            }`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: SWIFT } },
            }}
          >
            {product.stock === 0 ? t("product.outOfStock") : `${product.stock} ${t("product.inStock")}`}
          </motion.span>

          {/* ── Cart action ── */}
          <motion.div
            className="mt-2 w-full max-w-[280px]"
            style={{ minHeight: "60px" }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: SWIFT } },
            }}
          >
            {!user ? (
              <div className="border border-brownish p-2 w-full">
                <button
                  onClick={() => navigate(PATH.login)}
                  className="cursor-pointer w-full font-liter flex justify-center gap-2 items-center text-grayish bg-brownish py-2 px-7"
                >
                  {t("product.loginToAdd")}
                </button>
              </div>
            ) : product.stock === 0 ? (
              <div className="border border-brownish p-2 w-full opacity-70">
                <p className="w-full font-liter flex justify-center items-center text-grayish bg-brownish py-2 px-7">
                  {t("product.outOfStock")}
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                {qty === 0 ? (
                  <motion.div
                    key="add-btn"
                    className="border border-brownish p-2 w-full"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: SWIFT }}
                  >
                    <button
                      onClick={() => addMutation.mutate(product.id)}
                      className="cursor-pointer w-full font-liter flex justify-center gap-2 items-center text-grayish bg-brownish py-2 px-7"
                    >
                      {t("product.addToCart")}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="stepper"
                    className="w-full border border-brownish p-2"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: SWIFT }}
                  >
                    <div className="bg-brownish flex items-center justify-between w-full py-1">
                      <motion.button
                        onClick={() => removeMutation.mutate(product.id)}
                        className="bg-brownish text-grayish w-8 h-8 rounded-full text-lg flex items-center justify-center cursor-pointer"
                        whileTap={{ scale: 0.82 }}
                        transition={{ duration: 0.1 }}
                      >
                        <Minus className="w-4" />
                      </motion.button>

                      {/* Qty — slides up on add, down on remove */}
                      <div className="overflow-hidden h-6 flex items-center justify-center w-6">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.p
                            key={qty}
                            className="font-liter text-grayish leading-none"
                            initial={{ opacity: 0, y: addMutation.isPending ? -12 : 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: addMutation.isPending ? 12 : -12 }}
                            transition={{ duration: 0.18, ease: SWIFT }}
                          >
                            {qty}
                          </motion.p>
                        </AnimatePresence>
                      </div>

                      <motion.button
                        onClick={() => addMutation.mutate(product.id)}
                        disabled={qty >= product.stock}
                        className="bg-brownish text-grayish w-8 h-8 rounded-full text-lg disabled:opacity-40 flex items-center justify-center cursor-pointer"
                        whileTap={{ scale: 0.82 }}
                        transition={{ duration: 0.1 }}
                      >
                        <Plus className="w-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Related products */}
      <motion.div
        className="mt-20"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: SWIFT }}
      >
        <h2 className="font-liter text-2xl text-title">{t("product.seeAlso")}</h2>
        <Popularproducts />
      </motion.div>
    </section>
  );
}

export default ProductMore;
