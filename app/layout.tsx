import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NayaGhar | Demand-First Real Estate Marketplace",
  description: "The Upwork for Real Estate. Post your requirement brief and let verified agents pitch available properties directly to you.",
  openGraph: {
    title: "NayaGhar | Real Estate Marketplace",
    description: "Properties find you, not the other way around.",
    url: "https://nayaghar.com",
    siteName: "NayaGhar",
    locale: "en_PK",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#020617] text-slate-200">
        <Providers>
          <Navbar />
          <div className="pt-20 flex-grow">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
