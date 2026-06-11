import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../supabase/cartService";
import { placeOrder } from "../supabase/orderService";
import { PATH } from "../constants/paths";
import { ShoppingBag, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: cartItems = [], isLoading } = useQuery({ queryKey: ["cart"], queryFn: fetchCart });

  const checkoutMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate(PATH.orders);
    },
  });

  const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (isLoading) {
    return (
      <section className="containers min-h-screen flex items-center justify-center">
        <p className="text-textish font-liter">{t("checkout.loading")}</p>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="containers min-h-screen flex flex-col items-center justify-center gap-6">
        <ShoppingBag className="w-14 h-14 text-brownish" strokeWidth={1.2} />
        <h2 className="font-liter text-3xl text-title">{t("checkout.emptyTitle")}</h2>
        <p className="text-textish font-liter text-sm">{t("checkout.emptyDesc")}</p>
        <div className="border border-brownish p-2">
          <button
            onClick={() => navigate(PATH.products)}
            className="cursor-pointer font-liter flex justify-center items-center text-title bg-brownish py-2 px-8"
          >
            {t("checkout.browseCatalog")}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="containers min-h-screen pt-36 pb-24">
      <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
        <div className="flex-1 max-w-xl">
          <h1 className="font-liter text-4xl text-title mb-2">{t("checkout.reviewOrder")}</h1>
          <p className="font-liter text-sm text-textish mb-8">
            {totalItems} {totalItems === 1 ? t("cart.item") : t("cart.items")} — {t("checkout.confirmBefore")}
          </p>

          <ul className="flex flex-col divide-y divide-brownish/50">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-5">
                <div className="w-16 h-16 shrink-0 overflow-hidden bg-brownish/30">
                  {item.product.image_url ? (
                    <img src={item.product.image_url} alt={item.product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">🌸</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-liter text-title text-base leading-snug truncate">{item.product.title}</p>
                  <p className="font-liter text-textish text-sm mt-0.5">
                    {item.product.price} € × {item.quantity}
                  </p>
                </div>
                <p className="font-liter text-title text-sm font-medium shrink-0">
                  {(item.product.price * item.quantity).toFixed(2)} €
                </p>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate(PATH.cart)}
            className="mt-6 text-xs font-liter text-textish hover:text-title transition-colors cursor-pointer"
          >
            {t("checkout.backToCart")}
          </button>
        </div>

        <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-28">
          <div className="bg-brownish/30 border border-brownish p-6 flex flex-col gap-5">
            <h2 className="font-liter text-xl text-title">{t("checkout.paymentSummary")}</h2>
            <div className="flex flex-col gap-2 border-t border-brownish/60 pt-4">
              <div className="flex justify-between text-sm">
                <span className="font-liter text-textish">{t("checkout.subtotal")}</span>
                <span className="font-liter text-title">{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-liter text-textish">{t("checkout.delivery")}</span>
                <span className="font-liter text-title">{t("checkout.free")}</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-brownish pt-4">
              <span className="font-liter text-title text-base">{t("checkout.total")}</span>
              <span className="font-liter text-title text-xl font-medium">{total.toFixed(2)} €</span>
            </div>
            {checkoutMutation.isError && (
              <p className="text-pinkish text-xs font-liter text-center">{t("checkout.error")}</p>
            )}
            <div className="border border-brownish/80 p-2">
              <button
                onClick={() => checkoutMutation.mutate()}
                disabled={checkoutMutation.isPending}
                className="cursor-pointer w-full font-liter flex justify-center items-center gap-2 text-grayish bg-brownish py-2.5 px-7 hover:bg-brownish/70 transition-colors disabled:opacity-50"
              >
                {checkoutMutation.isPending ? t("checkout.placing") : (
                  <><CheckCircle className="w-4 h-4" /> {t("checkout.placeOrder")}</>
                )}
              </button>
            </div>
            <p className="text-xs font-liter text-textish text-center leading-relaxed">{t("checkout.terms")}</p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Checkout;
