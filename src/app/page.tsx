import Link from "next/link";
import {
  Mouse,
  Keyboard,
  Monitor,
  GitCompare,
  Zap,
  ShoppingBag,
  DollarSign,
  ArrowRight,
  Layers,
} from "lucide-react";

const features = [
  {
    icon: Mouse,
    title: "Mouse Database",
    description:
      "Browse and filter hundreds of gaming mice by specs, shape, weight, and connectivity.",
    href: "/mice",
    color: "bg-indigo-500",
  },
  {
    icon: Layers,
    title: "2D Shape Comparison",
    description:
      "Overlay up to 4 mouse silhouettes to visualize real-size differences side-by-side.",
    href: "/mice/shape",
    color: "bg-violet-500",
  },
  {
    icon: GitCompare,
    title: "Spec Comparison",
    description:
      "Compare mice, keyboards, and monitors head-to-head with highlighted best values.",
    href: "/mice/compare",
    color: "bg-sky-500",
  },
  {
    icon: Keyboard,
    title: "Keyboard Listings",
    description:
      "Explore mechanical, analog, and wireless keyboards with full spec breakdowns.",
    href: "/keyboards",
    color: "bg-emerald-500",
  },
  {
    icon: Monitor,
    title: "Monitor Listings",
    description:
      "Find the right panel — IPS, OLED, Mini-LED — filtered by resolution, refresh rate, and price.",
    href: "/monitors",
    color: "bg-orange-500",
  },
  {
    icon: DollarSign,
    title: "Budget Picks",
    description:
      "Set your budget and instantly see the best peripherals across all categories.",
    href: "/budget",
    color: "bg-pink-500",
  },
];

const stats = [
  { label: "Mice Listed", value: "8+" },
  { label: "Keyboards Listed", value: "8+" },
  { label: "Monitors Listed", value: "8+" },
  { label: "Spec Data Points", value: "500+" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-900">
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-50 dark:bg-indigo-950/30 blur-3xl opacity-60" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-violet-50 dark:bg-violet-950/20 blur-3xl opacity-40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
              <Zap size={14} />
              Peripheral comparison, done right
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.1] mb-6">
              Find your perfect
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">
                gaming setup.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8 max-w-xl">
              Compare mice, keyboards, and monitors with real specs. Overlay
              mouse shapes in 2D. Filter by budget. No fluff.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/mice/shape"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-500/20"
              >
                <Layers size={16} />
                Try Shape Overlay
              </Link>
              <Link
                href="/mice"
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-sm transition-colors"
              >
                Browse Mice
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-white dark:bg-neutral-950 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Everything you need
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-xl mx-auto">
              One place for all your peripheral research. Compare, filter, and
              find the right gear.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700"
              >
                <div
                  className={`w-10 h-10 ${feature.color} rounded-xl flex items-center justify-center mb-4`}
                >
                  <feature.icon size={20} className="text-white" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <span className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                  Explore <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop CTA */}
      <section className="bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-8 sm:p-12 text-center relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-4">
                <ShoppingBag size={14} />
                Coming Soon
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                InputLab Shop
              </h2>
              <p className="text-white/70 text-base mb-6 max-w-md mx-auto">
                Buy and sell peripherals directly. Curated listings, fair
                pricing, community-driven.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-600 font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                Get Notified
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
