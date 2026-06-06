import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../supabase/productService";
import { addToCart, fetchCart, removeFromCart } from "../supabase/cartService";
import { useAuth } from "../context/AuthContext";
import type { CartItemFull } from "../@types";
import { Card, Input, Title } from "../components";
import { TextAlignEnd } from "lucide-react";

const Products = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: products = [] } = useQuery({
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


  return (
    <section  className="min-h-screen flex flex-col items-center containers pt-50">
     <Title extraClass="max-w-[810px]">
        Catalog of Floral Delights for Every Occasion
      </Title>
  <div className="flex items-center justify-between w-full mt-25">
        <Input />
        <button className="cursor-pointer">
          <TextAlignEnd />
        </button>
      </div>
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-8 mt-10">
          {products.map((product) => {
            const cartItem = getCartItem(product.id);
            const qty = cartItem?.quantity ?? 0;
            return (
                <Card product={product} user={user} addMutation={addMutation} removeMutation={removeMutation} qty={qty}/>
            );
          })}
        </ul>

      
    </section>
  );
};

export default Products;
