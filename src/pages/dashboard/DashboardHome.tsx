import { useQuery } from "@tanstack/react-query";
import { adminFetchProducts, adminFetchUsers, adminFetchOrders } from "../../supabase/adminService";
import { ArrowUpRight, Package, Users, ClipboardList, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/paths";
import dashboardBanner from "../../assets/videos/dashboardBanner.webm";
const DashboardHome = () => {
  const navigate = useNavigate();

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: adminFetchProducts,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminFetchUsers,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: adminFetchOrders,
  });

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((acc, o) => acc + o.total, 0);

  const confirmedOrders = orders.filter((o) => o.status !== "cancelled").length;

  // Best seller — product with most total quantity sold
  const soldMap: Record<number, { title: string; image_url: string | null; qty: number; price: number }> = {};
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    for (const item of order.items) {
      if (!soldMap[item.product_id]) {
        soldMap[item.product_id] = {
          title: item.product.title,
          image_url: item.product.image_url,
          qty: 0,
          price: item.unit_price,
        };
      }
      soldMap[item.product_id].qty += item.quantity;
    }
  }
  const bestSeller = Object.values(soldMap).sort((a, b) => b.qty - a.qty)[0] ?? null;

  // Recent orders — last 5
  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "bg-[#1a6b3c]",
      text: "text-white",
    },
    {
      label: "Users",
      value: users.length,
      icon: Users,
      color: "bg-[#e6b800]",
      text: "text-gray-900",
    },
    {
      label: "Orders",
      value: confirmedOrders,
      icon: ClipboardList,
      color: "bg-[#7c3aed]",
      text: "text-white",
    },
    {
      label: "Revenue",
      value: `€${totalRevenue.toFixed(0)}`,
      icon: TrendingUp,
      color: "bg-[#ea580c]",
      text: "text-white",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Hero banner ── */}
      <div className="relative w-full h-50 rounded-3xl overflow-hidden bg-linear-to-r from-slate-700 to-slate-500">
      <video
      autoPlay
      muted
      loop
      playsInline
      width="100%"
      className="object-cover blur-[2px] w-full h-full">
      <source src={dashboardBanner} type="video/webm" />
      Your browser does not support the video tag.
    </video>
   </div>

      {/* ── Stat cards ── */}
      <section className="-mt-32 z-100 px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-[#ffffff50]  px-6 py-5 rounded-3xl">
        {stats.map(({ label, value, icon: Icon, color, text }) => (
          <div key={label} className={`${color} rounded-2xl p-5 flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
              <p className={`text-sm font-medium ${text} opacity-80`}>{label}</p>
              <div className={`w-7 h-7 rounded-full bg-white/20 flex items-center justify-center`}>
                <ArrowUpRight className={`w-4 h-4 ${text}`} />
              </div>
            </div>
            <p className={`text-4xl font-bold ${text}`}>{value}</p>
            <div className="flex items-center gap-1.5">
              <Icon className={`w-3.5 h-3.5 ${text} opacity-60`} />
              <p className={`text-xs ${text} opacity-60`}>All time</p>
            </div>
          </div>
        ))}
      </div>
      </section>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-base">Recent Orders</h3>
            <button
              onClick={() => navigate(PATH.dashboardOrders)}
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">No orders yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {recentOrders.map((order, idx) => (
                <div key={order.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                      #{orders.length - idx}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 truncate max-w-[180px]">
                        {order.user_email}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-800">
                      €{order.total.toFixed(2)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.status === "cancelled"
                        ? "bg-red-100 text-red-500"
                        : "bg-green-100 text-green-600"
                    }`}>
                      {order.status === "cancelled" ? "Cancelled" : "Confirmed"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Best Seller */}
        <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-base">Best Seller</h3>
            <button
              onClick={() => navigate(PATH.dashboardProducts)}
              className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {bestSeller ? (
            <>
              <div className="w-full h-36 rounded-xl overflow-hidden bg-gray-100">
                {bestSeller.image_url ? (
                  <img
                    src={bestSeller.image_url}
                    alt={bestSeller.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
                    🌸
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800 truncate max-w-[130px]">
                  {bestSeller.title}
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {bestSeller.price} €
                </p>
              </div>
              <p className="text-xs text-gray-400">{bestSeller.qty} units sold</p>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-gray-400">No sales data yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Low stock alert ── */}
      {products.filter((p) => p.stock <= 3).length > 0 && (
        <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-bold text-gray-800 text-base">
            Low Stock Alert
            <span className="ml-2 text-xs font-semibold bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
              {products.filter((p) => p.stock <= 3).length} items
            </span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {products
              .filter((p) => p.stock <= 3)
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm opacity-30">🌸</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{p.title}</p>
                    <p className={`text-xs font-bold ${p.stock === 0 ? "text-red-500" : "text-amber-500"}`}>
                      {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                    </p>
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
