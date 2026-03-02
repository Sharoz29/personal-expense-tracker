import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import type { Account, Payable } from "../../types";
import { formatPKR } from "../../utils/format";

interface MarkPaidDialogProps {
  open: boolean;
  payable: Payable | null;
  accounts: Account[];
  onClose: () => void;
  onConfirm: (payableId: number, accountId: number) => Promise<void>;
}

export default function MarkPaidDialog({ open, payable, accounts, onClose, onConfirm }: MarkPaidDialogProps) {
  const [accountId, setAccountId] = useState<number>(accounts[0]?.id ?? 0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (accounts.length > 0 && !accounts.some(a => a.id === accountId)) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  const handleConfirm = async () => {
    if (!payable || !accountId) return;
    setSubmitting(true);
    try {
      await onConfirm(payable.id, accountId);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Mark as Paid">
      {payable && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              This will create an income entry of <strong>{formatPKR(payable.amount)}</strong> with
              source "Reimbursement" and credit the selected account.
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Description:</strong> {payable.description}
            </p>
            {payable.from_person && (
              <p className="text-sm text-gray-600">
                <strong>From:</strong> {payable.from_person}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credit to Account</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Processing..." : "Confirm Payment"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
