"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Mouse } from "@/lib/types";
import { MouseCard } from "@/components/mice/MouseCard";
import { cn } from "@/lib/utils";
import { GitCompare, Layers, SlidersHorizontal, X, Loader2 } from "lucide-react";

const HANDEDNESS_OPTIONS = ["all", "right", "left", "ambidextrous"] as const;
const CONNECTIVITY_OPTIONS = ["all", "wired", "wireless"] as const;
const GRIP_OPTIONS = ["all", "palm", "claw", "fingertip"] as const;

const SORT_OPTIONS = [
  { value: "weight", label: "Lightest First" },
  { value: "weight-desc", label: "Heaviest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "length", label: "Smallest First" },
  { value: "newest", label: "Newest" },
] as const;

export default function MicePage() {
  const [allMice, setAllMice]             = useState<Mouse[]>([]);
  const [loading, setLoading]             = useState(true);
  const [handedness, setHandedness]       = useState<string>("all");
  const [connectivity, setConnectivity]   = useState<string>("all");
  const [gripStyle, setGripStyle]         = useState<string>("all");
  const [sort, setSort]                   = useState("weight");
  const [maxWeight, setMaxWeight]         = useState(150);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [showFilters, setShowFilters]     = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/mice")
      .then((r) => r.json())
      .then((j) => setAllMice(j.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...allMice];

    if (handedness !== "all")
      list = list.filter(
        (m) => m.handedness === handedness || m.handedness === "ambidextrous"
      );

    if (connectivity !== "all")
      list = list.filter((m) =>
        m.specifications.connectivity?.some((c) =>
          c.toLowerCase().includes(connectivity)
        )
      );

    if (gripStyle !== "all")
      list = list.filter((m) => m.gripStyle === gripStyle);

    list = list.filter((m) => m.weight <= maxWeight);

    if (sort === "weight")       list.sort((a, b) => a.weight - b.weight);
    else if (sort === "weight-desc") list.sort((a, b) => b.weight - a.weight);
    else if (sort === "price-asc")
      list.sort((a, b) => (a.price ?? 999) - (b.price ?? 999));
    else if (sort === "price-desc")
      list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    else if (sort === "length")
      list.sort((a, b) => a.dimensions.length - b.dimensions.length);

    return list;
  }, [allMice, handedness, connectivity, gripStyle, sort, maxWeight]);

  const toggleSelect = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug)
        ? prev.filter((x) => x !== slug)
        : prev.length < 6
        ? [...prev, slug]
        : prev
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Gaming Mice
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {loading ? "Loading…" : `${filtered.length} mice found`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedSlugs.length > 0 && (
            <>
              <Link
                href={`/mice/compare?ids=${selectedSlugs.join(",")}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
              >
                <GitCompare size={14} />
                Compare ({selectedSlugs.length})
              </Link>
              <Link
                href={`/mice/shape?ids=${selectedSlugs.join(",")}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
              >
                <Layers size={14} />
                Shape
              </Link>
            </>
          )}

          <button
            onClick={() => setShowFilters((f) => !f)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors",
              showFilters
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300"
            )}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="mb-8 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Handedness */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Handedness
              </p>
              <div className="flex flex-wrap gap-1.5">
                {HANDEDNESS_OPTIONS.map((h) => (
                  <button
                    key={h}
                    onClick={() => setHandedness(h)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize",
                      handedness === h
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-indigo-400"
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Connectivity */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Connectivity
              </p>
              <div className="flex flex-wrap gap-1.5">
                {CONNECTIVITY_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setConnectivity(c)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize",
                      connectivity === c
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-indigo-400"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Grip style */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Grip Style
              </p>
              <div className="flex flex-wrap gap-1.5">
                {GRIP_OPTIONS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGripStyle(g)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize",
                      gripStyle === g
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-indigo-400"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Max weight */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Max Weight: {maxWeight}g
              </p>
              <input
                type="range"
                min={30}
                max={150}
                step={5}
                value={maxWeight}
                onChange={(e) => setMaxWeight(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>30g</span>
                <span>150g</span>
              </div>
            </div>
          </div>

          {/* Sort + clear */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-1"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setHandedness("all");
                setConnectivity("all");
                setGripStyle("all");
                setMaxWeight(150);
                setSort("weight");
              }}
              className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              <X size={12} />
              Clear filters
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-neutral-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">
          <p className="text-lg font-medium mb-1">No mice match your filters</p>
          <p className="text-sm">Try adjusting the filters above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((mouse) => (
            <MouseCard
              key={mouse.slug}
              mouse={mouse}
              isSelected={selectedSlugs.includes(mouse.slug)}
              onSelect={toggleSelect}
              showSelect
            />
          ))}
        </div>
      )}
    </div>
  );
}
