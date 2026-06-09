import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import MobileNav from "@/components/MobileNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZAFIRA | Luxury Jewelry",
  description: "Minimalist and highly professional e-commerce platform for luxury jewelry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zafira-cream text-zafira-slate flex flex-col min-h-screen pt-20 pb-16 md:pb-0`}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <CartDrawer />
            <main className="flex-grow">
              {children}
            </main>
            <MobileNav />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
