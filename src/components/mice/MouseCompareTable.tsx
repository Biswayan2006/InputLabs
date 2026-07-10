"use client";

import { Mouse } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { Check, X, Minus } from "lucide-react";

interface Props {
  mice: Mouse[];
}

type SpecRow = {
  label: string;
  format: (m: Mouse) => React.ReactNode;
  bestFn?: (mice: Mouse[]) => string[]; // returns slugs of "best" mice
};

function best(
  mice: Mouse[],
  getValue: (m: Mouse) => number | undefined | null,
  prefer: "min" | "max"
): string[] {
  const values = mice
    .map((m) => ({ slug: m.slug, v: getValue(m) }))
    .filter((x): x is { slug: string; v: number } => x.v != null);
  if (!values.length) return [];
  const target =
    prefer === "min"
      ? Math.min(...values.map((x) => x.v))
      : Math.max(...values.map((x) => x.v));
  return values.filter((x) => x.v === target).map((x) => x.slug);
}

const specs: SpecRow[] = [
  {
    label: "Price",
    format: (m) => (m.price != null ? formatPrice(m.price) : <Minus size={14} className="text-neutral-400 mx-auto" />),
    bestFn: (mice) => best(mice, (m) => m.price, "min"),
  },
  {
    label: "Weight",
    format: (m) => `${m.weight}g`,
    bestFn: (mice) => best(mice, (m) => m.weight, "min"),
  },
  {
    label: "Length",
    format: (m) => `${m.dimensions.length}mm`,
  },
  {
    label: "Width",
    format: (m) => `${m.dimensions.width}mm`,
  },
  {
    label: "Height",
    format: (m) => `${m.dimensions.height}mm`,
  },
  {
    label: "Sensor",
    format: (m) => m.specifications.sensor ?? "—",
  },
  {
    label: "Max DPI",
    format: (m) =>
      m.specifications.maxDPI != null
        ? `${m.specifications.maxDPI.toLocaleString()} DPI`
        : "—",
    bestFn: (mice) => best(mice, (m) => m.specifications.maxDPI, "max"),
  },
  {
    label: "Polling Rate",
    format: (m) =>
      m.specifications.pollingRate != null ? `${m.specifications.pollingRate}Hz` : "—",
    bestFn: (mice) => best(mice, (m) => m.specifications.pollingRate, "max"),
  },
  {
    label: "Connectivity",
    format: (m) => m.specifications.connectivity?.join(", ") ?? "—",
  },
  {
    label: "Handedness",
    format: (m) => m.handedness ?? "—",
  },
  {
    label: "Grip Style",
    format: (m) => m.gripStyle ?? "—",
  },
  {
    label: "Battery Life",
    format: (m) =>
      m.specifications.batteryLife != null ? (
        `${m.specifications.batteryLife}h`
      ) : (
        <Minus size={14} className="text-neutral-400 mx-auto" />
      ),
    bestFn: (mice) => best(mice, (m) => m.specifications.batteryLife, "max"),
  },
  {
    label: "Switches",
    format: (m) => m.specifications.switches ?? "—",
  },
  {
    label: "Tags",
    format: (m) => (
      <div className="flex flex-wrap gap-1 justify-center">
        {m.tags.slice(0, 3).map((t) => (
          <span
            key={t}
            className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
          >
            {t}
          </span>
        ))}
      </div>
    ),
  },
];

export function MouseCompareTable({ mice }: Props) {
  if (!mice.length) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            <th className="text-left p-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-50 dark:bg-neutral-900 w-36 sticky left-0 z-10">
              Spec
            </th>
            {mice.map((mouse) => (
              <th
                key={mouse.slug}
                className="p-4 text-center bg-neutral-50 dark:bg-neutral-900 min-w-[160px]"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center text-sm mb-1">
                    🖱️
                  </div>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wide">
                    {mouse.brand}
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white leading-tight">
                    {mouse.model}
                  </p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specs.map((spec, idx) => {
            const bestSlugs = spec.bestFn?.(mice) ?? [];
            return (
              <tr
                key={spec.label}
                className={cn(
                  "border-b border-neutral-100 dark:border-neutral-800/60",
                  idx % 2 === 0
                    ? "bg-white dark:bg-neutral-950"
                    : "bg-neutral-50/50 dark:bg-neutral-900/30"
                )}
              >
                <td className="p-4 text-xs font-medium text-neutral-500 dark:text-neutral-400 sticky left-0 bg-inherit z-10">
                  {spec.label}
                </td>
                {mice.map((mouse) => {
                  const isBest = bestSlugs.includes(mouse.slug);
                  return (
                    <td
                      key={mouse.slug}
                      className={cn(
                        "p-4 text-center font-medium text-neutral-700 dark:text-neutral-300",
                        isBest &&
                          "text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20"
                      )}
                    >
                      {spec.format(mouse)}
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
