"use client";

import Link from "next/link";
import { MonitorProduct } from "@/lib/types";
import { cn, formatPrice, getRatingColor } from "@/lib/utils";
import { ArrowRight, GitCompare } from "lucide-react";

interface Props {
  monitor: MonitorProduct;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  showSelect?: boolean;
}

const panelColors: Record<string, string> = {
  IPS: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  VA: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  TN: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  OLED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "Mini-LED": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

export function MonitorCard({ monitor, isSelected, onSelect, showSelect }: Props) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-white dark:bg-neutral-900 overflow-hidden transition-all duration-200",
        "hover:shadow-lg hover:-translate-y-0.5",
        isSelected
          ? "border-indigo-500 ring-2 ring-indigo-500/20"
          : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
      )}
    >
      {/* Image area */}
      <div className="relative h-44 bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-center p-6">
        <div className="w-44 h-28 bg-neutral-200 dark:bg-neutral-700 rounded-xl flex items-center justify-center">
          <span className="text-3xl">🖥️</span>
        </div>
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full", panelColors[monitor.panel] ?? "bg-neutral-100 text-neutral-600")}>
            {monitor.panel}
          </span>
          {monitor.hdr && (
            <span className="text-[11px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full">
              {monitor.hdrLevel ?? "HDR"}
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className={cn("text-sm font-bold", getRatingColor(monitor.rating))}>
            {monitor.rating}
          </span>
        </div>
        {showSelect && (
          <button
            onClick={() => onSelect?.(monitor.id)}
            className={cn(
              "absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all",
              isSelected
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-600 hover:border-indigo-400 hover:text-indigo-600"
            )}
          >
            <GitCompare size={10} />
            {isSelected ? "Selected" : "Compare"}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-0.5">
            {monitor.brand}
          </p>
          <h3 className="font-semibold text-neutral-900 dark:text-white text-base leading-tight">
            {monitor.name}
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-2 col-span-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-0.5">Resolution</p>
              <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">{monitor.resolution}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-0.5">Refresh Rate</p>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{monitor.refreshRate}Hz</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-0.5">Size</p>
              <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">{monitor.size}"</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {monitor.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-neutral-900 dark:text-white">
            {formatPrice(monitor.price)}
          </span>
          <Link
            href={`/monitors/${monitor.id}`}
            className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Details <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
