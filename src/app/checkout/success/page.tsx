"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { useLanguage } from "@/contexts/language-context";
import { Breadcrumbs } from "@/components/storefront";
import { buttonVariants } from "@/components/ui/button";

function SuccessContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const orderReference = searchParams.get("ref") ?? "";

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <Breadcrumbs
        items={[
          { label: t("cart.title"), href: "/cart" },
          { label: t("checkout.title"), href: "/checkout" },
          { label: t("order.successTitle") },
        ]}
        className="mb-8"
      />
      <div className="mx-auto max-w-lg text-center">
        <CheckCircle2 className="mx-auto size-16 text-green-500" />
        <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
          {t("order.successTitle")}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {t("order.successMessage")}
        </p>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          {t("order.codMessage")}
        </p>
        {orderReference && (
          <p className="mt-4 rounded-lg bg-muted/50 px-4 py-2 font-mono text-sm">
            {t("order.orderReference")}: {orderReference}
          </p>
        )}
        <Link
          href="/shop"
          className={buttonVariants({ size: "lg", className: "mt-8" })}
        >
          {t("order.continueShopping")}
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16" />}>
      <SuccessContent />
    </Suspense>
  );
}
