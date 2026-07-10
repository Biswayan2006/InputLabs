"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mouse } from "@/lib/types";
import { cn, SHAPE_COLORS } from "@/lib/utils";
import { Minus, Plus, RotateCcw, Eye, EyeOff } from "lucide-react";

interface Props {
  mice: Mouse[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Base pixels per millimetre at zoom = 1 */
const PX_PER_MM = 4;

/** Canvas padding in mm */
const PAD_MM = 12;

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 5;
const ZOOM_STEP = 0.25;

// ─── Component ────────────────────────────────────────────────────────────────

export function ShapeOverlay({ mice }: Props) {
  const [visible, setVisible] = useState<Record<string, boolean>>(
    Object.fromEntries(mice.map((m) => [m.slug, true]))
  );
  const [opacity, setOpacity] = useState<Record<string, number>>(
    Object.fromEntries(mice.map((m) => [m.slug, 0.15]))
  );
  const [zoom, setZoom] = useState(1);
  const [view, setView] = useState<"top" | "side">("top");
  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync visibility/opacity state when mice list changes
  useEffect(() => {
    setVisible((prev) => {
      const next = { ...prev };
      mice.forEach((m) => {
        if (!(m.slug in next)) next[m.slug] = true;
      });
      return next;
    });
    setOpacity((prev) => {
      const next = { ...prev };
      mice.forEach((m) => {
        if (!(m.slug in next)) next[m.slug] = 0.15;
      });
      return next;
    });
  }, [mice]);

  const handleZoom = useCallback((delta: number) => {
    setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, +(z + delta).toFixed(2))));
  }, []);

  const pxPerMm = PX_PER_MM * zoom;

  // ── Compute canvas size from bounding box of all mice ──────────────────────
  let maxW = 0;
  let maxH = 0;
  mice.forEach((m) => {
    const vb = view === "top" ? m.shape.top.viewBox : m.shape.side.viewBox;
    if (vb.width  > maxW) maxW = vb.width;
    if (vb.height > maxH) maxH = vb.height;
  });

  const canvasW = (maxW + PAD_MM * 2) * pxPerMm;
  const canvasH = (maxH + PAD_MM * 2) * pxPerMm;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Controls bar ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* View toggle */}
        <div className="flex rounded-lg overflow-hidden border border-neutral-700">
          {(["top", "side"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                view === v
                  ? "bg-indigo-600 text-white"
                  : "bg-neutral-800 text-neutral-400 hover:text-neutral-200"
              )}
            >
              {v === "top" ? "Top view" : "Side profile"}
            </button>
          ))}
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 px-1">
          <button
            onClick={() => handleZoom(-ZOOM_STEP)}
            disabled={zoom <= ZOOM_MIN}
            className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
            aria-label="Zoom out"
          >
            <Minus size={14} />
          </button>
          <span className="text-xs font-mono text-neutral-300 w-10 text-center">
            {(zoom * 100).toFixed(0)}%
          </span>
          <button
            onClick={() => handleZoom(ZOOM_STEP)}
            disabled={zoom >= ZOOM_MAX}
            className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
            aria-label="Zoom in"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          onClick={() => setZoom(1)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 text-xs text-neutral-400 hover:text-white transition-colors"
          aria-label="Reset zoom"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      {/* ── Canvas ───────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-auto rounded-xl border border-neutral-800 bg-[#0a0a0a]"
        style={{ maxHeight: "70vh" }}
      >
        <div
          ref={canvasRef}
          style={{ width: canvasW, height: canvasH, position: "relative" }}
        >
          {/* Grid reference lines */}
          <svg
            width={canvasW}
            height={canvasH}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            {/* Desk baseline for side view */}
            {view === "side" && (
              <line
                x1={PAD_MM * pxPerMm * 0.5}
                y1={canvasH - PAD_MM * pxPerMm}
                x2={canvasW - PAD_MM * pxPerMm * 0.5}
                y2={canvasH - PAD_MM * pxPerMm}
                stroke="#333"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            )}
          </svg>

          {/* Mouse shapes */}
          <svg
            width={canvasW}
            height={canvasH}
            style={{ position: "absolute", inset: 0 }}
            aria-label="Mouse shape comparison canvas"
          >
            {mice.map((mouse, i) => {
              if (!visible[mouse.slug]) return null;

              const color = SHAPE_COLORS[i % SHAPE_COLORS.length];
              const svgView = view === "top" ? mouse.shape.top : mouse.shape.side;
              const { viewBox, path } = svgView;

              // Scale: 1 unit in the path = 1 mm → multiply by pxPerMm
              const scaleX = pxPerMm;
              const scaleY = pxPerMm;

              // All mice share the same origin (top-left + padding) so they
              // overlay naturally based on their real mm coordinates.
              const originX = PAD_MM * pxPerMm;
              // For side view, align to the bottom baseline
              const originY =
                view === "side"
                  ? canvasH - PAD_MM * pxPerMm - viewBox.height * scaleY
                  : PAD_MM * pxPerMm;

              const fillOpacity = opacity[mouse.slug] ?? 0.15;

              return (
                <g
                  key={mouse.slug}
                  transform={`translate(${originX}, ${originY}) scale(${scaleX}, ${scaleY})`}
                  style={{ willChange: "transform" }}
                >
                  <path
                    d={path}
                    fill={color.stroke}
                    fillOpacity={fillOpacity}
                    stroke={color.stroke}
                    strokeWidth={2 / pxPerMm}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ── Legend + per-mouse controls ──────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {mice.map((mouse, i) => {
          const color = SHAPE_COLORS[i % SHAPE_COLORS.length];
          const isVisible = visible[mouse.slug] ?? true;
          const op = opacity[mouse.slug] ?? 0.15;

          return (
            <div
              key={mouse.slug}
              className={cn(
                "flex flex-wrap items-center gap-4 px-4 py-3 rounded-xl border transition-colors",
                isVisible
                  ? "border-neutral-700 bg-neutral-900"
                  : "border-neutral-800 bg-neutral-900/40 opacity-50"
              )}
            >
              {/* Color swatch + name */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0 border-2"
                  style={{ backgroundColor: color.stroke, borderColor: color.stroke }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-200 truncate">
                    {mouse.brand} {mouse.model}
                  </p>
                  <p className="text-xs text-neutral-500 font-mono">
                    {mouse.dimensions.length}×{mouse.dimensions.width}×{mouse.dimensions.height}mm
                    &nbsp;·&nbsp;{mouse.weight}g
                  </p>
                </div>
              </div>

              {/* Opacity slider */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-500 w-14 text-right font-mono">
                  fill {Math.round(op * 100)}%
                </span>
                <input
                  type="range"
                  min={0}
                  max={0.6}
                  step={0.05}
                  value={op}
                  onChange={(e) =>
                    setOpacity((prev) => ({
                      ...prev,
                      [mouse.slug]: Number(e.target.value),
                    }))
                  }
                  className="w-24 accent-indigo-500"
                  aria-label={`Opacity for ${mouse.model}`}
                />
              </div>

              {/* Visibility toggle */}
              <button
                onClick={() =>
                  setVisible((prev) => ({ ...prev, [mouse.slug]: !prev[mouse.slug] }))
                }
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors"
                style={
                  isVisible
                    ? { borderColor: color.stroke, color: color.stroke }
                    : {}
                }
              >
                {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                {isVisible ? "Visible" : "Hidden"}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Dimensions table ─────────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left px-4 py-2.5 text-neutral-500 font-medium bg-neutral-900">Mouse</th>
              <th className="px-4 py-2.5 text-neutral-500 font-medium bg-neutral-900 text-center">Length</th>
              <th className="px-4 py-2.5 text-neutral-500 font-medium bg-neutral-900 text-center">Width</th>
              <th className="px-4 py-2.5 text-neutral-500 font-medium bg-neutral-900 text-center">Height</th>
              <th className="px-4 py-2.5 text-neutral-500 font-medium bg-neutral-900 text-center">Weight</th>
            </tr>
          </thead>
          <tbody>
            {mice.map((mouse, i) => {
              const color = SHAPE_COLORS[i % SHAPE_COLORS.length];
              return (
                <tr
                  key={mouse.slug}
                  className="border-b border-neutral-800/50 last:border-0"
                >
                  <td className="px-4 py-2.5 text-neutral-200 font-medium">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color.stroke }}
                      />
                      {mouse.brand} {mouse.model}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-neutral-300 text-center font-mono">
                    {mouse.dimensions.length}mm
                  </td>
                  <td className="px-4 py-2.5 text-neutral-300 text-center font-mono">
                    {mouse.dimensions.width}mm
                  </td>
                  <td className="px-4 py-2.5 text-neutral-300 text-center font-mono">
                    {mouse.dimensions.height}mm
                  </td>
                  <td className="px-4 py-2.5 text-neutral-300 text-center font-mono">
                    {mouse.weight}g
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
