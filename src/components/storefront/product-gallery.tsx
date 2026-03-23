"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { normalizeMediaSrc, isVideoMediaUrl } from "@/lib/media-url";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

function MainMedia({
  url,
  productName,
  isVideo,
  onError,
}: {
  url: string;
  productName: string;
  isVideo: boolean;
  onError: () => void;
}) {
  if (!url) return null;
  if (isVideo) {
    return (
      <video
        key={url}
        src={url}
        controls
        playsInline
        className="size-full object-cover"
        preload="metadata"
        onError={onError}
      />
    );
  }
  return (
    <img
      src={url}
      alt={productName}
      className="size-full object-cover"
      onError={onError}
      fetchPriority="high"
    />
  );
}

function ThumbMedia({
  url,
  productName,
  index,
  isVideo,
}: {
  url: string;
  productName: string;
  index: number;
  isVideo: boolean;
}) {
  if (isVideo) {
    return (
      <video
        src={url}
        muted
        playsInline
        preload="metadata"
        className="pointer-events-none size-full object-cover"
        aria-hidden
      />
    );
  }
  return (
    <img
      src={url}
      alt={`${productName} - image ${index + 1}`}
      className="size-full object-cover"
    />
  );
}

/**
 * Product gallery: images and videos (MP4/WebM/MOV URLs) from admin uploads.
 */
export function ProductGallery({
  images,
  productName,
  className,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mediaError, setMediaError] = useState<Record<number, boolean>>({});
  const validImages = images
    .map((url) => normalizeMediaSrc(url))
    .filter((url) => url.length > 0);
  const displayImages = validImages.length > 0 ? validImages : [""];
  const hasMedia = validImages.length > 0;
  const currentUrl = displayImages[selectedIndex] ?? "";
  const currentIsVideo = Boolean(currentUrl && isVideoMediaUrl(currentUrl));

  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted sm:aspect-square lg:aspect-[4/5]">
        {hasMedia && currentUrl && !mediaError[selectedIndex] ? (
          <MainMedia
            url={currentUrl}
            productName={productName}
            isVideo={currentIsVideo}
            onError={() =>
              setMediaError((prev) => ({ ...prev, [selectedIndex]: true }))
            }
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
              key={url + i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative aspect-square w-[70px] shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                selectedIndex === i
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-muted-foreground/40",
              )}
            >
              <ThumbMedia
                url={url}
                productName={productName}
                index={i}
                isVideo={isVideoMediaUrl(url)}
              />
            </button>
          ))}
        </div>
      ) : (
        hasMedia && (
          <div className="flex gap-2">
            <div className="relative aspect-square w-[70px] shrink-0 overflow-hidden rounded-xl border-2 border-primary bg-muted ring-2 ring-primary/20">
              <ThumbMedia
                url={displayImages[0]!}
                productName={productName}
                index={0}
                isVideo={isVideoMediaUrl(displayImages[0]!)}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
}
