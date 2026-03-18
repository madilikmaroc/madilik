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
    <div className="group relative aspect-[21/9] w-full overflow-hidden sm:aspect-[21/7] lg:aspect-[21/6] md:rounded-2xl">
      <Image
        src={bannerImage}
        alt="Homepage banner"
        fill
        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.02]"
        sizes="100vw"
        priority
        unoptimized
      />
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
    </div>
  );

  return (
    <section className="md:container md:mx-auto md:px-4 md:pt-4 md:pb-2">
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
