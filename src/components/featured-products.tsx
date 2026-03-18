"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { ProductDisplay } from "@/types/product";
import { useLanguage } from "@/contexts/language-context";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard, ProductGrid, SectionHeading } from "@/components/storefront";
import { cn } from "@/lib/utils";

interface FeaturedProductsProps {
  products: ProductDisplay[];
  title?: string;
  subtitle?: string;
}

export function FeaturedProducts({ products, title, subtitle }: FeaturedProductsProps) {
  const { t } = useLanguage();

  const sectionTitle = title || t("home.featuredTitle");
  const sectionSubtitle = subtitle || t("home.featuredSubtitle");

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <SectionHeading
        title={sectionTitle}
        subtitle={sectionSubtitle}
      >
        <Link
          href="/shop"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "hidden gap-1 sm:inline-flex",
          )}
        >
          {t("home.viewAll")}
          <ArrowRight className="size-4" />
        </Link>
      </SectionHeading>

      <ProductGrid className="mt-8">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full py-8 text-center text-muted-foreground">
            {t("empty.noFeatured")}
          </p>
        )}
      </ProductGrid>

      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/shop"
          className={cn(buttonVariants({ variant: "outline" }), "inline-flex gap-1")}
        >
          {t("home.viewAllProducts")}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
