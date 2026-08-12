import { useState } from "react";
import type { Committee, Account } from "../../types";
import { todayISO } from "../../utils/format";

interface CommitteeFormProps {
  committee?: Committee | null;
  accounts: Account[];
  onSubmit: (data: {
    name: string;
    total_members: number;
    contribution_per_month: number;
    my_month: number;
    start_date: string;
    account_id?: number;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function CommitteeForm({ committee, accounts, onSubmit, onCancel }: CommitteeFormProps) {
  const [name, setName] = useState(committee?.name ?? "");
  const [totalMembers, setTotalMembers] = useState(committee?.total_members?.toString() ?? "");
  const [contributionPerMonth, setContributionPerMonth] = useState(committee?.contribution_per_month?.toString() ?? "");
  const [myMonth, setMyMonth] = useState(committee?.my_month?.toString() ?? "");
  const [startDate, setStartDate] = useState(committee?.start_date ?? todayISO());
  const [accountId, setAccountId] = useState<number>(committee?.account_id ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!committee;
  const members = Number(totalMembers) || 0;
  const contribution = Number(contributionPerMonth) || 0;
  const totalPayout = members * contribution;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Committee name is required"); return; }
    if (members <= 0) { setError("Number of members must be positive"); return; }
    if (contribution <= 0) { setError("Contribution must be positive"); return; }
    const month = Number(myMonth);
    if (!month || month < 1 || month > members) {
      setError(`My month must be between 1 and ${members || "total members"}`);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        total_members: members,
        contribution_per_month: contribution,
        my_month: month,
        start_date: startDate,
        ...(accountId ? { account_id: accountId } : {}),
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Committee Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Office Committee 2026"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Members</label>
          <input
            type="number"
            step="1"
            min="2"
            value={totalMembers}
            onChange={(e) => setTotalMembers(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contribution / Month</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={contributionPerMonth}
            onChange={(e) => setContributionPerMonth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {totalPayout > 0 && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Total Payout: <span className="font-semibold">PKR {totalPayout.toLocaleString("en-PK", { minimumFractionDigits: 2 })}</span>
            <span className="text-blue-500 ml-1">({members} members x PKR {contribution.toLocaleString("en-PK")})</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">My Payout Month</label>
          <input
            type="number"
            step="1"
            min="1"
            max={members || undefined}
            value={myMonth}
            onChange={(e) => setMyMonth(e.target.value)}
            placeholder={members ? `1 - ${members}` : ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Which month number you receive the payout</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
        <select
          value={accountId}
          onChange={(e) => setAccountId(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={0}>None</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
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
          {submitting ? "Saving..." : isEditing ? "Update" : "Add Committee"}
        </button>
      </div>
    </form>
  );
}
