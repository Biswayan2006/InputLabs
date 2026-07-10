"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mouse } from "@/lib/types";
import { MouseCard } from "@/components/mice/MouseCard";
import { MouseCompareTable } from "@/components/mice/MouseCompareTable";
import { GitCompare, Plus, X, Loader2 } from "lucide-react";
import Link from "next/link";

function CompareContent() {
  const searchParams = useSearchParams();
  const initialIds = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];

  const [allMice, setAllMice] = useState<Mouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initialIds.slice(0, 6));
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    fetch("/api/mice")
      .then((r) => r.json())
      .then((j) => setAllMice(j.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const selectedMice = useMemo(
    () => selectedSlugs.map((slug) => allMice.find((m) => m.slug === slug)).filter(Boolean) as Mouse[],
    [selectedSlugs, allMice]
  );

  const unselectedMice = allMice.filter((m) => !selectedSlugs.includes(m.slug));

  const addMouse = (slug: string) => {
    if (selectedSlugs.length < 6) {
      setSelectedSlugs((prev) => [...prev, slug]);
      setShowPicker(false);
    }
  };

  const removeMouse = (slug: string) => {
    setSelectedSlugs((prev) => prev.filter((x) => x !== slug));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={28} className="animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <GitCompare size={18} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Mouse Comparison
          </h1>
        </div>
        <p className="text-neutral-500 dark:text-neutral-400">
          Compare up to 6 mice side-by-side. Best values highlighted in green.
        </p>
      </div>

      {/* Selected mice + add slot */}
      <div className="flex flex-wrap items-start gap-4 mb-8">
        {selectedMice.map((mouse) => (
          <div key={mouse.slug} className="relative">
            <MouseCard mouse={mouse} />
            <button
              onClick={() => removeMouse(mouse.slug)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-colors z-10"
              aria-label={`Remove ${mouse.model}`}
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {selectedMice.length < 6 && (
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="w-[200px] h-[380px] flex-shrink-0 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-400 dark:hover:border-indigo-600 flex flex-col items-center justify-center gap-3 text-neutral-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus size={20} />
            </div>
            <span className="text-sm font-medium">Add Mouse</span>
            <span className="text-xs opacity-60">{6 - selectedMice.length} slots remaining</span>
          </button>
        )}
      </div>

      {/* Picker panel */}
      {showPicker && unselectedMice.length > 0 && (
        <div className="mb-8 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
            Select a mouse to add:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {unselectedMice.map((mouse) => (
              <button
                key={mouse.slug}
                onClick={() => addMouse(mouse.slug)}
                className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30 transition-all text-left"
              >
                <span className="text-xl">🖱️</span>
                <div className="min-w-0">
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wide">{mouse.brand}</p>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">{mouse.model}</p>
                  <p className="text-xs text-neutral-500 font-mono">
                    {mouse.dimensions.length}×{mouse.dimensions.width}mm · {mouse.weight}g
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {selectedMice.length === 0 && !showPicker && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
            <GitCompare size={28} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">No mice selected</h3>
          <p className="text-neutral-400 dark:text-neutral-500 text-sm mb-6">
            Add mice to start comparing, or pick from the listing.
          </p>
          <Link
            href="/mice"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
          >
            <Plus size={14} />
            Browse Mice
          </Link>
        </div>
      )}

      {/* Comparison table */}
      {selectedMice.length >= 2 && (
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Full Spec Comparison</h2>
          <MouseCompareTable mice={selectedMice} />
        </div>
      )}

      {selectedMice.length === 1 && (
        <p className="text-sm text-neutral-400 text-center py-8">
          Add at least one more mouse to see the comparison table.
        </p>
      )}
    </div>
  );
}

export default function MouseComparePage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-400">Loading…</div>}>
      <CompareContent />
    </Suspense>
  );
}
