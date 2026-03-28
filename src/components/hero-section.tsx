"use client";

import { useMemo, useState } from "react";
import type { HomepageContent } from "@/lib/data/site-content";
import { normalizeMediaSrc } from "@/lib/media-url";

interface HeroSectionProps {
  content: HomepageContent;
}

/**
 * Homepage hero banner:
 * - default 4:3 presentation
 * - auto-adapts container ratio to uploaded image after load
 * - keeps image intact (no stretching / no important cropping)
 */
export function HeroSection({ content }: HeroSectionProps) {
  const bannerSrc = normalizeMediaSrc(content.bannerImage);
  const [naturalRatio, setNaturalRatio] = useState<number | null>(null);

  if (!bannerSrc) return null;

  const containerAspectRatio = useMemo(() => {
    // Default display ratio requested by design.
    if (!naturalRatio || !Number.isFinite(naturalRatio) || naturalRatio <= 0) {
      return 4 / 3;
    }
    // Keep extreme uploads visually stable while still adaptive.
    return Math.min(Math.max(naturalRatio, 0.7), 2.2);
  }, [naturalRatio]);

  return (
    <section className="md:container md:mx-auto md:px-4 md:pt-4 md:pb-2">
      <div
        className="group relative mx-auto w-full overflow-hidden bg-muted/30 md:rounded-2xl md:border"
        style={{ aspectRatio: String(containerAspectRatio) }}
      >
        <img
          src={bannerSrc}
          alt="Homepage banner"
          className="size-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.01]"
          fetchPriority="high"
          decoding="async"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              setNaturalRatio(img.naturalWidth / img.naturalHeight);
            }
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-transparent" />
      </div>
    </section>
  );
}
