"use client";

import { useState } from "react";
import { Mouse as MouseType } from "@/lib/types";
import { FormField, Input, Select, Textarea } from "./FormField";
import { Loader2 } from "lucide-react";

// The form works with a flat representation for ease of editing; we nest on submit.
interface FormState {
  brand: string;
  model: string;
  slug: string;
  // Dimensions
  length: number;
  width: number;
  height: number;
  gripWidth: string; // optional — blank = omit
  weight: number;
  // Specs
  sensor: string;
  maxDPI: string;
  pollingRate: string;
  switches: string;
  batteryLife: string;
  connectivity: string; // comma-separated
  // Shape SVG (top)
  topPath: string;
  topViewBoxW: string;
  topViewBoxH: string;
  // Shape SVG (side)
  sidePath: string;
  sideViewBoxW: string;
  sideViewBoxH: string;
  // Meta
  price: string;
  handedness: MouseType["handedness"] | "";
  gripStyle: MouseType["gripStyle"] | "";
  thumbnail: string;
  tags: string;
  releaseDate: string;
}

const defaultForm: FormState = {
  brand: "",
  model: "",
  slug: "",
  length: 120,
  width: 62,
  height: 40,
  gripWidth: "",
  weight: 70,
  sensor: "",
  maxDPI: "",
  pollingRate: "1000",
  switches: "",
  batteryLife: "",
  connectivity: "wired",
  topPath: "",
  topViewBoxW: "",
  topViewBoxH: "",
  sidePath: "",
  sideViewBoxW: "",
  sideViewBoxH: "",
  price: "",
  handedness: "right",
  gripStyle: "palm",
  thumbnail: "",
  tags: "",
  releaseDate: "",
};

