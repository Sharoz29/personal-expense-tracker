import { useState } from "react";
import type { Asset, AssetType } from "../../types";

interface AssetFormProps {
  assetTypes: AssetType[];
  asset?: Asset | null;
  onSubmit: (data: {
    name: string;
    asset_type_id: number;
    current_value: number;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function AssetForm({ assetTypes, asset, onSubmit, onCancel }: AssetFormProps) {
  const [name, setName] = useState(asset?.name ?? "");
  const [assetTypeId, setAssetTypeId] = useState(asset?.asset_type_id ?? (assetTypes[0]?.id ?? 0));
  const [currentValue, setCurrentValue] = useState(asset?.current_value?.toString() ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required"); return; }
    if (!currentValue || Number(currentValue) < 0) { setError("Value must be >= 0"); return; }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        asset_type_id: assetTypeId,
        current_value: Number(currentValue),
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm p-2 bg-red-50 rounded">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Honda City 2023"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          value={assetTypeId}
          onChange={(e) => setAssetTypeId(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {assetTypes.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Value</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? "Saving..." : asset ? "Update" : "Add Asset"}
        </button>
      </div>
    </form>
  );
}
