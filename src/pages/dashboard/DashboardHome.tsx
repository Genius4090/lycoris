import { useQuery } from "@tanstack/react-query";
import { adminFetchProducts, adminFetchUsers, adminFetchOrders } from "../../supabase/adminService";
import { ArrowUpRight, Package, Users, ClipboardList, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/paths";
import dashboardBanner from "../../assets/videos/dashboardBanner.mp4";
import { useTranslation } from "react-i18next";

const DashboardHome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: products = [] } = useQuery({ queryKey: ["admin-products"], queryFn: adminFetchProducts });
  const { data: users = [] }    = useQuery({ queryKey: ["admin-users"],    queryFn: adminFetchUsers });
  const { data: orders = [] }   = useQuery({ queryKey: ["admin-orders"],   queryFn: adminFetchOrders });

  const totalRevenue    = orders.filter((o) => o.status !== "cancelled").reduce((acc, o) => acc + o.total, 0);
  const confirmedOrders = orders.filter((o) => o.status !== "cancelled").length;

  const soldMap: Record<number, { title: string; image_url: string | null; qty: number; price: number }> = {};
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    for (const item of order.items) {
      if (!soldMap[item.product_id]) {
        soldMap[item.product_id] = { title: item.product.title, image_url: item.product.image_url, qty: 0, price: item.unit_price };
      }
      soldMap[item.product_id].qty += item.quantity;
    }
  }
  const bestSeller   = Object.values(soldMap).sort((a, b) => b.qty - a.qty)[0] ?? null;
  const recentOrders = orders.slice(0, 5);

  const stats = [
    { label: t("dashboard.totalProducts"), value: products.length,               icon: Package },
    { label: t("dashboard.users"),         value: users.length,                  icon: Users },
    { label: t("dashboard.orders"),        value: confirmedOrders,               icon: ClipboardList },
    { label: t("dashboard.revenue"),       value: `€${totalRevenue.toFixed(0)}`, icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="relative w-full h-48 overflow-hidden">
        <video autoPlay muted loop playsInline width="100%" className="object-cover blur-[2px] w-full h-full">
          <source src={dashboardBanner} type="video/webm" />
        </video>
      </div>
      <section className="-mt-32 z-100 px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-[#100d0a]/70 border border-brownish/20 px-6 py-5">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="border-brownish/40 bg-stonish border  p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="font-sora text-sm text-textish">{label}</p>
                <div className="w-7 h-7 bg-brownish/10 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-textish" />
                </div>
              </div>
              <p className="font-liter text-4xl text-title">{value}</p>
              <div className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-title" />
                <p className="font-sora text-xs text-title">{t("dashboard.allTime")}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 border-brownish/40 bg-stonish border p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-liter text-title text-base">{t("dashboard.recentOrders")}</h3>
            <button onClick={() => navigate(PATH.dashboardOrders)} className="font-sora text-xs text-title hover:text-textish transition-colors cursor-pointer flex items-center gap-1">
              {t("dashboard.viewAll")} <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          {recentOrders.length === 0 ? (
            <p className="font-sora text-sm text-title py-4">{t("dashboard.noOrders")}</p>
          ) : (
            <div className="flex flex-col divide-y divide-brownish/10 ">
              {recentOrders.map((order, idx) => (
                <div key={order.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brownish/10 border border-brownish/20 flex items-center justify-center font-sora text-xs text-title">#{orders.length - idx}</div>
                    <div>
                      <p className="font-sora text-sm text-title truncate max-w-[180px]">{order.user_email}</p>
                      <p className="font-sora text-xs text-title">{new Date(order.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-sora text-sm text-title">€{order.total.toFixed(2)}</span>
                    <span className={`font-sora text-[10px] px-2 py-0.5 ${order.status === "cancelled" ? "bg-pinkish/10 text-pinkish" : "bg-brownish/20 text-brownish"}`}>
                      {order.status === "cancelled" ? t("orders.statusCancelled") : t("orders.statusConfirmed")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border border-brownish/40 bg-stonish p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-liter text-title text-base">{t("dashboard.bestSeller")}</h3>
            <button onClick={() => navigate(PATH.dashboardProducts)} className="w-7 h-7 bg-brownish/15 border border-brownish/20 flex items-center justify-center cursor-pointer hover:bg-brownish/25 transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5 text-title" />
            </button>
          </div>
          {bestSeller ? (
            <>
              <div className="w-full h-36 overflow-hidden bg-brownish/5 border border-brownish/15">
                {bestSeller.image_url ? (
                  <img src={bestSeller.image_url} alt={bestSeller.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🌸</div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="font-sora text-sm text-title truncate max-w-[130px]">{bestSeller.title}</p>
                <p className="font-sora text-sm text-title">{bestSeller.price} €</p>
              </div>
              <p className="font-sora text-xs text-title">{bestSeller.qty} {t("dashboard.unitsSold")}</p>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="font-sora text-sm text-lightish">{t("dashboard.noSalesData")}</p>
            </div>
          )}
        </div>
      </div>
      {products.filter((p) => p.stock <= 3).length > 0 && (
        <div className="border border-brownish/40 bg-stonish p-6 flex flex-col gap-4">
          <h3 className="font-liter text-title text-base">
            {t("dashboard.lowStockAlert")}
            <span className="ml-2 font-sora text-[10px] bg-pinkish/10 text-pinkish px-2 py-0.5">{products.filter((p) => p.stock <= 3).length} {t("dashboard.items")}</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {products.filter((p) => p.stock <= 3).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 border border-brownish/40 bg-stonish">
                <div className="w-9 h-9 overflow-hidden bg-brownish/10 shrink-0">
                  {p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm opacity-30">🌸</div>}
                </div>
                <div className="min-w-0">
                  <p className="font-sora text-xs text-textish truncate">{p.title}</p>
                  <p className={`font-sora text-xs ${p.stock === 0 ? "text-pinkish" : "text-amber-400"}`}>{p.stock === 0 ? t("dashboard.outOfStock") : `${p.stock} ${t("dashboard.left")}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
