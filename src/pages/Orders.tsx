import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelOrder, clearOrderHistory, fetchOrders } from "../supabase/orderService";
import type { Order } from "../supabase/orderService";
import { useNavigate } from "react-router-dom";
import { PATH } from "../constants/paths";
import { PackageOpen, X } from "lucide-react";

// ── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: Order["status"] }) => {
  if (status === "cancelled") {
    return (
      <span className="text-xs font-liter px-2.5 py-0.5 bg-red-100 text-red-500 rounded-full">
        Cancelled
      </span>
    );
  }
  return (
    <span className="text-xs font-liter px-2.5 py-0.5 bg-brownish/40 text-title rounded-full">
      Confirmed
    </span>
  );
};

const Orders = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  // ── Cancel single order — optimistic ────────────────────────────────────
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
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["orders"], ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // ── Clear all history — optimistic ──────────────────────────────────────
  const clearMutation = useMutation({
    mutationFn: clearOrderHistory,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      const previous = queryClient.getQueryData<Order[]>(["orders"]);
      queryClient.setQueryData(["orders"], []);
      return { previous };
    },
    onError: (_err, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["orders"], ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setShowConfirm(false);
    },
  });

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section className="containers min-h-screen pt-40 flex items-start justify-center">
        <p className="text-textish font-liter">Loading orders...</p>
      </section>
    );
  }

  return (
    <section className="containers min-h-screen pt-36 pb-24">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-end gap-3">
          <h1 className="font-liter text-4xl text-title">My Orders</h1>
          {orders.length > 0 && (
            <span className="font-liter text-textish text-sm mb-1">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          )}
        </div>
        {orders.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 text-sm font-liter text-textish hover:text-pinkish transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            Clear history
          </button>
        )}
      </div>

      {/* ── Confirm clear modal ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[#F8F3EC] border border-brownish p-8 w-full max-w-sm flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="font-liter text-xl text-title">Clear order history?</h3>
              <p className="font-liter text-sm text-textish">
                This permanently deletes all your orders. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="border border-brownish p-1.5 flex-1">
                <button
                  onClick={() => clearMutation.mutate()}
                  disabled={clearMutation.isPending}
                  className="w-full font-liter text-sm text-title bg-brownish py-2 hover:bg-brownish/70 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {clearMutation.isPending ? "Clearing..." : "Yes, clear it"}
                </button>
              </div>
              <div className="border border-brownish/50 p-1.5 flex-1">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={clearMutation.isPending}
                  className="w-full font-liter text-sm text-textish py-2 hover:bg-brownish/20 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-6 py-20">
          <PackageOpen className="w-16 h-16 text-brownish" strokeWidth={1.2} />
          <h2 className="font-liter text-3xl text-title">No orders yet</h2>
          <p className="font-liter text-sm text-textish">
            Your completed orders will appear here.
          </p>
          <div className="border border-brownish p-2">
            <button
              onClick={() => navigate(PATH.products)}
              className="cursor-pointer font-liter flex justify-center items-center text-title bg-brownish py-2 px-8"
            >
              Start shopping
            </button>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-6">
          {orders.map((order, idx) => (
            <li
              key={order.id}
              className={`border border-brownish overflow-hidden transition-opacity ${
                order.status === "cancelled" ? "opacity-55" : ""
              }`}
            >
              {/* ── Order header ── */}
              <div className="bg-brownish/20 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-liter text-title text-base">
                      Order #{orders.length - idx}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <span className="font-liter text-textish text-xs">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-liter text-title text-lg font-medium">
                    {order.total.toFixed(2)} €
                  </span>
                  {order.status === "pending" && (
                    <button
                      onClick={() => cancelMutation.mutate(order.id)}
                      disabled={cancelMutation.isPending && cancelMutation.variables === order.id}
                      className="text-xs font-liter text-textish border border-brownish px-3 py-1.5 hover:text-pinkish hover:border-pinkish/50 transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      Cancel order
                    </button>
                  )}
                </div>
              </div>

              {/* ── Order items ── */}
              <ul className="flex flex-col divide-y divide-brownish/40">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 shrink-0 overflow-hidden bg-brownish/30">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl opacity-20">
                          🌸
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <span className="flex-1 font-liter text-title text-sm leading-snug">
                      {item.product.title}
                    </span>

                    {/* Qty */}
                    <span className="font-liter text-textish text-sm shrink-0">
                      × {item.quantity}
                    </span>

                    {/* Line total */}
                    <span className="font-liter text-title text-sm font-medium shrink-0 w-20 text-right">
                      {(item.unit_price * item.quantity).toFixed(2)} €
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Orders;
