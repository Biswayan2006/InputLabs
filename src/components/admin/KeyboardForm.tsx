"use client";

import { useState } from "react";
import { KeyboardProduct } from "@/lib/types";
import { FormField, Input, Select, Textarea, Checkbox } from "./FormField";
import { Loader2 } from "lucide-react";

type FormData = Omit<KeyboardProduct, "id">;

const defaultForm: FormData = {
  name: "",
  brand: "",
  image: "",
  price: 0,
  size: "tkl",
  switchType: "mechanical",
  switchName: "",
  connectivity: "wired",
  hotswap: false,
  rgb: false,
  knob: false,
  gasket: false,
  battery: undefined,
  weight: 900,
  layout: "ANSI",
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

export function KeyboardForm({ initial, onSubmit, onCancel, isEditing }: Props) {
  const [form, setForm] = useState<FormData>({ ...defaultForm, ...initial });
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
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
      await onSubmit({ ...form, tags });
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
          <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Keychron" required />
        </FormField>
        <FormField label="Name" required>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Q3 Max" required />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Price ($)" required>
          <Input type="number" min={0} step={0.01} value={form.price} onChange={(e) => set("price", Number(e.target.value))} required />
        </FormField>
        <FormField label="Rating (0–10)" required>
          <Input type="number" min={0} max={10} step={0.1} value={form.rating} onChange={(e) => set("rating", Number(e.target.value))} required />
        </FormField>
        <FormField label="Weight (g)" required>
          <Input type="number" min={0} value={form.weight} onChange={(e) => set("weight", Number(e.target.value))} required />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Switch Name" required>
          <Input value={form.switchName} onChange={(e) => set("switchName", e.target.value)} placeholder="Gateron G Pro Red" required />
        </FormField>
        <FormField label="Switch Type" required>
          <Select
            value={form.switchType}
            onChange={(e) => set("switchType", e.target.value as FormData["switchType"])}
            options={[
              { value: "mechanical", label: "Mechanical" },
              { value: "optical", label: "Optical" },
              { value: "membrane", label: "Membrane" },
              { value: "analog", label: "Analog / Hall Effect" },
            ]}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Size" required>
          <Select
            value={form.size}
            onChange={(e) => set("size", e.target.value as FormData["size"])}
            options={[
              { value: "full", label: "Full Size (100%)" },
              { value: "tkl", label: "TKL (80%)" },
              { value: "75%", label: "75%" },
              { value: "65%", label: "65%" },
              { value: "60%", label: "60%" },
              { value: "40%", label: "40%" },
            ]}
          />
        </FormField>
        <FormField label="Connectivity" required>
          <Select
            value={form.connectivity}
            onChange={(e) => set("connectivity", e.target.value as FormData["connectivity"])}
            options={[
              { value: "wired", label: "Wired" },
              { value: "wireless", label: "Wireless" },
              { value: "both", label: "Both" },
            ]}
          />
        </FormField>
        <FormField label="Layout">
          <Input value={form.layout} onChange={(e) => set("layout", e.target.value)} placeholder="ANSI" />
        </FormField>
      </div>

      <FormField label="Battery (mAh, leave blank for wired)">
        <Input
          type="number" min={0}
          value={form.battery ?? ""}
          onChange={(e) => set("battery", e.target.value ? Number(e.target.value) : undefined)}
          placeholder="e.g. 4000"
        />
      </FormField>

      <div className="flex flex-wrap gap-5">
        <Checkbox label="Hotswap" checked={form.hotswap} onChange={(e) => set("hotswap", e.target.checked)} />
        <Checkbox label="Gasket Mount" checked={form.gasket} onChange={(e) => set("gasket", e.target.checked)} />
        <Checkbox label="RGB" checked={form.rgb} onChange={(e) => set("rgb", e.target.checked)} />
        <Checkbox label="Knob" checked={form.knob} onChange={(e) => set("knob", e.target.checked)} />
      </div>

      <FormField label="Tags (comma-separated)">
        <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="gasket, hotswap, wireless" />
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
          {isEditing ? "Save Changes" : "Add Keyboard"}
        </button>
      </div>
    </form>
  );
}
