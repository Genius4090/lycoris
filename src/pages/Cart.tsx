import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  clearCart,
  deleteCartItem,
  fetchCart,
  removeFromCart,
} from "../supabase/cartService";
import { PATH } from "../constants/paths";
import type { CartItemFull } from "../@types";

const Cart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  // ── Optimistic add ──────────────────────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: (productId: number) => addToCart(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<CartItemFull[]>(["cart"]);

      queryClient.setQueryData<CartItemFull[]>(["cart"], (old = []) =>
        old.map((c) =>
          c.product_id === productId ? { ...c, quantity: c.quantity + 1 } : c
        )
      );

      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["cart"], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  // ── Optimistic remove (decrement or delete) ─────────────────────────────
  const removeMutation = useMutation({
    mutationFn: (productId: number) => removeFromCart(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<CartItemFull[]>(["cart"]);

      queryClient.setQueryData<CartItemFull[]>(["cart"], (old = []) => {
        const item = old.find((c) => c.product_id === productId);
        if (!item) return old;
        if (item.quantity > 1) {
          return old.map((c) =>
            c.product_id === productId ? { ...c, quantity: c.quantity - 1 } : c
          );
        }
        return old.filter((c) => c.product_id !== productId);
      });

      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["cart"], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  // ── Optimistic delete row ───────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (cartRowId: string) => deleteCartItem(cartRowId),
    onMutate: async (cartRowId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<CartItemFull[]>(["cart"]);

      queryClient.setQueryData<CartItemFull[]>(["cart"], (old = []) =>
        old.filter((c) => c.id !== cartRowId)
      );

      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["cart"], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  // ── Optimistic clear ────────────────────────────────────────────────────
  const clearMutation = useMutation({
    mutationFn: clearCart,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<CartItemFull[]>(["cart"]);
      queryClient.setQueryData(["cart"], []);
      return { previous };
    },
    onError: (_err, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["cart"], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="containers flex justify-center py-10">
        <p className="text-gray-400 text-sm">Loading cart...</p>
      </div>
    );
  }

  return (
    <section className="containers">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Your Cart</h2>
        {cartItems.length > 0 && (
          <button
            onClick={() => clearMutation.mutate()}
            className="text-sm text-red-500 underline"
          >
            Clear cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-10">
          Your cart is empty.
        </p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items list */}
          <ul className="flex flex-col gap-4 flex-1">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="border rounded-xl p-4 flex items-center gap-4"
              >
                {item.product.image_url && (
                  <img
                    src={item.product.image_url}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded-lg shrink-0"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.product.title}</p>
                  <p className="text-sm text-gray-500">
                    ${item.product.price} each
                  </p>
                  <p className="text-xs text-gray-400">
                    Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Quantity controls — no disabled state, updates feel instant */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => removeMutation.mutate(item.product_id)}
                    className="bg-black text-white w-7 h-7 rounded-full"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => addMutation.mutate(item.product_id)}
                    disabled={item.quantity >= item.product.stock}
                    className="bg-black text-white w-7 h-7 rounded-full disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                {/* Remove entirely */}
                <button
                  onClick={() => deleteMutation.mutate(item.id)}
                  className="text-gray-400 hover:text-red-500 text-lg ml-2"
                  aria-label="Remove item"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          {/* Order summary */}
          <div className="bg-black text-white rounded-xl p-6 flex flex-col gap-3 w-full lg:w-64 h-fit">
            <h3 className="font-semibold">Summary</h3>
            <div className="flex justify-between text-sm">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate(PATH.checkout)}
              className="bg-white text-black rounded-lg py-2 text-sm font-medium mt-2 cursor-pointer"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;
