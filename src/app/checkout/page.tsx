"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

import { useLanguage } from "@/contexts/language-context";
import { useCartStore } from "@/store/cart-store";
import { Breadcrumbs } from "@/components/storefront";
import {
  CheckoutForm,
  OrderSummary,
} from "@/components/checkout";
import type { CheckoutFormData } from "@/components/checkout";
import { EmptyState } from "@/components/storefront";

export default function CheckoutPage() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CheckoutFormData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: data.fullName,
          phone: data.phone,
          location: data.location,
          locale,
          items: items.map((i) => ({
            product: i.product,
            quantity: i.quantity,
          })),
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
        setError(msg);
        return;
      }

      clearCart();
      router.push(`/checkout/success?ref=${encodeURIComponent(json.orderReference)}`);
    } catch {
      setError(t("order.errorGeneric"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <Breadcrumbs
          items={[
            { label: t("cart.title"), href: "/cart" },
            { label: t("checkout.title") },
          ]}
          className="mb-8"
        />
        <EmptyState
          icon={ShoppingBag}
          title={t("empty.checkoutTitle")}
          description={t("empty.checkoutDescription")}
          action={{ label: t("empty.continueShopping"), href: "/shop" }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Breadcrumbs
        items={[
          { label: t("cart.title"), href: "/cart" },
          { label: t("checkout.title") },
        ]}
        className="mb-8"
      />

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {t("checkout.title")}
      </h1>
      <p className="mt-1 text-muted-foreground">
        {t("checkout.subtitle")}
      </p>

      {error && (
        <div
          role="alert"
          className="mt-6 flex gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-destructive"
        >
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-card p-6">
            <CheckoutForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <OrderSummary />
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/cart" className="hover:text-foreground">
          {t("checkout.backToCart")}
        </Link>
      </p>
    </div>
  );
}
