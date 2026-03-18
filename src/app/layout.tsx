import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { siteConfig } from "@/config/site";
import { LanguageProvider } from "@/contexts/language-context";
import { NavbarWrapper } from "@/components/layout/navbar-wrapper";
import { FooterWrapper } from "@/components/layout/footer-wrapper";
import { WhatsappFloatingWrapper } from "@/components/layout/whatsapp-floating-wrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: "/madilik.favicon.png",
    apple: "/madilik.favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@madilik",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="/madilik.favicon.png"
        />
        <link
          rel="shortcut icon"
          href="/madilik.favicon.png"
        />
        <link
          rel="apple-touch-icon"
          href="/madilik.favicon.png"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=localStorage.getItem("madilik-locale");if(l==="ar"){document.documentElement.dir="rtl";document.documentElement.lang="ar"}else if(l==="fr"||l==="en"){document.documentElement.dir="ltr";document.documentElement.lang=l}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <LanguageProvider>
          <div className="relative flex min-h-screen flex-col">
            <NavbarWrapper />
            <main className="flex-1">{children}</main>
            <FooterWrapper />
            <WhatsappFloatingWrapper />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
