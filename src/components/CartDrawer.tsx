"use client";

import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Offer } from "@/types";
import Image from "next/image";

export default function CartDrawer() {
  const { isCartDrawerOpen, setIsCartDrawerOpen, cart, updateQuantity, removeFromCart, totalAmount } = useCart();
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<number | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const q = query(collection(db, "offers"), where("isActive", "==", true), where("offerType", "==", "free_delivery"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const offer = snapshot.docs[0].data() as Offer;
          setFreeDeliveryThreshold(offer.thresholdAmount);
        }
      } catch (err) {
        console.error("Error fetching offers", err);
      }
    };
    if (isCartDrawerOpen) {
      fetchOffers();
    }
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const progress = freeDeliveryThreshold ? Math.min((totalAmount / freeDeliveryThreshold) * 100, 100) : 0;
  const remainingForFreeShipping = freeDeliveryThreshold ? Math.max(freeDeliveryThreshold - totalAmount, 0) : 0;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-zafira-white z-[70] shadow-2xl flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zafira-slate/10 flex items-center justify-between">
          <h2 className="text-xl font-serif text-zafira-slate tracking-wide">Your Cart</h2>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-2 text-zafira-slate hover:text-zafira-gold transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {freeDeliveryThreshold && (
          <div className="px-6 py-4 bg-zafira-cream border-b border-zafira-gold/10">
            <p className="text-sm text-center mb-2 text-zafira-slate/80 font-medium">
              {remainingForFreeShipping > 0
                ? `Add LKR ${remainingForFreeShipping.toLocaleString()} more to unlock Free Shipping!`
                : "🎉 You've unlocked Free Shipping!"}
            </p>
            <div className="w-full h-1.5 bg-zafira-slate/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-zafira-gold transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zafira-slate/50 space-y-4">
              <ShoppingBag className="w-12 h-12" />
              <p>Your cart is empty.</p>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="mt-4 px-6 py-2 border border-zafira-slate text-zafira-slate hover:bg-zafira-slate hover:text-white transition-colors uppercase tracking-widest text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="flex space-x-4">
                <div className="w-24 h-24 bg-zafira-cream relative overflow-hidden flex-shrink-0 border border-zafira-slate/5">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-zafira-slate/5" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-medium text-zafira-slate uppercase">{item.title}</h3>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-zafira-slate/40 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-zafira-slate/70 mt-1">LKR {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-zafira-slate/20">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 text-zafira-slate/60 hover:text-zafira-slate"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 text-zafira-slate/60 hover:text-zafira-slate"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-zafira-slate/10 bg-white">
            <div className="flex justify-between items-center mb-6">
              <span className="text-zafira-slate font-medium">Subtotal</span>
              <span className="text-lg font-serif">LKR {totalAmount.toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsCartDrawerOpen(false)}
              className="block w-full py-4 bg-zafira-slate text-white text-center uppercase tracking-widest text-sm hover:bg-zafira-gold transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
