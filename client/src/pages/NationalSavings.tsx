import { useState } from "react";
import { useSavingsCertificates } from "../hooks/useSavingsCertificates";
import SavingsCertificateList from "../components/national-savings/SavingsCertificateList";
import SavingsCertificateForm from "../components/national-savings/SavingsCertificateForm";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { Plus } from "lucide-react";
import type { SavingsCertificate } from "../types";
import { formatPKR } from "../utils/format";

export default function NationalSavings() {
  const { certificates, loading, totalInvested, create, update, remove } = useSavingsCertificates();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SavingsCertificate | null>(null);
  const [deleting, setDeleting] = useState<SavingsCertificate | null>(null);

  const handleSubmit = async (data: Parameters<typeof create>[0]) => {
    if (editing) {
      await update(editing.id, data);
    } else {
      await create(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await remove(deleting.id);
    setDeleting(null);
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-white border-b border-gray-200">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">National Savings</h2>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
        >
          <Plus size={16} /> Add Certificate
        </button>
      </header>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <p className="text-sm text-gray-500 mb-1">Total Invested</p>
          <p className="text-2xl font-bold text-emerald-600">{formatPKR(totalInvested)}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">
              {loading ? "Loading..." : `${certificates.length} certificate${certificates.length !== 1 ? "s" : ""}`}
            </h3>
          </div>
          <SavingsCertificateList
            certificates={certificates}
            totalInvested={totalInvested}
            onEdit={(c) => { setEditing(c); setShowForm(true); }}
            onDelete={setDeleting}
          />
        </div>
      </div>

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? "Edit Certificate" : "Add Certificate"}
      >
        <SavingsCertificateForm
          certificate={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Certificate"
        message={`Delete this ${formatPKR(deleting?.principal_amount ?? 0)} certificate?`}
      />
    </>
  );
}
