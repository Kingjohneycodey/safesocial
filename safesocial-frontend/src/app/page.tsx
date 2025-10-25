"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Users,
} from "lucide-react";

// Real reviews data (no images)
const reviews = [
  {
    name: "Elise K.",
    user: "0xb4c8...97ff",
    review: "SafeSocial turned me into a Web3 believer. My content, my keys, my privacy — for real.",
    timestamp: "2 days ago"
  },
  {
    name: "Sam P.",
    user: "0x09ab...d31e",
    review: "I love how simple sharing encrypted files is! No more worrying about leaks or centralized hacks.",
    timestamp: "4 days ago"
  },
  {
    name: "Mike T.",
    user: "0xe4b7...45cc",
    review: "The wallet connect and post flows just work. This is how socials should have always been.",
    timestamp: "1 week ago"
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">

      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#4ADE80_1px,transparent_0)] bg-size-[20px_20px] opacity-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 max-w-3xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            The{" "}
            <span className="text-[var(--secondary-color)]">
              Next Generation </span>
             of Private Social Networking
          </h1>
          <p className="text-neutral-300 mb-8 text-lg">
            SafeSocial lets you connect, share, and message freely — with
            encryption, wallet-based identity, and full data ownership.
          </p>
          <Button className="bg-[var(--secondary-color)] hover:bg-[var(--secondary-color-hover)] text-neutral-950 font-semibold px-6 py-5 rounded-xl">
            Get Started
          </Button>
        </motion.div>
      </section>

      {/* Live Feed (now reviews) */}
      <section className="py-16 bg-neutral-900/40 px-6 md:px-20">
        <h2 className="text-3xl font-semibold text-center mb-10">
          What users are saying
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-lg flex flex-col space-y-3"
            >
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-xs text-neutral-400">{r.user}</p>
              </div>
              <p className="text-neutral-300 italic">“{r.review}”</p>
              <span className="text-neutral-500 text-xs">{r.timestamp}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-neutral-950 py-20 px-6 md:px-20 border-t border-neutral-800">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Why SafeSocial?
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: ShieldCheck,
              title: "End-to-End Encryption",
              desc: "Your posts, messages, and files are encrypted client-side. Only you and intended recipients can access them.",
            },
            {
              icon: Lock,
              title: "Decentralized Storage",
              desc: "Your data is stored on IPFS — fully decentralized, secure, and tamper-proof.",
            },
            {
              icon: Users,
              title: "Own Your Network",
              desc: "No middlemen, no ads, no spying. Just your wallet, your data, and your community.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg text-center space-y-4"
            >
              <item.icon className="w-10 h-10 mx-auto text-[var(--secondary-color)]" />
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-neutral-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-neutral-900/60 py-16 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Join the Private Revolution
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto mb-10">
          SafeSocial is more than an app — it’s a movement to end data
          exploitation. Over{" "}
          <span className="text-[var(--secondary-color)] font-semibold">
            10+ users
          </span>{" "}
          have already joined.
        </p>
        <Button className="bg-[var(--secondary-color)] hover:bg-[var(--secondary-color-hover)] text-neutral-950 font-semibold px-8 py-5 rounded-xl">
          Join the Beta
        </Button>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-neutral-500 border-t border-neutral-800">
        <p>© 2025 SafeSocial. All rights reserved.</p>
      </footer>
    </div>
  );
}
