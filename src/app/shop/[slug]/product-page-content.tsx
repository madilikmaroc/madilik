"use client";

import {
  Breadcrumbs,
  ProductCard,
  ProductGallery,
  ProductGrid,
  SectionHeading,
  Price,
  ReviewsSection,
} from "@/components/storefront";
import { useLanguage } from "@/contexts/language-context";
import type { ProductDisplay } from "@/types/product";
import type { ReviewWithUser } from "@/lib/data/reviews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Truck } from "lucide-react";
import { ProductDetailsClient } from "./product-details-client";

interface ProductPageContentProps {
  product: ProductDisplay;
  relatedProducts: ProductDisplay[];
  reviews: ReviewWithUser[];
  customer: { userId: string; fullName: string; email: string } | null;
  hasReviewed: boolean;
}

export function ProductPageContent({
  product,
  relatedProducts,
  reviews,
  customer,
  hasReviewed,
}: ProductPageContentProps) {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <Breadcrumbs
        items={[
          { label: t("nav.shop"), href: "/shop" },
          {
            label: product.category.name,
            href: `/shop?category=${product.category.slug}`,
          },
          { label: product.name },
        ]}
        className="mb-6"
      />

      <div className="grid gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={product.images}
          productName={product.name}
        />

        <div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {product.category.name}
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">
                  {t("product.reviews", { count: product.reviewCount })}
                </span>
              </div>
              {product.badge && (
                <Badge
                  variant={
                    product.badge === "Sale" ? "destructive" : "secondary"
                  }
                >
                  {product.badge === "Sale"
                    ? t("product.badgeSale")
                    : product.badge}
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <Price value={product.price} className="text-2xl font-bold" />
            {product.compareAtPrice && (
              <Price
                value={product.compareAtPrice}
                className="text-lg text-muted-foreground line-through"
              />
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>

          <ProductDetailsClient product={product} />

          <div className="mt-6 flex flex-wrap gap-3">
            <p className="text-sm text-muted-foreground">
              {t("product.sku")}: {product.sku}
            </p>
            <Separator orientation="vertical" className="h-4" />
            <p
              className={`text-sm font-medium ${
                product.stock > 0 ? "text-green-600" : "text-destructive"
              }`}
            >
              {product.stock > 0
                ? t("product.inStock", { count: product.stock })
                : t("stock.outOfStock")}
            </p>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="ml-2 text-xs text-amber-600">
                {t("stock.lowStock")}
              </span>
            )}
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-lg border bg-muted/50 p-4">
            <Truck className="size-5 shrink-0 text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium">{t("product.freeShipping")}</p>
              <p className="text-muted-foreground">
                {t("product.freeShippingDetail")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t">
        <div className="grid gap-8 py-12 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">{t("product.description")}</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">{t("product.details")}</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {product.details}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">{t("product.shippingReturns")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("product.shippingReturnsContent")}
            </p>
          </div>
        </div>
      </div>

      <ReviewsSection
        productId={product.id}
        productSlug={product.slug}
        reviews={reviews}
        customer={customer}
        hasReviewed={hasReviewed}
      />

      {relatedProducts.length > 0 && (
        <section className="border-t py-16">
          <SectionHeading
            title={t("product.relatedTitle")}
            subtitle={t("product.relatedSubtitle")}
          />
          <ProductGrid className="mt-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ProductGrid>
        </section>
      )}
    </div>
  );
}
