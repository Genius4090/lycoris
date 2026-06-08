import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminCancelOrder, adminFetchOrders } from "../../supabase/adminService";
import type { Order } from "../../supabase/orderService";

type AdminOrder = Order & { user_email: string };

const StatusBadge = ({ status }: { status: Order["status"] }) => {
  if (status === "cancelled") {
    return (
      <span className="font-liter text-xs px-2.5 py-0.5 bg-red-100 text-red-500">
        Cancelled
      </span>
    );
  }
  return (
    <span className="font-liter text-xs px-2.5 py-0.5 bg-brownish/40 text-title">
      Confirmed
    </span>
  );
};

const DashboardOrders = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: adminFetchOrders,
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId: string) => adminCancelOrder(orderId),
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ["admin-orders"] });
      const previous = queryClient.getQueryData<AdminOrder[]>(["admin-orders"]);
      queryClient.setQueryData<AdminOrder[]>(["admin-orders"], (old = []) =>
        old.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
      );
      return { previous };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["admin-orders"], ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  return (
    <div className="flex flex-col gap-8">

      {/* ── Header ── */}
      <div className="flex items-end gap-3">
        <h1 className="font-liter text-3xl text-title">Orders</h1>
        {!isLoading && (
          <span className="font-liter text-textish text-sm mb-0.5">
            {orders.length} total
          </span>
        )}
      </div>

      {/* ── Table ── */}
      <div className="border border-brownish overflow-hidden">
        {isLoading ? (
          <p className="font-liter text-textish text-sm p-6">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="font-liter text-textish text-sm p-6">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-brownish/20 border-b border-brownish">
              <tr>
                <th className="text-left px-4 py-3 font-liter text-textish font-normal">Customer</th>
                <th className="text-left px-4 py-3 font-liter text-textish font-normal">Items</th>
                <th className="text-left px-4 py-3 font-liter text-textish font-normal">Total</th>
                <th className="text-left px-4 py-3 font-liter text-textish font-normal">Date</th>
                <th className="text-left px-4 py-3 font-liter text-textish font-normal">Status</th>
                <th className="px-4 py-3 w-28" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brownish/40">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className={`transition-colors hover:bg-brownish/10 ${
                    order.status === "cancelled" ? "opacity-50" : ""
                  }`}
                >
                  {/* Customer */}
                  <td className="px-4 py-3 font-liter text-textish text-xs max-w-[160px] truncate">
                    {order.user_email}
                  </td>

                  {/* Items */}
                  <td className="px-4 py-3 max-w-[200px]">
                    <div className="flex flex-col gap-0.5">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-1.5">
                          {item.product.image_url && (
                            <div className="w-5 h-5 overflow-hidden bg-brownish/30 shrink-0">
                              <img
                                src={item.product.image_url}
                                alt={item.product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <span className="font-liter text-xs text-textish truncate">
                            {item.product.title}
                            <span className="text-lightish ml-1">×{item.quantity}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3 font-liter text-title">
                    {order.total.toFixed(2)} €
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 font-liter text-textish text-xs">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-right">
                    {order.status === "pending" && (
                      <button
                        onClick={() => cancelMutation.mutate(order.id)}
                        disabled={cancelMutation.isPending && cancelMutation.variables === order.id}
                        className="font-liter text-xs text-textish border border-brownish/50 px-3 py-1.5 hover:text-pinkish hover:border-pinkish/40 transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardOrders;



