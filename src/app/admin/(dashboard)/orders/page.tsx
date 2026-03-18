import Link from "next/link";
import { formatOrderReference, getAllOrders } from "@/lib/data/admin-orders";
import { formatPrice } from "@/lib/formatters";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteOrderButton } from "./delete-order-button";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
      <p className="mt-1 text-muted-foreground">
        Manage COD orders from your store
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border bg-card">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">No orders yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Orders will appear here when customers place them
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">
                    {formatOrderReference(order.id)}
                  </td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order.phone}
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-3 text-muted-foreground">
                    {order.location}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatPrice(order.total, order.locale as "en" | "fr" | "ar")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-primary hover:underline"
                      >
                        View
                      </Link>
                      <DeleteOrderButton
                        orderId={order.id}
                        orderReference={formatOrderReference(order.id)}
                        variant="list"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
