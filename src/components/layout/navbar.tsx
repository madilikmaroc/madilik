"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { Menu, Search, ShoppingBag, User, LayoutGrid, ChevronRight } from "lucide-react";

import { siteConfig } from "@/config/site";
import { useLanguage } from "@/contexts/language-context";
import { useCartStore } from "@/store/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SearchDialog } from "@/components/layout/search-dialog";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  announcementText?: string;
  announcementVisible?: boolean;
  categories?: { name: string; slug: string }[];
}

export function Navbar({
  announcementText,
  announcementVisible = true,
  categories = [],
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { t } = useLanguage();
  const mounted = useMounted();
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const unsubscribe = useCartStore.subscribe((state, prevState) => {
      if (state.items.length > prevState.items.length) {
        setCartOpen(true);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b bg-background/80 backdrop-blur-lg"
            : "bg-background"
        }`}
      >
        {/* Announcement bar */}
        {announcementVisible && (
          <div className="bg-primary text-primary-foreground">
            <div className="container mx-auto flex h-8 items-center justify-center px-4 text-xs font-medium tracking-wide sm:text-sm">
              {announcementText || t("nav.announcement")}
            </div>
          </div>
        )}

        {/* Main header row — dir="ltr" so Arabic RTL doesn't reverse icon positions */}
        <nav dir="ltr" className="relative container mx-auto flex h-14 items-center px-4 sm:h-16 md:h-16 lg:h-20">

          {/* ===== MOBILE LAYOUT (< lg) ===== */}
          {/* Left: hamburger */}
          <div className="flex shrink-0 items-center lg:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="size-9 text-foreground">
                    <Menu className="size-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                }
              />
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="sr-only">{siteConfig.name}</SheetTitle>
                  <Link href="/" className="flex items-center">
                    <Image
                      src={siteConfig.headerLogo}
                      alt={siteConfig.name}
                      width={400}
                      height={120}
                      className="h-14 w-auto object-contain"
                    />
                  </Link>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-0.5 px-1">
                  <Link
                    href="/shop"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    <LayoutGrid className="size-4 text-muted-foreground" />
                    {t("nav.allProducts")}
                  </Link>
                  {categories.length > 0 && (
                    <>
                      <div className="my-2 border-t" />
                      <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("nav.categories")}
                      </p>
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/shop?category=${cat.slug}`}
                          className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {cat.name}
                          <ChevronRight className="size-3.5 opacity-40" />
                        </Link>
                      ))}
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Center: Logo — flex-1 on mobile to center, flex-initial on desktop */}
          <Link
            href="/"
            className="flex flex-1 items-center justify-center lg:flex-initial lg:justify-start lg:mr-6"
          >
            <Image
              src={siteConfig.headerLogo}
              alt={siteConfig.name}
              width={600}
              height={180}
              className="h-10 sm:h-11 lg:h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* ===== DESKTOP LAYOUT (lg+) ===== */}
          {/* Desktop: centered search */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-center">
            <button
              type="button"
              onClick={openSearch}
              className="flex h-10 w-full max-w-md items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-4 text-sm text-muted-foreground transition-colors hover:bg-muted lg:w-80 xl:w-96"
            >
              <Search className="size-4 shrink-0" />
              <span className="truncate">{t("nav.searchPlaceholder")}</span>
            </button>
          </div>

          {/* Right icons */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-3">
            {/* Desktop categories dropdown */}
            {categories.length > 0 && (
              <div className="group relative hidden lg:block">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={t("nav.categories")}
                >
                  <LayoutGrid className="size-[18px]" />
                </button>
                <div className="invisible absolute right-0 top-full z-50 min-w-[200px] rounded-xl border bg-background p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                  <Link
                    href="/shop"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    {t("nav.allProducts")}
                  </Link>
                  <div className="my-1 border-t" />
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/shop?category=${cat.slug}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      {cat.name}
                      <ChevronRight className="size-3 opacity-40" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <LanguageSwitcher />

            <Link href="/account">
              <Button
                variant="ghost"
                size="icon"
                className="size-9 text-foreground"
                aria-label={t("nav.account")}
              >
                <User className="size-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="relative size-9 text-foreground"
              aria-label={t("nav.cart")}
              onClick={openCart}
            >
              <ShoppingBag className="size-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile only: full-width pill search bar below header */}
        <div className="px-4 pb-3 pt-1 md:hidden">
          <button
            type="button"
            onClick={openSearch}
            className="flex w-full items-center gap-3 rounded-full border border-border/60 bg-muted/40 py-2.5 pl-4 pr-4 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/60"
          >
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <span>{t("nav.searchPlaceholder")}</span>
          </button>
        </div>
      </header>

      <SearchDialog open={searchOpen} onClose={closeSearch} />
      <CartDrawer open={cartOpen} onClose={closeCart} />
    </>
  );
}
