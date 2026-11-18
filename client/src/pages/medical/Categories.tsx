import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useHealthCategories } from "../../hooks/useHealthCategories";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export default function Categories() {
  const {
    categories, loading, error,
    createCategory, updateCategory, deleteCategory,
    createMarker, updateMarker, deleteMarker,
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
    normal_value: string | null;
  } | null>(null);
  const [markerName, setMarkerName] = useState("");
  const [markerUnit, setMarkerUnit] = useState("");
  const [markerType, setMarkerType] = useState<"numeric" | "text">("numeric");
  const [markerMinRef, setMarkerMinRef] = useState("");
  const [markerMaxRef, setMarkerMaxRef] = useState("");
  const [markerNormalValue, setMarkerNormalValue] = useState("");

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
                    {(cat.markers ?? []).map((m) => (
                      <div key={m.id} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-2 text-sm text-gray-700 min-w-0">
                          <span className="truncate">
                            {m.name} {m.unit && <span className="text-gray-400">({m.unit})</span>}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${m.marker_type === "text" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
                            {m.marker_type === "text" ? "Text" : "Numeric"}
                          </span>
                          {m.marker_type === "numeric" && (m.min_reference != null || m.max_reference != null) && (
                            <span className="text-xs text-gray-400">
                              [{m.min_reference ?? "—"} – {m.max_reference ?? "—"}]
                            </span>
                          )}
                          {m.marker_type === "text" && m.normal_value && (
                            <span className="text-xs text-gray-400">Normal: {m.normal_value}</span>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingMarker({
                                id: m.id, name: m.name, unit: m.unit, category_id: m.category_id,
                                marker_type: m.marker_type, min_reference: m.min_reference,
                                max_reference: m.max_reference, normal_value: m.normal_value,
                              });
                              setMarkerName(m.name);
                              setMarkerUnit(m.unit);
                              setMarkerType(m.marker_type);
                              setMarkerMinRef(m.min_reference != null ? String(m.min_reference) : "");
                              setMarkerMaxRef(m.max_reference != null ? String(m.max_reference) : "");
                              setMarkerNormalValue(m.normal_value ?? "");
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
                    ))}
                  </div>
                  <button
                    onClick={() => { setMarkerCategoryId(cat.id); setEditingMarker(null); resetMarkerFields(); setShowMarkerForm(true); }}
                    className="mt-3 flex items-center gap-1 text-sm text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    <Plus size={14} />
                    Add Marker
                  </button>
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

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowMarkerForm(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors">{editingMarker ? "Update" : "Add"}</button>
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
