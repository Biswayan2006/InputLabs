"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { keyboards } from "@/lib/data/keyboards";
import { KeyboardCard } from "@/components/keyboards/KeyboardCard";
import { cn } from "@/lib/utils";
import { GitCompare, SlidersHorizontal, X } from "lucide-react";
import { KeyboardCompareTable } from "@/components/keyboards/KeyboardCompareTable";

const SIZE_OPTIONS = ["all", "full", "tkl", "75%", "65%", "60%", "40%"] as const;
const CONNECTIVITY_OPTIONS = ["all", "wired", "wireless", "both"] as const;

export default function KeyboardsPage() {
  const [size, setSize] = useState("all");
  const [connectivity, setConnectivity] = useState("all");
  const [maxPrice, setMaxPrice] = useState(300);
  const [hotswapOnly, setHotswapOnly] = useState(false);
  const [gasketOnly, setGasketOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const filtered = useMemo(() => {
    let list = [...keyboards];
    if (size !== "all") list = list.filter((k) => k.size === size);
    if (connectivity !== "all") list = list.filter((k) => k.connectivity === connectivity || k.connectivity === "both");
    list = list.filter((k) => k.price <= maxPrice);
    if (hotswapOnly) list = list.filter((k) => k.hotswap);
    if (gasketOnly) list = list.filter((k) => k.gasket);
    list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [size, connectivity, maxPrice, hotswapOnly, gasketOnly]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const selectedKeyboards = keyboards.filter((k) => selectedIds.includes(k.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">Keyboards</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">{filtered.length} keyboards found</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {selectedIds.length >= 2 && (
            <>
              <button
                onClick={() => setShowCompare(!showCompare)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
              >
                <GitCompare size={14} />
                Compare ({selectedIds.length})
              </button>
              <button
                onClick={() => { setSelectedIds([]); setShowCompare(false); }}
                className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
              >
                <X size={14} />
              </button>
            </>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium transition-colors",
              showFilters
                ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            )}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-8 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">Size</label>
              <div className="flex flex-wrap gap-1.5">
                {SIZE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSize(opt)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors",
                      size === opt ? "bg-indigo-600 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">Connectivity</label>
              <div className="flex flex-wrap gap-1.5">
                {CONNECTIVITY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setConnectivity(opt)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors",
                      connectivity === opt ? "bg-indigo-600 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">
                Max Price: ${maxPrice}
              </label>
              <input
                type="range" min={50} max={400} step={10} value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox" checked={hotswapOnly}
                  onChange={(e) => setHotswapOnly(e.target.checked)}
                  className="accent-indigo-600 w-4 h-4"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Hotswap only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox" checked={gasketOnly}
                  onChange={(e) => setGasketOnly(e.target.checked)}
                  className="accent-indigo-600 w-4 h-4"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Gasket only</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {showCompare && selectedKeyboards.length >= 2 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Comparison</h2>
          <KeyboardCompareTable keyboards={selectedKeyboards} />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">
          <p className="text-lg font-medium mb-2">No keyboards found</p>
          <p className="text-sm">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((kb) => (
            <KeyboardCard
              key={kb.id}
              keyboard={kb}
              isSelected={selectedIds.includes(kb.id)}
              onSelect={toggleSelect}
              showSelect
            />
          ))}
        </div>
      )}
    </div>
  );
}
