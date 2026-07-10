import { useState } from "react";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import type { MutualFundCompany } from "../../types";

interface MutualFundCompanyManagerProps {
  companies: MutualFundCompany[];
  onCreate: (name: string) => Promise<void>;
  onUpdate: (id: number, name: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function MutualFundCompanyManager({ companies, onCreate, onUpdate, onDelete }: MutualFundCompanyManagerProps) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await onCreate(newName.trim());
      setNewName("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await onUpdate(id, editingName.trim());
      setEditingId(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    try {
      await onDelete(id);
    } catch (err: any) {
      setError(err.response?.data?.error || "Cannot delete - company has associated funds");
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-red-600 text-sm p-2 bg-red-50 rounded">{error}</div>}

      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="e.g. Al Meezan, AKD, Faysal"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreate}
          disabled={submitting || !newName.trim()}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="space-y-1">
        {companies.map((company) => (
          <div key={company.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
            {editingId === company.id ? (
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate(company.id)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button onClick={() => handleUpdate(company.id)} disabled={submitting} className="p-1 text-green-600 hover:bg-green-50 rounded">
                  <Check size={14} />
                </button>
                <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:bg-gray-100 rounded">
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-gray-700">{company.name}</span>
                <button
                  onClick={() => { setEditingId(company.id); setEditingName(company.name); }}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(company.id)}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        ))}
        {companies.length === 0 && (
          <p className="text-sm text-gray-400 py-2">No AMCs added yet.</p>
        )}
      </div>
    </div>
  );
}