interface Props {
  initial?: Partial<FormState> | Partial<MouseType>;
  onSubmit: (data: Partial<MouseType>) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

/** Auto-generate a slug from brand + model */
function toSlug(brand: string, model: string): string {
  return `${brand}-${model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function MouseForm({ initial, onSubmit, onCancel, isEditing }: Props) {
  // `initial` can be either a flat FormState (from form re-open) or a MouseType
  // from the database. We spread only the flat-compatible keys.
  const [form, setForm] = useState<FormState>(() => {
    if (!initial) return defaultForm;
    // If it looks like a MouseType (has nested `dimensions`), flatten it
    const init = initial as Partial<MouseType>;
    if (init.dimensions) {
      return {
        ...defaultForm,
        brand:       init.brand ?? "",
        model:       init.model ?? "",
        slug:        init.slug ?? "",
        length:      init.dimensions.length ?? 120,
        width:       init.dimensions.width ?? 62,
        height:      init.dimensions.height ?? 40,
        gripWidth:   String(init.dimensions.gripWidth ?? ""),
        weight:      init.weight ?? 70,
        sensor:      init.specifications?.sensor ?? "",
        maxDPI:      String(init.specifications?.maxDPI ?? ""),
        pollingRate: String(init.specifications?.pollingRate ?? "1000"),
        switches:    init.specifications?.switches ?? "",
        batteryLife: String(init.specifications?.batteryLife ?? ""),
        connectivity: init.specifications?.connectivity?.join(", ") ?? "wired",
        topPath:      init.shape?.top?.path ?? "",
        topViewBoxW:  String(init.shape?.top?.viewBox?.width ?? ""),
        topViewBoxH:  String(init.shape?.top?.viewBox?.height ?? ""),
        sidePath:     init.shape?.side?.path ?? "",
        sideViewBoxW: String(init.shape?.side?.viewBox?.width ?? ""),
        sideViewBoxH: String(init.shape?.side?.viewBox?.height ?? ""),
        price:        String(init.price ?? ""),
        handedness:   (init.handedness as FormState["handedness"]) ?? "right",
        gripStyle:    (init.gripStyle as FormState["gripStyle"]) ?? "palm",
        thumbnail:    init.images?.thumbnail ?? "",
        tags:         (init.tags ?? []).join(", "),
        releaseDate:  init.releaseDate
          ? new Date(init.releaseDate).toISOString().split("T")[0]
          : "",
      };
    }
    // Already flat FormState shape
    return { ...defaultForm, ...(initial as Partial<FormState>) };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      // Auto-derive slug while typing brand/model (only if not editing)
      if (!isEditing && (key === "brand" || key === "model")) {
        updated.slug = toSlug(
          key === "brand" ? (value as string) : prev.brand,
          key === "model" ? (value as string) : prev.model
        );
      }
      // Auto-derive viewBox from dimensions
      if (key === "length" || key === "width" || key === "height") {
        if (!isEditing) {
          updated.topViewBoxW = String(updated.width);
          updated.topViewBoxH = String(updated.length);
          updated.sideViewBoxW = String(updated.length);
          updated.sideViewBoxH = String(updated.height);
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: Partial<MouseType> = {
        brand: form.brand,
        model: form.model,
        slug:  form.slug || toSlug(form.brand, form.model),
        dimensions: {
          length: form.length,
          width:  form.width,
          height: form.height,
          ...(form.gripWidth ? { gripWidth: Number(form.gripWidth) } : {}),
        },
        weight: form.weight,
        specifications: {
          ...(form.sensor      ? { sensor:      form.sensor }               : {}),
          ...(form.maxDPI      ? { maxDPI:      Number(form.maxDPI) }       : {}),
          ...(form.pollingRate ? { pollingRate: Number(form.pollingRate) }  : {}),
          ...(form.switches    ? { switches:    form.switches }             : {}),
          ...(form.batteryLife ? { batteryLife: Number(form.batteryLife) }  : {}),
          connectivity: form.connectivity
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
        shape: {
          top: {
            path: form.topPath,
            viewBox: {
              width:  Number(form.topViewBoxW) || form.width,
              height: Number(form.topViewBoxH) || form.length,
            },
          },
          side: {
            path: form.sidePath,
            viewBox: {
              width:  Number(form.sideViewBoxW) || form.length,
              height: Number(form.sideViewBoxH) || form.height,
            },
          },
        },
        images: { thumbnail: form.thumbnail, gallery: [] },
        ...(form.price       ? { price: Number(form.price) }    : {}),
        ...(form.handedness  ? { handedness: form.handedness }  : {}),
        ...(form.gripStyle   ? { gripStyle:  form.gripStyle }   : {}),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        ...(form.releaseDate ? { releaseDate: form.releaseDate } : {}),
      };

      await onSubmit(payload);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Brand + Model */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Brand" required>
          <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Logitech" required />
        </FormField>
        <FormField label="Model" required>
          <Input value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="G Pro X Superlight 2" required />
        </FormField>
      </div>

      {/* Slug */}
      <FormField label="Slug" required>
        <Input
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
          placeholder="logitech-g-pro-x-superlight-2"
          required
        />
      </FormField>

      {/* Dimensions */}
      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Dimensions (mm)</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <FormField label="Length" required>
          <Input type="number" min={0} step={0.1} value={form.length} onChange={(e) => set("length", Number(e.target.value))} required />
        </FormField>
        <FormField label="Width" required>
          <Input type="number" min={0} step={0.1} value={form.width} onChange={(e) => set("width", Number(e.target.value))} required />
        </FormField>
        <FormField label="Height" required>
          <Input type="number" min={0} step={0.1} value={form.height} onChange={(e) => set("height", Number(e.target.value))} required />
        </FormField>
        <FormField label="Grip Width (opt)">
          <Input type="number" min={0} step={0.1} value={form.gripWidth} onChange={(e) => set("gripWidth", e.target.value)} placeholder="—" />
        </FormField>
      </div>

      {/* Weight */}
      <FormField label="Weight (g)" required>
        <Input type="number" min={0} step={0.1} value={form.weight} onChange={(e) => set("weight", Number(e.target.value))} required />
      </FormField>

      {/* Specifications */}
      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Specifications</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Sensor">
          <Input value={form.sensor} onChange={(e) => set("sensor", e.target.value)} placeholder="HERO 2" />
        </FormField>
        <FormField label="Max DPI">
          <Input type="number" min={0} step={100} value={form.maxDPI} onChange={(e) => set("maxDPI", e.target.value)} placeholder="32000" />
        </FormField>
        <FormField label="Polling Rate (Hz)">
          <Select
            value={form.pollingRate}
            onChange={(e) => set("pollingRate", e.target.value)}
            options={[
              { value: "125", label: "125 Hz" },
              { value: "250", label: "250 Hz" },
              { value: "500", label: "500 Hz" },
              { value: "1000", label: "1000 Hz" },
              { value: "2000", label: "2000 Hz" },
              { value: "4000", label: "4000 Hz" },
              { value: "8000", label: "8000 Hz" },
            ]}
          />
        </FormField>
        <FormField label="Battery Life (hrs)">
          <Input type="number" min={0} value={form.batteryLife} onChange={(e) => set("batteryLife", e.target.value)} placeholder="Leave blank for wired" />
        </FormField>
        <FormField label="Switches">
          <Input value={form.switches} onChange={(e) => set("switches", e.target.value)} placeholder="Kailh GM 4.0" />
        </FormField>
        <FormField label="Connectivity (comma-separated)" required>
          <Input value={form.connectivity} onChange={(e) => set("connectivity", e.target.value)} placeholder="wired" required />
        </FormField>
      </div>

      {/* Shape — Top SVG */}
      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Shape — Top View SVG</p>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="ViewBox Width (= mouse width mm)" required>
          <Input type="number" min={0} step={0.1} value={form.topViewBoxW} onChange={(e) => set("topViewBoxW", e.target.value)} placeholder="63.5" required />
        </FormField>
        <FormField label="ViewBox Height (= mouse length mm)" required>
          <Input type="number" min={0} step={0.1} value={form.topViewBoxH} onChange={(e) => set("topViewBoxH", e.target.value)} placeholder="125" required />
        </FormField>
      </div>
      <FormField label="Top SVG Path (d attribute)" required>
        <Textarea
          value={form.topPath}
          onChange={(e) => set("topPath", e.target.value)}
          placeholder="M 8.9 1.3 C 8.9 1.3 ..."
          rows={4}
          required
        />
      </FormField>

      {/* Shape — Side SVG */}
      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Shape — Side View SVG</p>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="ViewBox Width (= mouse length mm)" required>
          <Input type="number" min={0} step={0.1} value={form.sideViewBoxW} onChange={(e) => set("sideViewBoxW", e.target.value)} placeholder="125" required />
        </FormField>
        <FormField label="ViewBox Height (= mouse height mm)" required>
          <Input type="number" min={0} step={0.1} value={form.sideViewBoxH} onChange={(e) => set("sideViewBoxH", e.target.value)} placeholder="40" required />
        </FormField>
      </div>
      <FormField label="Side SVG Path (d attribute)" required>
        <Textarea
          value={form.sidePath}
          onChange={(e) => set("sidePath", e.target.value)}
          placeholder="M 0 0 L 0 6.4 ..."
          rows={4}
          required
        />
      </FormField>

      {/* Meta */}
      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Meta</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Price ($)">
          <Input type="number" min={0} step={0.01} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="159" />
        </FormField>
        <FormField label="Handedness">
          <Select
            value={form.handedness ?? ""}
            onChange={(e) => set("handedness", e.target.value as FormState["handedness"])}
            options={[
              { value: "", label: "Unknown" },
              { value: "right", label: "Right" },
              { value: "left", label: "Left" },
              { value: "ambidextrous", label: "Ambidextrous" },
            ]}
          />
        </FormField>
        <FormField label="Grip Style">
          <Select
            value={form.gripStyle ?? ""}
            onChange={(e) => set("gripStyle", e.target.value as FormState["gripStyle"])}
            options={[
              { value: "", label: "Unknown" },
              { value: "palm", label: "Palm" },
              { value: "claw", label: "Claw" },
              { value: "fingertip", label: "Fingertip" },
            ]}
          />
        </FormField>
      </div>

      <FormField label="Thumbnail URL">
        <Input value={form.thumbnail} onChange={(e) => set("thumbnail", e.target.value)} placeholder="/images/mice/my-mouse.png" />
      </FormField>

      <FormField label="Tags (comma-separated)">
        <Input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="competitive, lightweight, wireless" />
      </FormField>

      <FormField label="Release Date">
        <Input type="date" value={form.releaseDate} onChange={(e) => set("releaseDate", e.target.value)} />
      </FormField>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {isEditing ? "Save Changes" : "Add Mouse"}
        </button>
      </div>
    </form>
  );
}
