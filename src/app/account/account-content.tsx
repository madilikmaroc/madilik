"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { logoutAction } from "@/app/login/actions";

interface AccountContentProps {
  customer: { fullName: string; email: string };
}

export function AccountContent({ customer }: AccountContentProps) {
  const { t } = useLanguage();

  return (
    <div className="container px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("auth.account.title")}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t("auth.account.welcome", { name: customer.fullName })}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 space-y-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("auth.account.email")}
            </p>
            <p className="mt-1">{customer.email}</p>
          </div>
          <Link
            href="/account/orders"
            className="block rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted w-fit"
          >
            {t("account.orders.title")}
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              {t("auth.account.logout")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
