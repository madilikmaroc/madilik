"use client";

import type { HomepageContent } from "@/lib/data/site-content";
import { normalizeMediaSrc } from "@/lib/media-url";

interface HeroSectionProps {
  content: HomepageContent;
}

/**
 * Homepage hero: plain <img> so /uploads/... from admin always loads reliably (no image optimizer).
 */
export function HeroSection({ content }: HeroSectionProps) {
  const bannerSrc = normalizeMediaSrc(content.bannerImage);

  if (!bannerSrc) return null;

  return (
    <section className="md:container md:mx-auto md:px-4 md:pt-4 md:pb-2">
      <div className="group relative aspect-[21/9] w-full overflow-hidden sm:aspect-[21/7] lg:aspect-[21/6] md:rounded-2xl">
        <img
          src={bannerSrc}
          alt="Homepage banner"
          className="size-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.02]"
          fetchPriority="high"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>
    </section>
  );
}
