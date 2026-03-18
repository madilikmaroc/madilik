import { notFound } from "next/navigation";
import { getOrderById, formatOrderReference } from "@/lib/data/admin-orders";
import { formatPrice } from "@/lib/formatters";
import { siteConfig } from "@/config/site";
import { OrderPrintClient } from "./print-client";

interface PrintPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPrintPage({ params }: PrintPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  const orderReference = formatOrderReference(order.id);
  const loc = order.locale as "en" | "fr" | "ar";
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <OrderPrintClient />
      <div className="print-page">
        <style>{`
          @media print {
            @page {
              size: A4;
              margin: 15mm;
            }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          .print-page {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 32px;
            color: #1F2A37;
            background: #fff;
          }
          .print-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #1F2A37;
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          .print-brand h1 {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin: 0;
          }
          .print-brand p {
            font-size: 12px;
            color: #5a6270;
            margin: 4px 0 0 0;
          }
          .print-meta {
            text-align: right;
            font-size: 13px;
          }
          .print-meta .ref {
            font-size: 18px;
            font-weight: 700;
            font-family: monospace;
          }
          .print-meta .date { color: #5a6270; margin-top: 4px; }
          .print-meta .status {
            display: inline-block;
            margin-top: 6px;
            padding: 3px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: #f0f0f0;
            border: 1px solid #ddd;
          }

          .print-customer-box {
            border: 2px solid #1F2A37;
            border-radius: 10px;
            padding: 20px 24px;
            margin-bottom: 24px;
            background: #fafaf8;
          }
          .print-customer-box h2 {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #5a6270;
            margin: 0 0 12px 0;
            border-bottom: 1px solid #e5e1d8;
            padding-bottom: 8px;
          }
          .print-customer-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px 32px;
          }
          .print-customer-grid .full { grid-column: 1 / -1; }
          .print-customer-grid dt {
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #888;
            margin-bottom: 2px;
          }
          .print-customer-grid dd {
            font-size: 15px;
            font-weight: 600;
            margin: 0;
          }

          .print-payment-box {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            margin-bottom: 24px;
            border-radius: 8px;
            border: 1px dashed #C9A227;
            background: #fdf8e8;
            font-size: 13px;
            font-weight: 600;
          }
          .print-payment-box .cod-badge {
            background: #1F2A37;
            color: #F2D675;
            padding: 3px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }

          .print-items { margin-bottom: 24px; }
          .print-items h2 {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #5a6270;
            margin: 0 0 10px 0;
          }
          .print-items table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          .print-items thead th {
            text-align: left;
            padding: 8px 12px;
            background: #1F2A37;
            color: #F2D675;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
          }
          .print-items thead th:first-child { border-radius: 6px 0 0 6px; }
          .print-items thead th:last-child { border-radius: 0 6px 6px 0; text-align: right; }
          .print-items thead th.right { text-align: right; }
          .print-items tbody td {
            padding: 10px 12px;
            border-bottom: 1px solid #eee;
          }
          .print-items tbody td.right { text-align: right; }
          .print-items tbody tr:last-child td { border-bottom: none; }

          .print-totals {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 24px;
          }
          .print-totals table {
            min-width: 260px;
            border-collapse: collapse;
            font-size: 13px;
          }
          .print-totals td {
            padding: 6px 0;
          }
          .print-totals td:last-child { text-align: right; font-weight: 500; }
          .print-totals .total-row td {
            padding-top: 10px;
            border-top: 2px solid #1F2A37;
            font-size: 16px;
            font-weight: 700;
          }

          .print-notes {
            border: 1px solid #e5e1d8;
            border-radius: 8px;
            padding: 16px 20px;
            margin-bottom: 24px;
          }
          .print-notes h2 {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #888;
            margin: 0 0 8px 0;
          }
          .print-notes .note-area {
            min-height: 50px;
            border-bottom: 1px dashed #ccc;
          }

          .print-footer {
            text-align: center;
            font-size: 11px;
            color: #999;
            border-top: 1px solid #e5e1d8;
            padding-top: 16px;
          }

          @media screen {
            body { background: #f5f5f5; }
            .print-page {
              box-shadow: 0 2px 20px rgba(0,0,0,0.08);
              border-radius: 8px;
              margin: 32px auto;
            }
          }
        `}</style>

        {/* Header */}
        <div className="print-header">
          <div className="print-brand">
            <h1>{siteConfig.name}</h1>
            <p>Order / Shipping Slip</p>
          </div>
          <div className="print-meta">
            <div className="ref">{orderReference}</div>
            <div className="date">{orderDate}</div>
            <div>
              <span className="status">{order.status}</span>
            </div>
          </div>
        </div>

        {/* Customer info — prominent */}
        <div className="print-customer-box">
          <h2>📦 Ship To</h2>
          <dl className="print-customer-grid">
            <div>
              <dt>Customer Name</dt>
              <dd>{order.customerName}</dd>
            </div>
            <div>
              <dt>Phone Number</dt>
              <dd>{order.phone}</dd>
            </div>
            <div className="full">
              <dt>Delivery Address / Location</dt>
              <dd>{order.location}</dd>
            </div>
          </dl>
        </div>

        {/* Payment method */}
        <div className="print-payment-box">
          <span className="cod-badge">COD</span>
          <span>Payment: Cash on Delivery — Collect {formatPrice(order.total, loc)} on delivery</span>
        </div>

        {/* Order items */}
        <div className="print-items">
          <h2>Order Items</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th className="right">Qty</th>
                <th className="right">Unit Price</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.productName}</td>
                  <td className="right">{item.quantity}</td>
                  <td className="right">{formatPrice(item.unitPrice, loc)}</td>
                  <td className="right">{formatPrice(item.lineTotal, loc)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="print-totals">
          <table>
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td>{formatPrice(order.subtotal, loc)}</td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost, loc)}</td>
              </tr>
              <tr className="total-row">
                <td>Total (COD)</td>
                <td>{formatPrice(order.total, loc)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notes area */}
        <div className="print-notes">
          <h2>Internal Notes</h2>
          <div className="note-area" />
        </div>

        {/* Footer */}
        <div className="print-footer">
          <p>{siteConfig.name} — {siteConfig.url} — {orderReference}</p>
        </div>
      </div>
    </>
  );
}
