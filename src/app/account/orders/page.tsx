import { getCustomer } from "@/lib/auth/customer-session";
import { redirect } from "next/navigation";
import {
  getOrdersByUserId,
  formatOrderReference,
} from "@/lib/data/customer-orders";
import { AccountOrdersListClient } from "./account-orders-list-client";

export default async function AccountOrdersPage() {
  const customer = await getCustomer();
  if (!customer) {
    redirect("/login?redirect=/account/orders");
  }

  const orders = await getOrdersByUserId(customer.userId);

  return (
    <AccountOrdersListClient
      orders={orders.map((o) => ({
        id: o.id,
        reference: formatOrderReference(o.id),
        createdAt: o.createdAt,
        status: o.status,
        total: o.total,
        locale: o.locale as "en" | "fr" | "ar",
        itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
      }))}
    />
  );
}
