"use client";

import { useState } from "react";
import { ShoppingBag, Bell, ArrowRight, Package, Tag, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Curated Listings",
    description: "Hand-verified peripherals from trusted sellers. No fakes, no sketchy listings.",
  },
  {
    icon: Tag,
    title: "Fair Pricing",
    description: "Community-reported price history ensures you always pay a fair price.",
  },
  {
    icon: Shield,
    title: "Buyer Protection",
    description: "Secure transactions with full buyer protection on every purchase.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Direct from sellers with tracked shipping and real-time updates.",
  },
];

export default function ShopPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="flex-1 relative overflow-hidden bg-white dark:bg-neutral-950">
        {/* Background */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 blur-3xl opacity-60" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-sm font-semibold mb-8 border border-amber-200 dark:border-amber-900">
            <ShoppingBag size={15} />
            Coming Soon
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
            The peripheral
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              marketplace you deserve.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-500 dark:text-neutral-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Buy and sell gaming mice, keyboards, and monitors. Curated, community-driven, and built for enthusiasts.
          </p>

          {/* Email form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-500/20"
              >
                <Bell size={15} />
                Notify Me
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 max-w-md mx-auto mb-6 px-6 py-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 font-medium">
              ✓ You&apos;re on the list! We&apos;ll notify you when we launch.
            </div>
          )}

          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            No spam. Launch notification only. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-900 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white text-center mb-10">
            What to expect
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mb-4">
                  <feature.icon size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white text-sm mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="/mice"
              className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Browse our peripheral database while you wait
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
