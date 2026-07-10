"use client";

import { useState, useEffect, useCallback } from "react";
import { Mouse as MouseType, KeyboardProduct, MonitorProduct } from "@/lib/types";
import { MouseForm } from "@/components/admin/MouseForm";
import { KeyboardForm } from "@/components/admin/KeyboardForm";
import { MonitorForm } from "@/components/admin/MonitorForm";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  Plus, Pencil, Trash2, RefreshCw, Database,
  Mouse as MouseIcon, Keyboard, Monitor, Loader2, Search, Zap
} from "lucide-react";
import { cn, formatPrice, getRatingColor } from "@/lib/utils";

type Tab = "mice" | "keyboards" | "monitors";

// ── helpers ──────────────────────────────────────────────────────────────────
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Request failed");
  return json;
}

// ── main component ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("mice");

  // data
  const [miceData, setMiceData] = useState<MouseType[]>([]);
  const [keyboardsData, setKeyboardsData] = useState<KeyboardProduct[]>([]);
  const [monitorsData, setMonitorsData] = useState<MonitorProduct[]>([]);

  // loading / error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  // search
  const [search, setSearch] = useState("");

  // modals
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<MouseType | KeyboardProduct | MonitorProduct | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [m, k, mon] = await Promise.all([
        apiFetch<{ data: MouseType[] }>("/api/mice"),
        apiFetch<{ data: KeyboardProduct[] }>("/api/keyboards"),
        apiFetch<{ data: MonitorProduct[] }>("/api/monitors"),
      ]);
      setMiceData(m.data);
      setKeyboardsData(k.data);
      setMonitorsData(mon.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── seed ───────────────────────────────────────────────────────────────────
  const handleSeed = async () => {
    if (!confirm("This will REPLACE all existing data with the default seed data. Continue?")) return;
    setSeeding(true);
    setSeedMsg("");
    try {
      const res = await apiFetch<{ message: string; counts: Record<string, number> }>("/api/seed", { method: "POST" });
      setSeedMsg(`✓ Seeded: ${res.counts.mice} mice, ${res.counts.keyboards} keyboards, ${res.counts.monitors} monitors`);
      await fetchAll();
    } catch (e: unknown) {
      setSeedMsg(e instanceof Error ? e.message : "Seed failed");
    } finally {
      setSeeding(false);
    }
  };

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  const handleAdd = async (data: unknown) => {
    await apiFetch(`/api/${tab}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setAddOpen(false);
    await fetchAll();
  };

  const handleEdit = async (data: unknown) => {
    if (!editItem) return;
    await apiFetch(`/api/${tab}/${editItem.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setEditItem(null);
    await fetchAll();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await apiFetch(`/api/${tab}/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      await fetchAll();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── filtered lists ─────────────────────────────────────────────────────────
  const q = search.toLowerCase();
  const filteredMice = miceData.filter(
    (m) => !q || m.model.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q)
  );
  const filteredKeyboards = keyboardsData.filter(
    (k) => !q || k.name.toLowerCase().includes(q) || k.brand.toLowerCase().includes(q)
  );
  const filteredMonitors = monitorsData.filter(
    (m) => !q || m.name.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q)
  );

  const tabs: { id: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { id: "mice", label: "Mice", icon: MouseIcon, count: miceData.length },
    { id: "keyboards", label: "Keyboards", icon: Keyboard, count: keyboardsData.length },
    { id: "monitors", label: "Monitors", icon: Monitor, count: monitorsData.length },
  ];

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Database size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Admin Panel</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage your peripheral database</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={cn(loading && "animate-spin")} />
            Refresh
          </button>

          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors disabled:opacity-50"
          >
            {seeding ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
            Seed DB
          </button>

          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus size={14} />
            Add {tab === "mice" ? "Mouse" : tab === "keyboards" ? "Keyboard" : "Monitor"}
          </button>
        </div>
      </div>

      {/* Seed message */}
      {seedMsg && (
        <div className={cn(
          "mb-4 px-4 py-3 rounded-xl border text-sm",
          seedMsg.startsWith("✓")
            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400"
            : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400"
        )}>
          {seedMsg}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSearch(""); }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                tab === t.id
                  ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              )}
            >
              <t.icon size={14} />
              {t.label}
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full font-semibold",
                tab === t.id
                  ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
                  : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500"
              )}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or brand..."
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-neutral-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : (
        <>
          {tab === "mice" && (
            <MiceTable
              mice={filteredMice}
              onEdit={(m) => setEditItem(m)}
              onDelete={(id) => setDeleteId(id)}
            />
          )}
          {tab === "keyboards" && (
            <KeyboardsTable
              keyboards={filteredKeyboards}
              onEdit={(k) => setEditItem(k)}
              onDelete={(id) => setDeleteId(id)}
            />
          )}
          {tab === "monitors" && (
            <MonitorsTable
              monitors={filteredMonitors}
              onEdit={(m) => setEditItem(m)}
              onDelete={(id) => setDeleteId(id)}
            />
          )}
        </>
      )}

      {/* Add Modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title={`Add ${tab === "mice" ? "Mouse" : tab === "keyboards" ? "Keyboard" : "Monitor"}`}
        size="xl"
      >
        {tab === "mice" && (
          <MouseForm onSubmit={handleAdd as (d: Parameters<typeof handleAdd>[0]) => Promise<void>} onCancel={() => setAddOpen(false)} />
        )}
        {tab === "keyboards" && (
          <KeyboardForm onSubmit={handleAdd as (d: Parameters<typeof handleAdd>[0]) => Promise<void>} onCancel={() => setAddOpen(false)} />
        )}
        {tab === "monitors" && (
          <MonitorForm onSubmit={handleAdd as (d: Parameters<typeof handleAdd>[0]) => Promise<void>} onCancel={() => setAddOpen(false)} />
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        title={`Edit ${tab === "mice" ? "Mouse" : tab === "keyboards" ? "Keyboard" : "Monitor"}`}
        size="xl"
      >
        {editItem && tab === "mice" && (
          <MouseForm
            initial={editItem as Partial<MouseType>}
            onSubmit={handleEdit as (d: Parameters<typeof handleEdit>[0]) => Promise<void>}
            onCancel={() => setEditItem(null)}
            isEditing
          />
        )}
        {editItem && tab === "keyboards" && (
          <KeyboardForm
            initial={editItem as Omit<KeyboardProduct, "id">}
            onSubmit={handleEdit as (d: Parameters<typeof handleEdit>[0]) => Promise<void>}
            onCancel={() => setEditItem(null)}
            isEditing
          />
        )}
        {editItem && tab === "monitors" && (
          <MonitorForm
            initial={editItem as Omit<MonitorProduct, "id">}
            onSubmit={handleEdit as (d: Parameters<typeof handleEdit>[0]) => Promise<void>}
            onCancel={() => setEditItem(null)}
            isEditing
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete item"
        message="This action is permanent and cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </div>
  );
}

// ── sub-tables ────────────────────────────────────────────────────────────────
function TableShell({ headers, children, empty }: {
  headers: string[];
  children: React.ReactNode;
  empty: boolean;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
              {headers.map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {empty ? (
              <tr>
                <td colSpan={headers.length + 1} className="text-center py-16 text-neutral-400">
                  No items found. Add one or seed the database.
                </td>
              </tr>
            ) : children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionButtons({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <td className="px-4 py-3 text-right">
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={onEdit}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
          aria-label="Edit"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          aria-label="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </td>
  );
}

function MiceTable({ mice, onEdit, onDelete }: {
  mice: MouseType[];
  onEdit: (m: MouseType) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <TableShell
      headers={["Mouse", "Price", "Sensor", "Polling", "Weight", "Dimensions", "Connectivity"]}
      empty={mice.length === 0}
    >
      {mice.map((m, i) => {
        const isWireless = m.specifications.connectivity?.some(
          (c: string) => c.toLowerCase().includes("wireless")
        );
        return (
          <tr
            key={m.id}
            className={cn(
              "border-b border-neutral-100 dark:border-neutral-800/60 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors",
              i % 2 === 0 ? "bg-white dark:bg-neutral-950" : "bg-neutral-50/30 dark:bg-neutral-900/20"
            )}
          >
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">🖱️</span>
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wide">{m.brand}</p>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">{m.model}</p>
                  <p className="text-[10px] text-neutral-400 font-mono">{m.slug}</p>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
              {m.price != null ? formatPrice(m.price) : "—"}
            </td>
            <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
              {m.specifications.sensor ?? "—"}
            </td>
            <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
              {m.specifications.pollingRate ? `${m.specifications.pollingRate}Hz` : "—"}
            </td>
            <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{m.weight}g</td>
            <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap font-mono text-xs">
              {m.dimensions.length}×{m.dimensions.width}×{m.dimensions.height}mm
            </td>
            <td className="px-4 py-3">
              <span className={cn(
                "text-[11px] font-medium px-2 py-0.5 rounded-full capitalize",
                isWireless
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              )}>
                {m.specifications.connectivity?.join(", ") ?? "—"}
              </span>
            </td>
            <ActionButtons onEdit={() => onEdit(m)} onDelete={() => onDelete(m.id)} />
          </tr>
        );
      })}
    </TableShell>
  );
}

function KeyboardsTable({ keyboards, onEdit, onDelete }: {
  keyboards: KeyboardProduct[];
  onEdit: (k: KeyboardProduct) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <TableShell
      headers={["Keyboard", "Price", "Size", "Switch", "Connectivity", "Hotswap", "Gasket", "Rating"]}
      empty={keyboards.length === 0}
    >
      {keyboards.map((k, i) => (
        <tr
          key={k.id}
          className={cn(
            "border-b border-neutral-100 dark:border-neutral-800/60 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors",
            i % 2 === 0 ? "bg-white dark:bg-neutral-950" : "bg-neutral-50/30 dark:bg-neutral-900/20"
          )}
        >
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-lg">⌨️</span>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide">{k.brand}</p>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">{k.name}</p>
              </div>
            </div>
          </td>
          <td className="px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">{formatPrice(k.price)}</td>
          <td className="px-4 py-3">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">{k.size}</span>
          </td>
          <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap max-w-[160px] truncate">{k.switchName}</td>
          <td className="px-4 py-3">
            <span className={cn(
              "text-[11px] font-medium px-2 py-0.5 rounded-full capitalize",
              k.connectivity !== "wired" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
            )}>
              {k.connectivity}
            </span>
          </td>
          <td className="px-4 py-3 text-center text-sm">{k.hotswap ? "✓" : "—"}</td>
          <td className="px-4 py-3 text-center text-sm">{k.gasket ? "✓" : "—"}</td>
          <td className="px-4 py-3">
            <span className={cn("font-bold text-sm", getRatingColor(k.rating))}>{k.rating}</span>
          </td>
          <ActionButtons onEdit={() => onEdit(k)} onDelete={() => onDelete(k.id)} />
        </tr>
      ))}
    </TableShell>
  );
}

function MonitorsTable({ monitors, onEdit, onDelete }: {
  monitors: MonitorProduct[];
  onEdit: (m: MonitorProduct) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <TableShell
      headers={["Monitor", "Price", "Size", "Resolution", "Refresh", "Panel", "HDR", "Rating"]}
      empty={monitors.length === 0}
    >
      {monitors.map((m, i) => (
        <tr
          key={m.id}
          className={cn(
            "border-b border-neutral-100 dark:border-neutral-800/60 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors",
            i % 2 === 0 ? "bg-white dark:bg-neutral-950" : "bg-neutral-50/30 dark:bg-neutral-900/20"
          )}
        >
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-lg">🖥️</span>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide">{m.brand}</p>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">{m.name}</p>
              </div>
            </div>
          </td>
          <td className="px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">{formatPrice(m.price)}</td>
          <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{m.size}"</td>
          <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{m.resolution}</td>
          <td className="px-4 py-3 font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{m.refreshRate}Hz</td>
          <td className="px-4 py-3">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">{m.panel}</span>
          </td>
          <td className="px-4 py-3 text-sm">
            {m.hdr ? <span className="text-amber-600 dark:text-amber-400 font-medium">{m.hdrLevel ?? "HDR"}</span> : <span className="text-neutral-400">—</span>}
          </td>
          <td className="px-4 py-3">
            <span className={cn("font-bold text-sm", getRatingColor(m.rating))}>{m.rating}</span>
          </td>
          <ActionButtons onEdit={() => onEdit(m)} onDelete={() => onDelete(m.id)} />
        </tr>
      ))}
    </TableShell>
  );
}
