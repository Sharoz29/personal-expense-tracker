import type { MutualFund, MutualFundTransaction } from "../../types";
import MutualFundCard from "./MutualFundCard";
import EmptyState from "../common/EmptyState";

interface MutualFundListProps {
  funds: MutualFund[];
  transactions: MutualFundTransaction[];
  onEditFund: (fund: MutualFund) => void;
  onDeleteFund: (fund: MutualFund) => void;
  onAddTransaction: (fund: MutualFund) => void;
  onEditTransaction: (tx: MutualFundTransaction) => void;
  onDeleteTransaction: (tx: MutualFundTransaction) => void;
}

export default function MutualFundList({
  funds, transactions, onEditFund, onDeleteFund, onAddTransaction, onEditTransaction, onDeleteTransaction,
}: MutualFundListProps) {
  if (funds.length === 0) {
    return <EmptyState message="No mutual funds yet. Add a company (AMC) first, then add a fund." />;
  }

  // Group funds by company
  const grouped = new Map<string, MutualFund[]>();
  for (const fund of funds) {
    const company = fund.company_name ?? "Unknown";
    if (!grouped.has(company)) grouped.set(company, []);
    grouped.get(company)!.push(fund);
  }

  // Build transaction lookup by fund_id
  const txByFund = new Map<number, MutualFundTransaction[]>();
  for (const tx of transactions) {
    if (!txByFund.has(tx.fund_id)) txByFund.set(tx.fund_id, []);
    txByFund.get(tx.fund_id)!.push(tx);
  }

  return (
    <div className="space-y-6">
      {Array.from(grouped.entries()).map(([company, companyFunds]) => (
        <div key={company}>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{company}</h4>
          <div className="space-y-3">
            {companyFunds.map((fund) => (
              <MutualFundCard
                key={fund.id}
                fund={fund}
                transactions={txByFund.get(fund.id) ?? []}
                onEditFund={onEditFund}
                onDeleteFund={onDeleteFund}
                onAddTransaction={onAddTransaction}
                onEditTransaction={onEditTransaction}
                onDeleteTransaction={onDeleteTransaction}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
