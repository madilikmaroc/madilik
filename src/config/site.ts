export const siteConfig = {
  name: "Madilik",
  description:
    "Madilik — Your trusted destination for quality products. Shop with confidence and discover curated collections for every need.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
  // Logos: PNG files in /public (e.g. public/assets/store_logo_new.png)
  logo: "/assets/store_logo_new.png",
  headerLogo: "/madilik_header_logo_new.png",
  links: {
    twitter: "https://twitter.com/madilik",
    instagram: "https://instagram.com/madilik",
  },
  creator: "Madilik",
} as const;

export type SiteConfig = typeof siteConfig;
