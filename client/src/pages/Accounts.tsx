import { useState } from "react";
import Header from "../components/layout/Header";
import { useAccounts } from "../hooks/useAccounts";
import AccountList from "../components/accounts/AccountList";
import AccountForm from "../components/accounts/AccountForm";
import TransferForm from "../components/accounts/TransferForm";
import TransferList from "../components/accounts/TransferList";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { Plus, ArrowLeftRight } from "lucide-react";
import type { Account } from "../types";
import { formatPKR } from "../utils/format";

export default function Accounts() {
  const { accounts, transfers, loading, totalBalance, create, update, remove, transfer, refetch } = useAccounts();
  const [showForm, setShowForm] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [deleting, setDeleting] = useState<Account | null>(null);

  const handleSubmit = async (data: { name: string; account_number: string; balance: number }) => {
    if (editing) {
      await update(editing.id, { name: data.name, account_number: data.account_number });
    } else {
      await create(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleTransfer = async (data: Parameters<typeof transfer>[0]) => {
    await transfer(data);
    setShowTransfer(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await remove(deleting.id);
    await refetch();
    setDeleting(null);
  };

  return (
    <>
      <Header title="Accounts" />
      <div className="p-6 space-y-6">
        {/* Total Balance Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Total Balance</p>
          <p className={`text-2xl font-bold ${totalBalance >= 0 ? "text-green-700" : "text-red-700"}`}>
            {formatPKR(totalBalance)}
          </p>
        </div>

        {/* Accounts Section */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">
              {loading ? "Loading..." : `${accounts.length} account${accounts.length !== 1 ? "s" : ""}`}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTransfer(true)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                disabled={accounts.length < 2}
              >
                <ArrowLeftRight size={16} /> Transfer
              </button>
              <button
                onClick={() => { setEditing(null); setShowForm(true); }}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <Plus size={16} /> Add Account
              </button>
            </div>
          </div>
          <AccountList
            accounts={accounts}
            onEdit={(a) => { setEditing(a); setShowForm(true); }}
            onDelete={setDeleting}
          />
        </div>

        {/* Transfers Section */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">Transfer History</h3>
          </div>
          <TransferList transfers={transfers} />
        </div>
      </div>

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? "Edit Account" : "Add Account"}
      >
        <AccountForm
          account={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      </Modal>

      <Modal
        open={showTransfer}
        onClose={() => setShowTransfer(false)}
        title="Transfer Between Accounts"
      >
        <TransferForm
          accounts={accounts}
          onSubmit={handleTransfer}
          onCancel={() => setShowTransfer(false)}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Account"
        message={`Delete "${deleting?.name}"? This will fail if there are linked transactions.`}
      />
    </>
  );
}
