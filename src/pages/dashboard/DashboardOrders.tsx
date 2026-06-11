import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminCancelOrder, adminFetchOrders } from "../../supabase/adminService";
import type { Order } from "../../supabase/orderService";
import { useTranslation } from "react-i18next";

type AdminOrder = Order & { user_email: string };

const StatusBadge = ({ status }: { status: Order["status"] }) => {
  const { t } = useTranslation();
  return (
    <span className={`font-sora text-[10px] px-2 py-0.5 ${
      status === "cancelled" ? "bg-pinkish/10 text-pinkish" : "bg-brownish/20 text-brownish"
    }`}>
      {status === "cancelled" ? t("orders.statusCancelled") : t("orders.statusConfirmed")}
    </span>
  );
};

const DashboardOrders = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

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
      <div className="border border-brownish/40 bg-stonish overflow-hidden">
        <div className="px-6 py-4 border-b border-brownish/15 flex items-center gap-2">
          <h3 className="font-liter text-title text-base">{t("dashboard.orders_allOrders")}</h3>
          {!isLoading && (
            <span className="font-sora text-[10px] bg-brownish/20 text-brownish px-2 py-0.5">{orders.length}</span>
          )}
        </div>

        {isLoading ? (
          <p className="font-sora text-lightish text-sm p-6">{t("dashboard.orders_loading")}</p>
        ) : orders.length === 0 ? (
          <p className="font-sora text-lightish text-sm p-6">{t("dashboard.orders_noOrders")}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-brownish/5 border-b border-brownish/10">
              <tr>
                <th className="text-left font-sora text-[10px] uppercase tracking-widest text-title px-5 py-3">#</th>
                <th className="text-left font-sora text-[10px] uppercase tracking-widest text-title px-5 py-3">{t("dashboard.orders_customerCol")}</th>
                <th className="text-left font-sora text-[10px] uppercase tracking-widest text-title px-5 py-3">{t("dashboard.orders_itemsCol")}</th>
                <th className="text-left font-sora text-[10px] uppercase tracking-widest text-title px-5 py-3">{t("dashboard.orders_totalCol")}</th>
                <th className="text-left font-sora text-[10px] uppercase tracking-widest text-title px-5 py-3">{t("dashboard.orders_dateCol")}</th>
                <th className="text-left font-sora text-[10px] uppercase tracking-widest text-title px-5 py-3">{t("dashboard.orders_statusCol")}</th>
                <th className="px-5 py-3 w-24" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order.id} className={`border-b border-brownish/10 hover:bg-brownish/5 transition-colors ${order.status === "cancelled" ? "opacity-50" : ""}`}>
                  <td className="px-5 py-3 font-sora text-xs text-title">#{orders.length - idx}</td>
                  <td className="px-5 py-3 font-sora text-title text-xs max-w-[160px] truncate">{order.user_email}</td>
                  <td className="px-5 py-3 max-w-[200px]">
                    <div className="flex flex-col gap-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-1.5">
                          {item.product.image_url && (
                            <div className="w-5 h-5 overflow-hidden bg-brownish/10 shrink-0">
                              <img src={item.product.image_url} alt={item.product.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <span className="font-sora text-xs text-title truncate">
                            {item.product.title}
                            <span className="text-title ml-1">×{item.quantity}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-sora text-title">{order.total.toFixed(2)} €</td>
                  <td className="px-5 py-3 font-sora text-xs text-title">
                    {new Date(order.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-3 text-right">
                    {order.status === "pending" && (
                      <button
                        onClick={() => cancelMutation.mutate(order.id)}
                        disabled={cancelMutation.isPending && cancelMutation.variables === order.id}
                        className="font-sora text-xs text-title border border-brownish/30 px-3 py-1.5 hover:border-pinkish/50 hover:text-pinkish transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        {t("dashboard.orders_cancel")}
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
