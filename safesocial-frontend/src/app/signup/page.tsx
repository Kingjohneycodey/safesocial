// app/signup/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useAccount } from "wagmi";

export default function SignupPage() {
  const { address } = useAccount();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      // 1. Check if name exists
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/check-name`,
        { name }
      );
      if (data.exists) {
        setError("Name already exists. Please choose another.");
        setLoading(false);
        return;
      }
      // 2. Update user with name and wallet address
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/update-name`, {
        walletAddress: address,
        name,
      });
      setSuccess(true);
      setLoading(false);
      // 3. Redirect to homepage
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message || "Signup failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Signup failed");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#4ADE80_1px,transparent_0)] bg-[length:20px_20px]" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-neutral-900/60 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-neutral-800"
      >
        {/* Logo & Title */}
        <div className="flex items-center justify-center mb-6 space-x-2">
          <ShieldCheck className="text-green-400 w-8 h-8" />
          <h1 className="text-2xl font-semibold">SafeSocial</h1>
        </div>

        <p className="text-center text-neutral-300 mb-6">
          Own your data. Encrypt your world.
          <span className="text-green-400"> Privacy-first networking.</span>
        </p>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <Button
            size="lg"
            className="w-full bg-green-400 hover:bg-green-500 text-neutral-950 font-semibold transition-all duration-300"
            type="submit"
            disabled={loading}
          >
            <Lock className="w-5 h-5 mr-2" />
            {loading ? "Checking..." : "Sign Up"}
          </Button>
        </form>
        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-400 text-sm mt-2 text-center">
            Welcome aboard, {name}!
          </p>
        )}
        <p className="text-center text-sm text-neutral-400 mt-4">
          By connecting, you agree to our{" "}
          <span className="text-green-400 cursor-pointer hover:underline">
            privacy policy
          </span>
          .
        </p>
      </motion.div>
    </div>
  );
}
