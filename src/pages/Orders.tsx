import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelOrder, clearOrderHistory, fetchOrders } from "../supabase/orderService";
import type { Order } from "../supabase/orderService";
import { useNavigate } from "react-router-dom";
import { PATH } from "../constants/paths";
import { PackageOpen, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

const StatusBadge = ({ status }: { status: Order["status"] }) => {
  const { t } = useTranslation();
  if (status === "cancelled") {
    return (
      <motion.span
        className="text-xs font-liter px-2.5 py-0.5 bg-red-100 text-red-500 rounded-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease }}
      >
        {t("orders.statusCancelled")}
      </motion.span>
    );
  }
  return <span className="text-xs font-liter px-2.5 py-0.5 bg-brownish/40 text-title rounded-full">{t("orders.statusConfirmed")}</span>;
};

const Orders = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: orders = [], isLoading } = useQuery({ queryKey: ["orders"], queryFn: fetchOrders });

  const cancelMutation = useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      const previous = queryClient.getQueryData<Order[]>(["orders"]);
      queryClient.setQueryData<Order[]>(["orders"], (old = []) =>
        old.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => { if (ctx?.previous) queryClient.setQueryData(["orders"], ctx.previous); },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearOrderHistory,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      const previous = queryClient.getQueryData<Order[]>(["orders"]);
      queryClient.setQueryData(["orders"], []);
      return { previous };
    },
    onError: (_err, _v, ctx) => { if (ctx?.previous) queryClient.setQueryData(["orders"], ctx.previous); },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: ["orders"] }); setShowConfirm(false); },
  });

  if (isLoading) {
    return (
      <section className="containers min-h-screen pt-40 flex items-start justify-center">
        <p className="text-textish font-liter">{t("orders.loading")}</p>
      </section>
    );
  }

  return (
    <section className="containers min-h-screen pt-36 pb-24">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-end gap-3">
          <h1 className="font-liter text-4xl text-title">{t("orders.title")}</h1>
          {orders.length > 0 && (
            <span className="font-liter text-textish text-sm mb-1">
              {orders.length} {orders.length === 1 ? t("orders.order") : t("orders.orders")}
            </span>
          )}
        </div>
        {orders.length > 0 && (
          <motion.button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 text-sm font-liter text-textish hover:text-pinkish transition-colors cursor-pointer"
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.12 }}
          >
            <X className="w-4 h-4 mt-0.5" />
            {t("orders.clearHistory")}
          </motion.button>
        )}
      </div>

      {/* Confirm modal — scales in from center */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowConfirm(false); }}
          >
            <motion.div
              className="bg-[#1a1511] border border-brownish p-8 w-full max-w-sm flex flex-col gap-6"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.25, ease }}
            >
              <div className="flex flex-col gap-2">
                <h3 className="font-liter text-xl text-title">{t("orders.clearConfirmTitle")}</h3>
                <p className="font-liter text-sm text-textish">{t("orders.clearConfirmDesc")}</p>
              </div>
              <div className="flex gap-3">
                <div className="border border-brownish p-1.5 flex-1">
                  <motion.button
                    onClick={() => clearMutation.mutate()}
                    disabled={clearMutation.isPending}
                    className="w-full font-liter text-sm text-grayish bg-brownish py-2 hover:bg-brownish/70 transition-colors disabled:opacity-50 cursor-pointer"
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.12 }}
                  >
                    {clearMutation.isPending ? t("orders.clearing") : t("orders.yesClear")}
                  </motion.button>
                </div>
                <div className="border border-brownish/50 p-1.5 flex-1">
                  <motion.button
                    onClick={() => setShowConfirm(false)}
                    disabled={clearMutation.isPending}
                    className="w-full font-liter text-sm text-textish py-2 hover:bg-brownish/20 transition-colors disabled:opacity-50 cursor-pointer"
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.12 }}
                  >
                    {t("orders.cancel")}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-6 py-20">
          <PackageOpen className="w-16 h-16 text-brownish" strokeWidth={1.2} />
          <h2 className="font-liter text-3xl text-title">{t("orders.emptyTitle")}</h2>
          <p className="font-liter text-sm text-textish">{t("orders.emptyDesc")}</p>
          <div className="border border-brownish p-2">
            <motion.button
              onClick={() => navigate(PATH.products)}
              className="cursor-pointer font-liter flex justify-center items-center text-grayish bg-brownish py-2 px-8"
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.12 }}
            >
              {t("orders.startShopping")}
            </motion.button>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-6">
          <AnimatePresence initial={false}>
            {orders.map((order, idx) => (
              <motion.li
                key={order.id}
                layout
                className={`border border-brownish overflow-hidden transition-opacity ${order.status === "cancelled" ? "opacity-55" : ""}`}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3, ease }}
              >
                <div className="bg-brownish/20 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-liter text-title text-base">{t("orders.orderNum")}{orders.length - idx}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <span className="font-liter text-textish text-xs">
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-liter text-title text-lg font-medium">{order.total.toFixed(2)} €</span>
                    {order.status === "pending" && (
                      <motion.button
                        onClick={() => cancelMutation.mutate(order.id)}
                        disabled={cancelMutation.isPending && cancelMutation.variables === order.id}
                        className="text-xs font-liter text-textish border border-brownish px-3 py-1.5 hover:text-pinkish hover:border-pinkish/50 transition-colors disabled:opacity-40 cursor-pointer"
                        whileTap={{ scale: 0.94 }}
                        transition={{ duration: 0.12 }}
                      >
                        {t("orders.cancelOrder")}
                      </motion.button>
                    )}
                  </div>
                </div>

                <ul className="flex flex-col divide-y divide-brownish/40">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                      <div className="w-12 h-12 shrink-0 overflow-hidden bg-brownish/30">
                        {item.product.image_url ? (
                          <img src={item.product.image_url} alt={item.product.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl opacity-20">🌸</div>
                        )}
                      </div>
                      <span className="flex-1 font-liter text-title text-sm leading-snug">{item.product.title}</span>
                      <span className="font-liter text-textish text-sm shrink-0">× {item.quantity}</span>
                      <span className="font-liter text-title text-sm font-medium shrink-0 w-20 text-right">
                        {(item.unit_price * item.quantity).toFixed(2)} €
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
};

export default Orders;
