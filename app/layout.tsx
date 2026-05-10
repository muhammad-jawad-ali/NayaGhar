import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
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

import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${fraunces.variable} h-full antialiased`}
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
