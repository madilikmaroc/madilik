"use client";

import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";

interface NewsletterSectionProps {
  title?: string;
  subtitle?: string;
}

export function NewsletterSection({ title, subtitle }: NewsletterSectionProps) {
  const { t } = useLanguage();

  const sectionTitle = title || t("home.newsletterTitle");
  const sectionSubtitle = subtitle || t("home.newsletterSubtitle");

  return (
    <section className="border-t bg-gradient-to-b from-muted/40 to-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {sectionTitle}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {sectionSubtitle}
          </p>
          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder={t("home.newsletterPlaceholder")}
              className="h-12 rounded-xl border border-input bg-background px-5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 sm:min-w-[320px]"
              required
            />
            <Button type="submit" size="lg" className="h-12 rounded-xl px-8 text-sm font-bold shadow-md">
              {t("home.subscribe")}
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            {t("home.newsletterDisclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}
