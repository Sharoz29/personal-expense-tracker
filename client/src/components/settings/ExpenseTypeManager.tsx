import { useState } from "react";
import { useExpenseTypes } from "../../hooks/useExpenseTypes";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import ConfirmDialog from "../common/ConfirmDialog";

export default function ExpenseTypeManager() {
  const { expenseTypes, loading, create, update, remove } = useExpenseTypes();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setError(null);
    try {
      await create(newName.trim());
      setNewName("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create");
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    setError(null);
    try {
      await update(id, editName.trim());
      setEditingId(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    setError(null);
    try {
      await remove(deleteId);
      setDeleteId(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Cannot delete - type is in use");
      setDeleteId(null);
    }
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Expense Types</h3>
      {error && <div className="text-red-600 text-sm mb-3 p-2 bg-red-50 rounded">{error}</div>}

      <div className="flex gap-2 mb-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="New expense type..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreate}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <ul className="space-y-2">
        {expenseTypes.map((type) => (
          <li key={type.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            {editingId === type.id ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate(type.id)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button onClick={() => handleUpdate(type.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                  <Check size={16} />
                </button>
                <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:bg-gray-100 rounded">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <span className="text-sm text-gray-700">{type.name}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditingId(type.id); setEditName(type.name); }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(type.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Expense Type"
        message="Are you sure? This will fail if expenses are using this type."
      />
    </div>
  );
}
