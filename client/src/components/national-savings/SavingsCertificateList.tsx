import type { SavingsCertificate } from "../../types";
import { Pencil, Trash2 } from "lucide-react";
import EmptyState from "../common/EmptyState";
import { formatPKR, formatDate } from "../../utils/format";

interface SavingsCertificateListProps {
  certificates: SavingsCertificate[];
  totalInvested: number;
  onEdit: (cert: SavingsCertificate) => void;
  onDelete: (cert: SavingsCertificate) => void;
}

export default function SavingsCertificateList({ certificates, totalInvested, onEdit, onDelete }: SavingsCertificateListProps) {
  if (certificates.length === 0) {
    return <EmptyState message="No savings certificates yet. Click 'Add Certificate' to get started." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-150">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Type</th>
            <th className="text-right py-3 px-3 md:px-4 font-medium text-gray-500">Principal</th>
            <th className="text-right py-3 px-3 md:px-4 font-medium text-gray-500">Rate</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Purchase</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Maturity</th>
            <th className="text-right py-3 px-3 md:px-4 font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((cert) => (
            <tr key={cert.id} className="border-b border-gray-100 hover:bg-gray-50">
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
              <td className="py-3 px-3 md:px-4 text-gray-700">
                {formatDate(cert.purchase_date)}
              </td>
              <td className="py-3 px-3 md:px-4 text-gray-700">
                {formatDate(cert.maturity_date)}
              </td>
              <td className="py-3 px-3 md:px-4 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(cert)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(cert)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-200">
            <td className="py-3 px-3 md:px-4 font-semibold text-gray-700">Total Invested</td>
            <td className="py-3 px-3 md:px-4 text-right font-bold text-gray-900">{formatPKR(totalInvested)}</td>
            <td colSpan={4} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
