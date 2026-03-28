"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

import type { ProductDisplay } from "@/types/product";
import { useLanguage } from "@/contexts/language-context";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Price, QuantitySelector } from "@/components/storefront";
import { CheckoutForm } from "@/components/checkout";
import type { CheckoutFormData } from "@/components/checkout";

interface ProductDetailsClientProps {
  product: ProductDisplay;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [buyNowSubmitting, setBuyNowSubmitting] = useState(false);
  const [buyNowError, setBuyNowError] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNowSubmit = async (data: CheckoutFormData) => {
    setBuyNowError(null);
    setBuyNowSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: data.fullName,
          phone: data.phone,
          location: data.location,
          locale,
          items: [{ product, quantity }],
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        const msg =
          json?.error === "EMPTY_CART"
            ? t("order.errorEmptyCart")
            : json?.error
              ? t(json.error)
              : t("order.errorGeneric");
        setBuyNowError(msg);
        return;
      }
      setBuyNowOpen(false);
      router.push(`/checkout/success?ref=${encodeURIComponent(json.orderReference)}`);
    } catch {
      setBuyNowError(t("order.errorGeneric"));
    } finally {
      setBuyNowSubmitting(false);
    }
  };

  return (
    <>
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3">
          <QuantitySelector
            value={quantity}
            onValueChange={setQuantity}
            max={product.stock}
          />
          <Button
            variant="outline"
            size="icon-lg"
            onClick={() => setIsWishlisted(!isWishlisted)}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`size-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="lg"
            className="h-11 min-w-0 flex-1"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            {t("product.addToCart")}
          </Button>
          <Button
            size="lg"
            className="h-11 min-w-0 flex-1 border border-accent/60 bg-accent text-accent-foreground shadow-sm hover:bg-accent/90"
            disabled={product.stock === 0}
            onClick={() => {
              setBuyNowError(null);
              setBuyNowOpen(true);
            }}
          >
            {t("product.buyNow")}
          </Button>
        </div>
      </div>
      {buyNowOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border bg-background p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold tracking-tight">{t("product.buyNowTitle")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t("product.buyNowSubtitle")}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setBuyNowOpen(false)}
                disabled={buyNowSubmitting}
              >
                {t("account.orders.cancel.close")}
              </Button>
            </div>

            <div className="mb-5 rounded-xl border bg-muted/30 p-4">
              <p className="text-sm font-semibold">{product.name}</p>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                <span>
                  {t("cart.qty")}: {quantity}
                </span>
                <Price value={product.price * quantity} className="font-semibold text-foreground" />
              </div>
            </div>

            {buyNowError && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-sm font-medium text-destructive"
              >
                {buyNowError}
              </div>
            )}

            <CheckoutForm
              onSubmit={handleBuyNowSubmit}
              isSubmitting={buyNowSubmitting}
            />
          </div>
        </div>
      )}
    </>
  );
}
