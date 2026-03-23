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

  const ref = formatOrderReference(order.id);
  const loc = order.locale as "en" | "fr" | "ar";
  const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <OrderPrintClient />

      {/* ── All styles are inline so nothing leaks from the website ── */}
      <style>{`
        @media print {
          @page { size: A5; margin: 8mm; }
          body { background: #fff !important; }
          .no-print { display: none !important; }
          .slip { border: none !important; box-shadow: none !important; margin: 0 !important; max-width: 100% !important; page-break-inside: avoid; break-inside: avoid; }
          .slip * { page-break-inside: avoid; break-inside: avoid; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; color: #111; }

        .slip {
          max-width: 520px;
          margin: 24px auto;
          background: #fff;
          border: 2px solid #222;
          border-radius: 6px;
          overflow: hidden;
        }
        @media screen { .slip { box-shadow: 0 4px 24px rgba(0,0,0,.12); } }

        /* ── Header row ── */
        .slip-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: #111;
          color: #fff;
        }
        .slip-header .brand { font-size: 18px; font-weight: 800; letter-spacing: .5px; }
        .slip-header .ref { font-family: monospace; font-size: 14px; font-weight: 700; }
        .slip-header .date { font-size: 11px; opacity: .7; margin-top: 2px; text-align: right; }

        /* ── Customer box (most prominent) ── */
        .ship-to {
          border: 2px dashed #333;
          margin: 12px 16px;
          padding: 12px 16px;
          border-radius: 6px;
        }
        .ship-to-label {
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #666;
          margin-bottom: 10px;
        }
        .ship-to .name {
          font-size: 20px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 6px;
        }
        .ship-to .phone {
          font-size: 16px;
          font-weight: 700;
          font-family: monospace;
          margin-bottom: 6px;
        }
        .ship-to .address {
          font-size: 13px;
          line-height: 1.4;
          color: #333;
        }

        /* ── COD box ── */
        .cod-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0 16px 10px;
          padding: 10px 16px;
          border: 2px solid #111;
          border-radius: 6px;
          background: #f9f9f6;
        }
        .cod-box .label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .cod-box .badge {
          display: inline-block;
          background: #111;
          color: #fff;
          padding: 3px 10px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .5px;
          margin-right: 8px;
        }
        .cod-box .amount {
          font-size: 22px;
          font-weight: 900;
          font-family: monospace;
        }

        /* ── Items table ── */
        .items-section {
          margin: 0 16px 8px;
        }
        .items-section .section-title {
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #666;
          margin-bottom: 6px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        .items-table th {
          text-align: left;
          padding: 6px 8px;
          background: #eee;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .5px;
          border-bottom: 1px solid #ccc;
        }
        .items-table th.r { text-align: right; }
        .items-table td {
          padding: 6px 8px;
          border-bottom: 1px solid #eee;
        }
        .items-table td.r { text-align: right; }
        .items-table .total-row td {
          border-top: 2px solid #111;
          border-bottom: none;
          font-weight: 800;
          padding-top: 8px;
          font-size: 13px;
        }

        /* ── Notes ── */
        .notes {
          margin: 0 16px 10px;
          padding: 8px 14px;
          border: 1px solid #ddd;
          border-radius: 4px;
          min-height: 30px;
        }
        .notes .notes-title {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #999;
          margin-bottom: 4px;
        }

        /* ── Footer ── */
        .slip-footer {
          padding: 8px 20px;
          background: #f5f5f5;
          text-align: center;
          font-size: 10px;
          color: #999;
          border-top: 1px solid #ddd;
        }

        /* ── Cut line ── */
        .cut-line {
          margin: 0 16px 8px;
          border: none;
          border-top: 1px dashed #ccc;
        }
      `}</style>

      <div className="slip">
        {/* ▸ Header: brand + reference + date */}
        <div className="slip-header">
          <span className="brand">{siteConfig.name}</span>
          <div style={{ textAlign: "right" }}>
            <div className="ref">{ref}</div>
            <div className="date">{date}</div>
          </div>
        </div>

        {/* ▸ SHIP TO – most prominent */}
        <div className="ship-to">
          <div className="ship-to-label">📦 Ship To</div>
          <div className="name">{order.customerName}</div>
          <div className="phone">📞 {order.phone}</div>
          <div className="address">📍 {order.location}</div>
        </div>

        {/* ▸ COD Payment */}
        <div className="cod-box">
          <div>
            <span className="badge">COD</span>
            <span className="label">Cash on Delivery</span>
          </div>
          <div className="amount">{formatPrice(order.total, loc)}</div>
        </div>

        <hr className="cut-line" />

        {/* ▸ Items (compact) */}
        <div className="items-section">
          <div className="section-title">
            Order Items ({totalItems} item{totalItems !== 1 ? "s" : ""})
          </div>
          <table className="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th className="r">Qty</th>
                <th className="r">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td className="r">{item.quantity}</td>
                  <td className="r">{formatPrice(item.lineTotal, loc)}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td>Total</td>
                <td className="r">{totalItems}</td>
                <td className="r">{formatPrice(order.total, loc)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ▸ Internal notes area */}
        <div className="notes">
          <div className="notes-title">Notes</div>
        </div>

        {/* ▸ Footer */}
        <div className="slip-footer">
          {siteConfig.name} &middot; {ref} &middot; {date}
        </div>
      </div>
    </>
  );
}
