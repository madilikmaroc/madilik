import { getHomepageContent } from "@/lib/data/site-content";
import { getCategoriesForNav } from "@/lib/data/categories";
import { Navbar } from "./navbar";

export async function NavbarWrapper() {
  let announcementText: string | undefined;
  let announcementVisible = true;
  let categories: { name: string; slug: string }[] = [];

  try {
    const [content, cats] = await Promise.all([
      getHomepageContent(),
      getCategoriesForNav(),
    ]);
    announcementText = content.announcementBar;
    announcementVisible = content.announcementBarVisible;
    categories = cats;
  } catch {
    // DB not ready — Navbar falls back to defaults
  }

  return (
    <Navbar
      announcementText={announcementText}
      announcementVisible={announcementVisible}
      categories={categories}
    />
  );
}
