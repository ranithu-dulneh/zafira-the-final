"use client";

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    }
  }, [user, isAdmin, router]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error("Sign up error", err);
      setError(err.message || "Failed to create an account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Google sign up error", err);
      setError("Failed to sign up with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zafira-cream flex items-center justify-center p-4">
      <div className="bg-white p-8 max-w-md w-full border border-zafira-slate/10 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-zafira-slate uppercase tracking-widest mb-2">Create Account</h1>
          <p className="text-sm text-zafira-slate/60 uppercase tracking-wide">Join the Zafira Experience</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSignUp} className="space-y-6">
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
              minLength={6}
              className="border border-zafira-slate/20 p-3 outline-none focus:border-zafira-gold transition-colors"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm uppercase tracking-wide text-zafira-slate">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="border border-zafira-slate/20 p-3 outline-none focus:border-zafira-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-zafira-slate text-white uppercase tracking-widest text-sm hover:bg-zafira-gold transition-colors disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="my-6 flex items-center justify-center space-x-4">
          <div className="h-px bg-zafira-slate/20 flex-1"></div>
          <span className="text-xs uppercase tracking-widest text-zafira-slate/50">OR</span>
          <div className="h-px bg-zafira-slate/20 flex-1"></div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full py-4 bg-white border border-zafira-slate/20 text-zafira-slate uppercase tracking-widest text-sm hover:border-zafira-gold transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Sign up with Google</span>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-zafira-slate/70">
            Already have an account?{" "}
            <Link href="/login" className="text-zafira-slate font-medium underline hover:text-zafira-gold transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}