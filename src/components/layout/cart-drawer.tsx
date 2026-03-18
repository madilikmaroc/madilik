"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore, getShipping } from "@/store/cart-store";
import { useLanguage } from "@/contexts/language-context";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { t, locale } = useLanguage();
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  const subtotal = mounted ? getSubtotal() : 0;
  const shipping = getShipping(subtotal);
  const total = subtotal + shipping;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [open, onClose]);

  const loc = locale as "en" | "fr" | "ar";

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-[400px] flex-col bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5" />
            <h2 className="font-semibold">{t("cart.title")}</h2>
            {mounted && items.length > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {items.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {!mounted || items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-16">
              <ShoppingBag className="size-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                {t("empty.cartTitle")}
              </p>
              <Link href="/shop" onClick={onClose}>
                <Button variant="outline" size="sm">
                  {t("empty.continueShopping")}
                </Button>
              </Link>
            </div>
          ) : (
            <ul className="divide-y">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-3 px-4 py-4">
                  <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-lg text-muted-foreground/40">
                        {item.product.category?.name?.charAt(0) ?? "P"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/shop/${item.product.slug}`}
                      onClick={onClose}
                      className="text-sm font-medium hover:underline line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-0.5 text-sm font-semibold">
                      {formatPrice(item.product.price * item.quantity, loc)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="inline-flex items-center rounded-lg border">
                        <button
                          type="button"
                          onClick={() => decrementItem(item.product.id)}
                          className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-xs font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementItem(item.product.id)}
                          className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="rounded-md p-1 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {mounted && items.length > 0 && (
          <div className="border-t px-4 py-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                <span>{formatPrice(subtotal, loc)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("cart.shipping")}</span>
                <span className="text-green-600">{t("cart.free")}</span>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-semibold">
              <span>{t("cart.total")}</span>
              <span>{formatPrice(total, loc)}</span>
            </div>
            <Link href="/checkout" onClick={onClose} className="block">
              <Button className="mt-4 w-full" size="lg">
                {t("cart.checkout")}
              </Button>
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="mt-2 block text-center text-sm text-muted-foreground hover:text-foreground"
            >
              {t("cart.continueShopping")}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
