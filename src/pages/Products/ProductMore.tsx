import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProductById, fetchProducts } from "../../supabase/productService";
import { addToCart, fetchCart, removeFromCart } from "../../supabase/cartService";
import { useAuth } from "../../context/AuthContext";
import type { CartItemFull } from "../../@types";
import { PATH } from "../../constants/paths";
import { ChevronLeft, Minus, Plus } from "lucide-react";

function ProductMore() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
   const PAGE_SIZE = 4


   

  // ── Product query ───────────────────────────────────────────────────────
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(Number(id)),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  // ── Cart query ──────────────────────────────────────────────────────────
  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!user,
  });

  const qty = cartItems.find((c) => c.product_id === Number(id))?.quantity ?? 0;

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
        if (!product) return old;
        return [
          ...old,
          { id: `optimistic-${productId}`, user_id: "", product_id: productId, quantity: 1, product },
        ];
      });

      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["cart"], ctx.previous);
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
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["cart"], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });


  // - Products 

   const { data: Popularproduct } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts({ PAGE_SIZE }),
    staleTime: 1000 * 60 * 5,
  });
  
   
   


  // ── States ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <p className="text-textish font-liter">Loading...</p>
      </section>
    );
  }

  if (isError || !product) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 font-liter">Product not found.</p>
        <button
          onClick={() => navigate(PATH.products)}
          className="font-liter text-title bg-brownish py-2 px-6"
        >
          Back to catalog
        </button>
      </section>
    );
  }

  return (
    <section className="min-h-screen containers pt-40 pb-20">
     
      {/* Back button */}
      <button
        onClick={() => navigate(PATH.products)}
        className="flex items-center gap-1 text-textish font-liter mb-10 hover:opacity-70 transition-opacity cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 mt-1" />
        Back to catalog
      </button>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Image */}
        <div className="w-full md:w-[460px] h-[480px] bg-brownish/30 overflow-hidden shrink-0">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">
              🌸
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6 justify-center">
          <h1 className="font-liter text-5xl text-title">
            {product.title}
          </h1>

          <p className="font-liter text-xl text-textish">{product.price} Euro</p>
   <p className="text-xl font-liter text-textish max-w-[595px]">Harmonious blend of vibrant roses, fragrant lavender, delicate baby's breath, and elegant eucalyptus leaves, all artfully hand-tied with a satin ribbon.</p>
          <span
            className={`w-fit text-sm px-3 py-1 rounded-full font-liter ${
              product.stock === 0
                ? "bg-red-900/40 text-red-400"
                : product.stock <= 3
                ? "bg-amber-900/40 text-amber-400"
                : "bg-brownish/20 text-title"
            }`}
          >
            {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
          </span>

          {/* ── Cart action ── */}
          <div className="mt-2 w-full max-w-[280px]">
            {!user ? (
              <div className="border border-brownish p-2 w-full">
                <button
                  onClick={() => navigate(PATH.login)}
                  className="cursor-pointer w-full font-liter flex justify-center gap-2 items-center text-grayish bg-brownish py-2 px-7"
                >
                  Log in to add to cart
                </button>
              </div>
            ) : product.stock === 0 ? (
              <div className="border border-brownish p-2 w-full opacity-70">
                <p className="w-full font-liter flex justify-center items-center text-grayish bg-brownish py-2 px-7">
                  Out of stock
                </p>
              </div>
            ) : qty > 0 ? (
              <div className="w-full border border-brownish p-2">
                <div className="bg-brownish flex items-center justify-between w-full py-1">
                  <button
                    onClick={() => removeMutation.mutate(product.id)}
                    className="bg-brownish text-grayish w-8 h-8 rounded-full text-lg flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-4" />
                  </button>
                  <p className="font-liter mb-0.5 text-grayish">{qty}</p>
                  <button
                    onClick={() => addMutation.mutate(product.id)}
                    disabled={qty >= product.stock}
                    className="bg-brownish text-grayish w-8 h-8 rounded-full text-lg disabled:opacity-40 flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-brownish p-2 w-full">
                <button
                  onClick={() => addMutation.mutate(product.id)}
                  className="cursor-pointer w-full font-liter flex justify-center gap-2 items-center text-grayish bg-brownish py-2 px-7"
                >
                  Add to cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
  {/* More products to explore */}
      <div className="mt-20">
           <h2 className="font-liter text-2xl text-title">See Also</h2>
        <ul className="flex items-center gap-10 mt-9">
            {Popularproduct?.products.map(product => 
              <div className="flex flex-col gap-2">
        <div className="w-[250px] h-[280px] overflow-hidden bg-brownish/30">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
            onClick={()=> navigate(`${PATH.products}/${product.id}`)}
          />

        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
            🌸
          </div>
        )}
      </div>
       <div className="flex items-center justify-between">
         <p className=" font-liter text-title">{product.title}</p>
         <p className="font-liter text-title">{product.price} Euro</p>
       </div>

              </div>
            )}
        </ul>
      </div>

    </section>
  );
}

export default ProductMore;
