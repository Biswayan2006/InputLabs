"use client";

import { KeyboardProduct } from "@/lib/types";
import { cn, formatPrice, getRatingColor } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface Props {
  keyboards: KeyboardProduct[];
}

type SpecRow = {
  label: string;
  key: keyof KeyboardProduct | string;
  format?: (val: unknown, kb: KeyboardProduct) => React.ReactNode;
};

const specs: SpecRow[] = [
  { label: "Price", key: "price", format: (v) => formatPrice(v as number) },
  {
    label: "Rating", key: "rating",
    format: (v) => <span className={cn("font-bold", getRatingColor(v as number))}>{v as number}/10</span>,
  },
  { label: "Size", key: "size" },
  { label: "Switch", key: "switchName" },
  { label: "Switch Type", key: "switchType" },
  { label: "Connectivity", key: "connectivity" },
  { label: "Layout", key: "layout" },
  { label: "Weight", key: "weight", format: (v) => `${v}g` },
  {
    label: "Hotswap", key: "hotswap",
    format: (v) => v ? <Check size={14} className="text-emerald-500 mx-auto" /> : <X size={14} className="text-neutral-400 mx-auto" />,
  },
  {
    label: "Gasket Mount", key: "gasket",
    format: (v) => v ? <Check size={14} className="text-emerald-500 mx-auto" /> : <X size={14} className="text-neutral-400 mx-auto" />,
  },
  {
    label: "RGB", key: "rgb",
    format: (v) => v ? <Check size={14} className="text-emerald-500 mx-auto" /> : <X size={14} className="text-neutral-400 mx-auto" />,
  },
  {
    label: "Knob", key: "knob",
    format: (v) => v ? <Check size={14} className="text-emerald-500 mx-auto" /> : <X size={14} className="text-neutral-400 mx-auto" />,
  },
  {
    label: "Wireless", key: "connectivity",
    format: (v) => (v !== "wired" ? <Check size={14} className="text-emerald-500 mx-auto" /> : <X size={14} className="text-neutral-400 mx-auto" />),
  },
];

const highlightBest: Record<string, (kbs: KeyboardProduct[]) => string[]> = {
  price: (kbs) => {
    const min = Math.min(...kbs.map((k) => k.price));
    return kbs.filter((k) => k.price === min).map((k) => k.id);
  },
  weight: (kbs) => {
    const min = Math.min(...kbs.map((k) => k.weight));
    return kbs.filter((k) => k.weight === min).map((k) => k.id);
  },
  rating: (kbs) => {
    const max = Math.max(...kbs.map((k) => k.rating));
    return kbs.filter((k) => k.rating === max).map((k) => k.id);
  },
};

export function KeyboardCompareTable({ keyboards }: Props) {
  if (!keyboards.length) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            <th className="text-left p-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-50 dark:bg-neutral-900 w-36 sticky left-0 z-10">
              Spec
            </th>
            {keyboards.map((kb) => (
              <th key={kb.id} className="p-4 text-center bg-neutral-50 dark:bg-neutral-900 min-w-[160px]">
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xl mb-1">⌨️</div>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wide">{kb.brand}</p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white leading-tight">{kb.name}</p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specs.map((spec, idx) => {
            const bestIds = highlightBest[spec.key]?.(keyboards) ?? [];
            return (
              <tr
                key={spec.key + idx}
                className={cn(
                  "border-b border-neutral-100 dark:border-neutral-800/60",
                  idx % 2 === 0 ? "bg-white dark:bg-neutral-950" : "bg-neutral-50/50 dark:bg-neutral-900/30"
                )}
              >
                <td className="p-4 text-xs font-medium text-neutral-500 dark:text-neutral-400 sticky left-0 bg-inherit z-10">
                  {spec.label}
                </td>
                {keyboards.map((kb) => {
                  const raw = kb[spec.key as keyof KeyboardProduct];
                  const isBest = bestIds.includes(kb.id);
                  return (
                    <td
                      key={kb.id}
                      className={cn(
                        "p-4 text-center font-medium text-neutral-700 dark:text-neutral-300",
                        isBest && "text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20"
                      )}
                    >
                      {spec.format ? spec.format(raw, kb) : String(raw ?? "—")}
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
