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
    <section className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {sectionTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {sectionSubtitle}
          </p>
          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder={t("home.newsletterPlaceholder")}
              className="h-9 rounded-lg border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/50 sm:min-w-[300px]"
              required
            />
            <Button type="submit" size="lg">
              {t("home.subscribe")}
            </Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            {t("home.newsletterDisclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}
