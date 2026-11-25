import { useState } from "react";
import { useMonthYear } from "../context/MonthYearContext";
import { useSavings } from "../hooks/useSavings";
import Loader from "../components/common/Loader";
import SavingsList from "../components/savings/SavingsList";
import SavingsForm from "../components/savings/SavingsForm";
import Modal from "../components/common/Modal";
import { Calculator, Plus } from "lucide-react";
import type { Savings as SavingsType } from "../types";

export default function Savings() {
  const { month, year } = useMonthYear();
  const { savings, loading, calculate, update, create } = useSavings();
  const [editing, setEditing] = useState<SavingsType | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleRecalculate = async (m: number, y: number) => {
    await calculate(m, y);
  };

  const handleCalculateCurrent = async () => {
    await calculate(month, year);
  };

  const handleUpdate = async (m: number, y: number, amount: number, notes: string) => {
    await update(m, y, amount, notes);
    setEditing(null);
  };

  const handleCreate = async (m: number, y: number, amount: number, notes: string) => {
    await create(m, y, amount, notes);
    setShowAddForm(false);
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-white border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Savings</h2>
        <div className="flex items-center gap-2">
          {/* Mobile: icon-only buttons */}
          <button
            onClick={() => setShowAddForm(true)}
            className="sm:hidden p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={handleCalculateCurrent}
            className="sm:hidden p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <Calculator size={20} />
          </button>
          {/* Tablet+: full buttons */}
          <button
            onClick={() => setShowAddForm(true)}
            className="hidden sm:flex px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors items-center gap-1 whitespace-nowrap"
          >
            <Plus size={16} /> Add Savings
          </button>
          <button
            onClick={handleCalculateCurrent}
            className="hidden sm:flex px-3 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors items-center gap-1 whitespace-nowrap"
          >
            <Calculator size={16} /> Calculate Current Month
          </button>
        </div>
      </header>
      <div className="p-4 md:p-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">
              {loading ? <Loader module="finance" size="inline" /> : "Savings History"}
            </h3>
          </div>
          <SavingsList
            savings={savings}
            onEdit={setEditing}
            onRecalculate={handleRecalculate}
          />
        </div>
      </div>

      <Modal
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add Savings"
      >
        <SavingsForm
          onSubmit={handleCreate}
          onCancel={() => setShowAddForm(false)}
        />
      </Modal>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title="Edit Savings"
      >
        {editing && (
          <SavingsForm
            savings={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </>
  );
}
