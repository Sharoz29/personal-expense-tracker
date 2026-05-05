import { useState, useEffect, useMemo } from "react";
import Modal from "../common/Modal";
import type { Account, Payable } from "../../types";
import { formatPKR } from "../../utils/format";

interface LumpSumDialogProps {
  open: boolean;
  payables: Payable[];
  accounts: Account[];
  onClose: () => void;
  onConfirm: (fromPerson: string, amount: number, accountId: number) => Promise<void>;
}

export default function LumpSumDialog({ open, payables, accounts, onClose, onConfirm }: LumpSumDialogProps) {
  const [fromPerson, setFromPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState<number>(accounts[0]?.id ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get distinct from_person values from pending payables
  const persons = useMemo(() => {
    const set = new Set<string>();
    payables
      .filter((p) => p.status === "pending")
      .forEach((p) => {
        if (p.from_person) set.add(p.from_person);
      });
    return Array.from(set).sort();
  }, [payables]);

  // Get pending payables for selected person
  const personPayables = useMemo(() => {
    if (!fromPerson) return [];
    return payables
      .filter((p) => p.status === "pending" && p.from_person === fromPerson)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [payables, fromPerson]);

  const totalPendingFromPerson = useMemo(
    () => personPayables.reduce((sum, p) => sum + (p.amount - (p.amount_paid ?? 0)), 0),
    [personPayables]
  );

  // Preview distribution
  const preview = useMemo(() => {
    if (!fromPerson || !amount || Number(amount) <= 0) return [];
    let remaining = Number(amount);
    return personPayables.map((p) => {
      const paid = p.amount_paid ?? 0;
      const payableRemaining = p.amount - paid;
      const applied = Math.min(remaining, payableRemaining);
      remaining -= applied;
      return {
        id: p.id,
        description: p.description,
        total: p.amount,
        alreadyPaid: paid,
        applied,
        newPaid: paid + applied,
        fullyPaid: paid + applied >= p.amount,
      };
    });
  }, [fromPerson, amount, personPayables]);

  useEffect(() => {
    if (persons.length > 0 && !fromPerson) {
      setFromPerson(persons[0]);
    }
  }, [persons, fromPerson]);

  useEffect(() => {
    if (accounts.length > 0 && !accounts.some((a) => a.id === accountId)) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setAmount("");
      setError(null);
      if (persons.length > 0) setFromPerson(persons[0]);
    }
  }, [open, persons]);

  const handleConfirm = async () => {
    if (!fromPerson) { setError("Select a person"); return; }
    if (!amount || Number(amount) <= 0) { setError("Amount must be positive"); return; }
    if (!accountId) { setError("Select an account"); return; }
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(fromPerson, Number(amount), accountId);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to process lump sum");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Receive Lump Sum Payment">
      <div className="space-y-4">
        {error && <div className="text-red-600 text-sm p-2 bg-red-50 rounded">{error}</div>}

        {persons.length === 0 ? (
          <p className="text-sm text-gray-500">No pending payables with a person assigned.</p>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Person</label>
              <select
                value={fromPerson}
                onChange={(e) => setFromPerson(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {persons.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {fromPerson && (
                <p className="text-xs text-gray-500 mt-1">
                  Total pending: {formatPKR(totalPendingFromPerson)} across {personPayables.length} payable{personPayables.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 2500000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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

            {/* Distribution Preview */}
            {preview.length > 0 && Number(amount) > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-800 mb-2">Distribution Preview (oldest first)</p>
                <div className="space-y-1.5">
                  {preview.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <span className="text-blue-700 truncate mr-2">{item.description}</span>
                      <span className={`font-medium whitespace-nowrap ${item.fullyPaid ? "text-green-700" : item.applied > 0 ? "text-yellow-700" : "text-gray-500"}`}>
                        {item.applied > 0
                          ? `${formatPKR(item.applied)} → ${item.fullyPaid ? "Fully Paid" : `${formatPKR(item.newPaid)}/${formatPKR(item.total)}`}`
                          : "No change"}
                      </span>
                    </div>
                  ))}
                </div>
                {Number(amount) > totalPendingFromPerson && (
                  <p className="text-xs text-amber-700 mt-2">
                    Note: {formatPKR(Number(amount) - totalPendingFromPerson)} exceeds total pending and will not be applied to payables (but will still be credited to account as income).
                  </p>
                )}
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                This will create income entries (source "Reimbursement") for each affected payable and credit the selected account with the total amount.
              </p>
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
                disabled={submitting || !fromPerson || !amount || Number(amount) <= 0}
                className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
