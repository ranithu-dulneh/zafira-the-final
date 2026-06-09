"use client";

import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Category, ProductCategory } from "@/types";

export default function Header() {
  const { cart, setIsCartDrawerOpen } = useCart();
  const { user, isAdmin } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<ProductCategory | null>(null);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const cats: Category[] = [];
        querySnapshot.forEach((doc) => {
          cats.push({ id: doc.id, ...doc.data() } as Category);
        });
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  const navLinks: { label: string; value: ProductCategory }[] = [
    { label: "Men's", value: "mens" },
    { label: "Women's", value: "womens" },
    { label: "Unisex", value: "unisex" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zafira-white border-b border-zafira-gold/20 shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu & Search (Left) */}
          <div className="flex items-center space-x-4 flex-1">
            <button className="md:hidden text-zafira-slate hover:text-zafira-gold transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <button className="hidden md:block text-zafira-slate hover:text-zafira-gold transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Logo (Center) */}
          <Link href="/" className="flex-1 text-center">
            <h1 className="text-3xl md:text-4xl font-serif tracking-[0.2em] text-zafira-slate uppercase">
              Zafira
            </h1>
          </Link>

          {/* User Actions (Right) */}
          <div className="flex items-center justify-end space-x-6 flex-1">
            <Link href={user ? (isAdmin ? "/admin" : "/account") : "/login"} className="hidden md:flex text-zafira-slate hover:text-zafira-gold transition-colors">
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative text-zafira-slate hover:text-zafira-gold transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-zafira-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-center space-x-12 pb-4 relative">
          {navLinks.map((link) => (
            <div
              key={link.value}
              className="group relative pb-2"
              onMouseEnter={() => setActiveTab(link.value)}
              onMouseLeave={() => setActiveTab(null)}
            >
              <Link
                href={`/category/${link.value}`}
                className="text-sm font-medium tracking-widest uppercase text-zafira-slate/80 hover:text-zafira-gold transition-colors"
              >
                {link.label}
              </Link>

              {/* Dropdown Menu */}
              {activeTab === link.value && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-zafira-white shadow-xl border border-zafira-gold/10 p-6 z-50">
                  <div className="flex flex-col space-y-3">
                    {categories.filter(c => c.parentCategory === link.value).length > 0 ? (
                      categories.filter(c => c.parentCategory === link.value).map(sub => (
                        <Link
                          key={sub.id}
                          href={`/category/${link.value}?sub=${sub.name}`}
                          className="text-sm text-zafira-slate/70 hover:text-zafira-gold hover:translate-x-1 transition-all"
                        >
                          {sub.name}
                        </Link>
                      ))
                    ) : (
                      <span className="text-sm text-zafira-slate/50 italic">No categories</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}
