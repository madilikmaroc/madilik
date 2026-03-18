"use client";

import Link from "next/link";
import Image from "next/image";

import type { HomepageContent } from "@/lib/data/site-content";

interface HeroSectionProps {
  content: HomepageContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  const bannerLink = content.bannerLink || "/shop";
  const bannerImage = content.bannerImage;

  if (!bannerImage) return null;

  const inner = (
    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl sm:aspect-[21/7] lg:aspect-[21/6]">
      <Image
        src={bannerImage}
        alt="Homepage banner"
        fill
        className="object-cover"
        sizes="100vw"
        priority
        unoptimized
      />
    </div>
  );

  return (
    <section className="container mx-auto px-4 pt-4 pb-2 md:pt-6 md:pb-4">
      {bannerLink ? (
        <Link href={bannerLink} className="block">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </section>
  );
}
