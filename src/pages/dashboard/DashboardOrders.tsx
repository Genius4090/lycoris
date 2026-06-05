import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminCancelOrder, adminFetchOrders } from "../../supabase/adminService";
import type { Order } from "../../supabase/orderService";

type AdminOrder = Order & { user_email: string };

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
      <h1 className="text-xl font-semibold">Orders</h1>

      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? (
          <p className="text-gray-400 text-sm p-6">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium">Items</th>
                <th className="text-left px-4 py-3 font-medium">Total</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className={`hover:bg-gray-50 ${
                    order.status === "cancelled" ? "opacity-60" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[160px] truncate">
                    {order.user_email}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      {order.items.map((item) => (
                        <span key={item.id} className="text-xs text-gray-600">
                          {item.product.title} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{statusBadge(order.status)}</td>
                  <td className="px-4 py-3 text-right">
                    {order.status === "pending" && (
                      <button
                        onClick={() => cancelMutation.mutate(order.id)}
                        className="text-xs border border-red-200 text-red-500 px-3 py-1 rounded-lg hover:bg-red-50 cursor-pointer"
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
