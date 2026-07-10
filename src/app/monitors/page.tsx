"use client";

import { useState, useMemo } from "react";
import { monitors } from "@/lib/data/monitors";
import { MonitorCard } from "@/components/monitors/MonitorCard";
import { MonitorCompareTable } from "@/components/monitors/MonitorCompareTable";
import { cn } from "@/lib/utils";
import { GitCompare, SlidersHorizontal, X } from "lucide-react";

const PANEL_OPTIONS = ["all", "IPS", "VA", "TN", "OLED", "Mini-LED"] as const;
const REFRESH_OPTIONS = [
  { label: "Any", value: 0 },
  { label: "144Hz+", value: 144 },
  { label: "240Hz+", value: 240 },
  { label: "360Hz+", value: 360 },
];

export default function MonitorsPage() {
  const [panel, setPanel] = useState("all");
  const [minRefresh, setMinRefresh] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [hdrOnly, setHdrOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const filtered = useMemo(() => {
    let list = [...monitors];
    if (panel !== "all") list = list.filter((m) => m.panel === panel);
    if (minRefresh > 0) list = list.filter((m) => m.refreshRate >= minRefresh);
    list = list.filter((m) => m.price <= maxPrice);
    if (hdrOnly) list = list.filter((m) => m.hdr);
    list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [panel, minRefresh, maxPrice, hdrOnly]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const selectedMonitors = monitors.filter((m) => selectedIds.includes(m.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">Monitors</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">{filtered.length} monitors found</p>
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
                className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:text-neutral-600 transition-colors"
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
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">Panel Type</label>
              <div className="flex flex-wrap gap-1.5">
                {PANEL_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setPanel(opt)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      panel === opt ? "bg-indigo-600 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">Min Refresh Rate</label>
              <div className="flex flex-wrap gap-1.5">
                {REFRESH_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMinRefresh(opt.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      minRefresh === opt.value ? "bg-indigo-600 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">
                Max Price: ${maxPrice}
              </label>
              <input
                type="range" min={100} max={1500} step={50} value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox" checked={hdrOnly}
                  onChange={(e) => setHdrOnly(e.target.checked)}
                  className="accent-indigo-600 w-4 h-4"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">HDR only</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {showCompare && selectedMonitors.length >= 2 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Comparison</h2>
          <MonitorCompareTable monitors={selectedMonitors} />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">
          <p className="text-lg font-medium mb-2">No monitors found</p>
          <p className="text-sm">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((monitor) => (
            <MonitorCard
              key={monitor.id}
              monitor={monitor}
              isSelected={selectedIds.includes(monitor.id)}
              onSelect={toggleSelect}
              showSelect
            />
          ))}
        </div>
      )}
    </div>
  );
}
