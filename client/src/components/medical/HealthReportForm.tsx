import { useState, useEffect } from "react";
import { healthMarkersApi } from "../../api/health.api";
import type { FamilyMember, HealthReportCategory, HealthReport } from "../../types";

interface ResultEntry {
  marker_id: number;
  marker_name: string;
  marker_unit: string;
  marker_type: "numeric" | "text";
  value: string;
  text_value: string;
}

interface HealthReportFormProps {
  members: FamilyMember[];
  categories: HealthReportCategory[];
  initial?: HealthReport | null;
  onSubmit: (data: {
    family_member_id: number;
    category_id: number;
    report_date: string;
    lab_name?: string;
    notes?: string;
    results: { marker_id: number; value?: number | null; text_value?: string | null }[];
  }) => Promise<void>;
  onCancel: () => void;
}

export default function HealthReportForm({ members, categories, initial, onSubmit, onCancel }: HealthReportFormProps) {
  const [familyMemberId, setFamilyMemberId] = useState(initial?.family_member_id?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(initial?.category_id?.toString() ?? "");
  const [reportDate, setReportDate] = useState(initial?.report_date ?? new Date().toISOString().split("T")[0]);
  const [labName, setLabName] = useState(initial?.lab_name ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [markersLoaded, setMarkersLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load markers when category changes
  useEffect(() => {
    if (!categoryId) {
      setResults([]);
      setMarkersLoaded(false);
      return;
    }
    const loadMarkers = async () => {
      setMarkersLoaded(false);
      try {
        const markers = await healthMarkersApi.getAll(Number(categoryId));
        if (initial && initial.category_id === Number(categoryId) && initial.results) {
          setResults(
            markers.map((m) => {
              const existing = initial.results?.find((r) => r.marker_id === m.id);
              return {
                marker_id: m.id,
                marker_name: m.name,
                marker_unit: m.unit,
                marker_type: m.marker_type,
                value: existing && m.marker_type === "numeric" ? String(existing.value ?? "") : "",
                text_value: existing && m.marker_type === "text" ? String(existing.text_value ?? "") : "",
              };
            })
          );
        } else {
          setResults(
            markers.map((m) => ({
              marker_id: m.id,
              marker_name: m.name,
              marker_unit: m.unit,
              marker_type: m.marker_type,
              value: "",
              text_value: "",
            }))
          );
        }
        setMarkersLoaded(true);
      } catch {
        setError("Failed to load markers");
      }
    };
    loadMarkers();
  }, [categoryId]);

  const updateResult = (index: number, field: keyof ResultEntry, val: string) => {
    setResults((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: val } : r)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyMemberId || !categoryId) {
      setError("Family member and category are required");
      return;
    }
    const filledResults = results.filter((r) =>
      r.marker_type === "numeric" ? r.value !== "" : r.text_value !== ""
    );
    if (filledResults.length === 0) {
      setError("At least one result value is required");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await onSubmit({
        family_member_id: Number(familyMemberId),
        category_id: Number(categoryId),
        report_date: reportDate,
        lab_name: labName || undefined,
        notes: notes || undefined,
        results: filledResults.map((r) => ({
          marker_id: r.marker_id,
          value: r.marker_type === "numeric" ? Number(r.value) : null,
          text_value: r.marker_type === "text" ? r.text_value : null,
        })),
      });
    } catch {
      setError("Failed to save report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Family Member</label>
          <select
            value={familyMemberId}
            onChange={(e) => setFamilyMemberId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">Select...</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">Select...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Report Date</label>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lab Name</label>
          <input
            type="text"
            value={labName}
            onChange={(e) => setLabName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="e.g., City Lab"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          placeholder="Optional notes"
        />
      </div>

      {categoryId && markersLoaded && results.length === 0 && (
        <div className="text-amber-600 text-sm bg-amber-50 border border-amber-200 rounded-lg p-3">
          No markers defined for this category. Go to{" "}
          <span className="font-medium">Categories &amp; Markers</span> to add markers first.
        </div>
      )}

      {results.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Results</label>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={r.marker_id} className="grid grid-cols-2 gap-2 items-center">
                <span className="text-sm text-gray-700 truncate" title={`${r.marker_name} (${r.marker_unit})`}>
                  {r.marker_name} {r.marker_unit && <span className="text-gray-400 text-xs">({r.marker_unit})</span>}
                </span>
                {r.marker_type === "numeric" ? (
                  <input
                    type="number"
                    step="any"
                    value={r.value}
                    onChange={(e) => updateResult(i, "value", e.target.value)}
                    className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Value"
                  />
                ) : (
                  <input
                    type="text"
                    value={r.text_value}
                    onChange={(e) => updateResult(i, "text_value", e.target.value)}
                    className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="e.g., Negative"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
        <button type="submit" disabled={submitting} className="px-4 py-2 text-sm rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-colors">
          {submitting ? "Saving..." : initial ? "Update" : "Save Report"}
        </button>
      </div>
    </form>
  );
}
