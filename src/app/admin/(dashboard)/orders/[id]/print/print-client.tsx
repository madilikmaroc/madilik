"use client";

import { useEffect } from "react";

/**
 * Floating toolbar with Print + Back buttons (hidden when printing).
 * Auto-triggers print dialog on mount.
 */
export function OrderPrintClient() {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="no-print"
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 100,
        display: "flex",
        gap: 8,
      }}
    >
      <button
        onClick={() => window.print()}
        style={{
          padding: "8px 20px",
          fontSize: 13,
          fontWeight: 700,
          background: "#222",
          color: "#fff",
          border: "none",
          borderRadius: 6,
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
          color: "#222",
          border: "1px solid #ccc",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
    </div>
  );
}
