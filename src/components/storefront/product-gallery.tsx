"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { normalizeMediaSrc } from "@/lib/media-url";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

/**
 * Product images use <img> so admin-uploaded /uploads/products/... paths always display on the store.
 */
export function ProductGallery({
  images,
  productName,
  className,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const validImages = images
    .map((url) => normalizeMediaSrc(url))
    .filter((url) => url.length > 0);
  const displayImages = validImages.length > 0 ? validImages : [""];
  const hasImages = validImages.length > 0;

  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted sm:aspect-square lg:aspect-[4/5]">
        {hasImages && displayImages[selectedIndex] && !imgError[selectedIndex] ? (
          <img
            src={displayImages[selectedIndex]!}
            alt={productName}
            className="size-full object-cover"
            onError={() => setImgError((prev) => ({ ...prev, [selectedIndex]: true }))}
            fetchPriority="high"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="text-8xl font-light text-muted-foreground/30">
              {productName.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {displayImages.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative aspect-square w-[70px] shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                selectedIndex === i
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-muted-foreground/40",
              )}
            >
              <img
                src={url}
                alt={`${productName} - image ${i + 1}`}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : (
        hasImages && (
          <div className="flex gap-2">
            <div className="relative aspect-square w-[70px] shrink-0 overflow-hidden rounded-xl border-2 border-primary bg-muted ring-2 ring-primary/20">
              <img
                src={displayImages[0]!}
                alt={productName}
                className="size-full object-cover"
              />
            </div>
          </div>
        )
      )}
    </div>
  );
}
