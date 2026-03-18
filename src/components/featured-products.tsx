"use client";

import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Headphones } from "lucide-react";

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
    <>
      {/* Trust / Benefits strip */}
      <section className="border-y bg-muted/20">
        <div className="container mx-auto grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0 px-4">
          <div className="flex items-center gap-3 py-4 sm:justify-center sm:py-5">
            <div className="trust-icon-box shrink-0">
              <Truck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{t("home.trustFreeShipping") || "Free Shipping"}</p>
              <p className="text-xs text-muted-foreground">{t("home.trustFreeShippingDetail") || "On orders over 500 MAD"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-4 sm:justify-center sm:py-5">
            <div className="trust-icon-box shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{t("home.trustSecurePayment") || "Secure Payment"}</p>
              <p className="text-xs text-muted-foreground">{t("home.trustSecurePaymentDetail") || "100% protected checkout"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-4 sm:justify-center sm:py-5">
            <div className="trust-icon-box shrink-0">
              <Headphones className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{t("home.trustSupport") || "24/7 Support"}</p>
              <p className="text-xs text-muted-foreground">{t("home.trustSupportDetail") || "Dedicated customer care"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <SectionHeading
          title={sectionTitle}
          subtitle={sectionSubtitle}
        >
          <Link
            href="/shop"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden gap-1.5 sm:inline-flex font-medium",
            )}
          >
            {t("home.viewAll")}
            <ArrowRight className="size-4" />
          </Link>
        </SectionHeading>

        <ProductGrid className="mt-10">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full py-12 text-center text-muted-foreground">
              {t("empty.noFeatured")}
            </p>
          )}
        </ProductGrid>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/shop"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "inline-flex gap-1.5 font-medium")}
          >
            {t("home.viewAllProducts")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
