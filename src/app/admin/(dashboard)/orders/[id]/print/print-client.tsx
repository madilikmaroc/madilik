"use client";

import { useEffect } from "react";

/**
 * Auto-triggers window.print() on mount so the user immediately
 * gets the browser print dialog when navigating to the print page.
 */
export function OrderPrintClient() {
  useEffect(() => {
    // Small delay so the page fully renders before opening print dialog
    const timer = setTimeout(() => {
      window.print();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 100,
        display: "flex",
        gap: 8,
      }}
      className="no-print"
    >
      <style>{`@media print { .no-print { display: none !important; } }`}</style>
      <button
        onClick={() => window.print()}
        style={{
          padding: "8px 20px",
          fontSize: 13,
          fontWeight: 700,
          background: "#1F2A37",
          color: "#F2D675",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        🖨️ Print / Save PDF
      </button>
      <button
        onClick={() => window.history.back()}
        style={{
          padding: "8px 20px",
          fontSize: 13,
          fontWeight: 600,
          background: "#fff",
          color: "#1F2A37",
          border: "1px solid #ddd",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
    </div>
  );
}
