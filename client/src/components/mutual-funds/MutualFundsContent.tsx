import { useState } from "react";
import { useMutualFundCompanies } from "../../hooks/useMutualFundCompanies";
import { useMutualFunds } from "../../hooks/useMutualFunds";
import { useMutualFundTransactions } from "../../hooks/useMutualFundTransactions";
import { useAccounts } from "../../hooks/useAccounts";
import MutualFundCompanyManager from "./MutualFundCompanyManager";
import MutualFundForm from "./MutualFundForm";
import MutualFundTransactionForm from "./MutualFundTransactionForm";
import MutualFundList from "./MutualFundList";
import Modal from "../common/Modal";
import ConfirmDialog from "../common/ConfirmDialog";
import { Plus, Building2 } from "lucide-react";
import type { MutualFund, MutualFundTransaction } from "../../types";
import type { CreateMutualFundPayload } from "../../api/mutual-funds.api";
import type { CreateMutualFundTransactionPayload } from "../../api/mutual-fund-transactions.api";
import { formatPKR } from "../../utils/format";

export default function MutualFundsContent() {
  const { companies, create: createCompany, update: updateCompany, remove: removeCompany } = useMutualFundCompanies();
  const { funds, create: createFund, update: updateFund, remove: removeFund, refetch: refetchFunds } = useMutualFunds();
  const {
    transactions, loading, totalInvested, totalNetInvested, totalFees,
    create: createTransaction, update: updateTransaction, remove: removeTransaction, refetch: refetchTransactions,
  } = useMutualFundTransactions();
  const { accounts } = useAccounts();

  const [showCompanyManager, setShowCompanyManager] = useState(false);
  const [showFundForm, setShowFundForm] = useState(false);
  const [editingFund, setEditingFund] = useState<MutualFund | null>(null);
  const [deletingFund, setDeletingFund] = useState<MutualFund | null>(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionFund, setTransactionFund] = useState<MutualFund | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<MutualFundTransaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<MutualFundTransaction | null>(null);

  const handleFundSubmit = async (data: CreateMutualFundPayload) => {
    if (editingFund) {
      await updateFund(editingFund.id, data);
    } else {
      await createFund(data);
    }
    setShowFundForm(false);
    setEditingFund(null);
  };

  const handleDeleteFund = async () => {
    if (!deletingFund) return;
    await removeFund(deletingFund.id);
    await refetchTransactions();
    setDeletingFund(null);
  };

  const handleTransactionSubmit = async (data: CreateMutualFundTransactionPayload) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, data);
    } else {
      await createTransaction(data);
    }
    setShowTransactionForm(false);
    setTransactionFund(null);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = async () => {
    if (!deletingTransaction) return;
    await removeTransaction(deletingTransaction.id);
    setDeletingTransaction(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Invested</p>
            <p className="text-2xl font-bold text-emerald-600">{formatPKR(totalInvested)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Net Invested</p>
            <p className="text-xl font-bold text-blue-600">{formatPKR(totalNetInvested)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Fees</p>
            <p className="text-xl font-bold text-red-500">{formatPKR(totalFees)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Funds</p>
            <p className="text-xl font-bold text-gray-800">{funds.length}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700">
            {loading ? "Loading..." : `${funds.length} fund${funds.length !== 1 ? "s" : ""}`}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCompanyManager(true)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <Building2 size={16} /> Manage AMCs
            </button>
            <button
              onClick={() => { setEditingFund(null); setShowFundForm(true); }}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1 whitespace-nowrap"
              disabled={companies.length === 0}
            >
              <Plus size={16} /> Add Fund
            </button>
          </div>
        </div>

        <div className="p-4">
          <MutualFundList
            funds={funds}
            transactions={transactions}
            onEditFund={(f) => { setEditingFund(f); setShowFundForm(true); }}
            onDeleteFund={setDeletingFund}
            onAddTransaction={(f) => { setTransactionFund(f); setEditingTransaction(null); setShowTransactionForm(true); }}
            onEditTransaction={(tx) => { setEditingTransaction(tx); setTransactionFund(null); setShowTransactionForm(true); }}
            onDeleteTransaction={setDeletingTransaction}
          />
        </div>
      </div>

      {/* Company Manager Modal */}
      <Modal
        open={showCompanyManager}
        onClose={() => setShowCompanyManager(false)}
        title="Manage Fund Companies (AMCs)"
      >
        <MutualFundCompanyManager
          companies={companies}
          onCreate={async (name) => { await createCompany(name); }}
          onUpdate={async (id, name) => { await updateCompany(id, name); await refetchFunds(); }}
          onDelete={async (id) => { await removeCompany(id); }}
        />
      </Modal>

      {/* Fund Form Modal */}
      <Modal
        open={showFundForm}
        onClose={() => { setShowFundForm(false); setEditingFund(null); }}
        title={editingFund ? "Edit Fund" : "Add Fund"}
      >
        <MutualFundForm
          fund={editingFund}
          companies={companies}
          onSubmit={handleFundSubmit}
          onCancel={() => { setShowFundForm(false); setEditingFund(null); }}
        />
      </Modal>

      {/* Transaction Form Modal */}
      <Modal
        open={showTransactionForm}
        onClose={() => { setShowTransactionForm(false); setTransactionFund(null); setEditingTransaction(null); }}
        title={editingTransaction ? "Edit Investment" : "Add Investment"}
      >
        <MutualFundTransactionForm
          transaction={editingTransaction}
          fund={transactionFund}
          funds={funds}
          accounts={accounts}
          onSubmit={handleTransactionSubmit}
          onCancel={() => { setShowTransactionForm(false); setTransactionFund(null); setEditingTransaction(null); }}
        />
      </Modal>

      {/* Delete Fund Confirm */}
      <ConfirmDialog
        open={deletingFund !== null}
        onClose={() => setDeletingFund(null)}
        onConfirm={handleDeleteFund}
        title="Delete Fund"
        message={`Delete "${deletingFund?.name}"? This will fail if the fund has transactions.`}
      />

      {/* Delete Transaction Confirm */}
      <ConfirmDialog
        open={deletingTransaction !== null}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleDeleteTransaction}
        title="Delete Investment"
        message={`Delete this ${formatPKR(deletingTransaction?.amount ?? 0)} investment?`}
      />
    </div>
  );
}
