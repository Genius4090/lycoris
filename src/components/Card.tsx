import { useNavigate } from "react-router-dom";
import { PATH } from "../constants/paths";
import { Minus, Plus } from "lucide-react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import type { Product } from "../@types";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

interface CardProps {
  product: Product;
  user: User | null;
  addMutation: UseMutationResult<void, Error, number>;
  removeMutation: UseMutationResult<void, Error, number>;
  qty: number;
  index?: number;
}

const SWIFT = [0.22, 1, 0.36, 1] as const;

const Card = ({ product, user, addMutation, removeMutation, qty, index = 0 }: CardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.li
      className="flex flex-col w-full sm:w-[370px]"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.45,
        delay: (index % 3) * 0.08,
        ease: SWIFT,
      }}
    >
      {/* Image */}
      <div className="w-full sm:w-[370px] h-[280px] sm:h-[378px] overflow-hidden bg-brownish/30">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
            onClick={() => navigate(`${PATH.products}/${product.id}`)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🌸</div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 pt-3 flex-1">
        <h3 className="font-liter text-lg leading-snug text-title">{product.title}</h3>
        <div className="flex items-center justify-between text-textish">
          <span className="font-liter">{product.price} Euro</span>
          <span className={`text-sm px-2 py-0.5 rounded-full font-liter ${
            product.stock === 0
              ? "bg-red-900/40 text-red-400"
              : product.stock <= 3
              ? "bg-amber-900/40 text-amber-400"
              : "bg-brownish/20 text-title"
          }`}>
            {product.stock === 0 ? t("card.outOfStock") : `${product.stock} ${t("card.left")}`}
          </span>
        </div>

        {/* ── Cart action area ── */}
        <div className="flex flex-col items-center mt-4" style={{ minHeight: "60px" }}>
          {!user ? (
            <div className="border border-brownish p-2 w-full">
              <button
                onClick={() => navigate(PATH.login)}
                className="cursor-pointer w-full font-liter flex justify-center gap-2 items-center text-grayish bg-brownish py-2 px-7"
              >
                {t("card.loginToAdd")}
              </button>
            </div>
          ) : product.stock === 0 ? (
            <div className="border border-brownish p-2 w-full opacity-70">
              <p className="w-full font-liter flex justify-center gap-2 items-center text-title bg-brownish py-2 px-7">
                {t("card.outOfStock")}
              </p>
            </div>
          ) : (
            // AnimatePresence swaps cleanly between "Add to Cart" and the stepper
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
                    {t("card.addToCart")}
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
                      className="bg-brownish w-8 h-8 rounded-full text-lg flex items-center justify-center cursor-pointer"
                      whileTap={{ scale: 0.82 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Minus className="w-4 text-grayish" />
                    </motion.button>

                    {/* qty number — slides up on add, down on remove */}
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
                      className="bg-brownish text-title w-8 h-8 rounded-full text-lg disabled:opacity-40 flex items-center justify-center cursor-pointer"
                      whileTap={{ scale: 0.82 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Plus className="w-4 text-grayish" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.li>
  );
};

export default Card;
