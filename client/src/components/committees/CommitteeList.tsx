import type { Committee } from "../../types";
import { formatPKR, formatDate } from "../../utils/format";
import { Pencil, Trash2 } from "lucide-react";

interface CommitteeListProps {
  committees: Committee[];
  onEdit: (committee: Committee) => void;
  onDelete: (committee: Committee) => void;
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

function getMonthsElapsed(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  return Math.max(0, months);
}

function getStatus(committee: Committee): "upcoming" | "active" | "completed" {
  const now = new Date();
  const start = new Date(committee.start_date);
  const end = addMonths(committee.start_date, committee.total_members);
  if (now < start) return "upcoming";
  if (now >= end) return "completed";
  return "active";
}

export default function CommitteeList({ committees, onEdit, onDelete }: CommitteeListProps) {
  if (committees.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 text-sm">
        No committees yet. Click "Add Committee" to get started.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {committees.map((committee) => {
        const totalPayout = committee.total_members * committee.contribution_per_month;
        const status = getStatus(committee);
        const monthsElapsed = getMonthsElapsed(committee.start_date);
        const monthsPaid = Math.min(monthsElapsed, committee.total_members);
        const totalPaid = monthsPaid * committee.contribution_per_month;
        const remaining = totalPayout - totalPaid;
        const payoutDate = getPayoutDate(committee);
        const endDate = getEndDate(committee);
        const payoutReceived = new Date() >= new Date(payoutDate);

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
                <p className="text-gray-500 text-xs">Paid So Far</p>
                <p className="font-semibold text-gray-800">
                  {formatPKR(totalPaid)}
                  <span className="text-xs font-normal text-gray-500 ml-1">({monthsPaid}/{committee.total_members} months)</span>
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Remaining</p>
                <p className="font-semibold text-gray-800">{formatPKR(Math.max(0, remaining))}</p>
              </div>
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
                    className="bg-blue-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (monthsPaid / committee.total_members) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
