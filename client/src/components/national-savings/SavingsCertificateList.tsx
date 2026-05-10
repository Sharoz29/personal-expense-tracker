import { useState } from "react";
import type { SavingsCertificate, Account } from "../../types";
import { Pencil, Trash2, ChevronDown, ChevronRight, Banknote } from "lucide-react";
import EmptyState from "../common/EmptyState";
import { formatPKR, formatDate } from "../../utils/format";

interface SavingsCertificateListProps {
  certificates: SavingsCertificate[];
  totalInvested: number;
  accounts: Account[];
  onEdit: (cert: SavingsCertificate) => void;
  onDelete: (cert: SavingsCertificate) => void;
  onRedeemProfit: (certId: number, accountId: number) => Promise<void>;
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

function getPeriodMonths(duration: string): number {
  switch (duration) {
    case "Monthly": return 1;
    case "6 Months": return 6;
    case "1 Year": return 12;
    case "5 Years": return 60;
    case "10 Years": return 120;
    default: return 0;
  }
}

function monthsBetween(from: string, to: string): number {
  const d1 = new Date(from);
  const d2 = new Date(to);
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
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

function computeUnredeemed(cert: SavingsCertificate) {
  const periodMonths = getPeriodMonths(cert.duration);
  if (periodMonths === 0) return null;
  const trackingStart = cert.profit_tracking_start_date ?? cert.purchase_date;
  const today = new Date().toISOString().split("T")[0];
  const totalMonthsElapsed = monthsBetween(trackingStart, today);
  const elapsedPeriods = Math.floor(totalMonthsElapsed / periodMonths);

  if (elapsedPeriods <= 0) return { periods: 0, amount: 0 };

  const periodMultiplier = periodMonths / 12;
  const grossPerPeriod = cert.principal_amount * (cert.profit_rate / 100) * periodMultiplier;
  const taxRate = cert.tax_rate ?? 0;
  const taxPerPeriod = grossPerPeriod * (taxRate / 100);
  const netPerPeriod = grossPerPeriod - taxPerPeriod;

  return {
    periods: elapsedPeriods,
    amount: Math.round(netPerPeriod * elapsedPeriods * 100) / 100,
  };
}

export default function SavingsCertificateList({ certificates, totalInvested, accounts, onEdit, onDelete, onRedeemProfit }: SavingsCertificateListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [redeemingId, setRedeemingId] = useState<number | null>(null);
  const [redeemAccountId, setRedeemAccountId] = useState<number>(0);
  const [redeeming, setRedeeming] = useState(false);

  if (certificates.length === 0) {
    return <EmptyState message="No savings certificates yet. Click 'Add Certificate' to get started." />;
  }

  const totalColumns = 8;

  const handleRedeem = async (certId: number) => {
    if (!redeemAccountId) return;
    setRedeeming(true);
    try {
      await onRedeemProfit(certId, redeemAccountId);
      setRedeemingId(null);
      setRedeemAccountId(0);
    } catch {
      // error handled by parent
    } finally {
      setRedeeming(false);
    }
  };

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
            const unredeemed = computeUnredeemed(cert);
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
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">
                        {cert.certificate_type}
                      </span>
                      {unredeemed && unredeemed.periods > 0 && (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                          {unredeemed.periods} due
                        </span>
                      )}
                    </div>
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
                        <div className="space-y-4">
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
                            <div>
                              <p className="text-gray-500 text-xs mb-1">Tracking Since</p>
                              <p className="font-medium text-gray-800">{formatDate(cert.profit_tracking_start_date ?? cert.purchase_date)}</p>
                            </div>
                            {cert.account_name && (
                              <div>
                                <p className="text-gray-500 text-xs mb-1">Deducted From</p>
                                <p className="font-medium text-gray-800">{cert.account_name}</p>
                              </div>
                            )}
                          </div>

                          {/* Profit Redemption Section */}
                          {unredeemed && unredeemed.periods > 0 ? (
                            <div className="border-t border-gray-200 pt-3">
                              <div className="flex items-center justify-between flex-wrap gap-3">
                                <div>
                                  <p className="text-sm font-medium text-amber-700">
                                    {unredeemed.periods} unredeemed period{unredeemed.periods !== 1 ? "s" : ""}
                                  </p>
                                  <p className="text-lg font-bold text-emerald-700">{formatPKR(unredeemed.amount)}</p>
                                </div>
                                {redeemingId === cert.id ? (
                                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <select
                                      value={redeemAccountId}
                                      onChange={(e) => setRedeemAccountId(Number(e.target.value))}
                                      className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                      <option value={0}>Select account</option>
                                      {accounts.map((a) => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                      ))}
                                    </select>
                                    <button
                                      onClick={() => handleRedeem(cert.id)}
                                      disabled={!redeemAccountId || redeeming}
                                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                                    >
                                      {redeeming ? "Redeeming..." : "Confirm"}
                                    </button>
                                    <button
                                      onClick={() => { setRedeemingId(null); setRedeemAccountId(0); }}
                                      className="px-2 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setRedeemingId(cert.id); setRedeemAccountId(0); }}
                                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors flex items-center gap-1"
                                  >
                                    <Banknote size={14} /> Redeem Profit
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : unredeemed ? (
                            <div className="border-t border-gray-200 pt-3">
                              <p className="text-sm text-gray-500">No profit due yet</p>
                            </div>
                          ) : null}
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
