/**
 * Dedicated layout for order print pages.
 * Strips ALL admin chrome (sidebar, header, navigation) so the print
 * output is a clean standalone document.
 */
export default function OrderPrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Order – Print</title>
      </head>
      <body style={{ margin: 0, padding: 0, background: "#f5f5f5" }}>
        {children}
      </body>
    </html>
  );
}
