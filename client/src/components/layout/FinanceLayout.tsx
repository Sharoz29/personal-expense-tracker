import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Receipt, Wallet, PiggyBank, Car, Settings, Landmark, HandCoins, Building2, TrendingUp, BarChart3, Banknote, LineChart, ArrowLeft, Menu, X, PanelLeftClose, PanelLeftOpen, Bell } from "lucide-react";
import { useProfitDueAlerts } from "../../hooks/useProfitDueAlerts";

const links = [
  { to: "/finance", label: "Dashboard", icon: LayoutDashboard },
  { to: "/finance/accounts", label: "Accounts", icon: Landmark },
  { to: "/finance/expenses", label: "Expenses", icon: Receipt },
  { to: "/finance/income", label: "Income", icon: Wallet },
  { to: "/finance/payables", label: "Payables", icon: HandCoins },
  { to: "/finance/savings", label: "Savings", icon: PiggyBank },
  { to: "/finance/loans", label: "Loans", icon: Car },
  { to: "/finance/installments", label: "Installments", icon: Banknote },
  { to: "/finance/assets", label: "Assets", icon: Building2 },
  { to: "/finance/investments", label: "Investments", icon: TrendingUp },
  { to: "/finance/balance-history", label: "Balance History", icon: LineChart },
  { to: "/finance/annual-stats", label: "Statistics", icon: BarChart3 },
  { to: "/finance/settings", label: "Settings", icon: Settings },
];

function ProfitBadge({ value, size = "normal" }: { value: number | null; size?: "normal" | "small" }) {
  if (value === null) return null;
  if (size === "small") {
    return (
      <span className="absolute -top-1.5 -right-2.5 px-1 bg-amber-500 text-white rounded-full text-[8px] font-bold min-w-3.5 text-center leading-3.5">
        {value <= 0 ? "!" : value}
      </span>
    );
  }
  return (
    <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-xs font-bold min-w-5 text-center">
      {value <= 0 ? "!" : `${value}d`}
    </span>
  );
}

export default function FinanceLayout() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { hasDueSoon, minDaysUntilDue, dueCount } = useProfitDueAlerts();

  const profitBadge = hasDueSoon ? minDaysUntilDue : null;

  const bannerText =
    minDaysUntilDue !== null && minDaysUntilDue <= 0
      ? `Savings profit is due! (${dueCount} certificate${dueCount !== 1 ? "s" : ""})`
      : minDaysUntilDue !== null
        ? `Savings profit due in ${minDaysUntilDue} day${minDaysUntilDue !== 1 ? "s" : ""}`
        : "";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar — lg and above */}
      <aside className={`hidden lg:flex bg-white border-r border-gray-200 h-screen sticky top-0 flex-col shrink-0 transition-all duration-200 ${
        sidebarCollapsed ? "w-16 p-2" : "w-64 p-4"
      }`}>
        {sidebarCollapsed ? (
          <>
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors mb-4 self-center"
              title="Expand sidebar"
            >
              <PanelLeftOpen size={18} className="text-gray-500" />
            </button>
            <nav className="flex flex-col gap-1 items-center flex-1 overflow-y-auto">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/finance"}
                  className={({ isActive }) =>
                    `relative flex items-center justify-center p-2.5 rounded-lg transition-colors ${
                      isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                  title={label}
                >
                  <Icon size={20} />
                  {to === "/finance/investments" && <ProfitBadge value={profitBadge} size="small" />}
                </NavLink>
              ))}
            </nav>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center p-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors self-center"
              title="Back to Modules"
            >
              <ArrowLeft size={20} />
            </button>
          </>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-800">Finance</h1>
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Collapse sidebar"
                >
                  <PanelLeftClose size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
            <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/finance"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span className="flex-1">{label}</span>
                  {to === "/finance/investments" && <ProfitBadge value={profitBadge} />}
                </NavLink>
              ))}
            </nav>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Modules
            </button>
          </>
        )}
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile & tablet top bar — below lg */}
        <header className="lg:hidden bg-white border-b border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Hamburger — mobile only (below md) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} className="text-gray-700" />
            </button>

            {/* Back arrow — tablet only (md to lg) */}
            <button
              onClick={() => navigate("/")}
              className="hidden md:flex lg:hidden items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} />
            </button>

            <h1 className="text-lg font-bold text-gray-800 flex-1">Finance</h1>
          </div>

          {/* Tablet horizontal nav — md to lg */}
          <nav className="hidden md:flex lg:hidden border-t border-gray-100 px-2 overflow-x-auto">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/finance"}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`
                }
              >
                <Icon size={16} />
                {label}
                {to === "/finance/investments" && profitBadge !== null && (
                  <span className="px-1 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-bold min-w-4 text-center leading-none">
                    {profitBadge <= 0 ? "!" : profitBadge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </header>

        {/* Profit due alert banner */}
        {hasDueSoon && (
          <div
            onClick={() => navigate("/finance/investments")}
            className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-amber-100 transition-colors"
          >
            <Bell size={16} className="text-amber-600" />
            <p className="text-sm font-medium text-amber-800">{bannerText}</p>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Mobile slide-out drawer */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Finance</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/finance"}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span className="flex-1">{label}</span>
                  {to === "/finance/investments" && <ProfitBadge value={profitBadge} />}
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => { setDrawerOpen(false); navigate("/"); }}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors w-full px-3 py-2.5 rounded-lg hover:bg-gray-50"
              >
                <ArrowLeft size={16} />
                Back to Modules
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
