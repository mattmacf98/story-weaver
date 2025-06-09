"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import StoryWeaverNav from "@/components/StoryWeaverNav";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user && !authLoading) {
      router.push("/");
    }
  }, [user, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log(userCredential);
      } catch (error) {
        console.error(error);
        setError("Failed to create account");
        setLoading(false);
        return;
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log(userCredential);
      } catch (error) {
        console.error(error);
        setError("Failed to sign in");
        setLoading(false);
        return;
      }
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#0F1A24] flex flex-col">
      <StoryWeaverNav />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-[#172633] rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6 border border-[#304D69]"
        >
          <h1 className="text-3xl font-bold text-white text-center mb-2">{isSignUp ? "Sign Up" : "Sign In"}</h1>
          {error && (
            <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded text-center text-sm">{error}</div>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-white font-medium text-sm">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="px-4 py-3 rounded-md bg-[#0F1A24] text-white border border-gray-600 focus:outline-none focus:border-[#0D80F2] placeholder:text-[#8FADCC]"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-white font-medium text-sm">Password</label>
            <input
              id="password"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              className="px-4 py-3 rounded-md bg-[#0F1A24] text-white border border-gray-600 focus:outline-none focus:border-[#0D80F2] placeholder:text-[#8FADCC]"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {isSignUp && (
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-white font-medium text-sm">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="px-4 py-3 rounded-md bg-[#0F1A24] text-white border border-gray-600 focus:outline-none focus:border-[#0D80F2] placeholder:text-[#8FADCC]"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="mt-2 bg-[#0D80F2] text-white font-bold py-3 rounded-lg hover:bg-[#106ad6] transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (isSignUp ? "Signing Up..." : "Signing In...") : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-[#0D80F2] hover:underline text-sm"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
              setPassword("");
              setConfirmPassword("");
            }}
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </main>
    </div>
  );
}
