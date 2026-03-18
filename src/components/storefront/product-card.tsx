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
      className={cn("group flex flex-col h-full overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-lg transition-all duration-300", className)}
    >
      <div className="relative overflow-hidden bg-muted aspect-[4/5]">
        {/* Product image or placeholder */}
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="size-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-muted/60">
            <span className="text-5xl font-light text-muted-foreground/25">
              {product.category.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
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
      </div>

      <div className="flex flex-col flex-grow p-4 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
          {product.category.name}
        </p>
        <h3 className="line-clamp-2 text-[15px] font-medium leading-snug group-hover:text-primary transition-colors flex-grow">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 pt-1">
          <Price value={product.price} className="text-base font-bold text-foreground" />
          {hasDiscount && (
            <Price
              value={product.compareAtPrice!}
              className="text-xs text-muted-foreground line-through font-medium"
            />
          )}
        </div>
        <div className="flex items-center gap-1.5 pb-2">
          <div className="flex items-center gap-0.5">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold">{product.rating}</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-medium">
            ({product.reviewCount})
          </span>
        </div>

        {/* Mobile + Desktop Direct Add to Cart (Visible inline at bottom of card) */}
        <div className="mt-auto w-full pt-2">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-[13px] font-bold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            aria-label={t("product.addToCart")}
          >
            <ShoppingBag className="size-[18px]" />
            {t("product.addToCart")}
          </button>
        </div>
      </div>
    </Link>
  );
}
