import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminCancelOrder, adminFetchOrders } from "../../supabase/adminService";
import type { Order } from "../../supabase/orderService";

type AdminOrder = Order & { user_email: string };

const StatusBadge = ({ status }: { status: Order["status"] }) => (
  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
    status === "cancelled" ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"
  }`}>
    {status === "cancelled" ? "Cancelled" : "Confirmed"}
  </span>
);

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
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <h3 className="font-bold text-gray-800 text-base">All Orders</h3>
          {!isLoading && (
            <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">
              {orders.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <p className="text-gray-400 text-sm p-6">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">#</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">Customer</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">Items</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">Total</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order, idx) => (
                <tr key={order.id} className={`hover:bg-gray-50 transition-colors ${order.status === "cancelled" ? "opacity-50" : ""}`}>
                  <td className="px-5 py-3 text-xs text-gray-400 font-semibold">#{orders.length - idx}</td>
                  <td className="px-5 py-3 text-gray-600 text-xs max-w-[160px] truncate">{order.user_email}</td>
                  <td className="px-5 py-3 max-w-[200px]">
                    <div className="flex flex-col gap-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-1.5">
                          {item.product.image_url && (
                            <div className="w-5 h-5 rounded overflow-hidden bg-gray-100 shrink-0">
                              <img src={item.product.image_url} alt={item.product.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <span className="text-xs text-gray-600 truncate">
                            {item.product.title}
                            <span className="text-gray-400 ml-1">×{item.quantity}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-800">{order.total.toFixed(2)} €</td>
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-3 text-right">
                    {order.status === "pending" && (
                      <button
                        onClick={() => cancelMutation.mutate(order.id)}
                        disabled={cancelMutation.isPending && cancelMutation.variables === order.id}
                        className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-40 cursor-pointer"
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
