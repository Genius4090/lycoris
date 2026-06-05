import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../supabase/cartService";
import { placeOrder } from "../supabase/orderService";
import { PATH } from "../constants/paths";

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  const checkoutMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      // Invalidate cart (now empty) and products (stock changed)
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate(PATH.orders);
    },
  });

  const total = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  if (isLoading) {
    return (
      <div className="containers flex justify-center py-10">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="containers flex justify-center">
      <div className="w-full max-w-md flex flex-col gap-6">
        <h2 className="text-lg font-semibold">Order Summary</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-400 text-sm">Your cart is empty.</p>
        ) : (
          <>
            <ul className="border rounded-xl divide-y">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center px-4 py-3 text-sm"
                >
                  <span>
                    {item.product.title}{" "}
                    <span className="text-gray-400">× {item.quantity}</span>
                  </span>
                  <span className="font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between font-semibold text-base border-t pt-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {checkoutMutation.isError && (
              <p className="text-red-500 text-sm text-center">
                Something went wrong. Please try again.
              </p>
            )}

            <button
              onClick={() => checkoutMutation.mutate()}
              disabled={checkoutMutation.isPending}
              className="bg-black text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50 cursor-pointer"
            >
              {checkoutMutation.isPending ? "Placing order..." : "Place Order"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
