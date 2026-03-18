"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { RegisterForm } from "./register-form";

interface RegisterPageClientProps {
  redirectUrl: string;
}

export function RegisterPageClient({ redirectUrl }: RegisterPageClientProps) {
  const { t } = useLanguage();
  const loginHref = redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login";

  return (
    <div className="container flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {t("auth.register.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("auth.register.subtitle")}
          </p>
        </div>
        <RegisterForm redirectUrl={redirectUrl} />
        <p className="text-center text-sm text-muted-foreground">
          {t("auth.register.hasAccount")}{" "}
          <Link href={loginHref} className="font-medium text-primary hover:underline">
            {t("auth.register.loginLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
