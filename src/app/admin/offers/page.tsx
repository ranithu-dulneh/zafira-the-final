"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Offer } from "@/types";

export default function AdminOffers() {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [threshold, setThreshold] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "offers"), where("offerType", "==", "free_delivery"));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data() as Offer;
        setOffer({ ...data, id: snapshot.docs[0].id });
        setThreshold(data.thresholdAmount.toString());
        setIsActive(data.isActive);
      }
    } catch (error) {
      console.error("Error fetching offers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const offerData = {
        offerType: "free_delivery",
        thresholdAmount: Number(threshold),
        isActive,
        description: `Free Delivery on orders above LKR ${threshold}`,
      };

      if (offer?.id) {
        await setDoc(doc(db, "offers", offer.id), offerData);
      } else {
        await setDoc(doc(collection(db, "offers")), offerData);
      }
      alert("Offer updated successfully!");
      fetchOffers();
    } catch (error) {
      console.error("Error saving offer", error);
      alert("Failed to update offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-serif text-zafira-slate uppercase tracking-wide mb-8">
        Promotional Offers Matrix
      </h1>

      <div className="bg-white p-6 border border-zafira-slate/10 shadow-sm">
        <h2 className="text-lg font-medium uppercase tracking-wide mb-6 border-b border-zafira-slate/10 pb-4">
          Free Delivery Rule
        </h2>

        {loading ? (
          <p className="text-zafira-slate/50">Loading...</p>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-zafira-cream border border-zafira-slate/5">
              <div>
                <p className="font-medium uppercase tracking-wide text-sm mb-1">Enable Free Delivery</p>
                <p className="text-sm text-zafira-slate/60">Toggle to activate free delivery logic on the storefront.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zafira-gold"></div>
              </label>
            </div>

            <div className={`space-y-2 transition-opacity ${!isActive ? 'opacity-50 pointer-events-none' : ''}`}>
              <label className="text-sm uppercase tracking-wide">Threshold Amount (LKR)</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                min="0"
                required={isActive}
                className="w-full border border-zafira-slate/20 p-3 outline-none focus:border-zafira-gold"
                placeholder="e.g. 5000"
              />
              <p className="text-xs text-zafira-slate/50">Orders strictly above this amount will qualify for free shipping.</p>
            </div>

            <button type="submit" className="px-8 py-3 bg-zafira-slate text-white uppercase tracking-widest text-sm hover:bg-zafira-gold transition-colors">
              Save Configuration
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
