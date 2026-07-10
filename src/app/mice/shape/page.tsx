"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mouse } from "@/lib/types";
import { ShapeOverlay } from "@/components/mice/ShapeOverlay";
import { cn, SHAPE_COLORS } from "@/lib/utils";
import { X, Plus, ChevronDown, Loader2 } from "lucide-react";

function ShapeContent() {
  const searchParams = useSearchParams();
  const initialIds = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];

  const [allMice, setAllMice] = useState<Mouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    fetch("/api/mice")
      .then((r) => r.json())
      .then((j) => {
        const data: Mouse[] = j.data ?? [];
        setAllMice(data);
        // Pre-select from URL params, or default to first 2
        const initial =
          initialIds.length > 0
            ? initialIds.slice(0, 6).filter((id) => data.some((m) => m.slug === id))
            : data.slice(0, 2).map((m) => m.slug);
        setSelectedSlugs(initial);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedMice = useMemo(
    () =>
      selectedSlugs
        .map((slug) => allMice.find((m) => m.slug === slug))
        .filter(Boolean) as Mouse[],
    [selectedSlugs, allMice]
  );

  const unselectedMice = allMice.filter((m) => !selectedSlugs.includes(m.slug));

  const addMouse = (slug: string) => {
    if (selectedSlugs.length < 6) setSelectedSlugs((p) => [...p, slug]);
    setPickerOpen(false);
  };

  const removeMouse = (slug: string) => {
    setSelectedSlugs((p) => p.filter((x) => x !== slug));
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Top bar */}
      <div className="border-b border-neutral-800 bg-[#111] px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2">
          {loading ? (
            <div className="flex items-center gap-2 text-neutral-500 text-sm">
              <Loader2 size={14} className="animate-spin" />
              Loading mice…
            </div>
          ) : (
            <>
              {/* Selected chips */}
              {selectedMice.map((mouse, i) => {
                const color = SHAPE_COLORS[i % SHAPE_COLORS.length];
                return (
                  <div
                    key={mouse.slug}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-sm"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color.stroke }}
                    />
                    <span className="font-medium text-neutral-200">
                      {mouse.brand} {mouse.model}
                    </span>
                    <span className="text-neutral-500 text-xs font-mono">
                      {mouse.dimensions.length}×{mouse.dimensions.width}×{mouse.dimensions.height}mm
                      &nbsp;·&nbsp;{mouse.weight}g
                    </span>
                    <button
                      onClick={() => removeMouse(mouse.slug)}
                      className="ml-1 w-4 h-4 flex items-center justify-center rounded-full text-neutral-500 hover:text-white hover:bg-neutral-600 transition-colors flex-shrink-0"
                      aria-label={`Remove ${mouse.model}`}
                    >
                      <X size={10} />
                    </button>
                  </div>
                );
              })}

              {/* Add picker */}
              {selectedSlugs.length < 6 && unselectedMice.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setPickerOpen((o) => !o)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-neutral-600 text-neutral-500 hover:text-neutral-300 hover:border-neutral-500 text-sm transition-colors"
                  >
                    <Plus size={13} />
                    Add mouse
                    <ChevronDown
                      size={12}
                      className={cn("transition-transform", pickerOpen && "rotate-180")}
                    />
                  </button>

                  {pickerOpen && (
                    <div className="absolute top-full left-0 mt-1 w-80 bg-[#1a1a1a] border border-neutral-700 rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto">
                      {unselectedMice.map((mouse) => (
                        <button
                          key={mouse.slug}
                          onClick={() => addMouse(mouse.slug)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-800 transition-colors border-b border-neutral-800/60 last:border-0"
                        >
                          <span className="text-base">🖱️</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-200 truncate">
                              {mouse.brand} {mouse.model}
                            </p>
                            <p className="text-xs text-neutral-500 font-mono">
                              {mouse.dimensions.length}×{mouse.dimensions.width}×{mouse.dimensions.height}mm
                              &nbsp;·&nbsp;{mouse.weight}g
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main canvas */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 size={32} className="animate-spin text-neutral-600" />
          </div>
        ) : selectedMice.length > 0 ? (
          <ShapeOverlay mice={selectedMice} />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-neutral-600">
            <div className="text-5xl mb-4 opacity-30">🖱️</div>
            <p className="text-lg font-medium mb-1">No mice selected</p>
            <p className="text-sm">Use the bar above to add mice for comparison.</p>
          </div>
        )}
      </div>

      {/* Click-outside to close picker */}
      {pickerOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setPickerOpen(false)} />
      )}
    </div>
  );
}

export default function MouseShapePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-neutral-500">
          <Loader2 size={24} className="animate-spin mr-2" />
          Loading…
        </div>
      }
    >
      <ShapeContent />
    </Suspense>
  );
}
