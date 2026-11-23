import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, X, ListPlus } from "lucide-react";
import { useHealthCategories } from "../../hooks/useHealthCategories";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import type { ReferenceRange } from "../../types";

interface BulkRow {
  name: string;
  unit: string;
  marker_type: "numeric" | "text";
  min_reference: string;
  max_reference: string;
  normal_value: string;
  ranges: RangeEntry[];
}

interface RangeEntry {
  label: string;
  min: string;
  max: string;
  value: string;
  color: "green" | "yellow" | "red";
}

function parseRanges(json: string | null): RangeEntry[] {
  if (!json) return [];
  try {
    const parsed: ReferenceRange[] = JSON.parse(json);
    return parsed.map((r) => ({
      label: r.label,
      min: r.min != null ? String(r.min) : "",
      max: r.max != null ? String(r.max) : "",
      value: r.value ?? "",
      color: r.color,
    }));
  } catch {
    return [];
  }
}

function serializeRanges(ranges: RangeEntry[], markerType: "numeric" | "text"): string | null {
  const filtered = ranges.filter((r) => r.label.trim());
  if (filtered.length === 0) return null;
  const serialized: ReferenceRange[] = filtered.map((r) => {
    if (markerType === "numeric") {
      return {
        label: r.label.trim(),
        min: r.min ? Number(r.min) : null,
        max: r.max ? Number(r.max) : null,
        color: r.color,
      };
    }
    return {
      label: r.label.trim(),
      value: r.value.trim() || null,
      color: r.color,
    };
  });
  return JSON.stringify(serialized);
}

const colorOptions: { value: "green" | "yellow" | "red"; label: string; cls: string }[] = [
  { value: "green", label: "Normal", cls: "bg-green-100 text-green-700" },
  { value: "yellow", label: "Borderline", cls: "bg-yellow-100 text-yellow-700" },
  { value: "red", label: "High/Abnormal", cls: "bg-red-100 text-red-700" },
];

