"use client";

import Link from "next/link";

import type { CartItem } from "@/store/cart-store";
import { useCartStore, getShipping } from "@/store/cart-store";
import { useLanguage } from "@/contexts/language-context";
import { Price } from "@/components/storefront";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface OrderSummaryProps {
  className?: string;
}

export function OrderSummary({ className }: OrderSummaryProps) {
  const { t } = useLanguage();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const subtotal = getSubtotal();
  const shipping = getShipping(subtotal);
  const total = subtotal + shipping;

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6",
        className,
      )}
    >
      <h2 className="font-semibold">{t("cart.orderSummary")}</h2>

      <ul className="mt-4 max-h-60 space-y-3 overflow-y-auto">
        {items.map((item: CartItem) => (
          <li
            key={item.product.id}
            className="flex gap-3 text-sm"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
              <span className="text-lg text-muted-foreground/50">
                {item.product.category.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/shop/${item.product.slug}`}
                className="font-medium hover:underline"
              >
                {item.product.name}
              </Link>
              <p className="text-muted-foreground">
                {t("cart.qty")} {item.quantity} × <Price value={item.product.price} />
              </p>
            </div>
            <span className="shrink-0 font-medium">
              <Price value={item.product.price * item.quantity} />
            </span>
          </li>
        ))}
      </ul>

      <Separator className="my-4" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("cart.subtotal")}</span>
          <span>
            <Price value={subtotal} />
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("cart.shipping")}</span>
          <span className="text-green-600">{t("cart.free")}</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between font-semibold">
        <span>{t("cart.total")}</span>
        <span>
          <Price value={total} />
        </span>
      </div>
    </div>
  );
}
