import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../supabase/productService";
import { addToCart, fetchCart, removeFromCart } from "../supabase/cartService";
import { useAuth } from "../context/AuthContext";
import { PATH } from "../constants/paths";
import type { CartItemFull } from "../@types";

const Products = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!user,
  });

  // ── Optimistic add ──────────────────────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: (productId: number) => addToCart(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<CartItemFull[]>(["cart"]);

      queryClient.setQueryData<CartItemFull[]>(["cart"], (old = []) => {
        const existing = old.find((c) => c.product_id === productId);
        if (existing) {
          return old.map((c) =>
            c.product_id === productId ? { ...c, quantity: c.quantity + 1 } : c
          );
        }
        // Optimistically insert a new row — product data comes from the products cache
        const product = products.find((p) => p.id === productId);
        if (!product) return old;
        return [
          ...old,
          {
            id: `optimistic-${productId}`,
            user_id: "",
            product_id: productId,
            quantity: 1,
            product,
          },
        ];
      });

      return { previous };
    },
    onError: (_err, _productId, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["cart"], ctx.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  // ── Optimistic remove ───────────────────────────────────────────────────
  const removeMutation = useMutation({
    mutationFn: (productId: number) => removeFromCart(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<CartItemFull[]>(["cart"]);

      queryClient.setQueryData<CartItemFull[]>(["cart"], (old = []) => {
        const existing = old.find((c) => c.product_id === productId);
        if (!existing) return old;
        if (existing.quantity > 1) {
          return old.map((c) =>
            c.product_id === productId ? { ...c, quantity: c.quantity - 1 } : c
          );
        }
        return old.filter((c) => c.product_id !== productId);
      });

      return { previous };
    },
    onError: (_err, _productId, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["cart"], ctx.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const getCartItem = (productId: number) =>
    cartItems.find((c) => c.product_id === productId);

  if (productsLoading) {
    return (
      <div className="containers flex justify-center py-10">
        <p className="text-gray-400 text-sm">Loading products...</p>
      </div>
    );
  }

  return (
    <section className="containers">
      <h2 className="text-lg font-semibold mb-6 text-center">Products</h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-400 text-sm">No products yet.</p>
      ) : (
        <ul className="flex flex-wrap justify-center gap-6">
          {products.map((product) => {
            const cartItem = getCartItem(product.id);
            const qty = cartItem?.quantity ?? 0;

            return (
              <li
                key={product.id}
                className="border rounded-xl p-5 w-[220px] flex flex-col items-center gap-3"
              >
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-36 object-cover rounded-lg"
                  />
                )}
                <h3 className="font-medium text-center">{product.title}</h3>
                <p className="text-sm text-gray-500">${product.price}</p>
                <p className="text-xs text-gray-400">Stock: {product.stock}</p>

                {!user ? (
                  <button
                    onClick={() => navigate(PATH.login)}
                    className="border border-black text-black px-4 py-1.5 rounded-lg text-sm w-full hover:bg-black hover:text-white transition-colors"
                  >
                    Log in to add to cart
                  </button>
                ) : product.stock === 0 ? (
                  <button
                    disabled
                    className="bg-black text-white px-4 py-1.5 rounded-lg text-sm w-full opacity-40"
                  >
                    Out of stock
                  </button>
                ) : qty > 0 ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => removeMutation.mutate(product.id)}
                      className="bg-black text-white w-8 h-8 rounded-full text-lg"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-medium">{qty}</span>
                    <button
                      onClick={() => addMutation.mutate(product.id)}
                      disabled={qty >= product.stock}
                      className="bg-black text-white w-8 h-8 rounded-full text-lg disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addMutation.mutate(product.id)}
                    className="bg-black text-white px-4 py-1.5 rounded-lg text-sm w-full"
                  >
                    Add to cart
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default Products;
