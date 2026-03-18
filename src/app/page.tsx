import { getFeaturedProducts } from "@/lib/data/products";
import { getHomepageContent } from "@/lib/data/site-content";

export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/hero-section";
import { FeaturedProducts } from "@/components/featured-products";
import { NewsletterSection } from "@/components/newsletter-section";

export default async function HomePage() {
  const [featuredProducts, content] = await Promise.all([
    getFeaturedProducts(),
    getHomepageContent(),
  ]);

  return (
    <>
      {content.bannerVisible && <HeroSection content={content} />}

      {content.featuredProductsVisible && (
        <FeaturedProducts
          products={featuredProducts}
          title={content.featuredTitle}
          subtitle={content.featuredSubtitle}
        />
      )}

      {content.newsletterSectionVisible && (
        <NewsletterSection
          title={content.newsletterTitle}
          subtitle={content.newsletterSubtitle}
        />
      )}
    </>
  );
}
