"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: any) {
      console.error("Login error", err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zafira-cream flex items-center justify-center p-4">
      <div className="bg-white p-8 max-w-md w-full border border-zafira-slate/10 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-zafira-slate uppercase tracking-widest mb-2">Zafira Admin</h1>
          <p className="text-sm text-zafira-slate/60 uppercase tracking-wide">Enter your credentials</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm uppercase tracking-wide text-zafira-slate">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-zafira-slate/20 p-3 outline-none focus:border-zafira-gold transition-colors"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm uppercase tracking-wide text-zafira-slate">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-zafira-slate/20 p-3 outline-none focus:border-zafira-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-zafira-slate text-white uppercase tracking-widest text-sm hover:bg-zafira-gold transition-colors disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