export default function Categories() {
  const {
    categories, loading, error,
    createCategory, updateCategory, deleteCategory,
    createMarker, createMarkersBatch, updateMarker, deleteMarker,
  } = useHealthCategories();

  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null);
  const [categoryName, setCategoryName] = useState("");

  const [showMarkerForm, setShowMarkerForm] = useState(false);
  const [markerCategoryId, setMarkerCategoryId] = useState<number>(0);
  const [editingMarker, setEditingMarker] = useState<{
    id: number; name: string; unit: string; category_id: number;
    marker_type: "numeric" | "text";
    min_reference: number | null; max_reference: number | null;
    normal_value: string | null; reference_ranges: string | null;
  } | null>(null);
  const [markerName, setMarkerName] = useState("");
  const [markerUnit, setMarkerUnit] = useState("");
  const [markerType, setMarkerType] = useState<"numeric" | "text">("numeric");
  const [markerMinRef, setMarkerMinRef] = useState("");
  const [markerMaxRef, setMarkerMaxRef] = useState("");
  const [markerNormalValue, setMarkerNormalValue] = useState("");
  const [ranges, setRanges] = useState<RangeEntry[]>([]);

  // Bulk add state
  const emptyBulkRow = (): BulkRow => ({
    name: "", unit: "", marker_type: "numeric",
    min_reference: "", max_reference: "", normal_value: "", ranges: [],
  });
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkCategoryId, setBulkCategoryId] = useState<number>(0);
  const [bulkRows, setBulkRows] = useState<BulkRow[]>([emptyBulkRow(), emptyBulkRow(), emptyBulkRow()]);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [expandedBulk, setExpandedBulk] = useState<Set<number>>(new Set());

  const [deletingCategory, setDeletingCategory] = useState<{ id: number; name: string } | null>(null);
  const [deletingMarker, setDeletingMarker] = useState<{ id: number; name: string } | null>(null);

  const toggle = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    if (editingCategory) {
      await updateCategory(editingCategory.id, categoryName.trim());
    } else {
      await createCategory(categoryName.trim());
    }
    setShowCategoryForm(false);
    setEditingCategory(null);
    setCategoryName("");
  };

  const handleMarkerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!markerName.trim()) return;
    const payload = {
      name: markerName.trim(),
      unit: markerUnit.trim(),
      category_id: editingMarker ? editingMarker.category_id : markerCategoryId,
      marker_type: markerType,
      min_reference: markerType === "numeric" && markerMinRef ? Number(markerMinRef) : null,
      max_reference: markerType === "numeric" && markerMaxRef ? Number(markerMaxRef) : null,
      normal_value: markerType === "text" && markerNormalValue ? markerNormalValue.trim() : null,
      reference_ranges: serializeRanges(ranges, markerType),
    };
    if (editingMarker) {
      await updateMarker(editingMarker.id, payload);
    } else {
      await createMarker(payload);
    }
    setShowMarkerForm(false);
    setEditingMarker(null);
    resetMarkerFields();
  };

  const resetMarkerFields = () => {
    setMarkerName("");
    setMarkerUnit("");
    setMarkerType("numeric");
    setMarkerMinRef("");
    setMarkerMaxRef("");
    setMarkerNormalValue("");
    setRanges([]);
  };

  const addRange = () => {
    setRanges((prev) => [...prev, { label: "", min: "", max: "", value: "", color: "green" }]);
  };

  const updateRange = (index: number, field: keyof RangeEntry, val: string) => {
    setRanges((prev) => prev.map((r, i) => i === index ? { ...r, [field]: val } : r));
  };

  const removeRange = (index: number) => {
    setRanges((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = bulkRows.filter((r) => r.name.trim());
    if (valid.length === 0) return;
    setBulkSaving(true);
    try {
      await createMarkersBatch(
        valid.map((r) => ({
          name: r.name.trim(),
          unit: r.unit.trim(),
          category_id: bulkCategoryId,
          marker_type: r.marker_type,
          min_reference: r.marker_type === "numeric" && r.min_reference ? Number(r.min_reference) : null,
          max_reference: r.marker_type === "numeric" && r.max_reference ? Number(r.max_reference) : null,
          normal_value: r.marker_type === "text" && r.normal_value ? r.normal_value.trim() : null,
          reference_ranges: serializeRanges(r.ranges, r.marker_type),
        }))
      );
      setShowBulkForm(false);
      setBulkRows([emptyBulkRow(), emptyBulkRow(), emptyBulkRow()]);
      setExpandedBulk(new Set());
    } finally {
      setBulkSaving(false);
    }
  };

  const updateBulkRow = (index: number, field: string, val: string) => {
    setBulkRows((prev) => prev.map((r, i) => i === index ? { ...r, [field]: val } : r));
  };

  const addBulkRow = () => {
    setBulkRows((prev) => [...prev, emptyBulkRow()]);
  };

  const removeBulkRow = (index: number) => {
    setBulkRows((prev) => prev.filter((_, i) => i !== index));
    setExpandedBulk((prev) => {
      const next = new Set<number>();
      prev.forEach((v) => { if (v < index) next.add(v); else if (v > index) next.add(v - 1); });
      return next;
    });
  };

  const toggleBulkAccordion = (index: number) => {
    setExpandedBulk((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
  };

  const addBulkRange = (index: number) => {
    setBulkRows((prev) => prev.map((r, i) =>
      i === index ? { ...r, ranges: [...r.ranges, { label: "", min: "", max: "", value: "", color: "green" as const }] } : r
    ));
  };

  const updateBulkRange = (rowIndex: number, rangeIndex: number, field: keyof RangeEntry, val: string) => {
    setBulkRows((prev) => prev.map((r, i) =>
      i === rowIndex ? { ...r, ranges: r.ranges.map((rng, j) => j === rangeIndex ? { ...rng, [field]: val } : rng) } : r
    ));
  };

  const removeBulkRange = (rowIndex: number, rangeIndex: number) => {
    setBulkRows((prev) => prev.map((r, i) =>
      i === rowIndex ? { ...r, ranges: r.ranges.filter((_, j) => j !== rangeIndex) } : r
    ));
  };

  const getRangesSummary = (json: string | null): string => {
    if (!json) return "";
    try {
      const parsed: ReferenceRange[] = JSON.parse(json);
      return parsed.map((r) => r.label).join(", ");
    } catch {
      return "";
    }
  };

  if (loading) {
    return <div className="p-4 md:p-6"><p className="text-gray-500">Loading...</p></div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Categories & Markers</h1>
        <button
          onClick={() => { setEditingCategory(null); setCategoryName(""); setShowCategoryForm(true); }}
          className="flex items-center gap-1 px-3 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition-colors"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {categories.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No categories yet. Add categories like "Lipid Panel", "CBC", "Vitals", etc.
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-200">
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggle(cat.id)}
              >
                <div className="flex items-center gap-2">
                  {expanded.has(cat.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                  <span className="text-xs text-gray-400">
                    ({cat.markers?.length ?? 0} markers)
                  </span>
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => { setEditingCategory({ id: cat.id, name: cat.name }); setCategoryName(cat.name); setShowCategoryForm(true); }}
                    className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Pencil size={14} className="text-gray-500" />
                  </button>
                  <button
                    onClick={() => setDeletingCategory({ id: cat.id, name: cat.name })}
                    className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>

              {expanded.has(cat.id) && (
                <div className="border-t border-gray-100 px-4 pb-4">
                  <div className="mt-3 space-y-2">
                    {(cat.markers ?? []).map((m) => {
                      const rangesSummary = getRangesSummary(m.reference_ranges);
                      return (
                        <div key={m.id} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-2 text-sm text-gray-700 min-w-0 flex-wrap">
                            <span className="truncate">
                              {m.name} {m.unit && <span className="text-gray-400">({m.unit})</span>}
                            </span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${m.marker_type === "text" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
                              {m.marker_type === "text" ? "Text" : "Numeric"}
                            </span>
                            {rangesSummary ? (
                              <span className="text-xs text-gray-400">{rangesSummary}</span>
                            ) : (
                              <>
                                {m.marker_type === "numeric" && (m.min_reference != null || m.max_reference != null) && (
                                  <span className="text-xs text-gray-400">
                                    [{m.min_reference ?? "—"} – {m.max_reference ?? "—"}]
                                  </span>
                                )}
                                {m.marker_type === "text" && m.normal_value && (
                                  <span className="text-xs text-gray-400">Normal: {m.normal_value}</span>
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setEditingMarker({
                                  id: m.id, name: m.name, unit: m.unit, category_id: m.category_id,
                                  marker_type: m.marker_type, min_reference: m.min_reference,
                                  max_reference: m.max_reference, normal_value: m.normal_value,
                                  reference_ranges: m.reference_ranges,
                                });
                                setMarkerName(m.name);
                                setMarkerUnit(m.unit);
                                setMarkerType(m.marker_type);
                                setMarkerMinRef(m.min_reference != null ? String(m.min_reference) : "");
                                setMarkerMaxRef(m.max_reference != null ? String(m.max_reference) : "");
                                setMarkerNormalValue(m.normal_value ?? "");
                                setRanges(parseRanges(m.reference_ranges));
                                setShowMarkerForm(true);
                              }}
                              className="p-1 rounded hover:bg-gray-200 transition-colors"
                            >
                              <Pencil size={12} className="text-gray-500" />
                            </button>
                            <button
                              onClick={() => setDeletingMarker({ id: m.id, name: m.name })}
                              className="p-1 rounded hover:bg-gray-200 transition-colors"
                            >
                              <Trash2 size={12} className="text-red-500" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => { setMarkerCategoryId(cat.id); setEditingMarker(null); resetMarkerFields(); setShowMarkerForm(true); }}
                      className="flex items-center gap-1 text-sm text-rose-600 hover:text-rose-700 transition-colors"
                    >
                      <Plus size={14} />
                      Add Marker
                    </button>
                    <button
                      onClick={() => {
                        setBulkCategoryId(cat.id);
                        setBulkRows([emptyBulkRow(), emptyBulkRow(), emptyBulkRow()]);
                        setExpandedBulk(new Set());
                        setShowBulkForm(true);
                      }}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <ListPlus size={14} />
                      Bulk Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Category Form Modal */}
      <Modal
        open={showCategoryForm}
        onClose={() => { setShowCategoryForm(false); setEditingCategory(null); }}
        title={editingCategory ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="e.g., Lipid Panel"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowCategoryForm(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors">{editingCategory ? "Update" : "Add"}</button>
          </div>
        </form>
      </Modal>

      {/* Marker Form Modal */}
      <Modal
        open={showMarkerForm}
        onClose={() => { setShowMarkerForm(false); setEditingMarker(null); }}
        title={editingMarker ? "Edit Marker" : "Add Marker"}
      >
        <form onSubmit={handleMarkerSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={markerName}
              onChange={(e) => setMarkerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="e.g., LDL Cholesterol"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input
                type="text"
                value={markerUnit}
                onChange={(e) => setMarkerUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="e.g., mg/dL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={markerType}
                onChange={(e) => setMarkerType(e.target.value as "numeric" | "text")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="numeric">Numeric</option>
                <option value="text">Text (Qualitative)</option>
              </select>
            </div>
          </div>

          {markerType === "numeric" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Reference</label>
                <input
                  type="number"
                  step="any"
                  value={markerMinRef}
                  onChange={(e) => setMarkerMinRef(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="e.g., 0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Reference</label>
                <input
                  type="number"
                  step="any"
                  value={markerMaxRef}
                  onChange={(e) => setMarkerMaxRef(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="e.g., 200"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Normal Value</label>
              <input
                type="text"
                value={markerNormalValue}
                onChange={(e) => setMarkerNormalValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="e.g., Negative"
              />
            </div>
          )}

          {/* Multi-tier Reference Ranges */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Reference Ranges</label>
              <button
                type="button"
                onClick={addRange}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 transition-colors"
              >
                <Plus size={12} />
                Add Range
              </button>
            </div>
            {ranges.length === 0 ? (
              <p className="text-xs text-gray-400">
                Optional. Add tiered ranges for markers like cholesterol (Desirable, Borderline, High).
              </p>
            ) : (
              <div className="space-y-2">
                {ranges.map((range, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={range.label}
                        onChange={(e) => updateRange(i, "label", e.target.value)}
                        className="col-span-2 px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                        placeholder="Label (e.g., Desirable)"
                      />
                      {markerType === "numeric" ? (
                        <>
                          <input
                            type="number"
                            step="any"
                            value={range.min}
                            onChange={(e) => updateRange(i, "min", e.target.value)}
                            className="px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                            placeholder="Min (optional)"
                          />
                          <input
                            type="number"
                            step="any"
                            value={range.max}
                            onChange={(e) => updateRange(i, "max", e.target.value)}
                            className="px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                            placeholder="Max (optional)"
                          />
                        </>
                      ) : (
                        <input
                          type="text"
                          value={range.value}
                          onChange={(e) => updateRange(i, "value", e.target.value)}
                          className="col-span-2 px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                          placeholder="Value (e.g., Negative)"
                        />
                      )}
                      <select
                        value={range.color}
                        onChange={(e) => updateRange(i, "color", e.target.value)}
                        className="col-span-2 px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                      >
                        {colorOptions.map((c) => (
                          <option key={c.value} value={c.value}>{c.label} ({c.value})</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRange(i)}
                      className="p-1 rounded hover:bg-gray-200 transition-colors mt-0.5"
                    >
                      <X size={14} className="text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowMarkerForm(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors">{editingMarker ? "Update" : "Add"}</button>
          </div>
        </form>
      </Modal>

      {/* Bulk Add Markers Modal */}
      <Modal
        open={showBulkForm}
        onClose={() => setShowBulkForm(false)}
        title="Bulk Add Markers"
        size="xl"
      >
        <form onSubmit={handleBulkSubmit} className="space-y-3">
          <div className="space-y-2">
            {bulkRows.map((row, i) => {
              const isOpen = expandedBulk.has(i);
              const hasRangeData = row.ranges.length > 0 || row.min_reference || row.max_reference || row.normal_value;
              return (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Accordion header */}
                  <div className="flex items-center gap-2 p-3 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => toggleBulkAccordion(i)}
                      className="p-0.5 shrink-0"
                    >
                      {isOpen ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                    </button>
                    <span className="text-xs text-gray-400 w-4 shrink-0">{i + 1}</span>
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => updateBulkRow(i, "name", e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                      placeholder="Marker name"
                      autoFocus={i === 0}
                    />
                    <input
                      type="text"
                      value={row.unit}
                      onChange={(e) => updateBulkRow(i, "unit", e.target.value)}
                      className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                      placeholder="Unit"
                    />
                    <select
                      value={row.marker_type}
                      onChange={(e) => updateBulkRow(i, "marker_type", e.target.value)}
                      className="w-28 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                    >
                      <option value="numeric">Numeric</option>
                      <option value="text">Text</option>
                    </select>
                    {hasRangeData && (
                      <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" title="Has reference ranges" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeBulkRow(i)}
                      className="p-1 rounded hover:bg-gray-200 transition-colors shrink-0"
                      disabled={bulkRows.length <= 1}
                    >
                      <X size={14} className={bulkRows.length <= 1 ? "text-gray-200" : "text-gray-400"} />
                    </button>
                  </div>

                  {/* Accordion body - reference ranges */}
                  {isOpen && (
                    <div className="p-3 pt-2 border-t border-gray-100 bg-white space-y-3">
                      {/* Simple reference fields */}
                      {row.marker_type === "numeric" ? (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Min Reference</label>
                            <input
                              type="number"
                              step="any"
                              value={row.min_reference}
                              onChange={(e) => updateBulkRow(i, "min_reference", e.target.value)}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                              placeholder="e.g., 0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Max Reference</label>
                            <input
                              type="number"
                              step="any"
                              value={row.max_reference}
                              onChange={(e) => updateBulkRow(i, "max_reference", e.target.value)}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                              placeholder="e.g., 200"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Normal Value</label>
                          <input
                            type="text"
                            value={row.normal_value}
                            onChange={(e) => updateBulkRow(i, "normal_value", e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                            placeholder="e.g., Negative"
                          />
                        </div>
                      )}

                      {/* Tiered ranges */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-medium text-gray-500">Reference Ranges</label>
                          <button
                            type="button"
                            onClick={() => addBulkRange(i)}
                            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 transition-colors"
                          >
                            <Plus size={10} />
                            Add Range
                          </button>
                        </div>
                        {row.ranges.length === 0 ? (
                          <p className="text-xs text-gray-400">No tiered ranges. Click "Add Range" for markers like cholesterol.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {row.ranges.map((rng, ri) => (
                              <div key={ri} className="flex items-center gap-2 p-2 rounded bg-gray-50">
                                <input
                                  type="text"
                                  value={rng.label}
                                  onChange={(e) => updateBulkRange(i, ri, "label", e.target.value)}
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                                  placeholder="Label (e.g., Desirable)"
                                />
                                {row.marker_type === "numeric" ? (
                                  <>
                                    <input
                                      type="number"
                                      step="any"
                                      value={rng.min}
                                      onChange={(e) => updateBulkRange(i, ri, "min", e.target.value)}
                                      className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                                      placeholder="Min"
                                    />
                                    <input
                                      type="number"
                                      step="any"
                                      value={rng.max}
                                      onChange={(e) => updateBulkRange(i, ri, "max", e.target.value)}
                                      className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                                      placeholder="Max"
                                    />
                                  </>
                                ) : (
                                  <input
                                    type="text"
                                    value={rng.value}
                                    onChange={(e) => updateBulkRange(i, ri, "value", e.target.value)}
                                    className="w-28 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                                    placeholder="Value"
                                  />
                                )}
                                <select
                                  value={rng.color}
                                  onChange={(e) => updateBulkRange(i, ri, "color", e.target.value)}
                                  className="w-28 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                                >
                                  {colorOptions.map((c) => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => removeBulkRange(i, ri)}
                                  className="p-0.5 rounded hover:bg-gray-200 transition-colors"
                                >
                                  <X size={12} className="text-gray-400" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={addBulkRow}
            className="flex items-center gap-1 text-sm text-rose-600 hover:text-rose-700 transition-colors"
          >
            <Plus size={14} />
            Add Marker
          </button>

          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-400">
              {bulkRows.filter((r) => r.name.trim()).length} marker(s) to add
            </span>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowBulkForm(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
              <button
                type="submit"
                disabled={bulkSaving || bulkRows.filter((r) => r.name.trim()).length === 0}
                className="px-4 py-2 text-sm rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {bulkSaving ? "Adding..." : "Add All"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deletingCategory !== null}
        onClose={() => setDeletingCategory(null)}
        onConfirm={async () => { if (deletingCategory) { await deleteCategory(deletingCategory.id); setDeletingCategory(null); } }}
        title="Delete Category"
        message={`Delete "${deletingCategory?.name}"? All markers in this category must be removed first.`}
      />

      <ConfirmDialog
        open={deletingMarker !== null}
        onClose={() => setDeletingMarker(null)}
        onConfirm={async () => { if (deletingMarker) { await deleteMarker(deletingMarker.id); setDeletingMarker(null); } }}
        title="Delete Marker"
        message={`Delete "${deletingMarker?.name}"?`}
      />
    </div>
  );
}
