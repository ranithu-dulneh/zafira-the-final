"use client";

import { useAuth } from "@/context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Account() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zafira-cream">
        <div className="text-zafira-slate text-sm uppercase tracking-widest animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zafira-cream p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 border border-zafira-slate/10 shadow-sm mt-10">
        <h1 className="text-3xl font-serif text-zafira-slate uppercase tracking-widest mb-6">
          My Account
        </h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-sm uppercase tracking-wide text-zafira-slate/60 mb-1">Email</h2>
            <p className="text-zafira-slate">{user.email || "Guest User"}</p>
          </div>

          {isAdmin && (
            <div>
              <span className="inline-block bg-zafira-gold/20 text-zafira-slate text-xs uppercase tracking-widest px-3 py-1 border border-zafira-gold/30">
                Administrator
              </span>
            </div>
          )}
        </div>

        <div className="mt-12 pt-6 border-t border-zafira-slate/10">
          <button
            onClick={handleSignOut}
            className="py-3 px-6 bg-zafira-slate text-white uppercase tracking-widest text-sm hover:bg-zafira-gold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}