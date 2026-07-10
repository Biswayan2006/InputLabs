"use client";

import Link from "next/link";
import { Mouse } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { Wifi, WifiOff, Zap, Weight, ArrowRight, GitCompare } from "lucide-react";

interface MouseCardProps {
  mouse: Mouse;
  isSelected?: boolean;
  onSelect?: (slug: string) => void;
  showSelect?: boolean;
}

export function MouseCard({ mouse, isSelected, onSelect, showSelect }: MouseCardProps) {
  const isWireless = mouse.specifications.connectivity?.some(
    (c) => c.toLowerCase().includes("wireless") || c.toLowerCase().includes("2.4")
  );

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
        <div className="w-32 h-20 bg-neutral-200 dark:bg-neutral-700 rounded-xl flex items-center justify-center">
          <span className="text-2xl">🖱️</span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {isWireless ? (
            <span className="flex items-center gap-1 text-[11px] font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded-full">
              <Wifi size={10} />
              Wireless
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-medium bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 px-2 py-0.5 rounded-full">
              <WifiOff size={10} />
              Wired
            </span>
          )}
        </div>

        {showSelect && (
          <button
            onClick={() => onSelect?.(mouse.slug)}
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
            {mouse.brand}
          </p>
          <h3 className="font-semibold text-neutral-900 dark:text-white text-base leading-tight">
            {mouse.model}
          </h3>
        </div>

        {/* Key specs grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {mouse.specifications.sensor && (
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-2">
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-0.5">Sensor</p>
              <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 truncate">
                {mouse.specifications.sensor}
              </p>
            </div>
          )}
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-2">
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-0.5">Weight</p>
            <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1">
              <Weight size={10} />
              {mouse.weight}g
            </p>
          </div>
          {mouse.specifications.pollingRate && (
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-2">
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-0.5">Polling</p>
              <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1">
                <Zap size={10} />
                {mouse.specifications.pollingRate}Hz
              </p>
            </div>
          )}
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-2">
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-0.5">Size</p>
            <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 truncate">
              {mouse.dimensions.length}×{mouse.dimensions.width}mm
            </p>
          </div>
        </div>

        {/* Tags */}
        {mouse.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {mouse.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          {mouse.price != null ? (
            <span className="text-lg font-bold text-neutral-900 dark:text-white">
              {formatPrice(mouse.price)}
            </span>
          ) : (
            <span className="text-sm text-neutral-400">—</span>
          )}
          <Link
            href={`/mice/${mouse.slug}`}
            className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Details
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
