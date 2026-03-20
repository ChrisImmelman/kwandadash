import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-subheading-var",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-drama-var",
  subsets: ["latin"],
  weight: ["600"],
  style: ["italic"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono-brand-var",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Kwandadash — Internal Dashboard",
  description: "Kwanda AI internal business dashboard",
  icons: {
    icon: "/favicons/favicon.ico",
    apple: "/favicons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${outfit.variable} ${cormorant.variable} ${ibmPlexMono.variable} h-full`}
    >
      <body className="min-h-full flex">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-64 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
