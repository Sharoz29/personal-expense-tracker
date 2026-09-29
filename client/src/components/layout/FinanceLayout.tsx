import { Outlet, useNavigate } from "react-router-dom";
import { DesktopSidebar, MobileBottomNav } from "./FinanceSidebar";
import { useProfitDueAlerts } from "../../hooks/useProfitDueAlerts";
import { Bell, ArrowLeft } from "lucide-react";

export default function FinanceLayout() {
  const navigate = useNavigate();
  const { hasDueSoon, minDaysUntilDue, dueCount } = useProfitDueAlerts();

  const bannerText =
    minDaysUntilDue !== null && minDaysUntilDue <= 0
      ? `Savings profit is due! (${dueCount} certificate${dueCount !== 1 ? "s" : ""})`
      : minDaysUntilDue !== null
        ? `Savings profit due in ${minDaysUntilDue} day${minDaysUntilDue !== 1 ? "s" : ""}`
        : "";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DesktopSidebar profitDueBadge={hasDueSoon ? minDaysUntilDue : null} />
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Modules
          </button>
        </div>
        {hasDueSoon && (
          <div
            onClick={() => navigate("/finance/investments")}
            className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-amber-100 transition-colors"
          >
            <Bell size={16} className="text-amber-600" />
            <p className="text-sm font-medium text-amber-800">{bannerText}</p>
          </div>
        )}
        <Outlet />
      </main>
      <MobileBottomNav profitDueBadge={hasDueSoon ? minDaysUntilDue : null} />
    </div>
  );
}
