"use client";

import { useState } from "react";
import { MonitorProduct } from "@/lib/types";
import { FormField, Input, Select, Textarea, Checkbox } from "./FormField";
import { Loader2 } from "lucide-react";

type FormData = Omit<MonitorProduct, "id">;

const defaultForm: FormData = {
  name: "",
  brand: "",
  image: "",
  price: 0,
  size: 27,
  resolution: "2560x1440",
  refreshRate: 144,
  responseTime: 1,
  panel: "IPS",
  hdr: false,
  hdrLevel: "",
  brightness: 400,
  contrast: "1000:1",
  colorGamut: "sRGB 99%",
  gSync: false,
  freeSync: false,
  curved: false,
  ports: [],
  tags: [],
  rating: 8.0,
  description: "",
};

interface Props {
  initial?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export function MonitorForm({ initial, onSubmit, onCancel, isEditing }: Props) {
  const [form, setForm] = useState<FormData>({ ...defaultForm, ...initial });
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
  const [portsInput, setPortsInput] = useState((initial?.ports ?? []).join(", "));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const ports = portsInput.split(",").map((p) => p.trim()).filter(Boolean);
      await onSubmit({ ...form, tags, ports });
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Brand" required>
          <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="LG" required />
        </FormField>
        <FormField label="Name" required>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="27GP950-B" required />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Price ($)" required>
          <Input type="number" min={0} step={0.01} value={form.price} onChange={(e) => set("price", Number(e.target.value))} required />
        </FormField>
        <FormField label="Rating (0–10)" required>
          <Input type="number" min={0} max={10} step={0.1} value={form.rating} onChange={(e) => set("rating", Number(e.target.value))} required />
        </FormField>
        <FormField label='Size (inches)"' required>
          <Input type="number" min={10} max={100} step={0.1} value={form.size} onChange={(e) => set("size", Number(e.target.value))} required />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Resolution" required>
          <Input value={form.resolution} onChange={(e) => set("resolution", e.target.value)} placeholder="2560x1440" required />
        </FormField>
        <FormField label="Refresh Rate (Hz)" required>
          <Input type="number" min={60} value={form.refreshRate} onChange={(e) => set("refreshRate", Number(e.target.value))} required />
        </FormField>
        <FormField label="Response Time (ms)" required>
          <Input type="number" min={0} step={0.1} value={form.responseTime} onChange={(e) => set("responseTime", Number(e.target.value))} required />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Panel Type" required>
          <Select
            value={form.panel}
            onChange={(e) => set("panel", e.target.value as FormData["panel"])}
            options={[
              { value: "IPS", label: "IPS" },
              { value: "VA", label: "VA" },
              { value: "TN", label: "TN" },
              { value: "OLED", label: "OLED" },
              { value: "Mini-LED", label: "Mini-LED" },
            ]}
          />
        </FormField>
        <FormField label="HDR Level (e.g. HDR400, HDR600)">
          <Input
            value={form.hdrLevel ?? ""}
            onChange={(e) => set("hdrLevel", e.target.value || "")}
            placeholder="HDR400"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Brightness (nits)" required>
          <Input type="number" min={0} value={form.brightness} onChange={(e) => set("brightness", Number(e.target.value))} required />
        </FormField>
        <FormField label="Contrast Ratio" required>
          <Input value={form.contrast} onChange={(e) => set("contrast", e.target.value)} placeholder="1000:1" required />
        </FormField>
        <FormField label="Color Gamut" required>
          <Input value={form.colorGamut} onChange={(e) => set("colorGamut", e.target.value)} placeholder="DCI-P3 98%" required />
        </FormField>
      </div>

      <div className="flex flex-wrap gap-5">
        <Checkbox label="HDR" checked={form.hdr} onChange={(e) => set("hdr", e.target.checked)} />
        <Checkbox label="G-Sync" checked={form.gSync} onChange={(e) => set("gSync", e.target.checked)} />
        <Checkbox label="FreeSync" checked={form.freeSync} onChange={(e) => set("freeSync", e.target.checked)} />
        <Checkbox label="Curved" checked={form.curved} onChange={(e) => set("curved", e.target.checked)} />
      </div>

      <FormField label="Ports (comma-separated)">
        <Input value={portsInput} onChange={(e) => setPortsInput(e.target.value)} placeholder="DisplayPort 1.4, HDMI 2.1, USB-A x2" />
      </FormField>

      <FormField label="Tags (comma-separated)">
        <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="4K, 144Hz, IPS" />
      </FormField>

      <FormField label="Description">
        <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="A brief description..." />
      </FormField>

      <div className="flex justify-end gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60">
          {loading && <Loader2 size={14} className="animate-spin" />}
          {isEditing ? "Save Changes" : "Add Monitor"}
        </button>
      </div>
    </form>
  );
}
