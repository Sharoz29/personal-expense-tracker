import type { Asset } from "../../types";
import { Pencil, Trash2 } from "lucide-react";
import EmptyState from "../common/EmptyState";
import { formatPKR } from "../../utils/format";

interface AssetListProps {
  assets: Asset[];
  totalValue: number;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
}

export default function AssetList({ assets, totalValue, onEdit, onDelete }: AssetListProps) {
  if (assets.length === 0) {
    return <EmptyState message="No assets yet. Click 'Add Asset' to start tracking your portfolio." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-100">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Name</th>
            <th className="text-left py-3 px-3 md:px-4 font-medium text-gray-500">Type</th>
            <th className="text-right py-3 px-3 md:px-4 font-medium text-gray-500">Current Value</th>
            <th className="text-right py-3 px-3 md:px-4 font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-3 md:px-4 text-gray-700 font-medium">{asset.name}</td>
              <td className="py-3 px-3 md:px-4">
                <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                  {asset.asset_type_name}
                </span>
              </td>
              <td className="py-3 px-3 md:px-4 text-right font-medium text-gray-900">
                {formatPKR(asset.current_value)}
              </td>
              <td className="py-3 px-3 md:px-4 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(asset)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(asset)}
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
            <td colSpan={2} className="py-3 px-3 md:px-4 font-semibold text-gray-700">Total Portfolio Value</td>
            <td className="py-3 px-3 md:px-4 text-right font-bold text-gray-900">{formatPKR(totalValue)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
