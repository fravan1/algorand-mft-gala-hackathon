import type { Metadata } from "next";
import PrismBackground from "@/components/layout/PrismBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WalletProvider from "@/components/provider/WalletProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "mft-gala",
  description: "Author: 0xaybuke 0xbahaz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#070210]" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden'}}>
        <WalletProvider>
          {/*<PrismBackground />*/}
          <Navbar />
          <main style={{ flex: 1, overflow: 'auto' }}>
            {children}
          </main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
