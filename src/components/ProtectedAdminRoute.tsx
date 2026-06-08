"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zafira-cream">
        <div className="text-zafira-slate text-sm uppercase tracking-widest animate-pulse">
          Verifying Identity...
        </div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
