import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import { PATH } from "./constants/paths";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRoute from "./components/DashboardRoute";
import SuperAdminRoute from "./components/SuperAdminRoute";
import DashboardProducts from "./pages/dashboard/DashboardProducts";
import DashboardUsers from "./pages/dashboard/DashboardUsers";
import DashboardOrders from "./pages/dashboard/DashboardOrders";
import DashboardAdmins from "./pages/dashboard/DashboardAdmins";

function App() {
  const router = createBrowserRouter([
    // ── Store (public layout) ──────────────────────────────────────────────
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: PATH.home, element: <Navigate to="/" replace /> },
        { path: PATH.login, element: <Login /> },
        { path: PATH.products, element: <Products /> },
        {
          path: PATH.cart,
          element: <ProtectedRoute><Cart /></ProtectedRoute>,
        },
        {
          path: PATH.checkout,
          element: <ProtectedRoute><Checkout /></ProtectedRoute>,
        },
        {
          path: PATH.orders,
          element: <ProtectedRoute><Orders /></ProtectedRoute>,
        },
      ],
    },
    // ── Dashboard (admin layout) ───────────────────────────────────────────
    {
      path: PATH.dashboard,
      element: <DashboardRoute><DashboardLayout /></DashboardRoute>,
      children: [
        { index: true, element: <Navigate to={PATH.dashboardProducts} replace /> },
        { path: PATH.dashboardProducts, element: <DashboardProducts /> },
        { path: PATH.dashboardUsers,    element: <DashboardUsers /> },
        { path: PATH.dashboardOrders,   element: <DashboardOrders /> },
        {
          path: PATH.dashboardAdmins,
          element: <SuperAdminRoute><DashboardAdmins /></SuperAdminRoute>,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
