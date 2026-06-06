import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelOrder, clearOrderHistory, fetchOrders } from "../supabase/orderService";
import type { Order } from "../supabase/orderService";
import { NavLink } from "react-router-dom";
import { PATH } from "../constants/paths";

const statusBadge = (status: Order["status"]) => {
  if (status === "cancelled") {
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">
        Cancelled
      </span>
    );
  }
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
      Confirmed
    </span>
  );
};

const Orders = () => {
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  // Cancel single order — optimistic
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

  // Clear all history — optimistic
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

  const handleConfirmClear = () => {
    clearMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="containers flex justify-center py-10">
        <p className="text-gray-400 text-sm">Loading orders...</p>
      </div>
    );
  }

  return (
    <section className="containers">

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">My Orders</h2>
        {orders.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-sm text-red-500 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
          >
            Clear history
          </button>
        )}
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-7 w-full max-w-sm flex flex-col gap-5 shadow-xl">
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-base">Clear order history?</h3>
              <p className="text-sm text-gray-500">
                This will permanently delete all your orders. You can't restore it.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmClear}
                disabled={clearMutation.isPending}
                className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50 cursor-pointer"
              >
                {clearMutation.isPending ? "Clearing..." : "I'm sure, clear it"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={clearMutation.isPending}
                className="flex-1 border rounded-lg py-2 text-sm cursor-pointer hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <p className="text-gray-400 text-sm">No orders yet.</p>
          <NavLink
            to={PATH.products}
            className="bg-black text-white px-6 py-2 rounded-xl text-sm"
          >
            Start Shopping
          </NavLink>
        </div>
      ) : (
        <ul className="flex flex-col gap-6">
          {orders.map((order, idx) => (
            <li
              key={order.id}
              className={`border rounded-xl overflow-hidden transition-opacity ${
                order.status === "cancelled" ? "opacity-60" : ""
              }`}
            >
              {/* Order header */}
              <div className="bg-gray-50 px-4 py-3 flex justify-between items-center text-sm">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Order #{orders.length - idx}</span>
                    {statusBadge(order.status)}
                  </div>
                  <span className="text-gray-400 text-xs">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold">${order.total.toFixed(2)}</span>
                  {order.status === "pending" && (
                    <button
                      onClick={() => cancelMutation.mutate(order.id)}
                      className="text-xs text-red-500 border border-red-300 rounded-lg px-3 py-1 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Order items */}
              <ul className="divide-y">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-3 text-sm"
                  >
                    {item.product.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.title}
                        className="w-10 h-10 object-cover rounded-lg shrink-0"
                      />
                    )}
                    <span className="flex-1">{item.product.title}</span>
                    <span className="text-gray-400">× {item.quantity}</span>
                    <span className="font-medium">
                      ${(item.unit_price * item.quantity).toFixed(2)}
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
