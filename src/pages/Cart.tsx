import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { addToCart, clearCart, deleteCartItem, fetchCart, removeFromCart } from "../supabase/cartService";
import { PATH } from "../constants/paths";
import type { CartItemFull } from "../@types";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

const Cart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: cartItems = [], isLoading } = useQuery({ queryKey: ["cart"], queryFn: fetchCart });

  const addMutation = useMutation({
    mutationFn: (productId: number) => addToCart(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<CartItemFull[]>(["cart"]);
      queryClient.setQueryData<CartItemFull[]>(["cart"], (old = []) =>
        old.map((c) => c.product_id === productId ? { ...c, quantity: c.quantity + 1 } : c)
      );
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
        const item = old.find((c) => c.product_id === productId);
        if (!item) return old;
        if (item.quantity > 1) return old.map((c) => c.product_id === productId ? { ...c, quantity: c.quantity - 1 } : c);
        return old.filter((c) => c.product_id !== productId);
      });
      return { previous };
    },
    onError: (_err, _id, ctx) => { if (ctx?.previous) queryClient.setQueryData(["cart"], ctx.previous); },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (cartRowId: string) => deleteCartItem(cartRowId),
    onMutate: async (cartRowId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<CartItemFull[]>(["cart"]);
      queryClient.setQueryData<CartItemFull[]>(["cart"], (old = []) => old.filter((c) => c.id !== cartRowId));
      return { previous };
    },
    onError: (_err, _id, ctx) => { if (ctx?.previous) queryClient.setQueryData(["cart"], ctx.previous); },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<CartItemFull[]>(["cart"]);
      queryClient.setQueryData(["cart"], []);
      return { previous };
    },
    onError: (_err, _v, ctx) => { if (ctx?.previous) queryClient.setQueryData(["cart"], ctx.previous); },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const totalPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (isLoading) {
    return (
      <section className="containers min-h-screen pt-40 flex items-start justify-center">
        <p className="text-textish font-liter">{t("cart.loading")}</p>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="containers min-h-screen flex flex-col items-center justify-center gap-6">
        <ShoppingBag className="w-16 h-16 text-brownish" strokeWidth={1.2} />
        <h2 className="font-liter text-3xl text-title">{t("cart.empty")}</h2>
        <p className="text-textish font-liter text-[15px]">{t("cart.emptyDesc")}</p>
        <div className="border border-brownish p-2">
          <motion.button
            onClick={() => navigate(PATH.products)}
            className="cursor-pointer font-liter flex justify-center items-center text-grayish bg-brownish py-2 px-8"
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.12 }}
          >
            {t("cart.browseCatalog")}
          </motion.button>
        </div>
      </section>
    );
  }

  return (
    <section className="containers min-h-screen pt-36 pb-24 px-8">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-end gap-4">
          <h1 className="font-liter text-4xl text-title">{t("cart.title")}</h1>
          {/* Item count animates when it changes */}
          <AnimatePresence mode="wait">
            <motion.span
              key={totalItems}
              className="font-liter text-textish text-[15px] mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease }}
            >
              {totalItems} {totalItems === 1 ? t("cart.item") : t("cart.items")}
            </motion.span>
          </AnimatePresence>
        </div>
        <motion.button
          onClick={() => clearMutation.mutate()}
          disabled={clearMutation.isPending}
          className="flex items-center gap-1.5 text-[15px] font-liter text-textish hover:text-red-500 transition-colors cursor-pointer disabled:opacity-40"
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.12 }}
        >
          <Trash2 className="w-4 h-4" />
          {t("cart.clearAll")}
        </motion.button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Cart items list — AnimatePresence handles exit animation per item */}
        <ul className="flex flex-col flex-1 divide-y divide-brownish/50">
          <AnimatePresence initial={false}>
            {cartItems.map((item) => (
              <motion.li
                key={item.id}
                layout
                className="flex gap-5 py-6 group"
                exit={{ opacity: 0, x: 40, height: 0, paddingTop: 0, paddingBottom: 0 }}
                transition={{ duration: 0.3, ease }}
              >
                <div
                  className="w-24 h-24 shrink-0 overflow-hidden bg-brownish/30 cursor-pointer"
                  onClick={() => navigate(`${PATH.products}/${item.product_id}`)}
                >
                  {item.product.image_url ? (
                    <img src={item.product.image_url} alt={item.product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">🌸</div>
                  )}
                </div>

                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="font-liter text-lg text-title leading-snug cursor-pointer hover:opacity-70 transition-opacity truncate"
                      onClick={() => navigate(`${PATH.products}/${item.product_id}`)}
                    >
                      {item.product.title}
                    </h3>
                    {/* Delete button — press + spin on click */}
                    <motion.button
                      onClick={() => deleteMutation.mutate(item.id)}
                      className="text-lightish hover:text-pinkish transition-colors cursor-pointer shrink-0 mt-0.5"
                      aria-label="Remove item"
                      whileTap={{ scale: 0.8, rotate: 90 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <p className="font-liter text-[15px] text-textish">
                      {item.product.price} {t("cart.pricePerPc")}
                    </p>

                    {/* Qty stepper */}
                    <div className="flex items-center gap-3">
                      <motion.button
                        onClick={() => removeMutation.mutate(item.product_id)}
                        className="bg-brownish w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-brownish/70 transition-colors"
                        aria-label="Decrease quantity"
                        whileTap={{ scale: 0.82 }}
                        transition={{ duration: 0.1 }}
                      >
                        <Minus className="w-3.5 h-3.5 text-grayish" />
                      </motion.button>

                      {/* Qty number fades on change */}
                      <div className="h-5 flex items-center justify-center w-5">
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={item.quantity}
                            className="font-liter text-title leading-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15, ease }}
                          >
                            {item.quantity}
                          </motion.span>
                        </AnimatePresence>
                      </div>

                      <motion.button
                        onClick={() => addMutation.mutate(item.product_id)}
                        disabled={item.quantity >= item.product.stock}
                        className="bg-brownish text-title w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-brownish/70 transition-colors disabled:opacity-40"
                        aria-label="Increase quantity"
                        whileTap={{ scale: 0.82 }}
                        transition={{ duration: 0.1 }}
                      >
                        <Plus className="w-3.5 h-3.5 text-grayish" />
                      </motion.button>
                    </div>

                    {/* Line total fades when qty changes */}
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={item.quantity}
                        className="font-liter text-[15px] text-title font-medium w-20 text-right"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease }}
                      >
                        {(item.product.price * item.quantity).toFixed(2)} €
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  {item.product.stock <= 3 && item.product.stock > 0 && (
                    <p className="text-xs font-liter text-amber-600 mt-2">
                      {t("cart.lowStock", { count: item.product.stock })}
                    </p>
                  )}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Order summary sidebar */}
        <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-28">
          <div className="bg-brownish/30 border border-brownish p-6 flex flex-col gap-4">
            <h2 className="font-liter text-xl text-title">{t("cart.orderSummary")}</h2>
            <div className="border-t border-brownish/60 pt-4 flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="flex justify-between items-center text-[15px]"
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25, ease }}
                  >
                    <span className="font-liter text-textish truncate max-w-[140px]">
                      <span className="font-liter text-title">{item.product.title}</span>
                      <span className="text-title ml-1 font-liter">×{item.quantity}</span>
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={item.quantity}
                        className="font-liter text-title shrink-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease }}
                      >
                        {(item.product.price * item.quantity).toFixed(2)} €
                      </motion.span>
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="border-t border-brownish pt-4 flex justify-between items-center">
              <span className="font-liter text-title text-base">{t("cart.total")}</span>
              {/* Total price fades when it changes */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={totalPrice.toFixed(2)}
                  className="font-liter text-title text-xl font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease }}
                >
                  {totalPrice.toFixed(2)} €
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="border border-brownish/80 p-2 mt-1">
              <motion.button
                onClick={() => navigate(PATH.checkout)}
                className="cursor-pointer w-full font-liter flex justify-center items-center text-grayish bg-brownish py-2.5 px-7 hover:bg-brownish/70 transition-colors"
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.12 }}
              >
                {t("cart.checkout")}
              </motion.button>
            </div>
            <button
              onClick={() => navigate(PATH.products)}
              className="text-center text-xs font-liter text-textish hover:text-title transition-colors cursor-pointer"
            >
              {t("cart.continueShopping")}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
