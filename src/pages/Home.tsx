import { NavLink } from "react-router-dom";
import { PATH } from "../constants/paths";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="containers flex flex-col items-center gap-6 py-16 text-center">
      <h1 className="text-3xl font-bold">Welcome to the Store</h1>
      <p className="text-gray-500 max-w-sm">
        Browse our products, add items to your cart, and checkout — all saved to
        your account.
      </p>
      {user ? (
        <NavLink
          to={PATH.products}
          className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium"
        >
          Browse Products
        </NavLink>
      ) : (
        <NavLink
          to={PATH.login}
          className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium"
        >
          Get Started
        </NavLink>
      )}
    </div>
  );
};

export default Home;
