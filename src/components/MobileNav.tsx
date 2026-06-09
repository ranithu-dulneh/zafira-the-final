"use client";

import Link from "next/link";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function MobileNav() {
  const { cart, setIsCartDrawerOpen } = useCart();
  const { user, isAdmin } = useAuth();

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zafira-slate/10 px-6 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <nav className="flex justify-between items-center">
        <Link href="/" className="flex flex-col items-center text-zafira-slate hover:text-zafira-gold transition-colors">
          <Home className="w-6 h-6 mb-1" />
          <span className="text-[10px] uppercase tracking-wider">Home</span>
        </Link>

        <button className="flex flex-col items-center text-zafira-slate hover:text-zafira-gold transition-colors">
          <Search className="w-6 h-6 mb-1" />
          <span className="text-[10px] uppercase tracking-wider">Search</span>
        </button>

        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="flex flex-col items-center text-zafira-slate hover:text-zafira-gold transition-colors relative"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6 mb-1" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-zafira-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-wider">Cart</span>
        </button>

        <Link
          href={user ? (isAdmin ? "/admin" : "/account") : "/login"}
          className="flex flex-col items-center text-zafira-slate hover:text-zafira-gold transition-colors"
        >
          <User className="w-6 h-6 mb-1" />
          <span className="text-[10px] uppercase tracking-wider">Account</span>
        </Link>
      </nav>
    </div>
  );
}