import Link from "next/link";
import { Package } from "lucide-react";

import { getOrderStats } from "@/lib/data/admin-orders";

export default async function AdminDashboardPage() {
  const stats = await getOrderStats();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">
        Overview of your store orders
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Total Orders
          </p>
          <p className="mt-2 text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Pending
          </p>
          <p className="mt-2 text-2xl font-bold">{stats.pending}</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Delivered
          </p>
          <p className="mt-2 text-2xl font-bold">{stats.delivered}</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Last 7 days
          </p>
          <p className="mt-2 text-2xl font-bold">{stats.recent}</p>
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/admin/orders"
          className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Package className="mr-2 size-4" />
          View all orders
        </Link>
      </div>
    </div>
  );
}
