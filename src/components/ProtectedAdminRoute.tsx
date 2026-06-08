"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "ranithudulneth@gmail.com") {
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
