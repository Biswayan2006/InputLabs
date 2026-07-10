"use client";

import { useState, useEffect, useMemo } from "react";
import { Mouse, KeyboardProduct, MonitorProduct } from "@/lib/types";
import { MouseCard } from "@/components/mice/MouseCard";
import { KeyboardCard } from "@/components/keyboards/KeyboardCard";
import { MonitorCard } from "@/components/monitors/MonitorCard";
import { DollarSign, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const BUDGET_PRESETS = [
  { label: "$50",  value: 50  },
  { label: "$100", value: 100 },
  { label: "$150", value: 150 },
  { label: "$200", value: 200 },
  { label: "$300", value: 300 },
  { label: "$500", value: 500 },
];

type Tab = "all" | "mice" | "keyboards" | "monitors";

export default function BudgetPage() {
  const [budget, setBudget] = useState(150);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const [allMice, setAllMice]           = useState<Mouse[]>([]);
  const [allKeyboards, setAllKeyboards] = useState<KeyboardProduct[]>([]);
  const [allMonitors, setAllMonitors]   = useState<MonitorProduct[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/mice").then((r) => r.json()),
      fetch("/api/keyboards").then((r) => r.json()),
      fetch("/api/monitors").then((r) => r.json()),
    ])
      .then(([m, k, mon]) => {
        setAllMice(m.data ?? []);
        setAllKeyboards(k.data ?? []);
        setAllMonitors(mon.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredMice = useMemo(
    () =>
      allMice
        .filter((m) => m.price != null && m.price <= budget)
        .sort((a, b) => (a.weight ?? 999) - (b.weight ?? 999))
        .slice(0, 4),
    [allMice, budget]
  );

  const filteredKeyboards = useMemo(
    () =>
      allKeyboards
        .filter((k) => k.price <= budget)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4),
    [allKeyboards, budget]
  );

  const filteredMonitors = useMemo(
    () =>
      allMonitors
        .filter((m) => m.price <= budget)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4),
    [allMonitors, budget]
  );

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "all", label: "All", count: filteredMice.length + filteredKeyboards.length + filteredMonitors.length },
    { id: "mice", label: "Mice", count: filteredMice.length },
    { id: "keyboards", label: "Keyboards", count: filteredKeyboards.length },
    { id: "monitors", label: "Monitors", count: filteredMonitors.length },
  ];

  const showMice      = activeTab === "all" || activeTab === "mice";
  const showKeyboards = activeTab === "all" || activeTab === "keyboards";
  const showMonitors  = activeTab === "all" || activeTab === "monitors";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-pink-500 flex items-center justify-center">
            <DollarSign size={18} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Budget Picks
          </h1>
        </div>
        <p className="text-neutral-500 dark:text-neutral-400">
          Set your budget and instantly see the best peripherals within your range.
        </p>
      </div>

      {/* Budget control */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Max Budget
              </label>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                ${budget}
              </span>
            </div>
            <input
              type="range" min={30} max={1500} step={10}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-neutral-400 mt-1">
              <span>$30</span>
              <span>$1,500</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {BUDGET_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setBudget(preset.value)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                  budget === preset.value
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-800 hover:border-indigo-300 hover:text-indigo-600"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl mb-8 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            )}
          >
            {tab.label}
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded-full font-semibold",
              activeTab === tab.id
                ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
                : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-neutral-400" />
        </div>
      ) : (
        <div className="space-y-12">
          {showMice && (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">🖱️</span>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Mice Under ${budget}
                </h2>
                <span className="text-sm text-neutral-400">({filteredMice.length})</span>
              </div>
              {filteredMice.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredMice.map((mouse) => (
                    <MouseCard key={mouse.slug} mouse={mouse} />
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-400 text-sm">
                  No mice with a listed price under ${budget}.
                </div>
              )}
            </section>
          )}

          {showKeyboards && (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">⌨️</span>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Keyboards Under ${budget}
                </h2>
                <span className="text-sm text-neutral-400">({filteredKeyboards.length})</span>
              </div>
              {filteredKeyboards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredKeyboards.map((kb) => (
                    <KeyboardCard key={kb.id} keyboard={kb} />
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-400 text-sm">
                  No keyboards available under ${budget}.
                </div>
              )}
            </section>
          )}

          {showMonitors && (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">🖥️</span>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Monitors Under ${budget}
                </h2>
                <span className="text-sm text-neutral-400">({filteredMonitors.length})</span>
              </div>
              {filteredMonitors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredMonitors.map((monitor) => (
                    <MonitorCard key={monitor.id} monitor={monitor} />
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-400 text-sm">
                  No monitors available under ${budget}.
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
