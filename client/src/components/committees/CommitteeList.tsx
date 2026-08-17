import { useState } from "react";
import type { Committee, CommitteePayment, Account } from "../../types";
import { formatPKR, formatDate, todayISO } from "../../utils/format";
import { Pencil, Trash2, CreditCard, Undo2, ChevronDown, ChevronUp } from "lucide-react";

interface CommitteeListProps {
  committees: Committee[];
  getPayments: (committeeId: number) => CommitteePayment[];
  accounts: Account[];
  onEdit: (committee: Committee) => void;
  onDelete: (committee: Committee) => void;
  onPay: (committeeId: number, data: { month_number: number; account_id: number; payment_date: string }) => Promise<unknown>;
  onUndoPayment: (paymentId: number) => Promise<void>;
}

function addMonths(dateStr: string, months: number): Date {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d;
}

function getPayoutDate(committee: Committee): string {
  const d = addMonths(committee.start_date, committee.my_month - 1);
  return d.toISOString().split("T")[0];
}

function getEndDate(committee: Committee): string {
  const d = addMonths(committee.start_date, committee.total_members - 1);
  return d.toISOString().split("T")[0];
}

function getStatus(committee: Committee): "upcoming" | "active" | "completed" {
  const now = new Date();
  const start = new Date(committee.start_date);
  const end = addMonths(committee.start_date, committee.total_members);
  if (now < start) return "upcoming";
  if (now >= end) return "completed";
  return "active";
}

export default function CommitteeList({ committees, getPayments, accounts, onEdit, onDelete, onPay, onUndoPayment }: CommitteeListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [payAccountId, setPayAccountId] = useState<number>(0);
  const [payDate, setPayDate] = useState(todayISO());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (committees.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 text-sm">
        No committees yet. Click "Add Committee" to get started.
      </div>
    );
  }

  const handlePay = async (committee: Committee, monthNumber: number) => {
    if (!payAccountId) { setError("Select an account"); return; }
    setSubmitting(true);
    setError(null);
    try {
      await onPay(committee.id, {
        month_number: monthNumber,
        account_id: payAccountId,
        payment_date: payDate,
      });
      setPayingId(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {committees.map((committee) => {
        const totalPayout = committee.total_members * committee.contribution_per_month;
        const status = getStatus(committee);
        const committeePayments = getPayments(committee.id);
        const paidMonths = new Set(committeePayments.map((p) => p.month_number));
        const totalPaid = committeePayments.reduce((sum, p) => sum + p.amount, 0);
        const remaining = totalPayout - totalPaid;
        const payoutDate = getPayoutDate(committee);
        const endDate = getEndDate(committee);
        const payoutReceived = new Date() >= new Date(payoutDate);
        const isExpanded = expandedId === committee.id;
        const nextUnpaidMonth = Array.from({ length: committee.total_members }, (_, i) => i + 1).find((m) => !paidMonths.has(m));

        return (
          <div key={committee.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-800">{committee.name}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : status === "completed"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {status === "active" ? "Active" : status === "completed" ? "Completed" : "Upcoming"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {committee.total_members} members &middot; {formatPKR(committee.contribution_per_month)}/month
                  {committee.account_name && <> &middot; {committee.account_name}</>}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {nextUnpaidMonth && (
                  <button
                    onClick={() => {
                      setPayingId(payingId === committee.id ? null : committee.id);
                      setPayAccountId(committee.account_id ?? 0);
                      setPayDate(todayISO());
                      setError(null);
                    }}
                    className="px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors flex items-center gap-1"
                  >
                    <CreditCard size={12} /> Pay Month {nextUnpaidMonth}
                  </button>
                )}
                <button
                  onClick={() => onEdit(committee)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => onDelete(committee)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Pay form */}
            {payingId === committee.id && nextUnpaidMonth && (
              <div className="mb-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                {error && <div className="text-red-600 text-xs mb-2 p-1 bg-red-50 rounded">{error}</div>}
                <p className="text-sm font-medium text-emerald-800 mb-2">
                  Pay Month {nextUnpaidMonth} — {formatPKR(committee.contribution_per_month)}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Account</label>
                    <select
                      value={payAccountId}
                      onChange={(e) => setPayAccountId(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value={0}>Select account</option>
                      {accounts.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={payDate}
                      onChange={(e) => setPayDate(e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handlePay(committee, nextUnpaidMonth)}
                    disabled={submitting}
                    className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? "Paying..." : "Confirm Payment"}
                  </button>
                  <button
                    onClick={() => setPayingId(null)}
                    className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Total Payout</p>
                <p className="font-semibold text-gray-800">{formatPKR(totalPayout)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">My Month</p>
                <p className="font-semibold text-gray-800">
                  Month {committee.my_month}
                  <span className="text-xs font-normal text-gray-500 ml-1">({formatDate(payoutDate)})</span>
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Paid</p>
                <p className="font-semibold text-gray-800">
                  {formatPKR(totalPaid)}
                  <span className="text-xs font-normal text-gray-500 ml-1">({paidMonths.size}/{committee.total_members})</span>
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Remaining</p>
                <p className="font-semibold text-gray-800">{formatPKR(Math.max(0, remaining))}</p>
              </div>
            </div>

            {/* Month grid */}
            <div className="mt-3 flex flex-wrap gap-1">
              {Array.from({ length: committee.total_members }, (_, i) => {
                const monthNum = i + 1;
                const isPaid = paidMonths.has(monthNum);
                const isMyMonth = monthNum === committee.my_month;
                return (
                  <div
                    key={monthNum}
                    className={`w-7 h-7 rounded text-xs flex items-center justify-center font-medium border ${
                      isPaid
                        ? "bg-emerald-500 text-white border-emerald-600"
                        : isMyMonth
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-gray-50 text-gray-400 border-gray-200"
                    }`}
                    title={`Month ${monthNum}${isMyMonth ? " (your payout)" : ""}${isPaid ? " (paid)" : ""}`}
                  >
                    {monthNum}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              <span>Start: {formatDate(committee.start_date)}</span>
              <span>End: {formatDate(endDate)}</span>
              {status === "active" && (
                <span className={payoutReceived ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>
                  {payoutReceived ? "Payout received" : "Payout pending"}
                </span>
              )}
            </div>

            {status === "active" && (
              <div className="mt-2">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (paidMonths.size / committee.total_members) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Expandable payment history */}
            {committeePayments.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : committee.id)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {isExpanded ? "Hide" : "Show"} payment history ({committeePayments.length})
                </button>
                {isExpanded && (
                  <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left px-3 py-2 font-medium text-gray-600">Month</th>
                          <th className="text-left px-3 py-2 font-medium text-gray-600">Amount</th>
                          <th className="text-left px-3 py-2 font-medium text-gray-600">Date</th>
                          <th className="text-left px-3 py-2 font-medium text-gray-600">Account</th>
                          <th className="text-right px-3 py-2 font-medium text-gray-600"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {committeePayments.map((p) => (
                          <tr key={p.id}>
                            <td className="px-3 py-2">Month {p.month_number}</td>
                            <td className="px-3 py-2">{formatPKR(p.amount)}</td>
                            <td className="px-3 py-2">{formatDate(p.payment_date)}</td>
                            <td className="px-3 py-2">{p.account_name || "—"}</td>
                            <td className="px-3 py-2 text-right">
                              <button
                                onClick={() => onUndoPayment(p.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Undo payment"
                              >
                                <Undo2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
