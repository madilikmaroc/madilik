"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export function ProductGallery({
  images,
  productName,
  className,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const validImages = images.filter((url) => url && url.trim());
  const displayImages = validImages.length > 0 ? validImages : [""];
  const hasImages = validImages.length > 0;

  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      {/* Main image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted sm:aspect-square lg:aspect-[4/5]">
        {hasImages && displayImages[selectedIndex] && !imgError[selectedIndex] ? (
          <Image
            src={displayImages[selectedIndex]!}
            alt={productName}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            unoptimized
            onError={() => setImgError((prev) => ({ ...prev, [selectedIndex]: true }))}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="text-8xl font-light text-muted-foreground/30">
              {productName.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative aspect-square w-14 sm:w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                selectedIndex === i
                  ? "border-foreground"
                  : "border-transparent hover:border-muted-foreground/50",
              )}
            >
              <Image
                src={url}
                alt={`${productName} - image ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
                unoptimized
              />
            </button>
          ))}
        </div>
      ) : (
        hasImages && (
          <div className="flex gap-2">
            <div className="relative aspect-square w-14 sm:w-16 shrink-0 overflow-hidden rounded-lg border-2 border-foreground bg-muted">
              <Image
                src={displayImages[0]!}
                alt={productName}
                fill
                className="object-cover"
                sizes="64px"
                unoptimized
              />
            </div>
          </div>
        )
      )}
    </div>
  );
}
