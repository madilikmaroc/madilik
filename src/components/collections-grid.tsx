"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useLanguage } from "@/contexts/language-context";

const collections = [
  {
    name: "Summer Essentials",
    description: "Light fabrics, bold looks",
    href: "/collections/summer",
    span: "md:col-span-2",
    height: "h-64 md:h-80",
  },
  {
    name: "Accessories",
    description: "Complete the look",
    href: "/collections/accessories",
    span: "",
    height: "h-64 md:h-80",
  },
  {
    name: "Footwear",
    description: "Step into style",
    href: "/collections/footwear",
    span: "",
    height: "h-64 md:h-80",
  },
  {
    name: "Premium Collection",
    description: "Luxury redefined",
    href: "/collections/premium",
    span: "md:col-span-2",
    height: "h-64 md:h-80",
  },
];

export function CollectionsGrid() {
  const { t } = useLanguage();
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t("home.collectionsTitle")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("home.collectionsSubtitle")}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {collections.map((collection) => (
          <Link
            key={collection.name}
            href={collection.href}
            className={`group relative flex overflow-hidden rounded-xl bg-muted ${collection.span} ${collection.height}`}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-all group-hover:from-black/70" />

            {/* Content */}
            <div className="relative mt-auto p-6 text-white">
              <h3 className="text-lg font-semibold sm:text-xl">
                {collection.name}
              </h3>
              <p className="mt-1 text-sm text-white/80">
                {collection.description}
              </p>
              <div className="mt-3 flex items-center text-sm font-medium">
                Shop Now
                <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
