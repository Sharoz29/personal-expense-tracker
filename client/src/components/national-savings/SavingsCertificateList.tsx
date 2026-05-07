import { useState } from "react";
import type { SavingsCertificate } from "../../types";
import { Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import EmptyState from "../common/EmptyState";
import { formatPKR, formatDate } from "../../utils/format";

interface SavingsCertificateListProps {
  certificates: SavingsCertificate[];
  totalInvested: number;
  onEdit: (cert: SavingsCertificate) => void;
  onDelete: (cert: SavingsCertificate) => void;
}

function getPeriodMultiplier(duration: string): { multiplier: number; label: string } {
  switch (duration) {
    case "Monthly": return { multiplier: 1 / 12, label: "Monthly" };
    case "6 Months": return { multiplier: 6 / 12, label: "Per 6 Months" };
    case "1 Year": return { multiplier: 1, label: "Yearly" };
    case "5 Years": return { multiplier: 5, label: "Per 5 Years" };
    case "10 Years": return { multiplier: 10, label: "Per 10 Years" };
    default: return { multiplier: 0, label: "-" };
  }
}

function computeProfit(cert: SavingsCertificate) {
  const { multiplier, label } = getPeriodMultiplier(cert.duration);
  if (multiplier === 0) return null;
  const grossProfit = cert.principal_amount * (cert.profit_rate / 100) * multiplier;
  const taxRate = cert.tax_rate ?? 0;
  const taxAmount = grossProfit * (taxRate / 100);
  const netProfit = grossProfit - taxAmount;
  return { grossProfit, taxAmount, netProfit, taxRate, label };
}

export default function SavingsCertificateList({ certificates, totalInvested, onEdit, onDelete }: SavingsCertificateListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (certificates.length === 0) {
    return <EmptyState message="No savings certificates yet. Click 'Add Certificate' to get started." />;
  }

  const totalColumns = 8;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-150">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="w-8 py-3 px-2" />
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Type</th>
            <th className="text-right py-3 px-3 md:px-4 font-medium text-gray-500">Principal</th>
            <th className="text-right py-3 px-3 md:px-4 font-medium text-gray-500">Rate</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Duration</th>
            <th className="text-right py-3 px-3 md:px-4 font-medium text-gray-500">Net Profit</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Maturity</th>
            <th className="text-right py-3 px-3 md:px-4 font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((cert) => {
            const profit = computeProfit(cert);
            const isExpanded = expandedId === cert.id;

            return (
              <>
                <tr
                  key={cert.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${isExpanded ? "bg-gray-50" : ""}`}
                  onClick={() => setExpandedId(isExpanded ? null : cert.id)}
                >
                  <td className="py-3 px-2 text-gray-400">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </td>
                  <td className="py-3 px-3 md:px-4">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">
                      {cert.certificate_type}
                    </span>
                  </td>
                  <td className="py-3 px-3 md:px-4 text-right font-medium text-gray-900">
                    {formatPKR(cert.principal_amount)}
                  </td>
                  <td className="py-3 px-3 md:px-4 text-right text-gray-700">
                    {cert.profit_rate}%
                  </td>
                  <td className="py-3 px-3 md:px-4 text-gray-600">
                    {cert.duration || "-"}
                  </td>
                  <td className="py-3 px-3 md:px-4 text-right font-medium text-emerald-700">
                    {profit ? formatPKR(profit.netProfit) : "-"}
                    {profit && <span className="text-xs text-gray-500 ml-1">/{profit.label.replace("Per ", "").toLowerCase()}</span>}
                  </td>
                  <td className="py-3 px-3 md:px-4 text-gray-700">
                    {formatDate(cert.maturity_date)}
                  </td>
                  <td className="py-3 px-3 md:px-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(cert); }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(cert); }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr key={`${cert.id}-detail`} className="bg-gray-50 border-b border-gray-100">
                    <td colSpan={totalColumns} className="px-6 md:px-10 py-4">
                      {profit ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Payout Frequency</p>
                            <p className="font-medium text-gray-800">{profit.label}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Gross Profit ({profit.label})</p>
                            <p className="font-medium text-gray-800">{formatPKR(profit.grossProfit)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Tax ({profit.taxRate}%)</p>
                            <p className="font-medium text-red-600">- {formatPKR(profit.taxAmount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Net Profit ({profit.label})</p>
                            <p className="font-bold text-emerald-700">{formatPKR(profit.netProfit)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Purchase Date</p>
                            <p className="font-medium text-gray-800">{formatDate(cert.purchase_date)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Maturity Date</p>
                            <p className="font-medium text-gray-800">{formatDate(cert.maturity_date)}</p>
                          </div>
                          {cert.account_name && (
                            <div>
                              <p className="text-gray-500 text-xs mb-1">Deducted From</p>
                              <p className="font-medium text-gray-800">{cert.account_name}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Select a duration to see profit calculations.</p>
                      )}
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-200">
            <td />
            <td className="py-3 px-3 md:px-4 font-semibold text-gray-700">Total Invested</td>
            <td className="py-3 px-3 md:px-4 text-right font-bold text-gray-900">{formatPKR(totalInvested)}</td>
            <td colSpan={5} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
