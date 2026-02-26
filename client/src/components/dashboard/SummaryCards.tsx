import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}

export default function SummaryCards({ totalIncome, totalExpenses, savings }: SummaryCardsProps) {
  const cards = [
    {
      label: "Total Income",
      value: totalIncome,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
    },
    {
      label: "Total Expenses",
      value: totalExpenses,
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-50",
      iconBg: "bg-red-100",
    },
    {
      label: "Net Savings",
      value: savings,
      icon: PiggyBank,
      color: savings >= 0 ? "text-blue-600" : "text-red-600",
      bg: savings >= 0 ? "bg-blue-50" : "bg-red-50",
      iconBg: savings >= 0 ? "bg-blue-100" : "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg, iconBg }) => (
        <div key={label} className={`${bg} rounded-xl p-5 border border-gray-100`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">{label}</span>
            <div className={`${iconBg} p-2 rounded-lg`}>
              <Icon size={20} className={color} />
            </div>
          </div>
          <div className={`text-2xl font-bold ${color}`}>
            ${value.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
