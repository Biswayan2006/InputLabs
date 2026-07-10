"use client";

import { MonitorProduct } from "@/lib/types";
import { cn, formatPrice, getRatingColor } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface Props {
  monitors: MonitorProduct[];
}

type SpecRow = {
  label: string;
  key: keyof MonitorProduct | string;
  format?: (val: unknown, m: MonitorProduct) => React.ReactNode;
};

const specs: SpecRow[] = [
  { label: "Price", key: "price", format: (v) => formatPrice(v as number) },
  {
    label: "Rating", key: "rating",
    format: (v) => <span className={cn("font-bold", getRatingColor(v as number))}>{v as number}/10</span>,
  },
  { label: "Size", key: "size", format: (v) => `${v}"` },
  { label: "Resolution", key: "resolution" },
  { label: "Refresh Rate", key: "refreshRate", format: (v) => `${v}Hz` },
  { label: "Response Time", key: "responseTime", format: (v) => `${v}ms` },
  { label: "Panel", key: "panel" },
  { label: "Brightness", key: "brightness", format: (v) => `${v} nits` },
  { label: "Contrast", key: "contrast" },
  { label: "Color Gamut", key: "colorGamut" },
  {
    label: "HDR", key: "hdr",
    format: (v, m) => v ? <span className="text-amber-600 dark:text-amber-400 font-medium">{m.hdrLevel ?? "HDR"}</span> : <X size={14} className="text-neutral-400 mx-auto" />,
  },
  {
    label: "G-Sync", key: "gSync",
    format: (v) => v ? <Check size={14} className="text-emerald-500 mx-auto" /> : <X size={14} className="text-neutral-400 mx-auto" />,
  },
  {
    label: "FreeSync", key: "freeSync",
    format: (v) => v ? <Check size={14} className="text-emerald-500 mx-auto" /> : <X size={14} className="text-neutral-400 mx-auto" />,
  },
  {
    label: "Curved", key: "curved",
    format: (v) => v ? <Check size={14} className="text-emerald-500 mx-auto" /> : <X size={14} className="text-neutral-400 mx-auto" />,
  },
];

const highlightBest: Record<string, (ms: MonitorProduct[]) => string[]> = {
  price: (ms) => { const min = Math.min(...ms.map((m) => m.price)); return ms.filter((m) => m.price === min).map((m) => m.id); },
  refreshRate: (ms) => { const max = Math.max(...ms.map((m) => m.refreshRate)); return ms.filter((m) => m.refreshRate === max).map((m) => m.id); },
  responseTime: (ms) => { const min = Math.min(...ms.map((m) => m.responseTime)); return ms.filter((m) => m.responseTime === min).map((m) => m.id); },
  brightness: (ms) => { const max = Math.max(...ms.map((m) => m.brightness)); return ms.filter((m) => m.brightness === max).map((m) => m.id); },
  rating: (ms) => { const max = Math.max(...ms.map((m) => m.rating)); return ms.filter((m) => m.rating === max).map((m) => m.id); },
};

export function MonitorCompareTable({ monitors }: Props) {
  if (!monitors.length) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            <th className="text-left p-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-50 dark:bg-neutral-900 w-36 sticky left-0 z-10">Spec</th>
            {monitors.map((m) => (
              <th key={m.id} className="p-4 text-center bg-neutral-50 dark:bg-neutral-900 min-w-[160px]">
                <div className="flex flex-col items-center gap-1">
                  <div className="text-2xl mb-1">🖥️</div>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wide">{m.brand}</p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white leading-tight">{m.name}</p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specs.map((spec, idx) => {
            const bestIds = highlightBest[spec.key]?.(monitors) ?? [];
            return (
              <tr
                key={spec.key + idx}
                className={cn(
                  "border-b border-neutral-100 dark:border-neutral-800/60",
                  idx % 2 === 0 ? "bg-white dark:bg-neutral-950" : "bg-neutral-50/50 dark:bg-neutral-900/30"
                )}
              >
                <td className="p-4 text-xs font-medium text-neutral-500 dark:text-neutral-400 sticky left-0 bg-inherit z-10">{spec.label}</td>
                {monitors.map((m) => {
                  const raw = m[spec.key as keyof MonitorProduct];
                  const isBest = bestIds.includes(m.id);
                  return (
                    <td
                      key={m.id}
                      className={cn(
                        "p-4 text-center font-medium text-neutral-700 dark:text-neutral-300",
                        isBest && "text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20"
                      )}
                    >
                      {spec.format ? spec.format(raw, m) : String(raw ?? "—")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
