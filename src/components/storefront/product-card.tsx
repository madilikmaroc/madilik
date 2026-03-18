"use client";

import Link from "next/link";
import { Star, ShoppingBag } from "lucide-react";

import type { ProductDisplay } from "@/types/product";
import { useCartStore } from "@/store/cart-store";
import { useLanguage } from "@/contexts/language-context";
import { Price } from "./price";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: ProductDisplay;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { t } = useLanguage();
  const addItem = useCartStore((s) => s.addItem);
  const hasDiscount = product.compareAtPrice != null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100,
      )
    : 0;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={cn("group block", className)}
    >
      <div className="relative overflow-hidden rounded-xl bg-muted transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
        <div className="relative aspect-square overflow-hidden">
        {/* Product image or placeholder */}
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-muted/60">
            <span className="text-5xl font-light text-muted-foreground/25">
              {product.category.name.charAt(0)}
            </span>
          </div>
        )}
        </div>

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {product.stock === 0 ? (
            <Badge variant="destructive" className="text-[10px] font-semibold uppercase tracking-wider">
              {t("stock.outOfStock")}
            </Badge>
          ) : (
            <>
              {product.badge && (
                <Badge
                  variant={product.badge === "Sale" ? "destructive" : "secondary"}
                  className="text-[10px] font-semibold uppercase tracking-wider"
                >
                  {product.badge === "Sale" ? t("product.badgeSale") : product.badge}
                </Badge>
              )}
              {hasDiscount && (
                <Badge variant="destructive" className="text-[10px] font-semibold">
                  -{discountPercent}%
                </Badge>
              )}
              {!product.badge && !hasDiscount && product.stock > 0 && product.stock <= 5 && (
                <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider">
                  {t("stock.lowStock")}
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Desktop: Quick add button (slides up on hover) */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0 hidden md:block">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingBag className="size-4" />
            {t("product.addToCart")}
          </button>
        </div>

        {/* Mobile: Quick add icon button (always visible, bottom-right corner) */}
        {product.stock > 0 && (
          <button
            type="button"
            className="absolute bottom-2 right-2 flex md:hidden size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95 transition-transform"
            onClick={handleAddToCart}
            aria-label={t("product.addToCart")}
          >
            <ShoppingBag className="size-4" />
          </button>
        )}
      </div>

      <div className="mt-3 space-y-1 px-0.5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {product.category.name}
        </p>
        <h3 className="line-clamp-1 text-sm font-medium leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <Price value={product.price} className="text-sm font-bold" />
          {hasDiscount && (
            <Price
              value={product.compareAtPrice!}
              className="text-xs text-muted-foreground line-through"
            />
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium">{product.rating}</span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {t("product.reviews", { count: product.reviewCount })}
          </span>
        </div>
      </div>
    </Link>
  );
}
