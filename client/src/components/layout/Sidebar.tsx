import { NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, Wallet, PiggyBank, Car, Settings, Landmark, HandCoins, Building2, Shield, BarChart3 } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/accounts", label: "Accounts", icon: Landmark },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/income", label: "Income", icon: Wallet },
  { to: "/payables", label: "Payables", icon: HandCoins },
  { to: "/savings", label: "Savings", icon: PiggyBank },
  { to: "/loans", label: "Loans", icon: Car },
  { to: "/assets", label: "Assets", icon: Building2 },
  { to: "/national-savings", label: "Nat. Savings", icon: Shield },
  { to: "/annual-stats", label: "Statistics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  profitDueBadge: number | null;
}

export function DesktopSidebar({ profitDueBadge }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 min-h-screen p-4 flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">Expense Tracker</h1>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <Icon size={20} />
            <span className="flex-1">{label}</span>
            {to === "/national-savings" && profitDueBadge !== null && (
              <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-xs font-bold min-w-5 text-center">
                {profitDueBadge <= 0 ? "!" : `${profitDueBadge}d`}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export function MobileBottomNav({ profitDueBadge }: SidebarProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex justify-around items-center py-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? "text-blue-700" : "text-gray-500"
              }`
            }
          >
            <div className="relative">
              <Icon size={20} />
              {to === "/national-savings" && profitDueBadge !== null && (
                <span className="absolute -top-1.5 -right-2.5 px-1 bg-amber-500 text-white rounded-full text-[8px] font-bold min-w-3.5 text-center leading-3.5">
                  {profitDueBadge <= 0 ? "!" : profitDueBadge}
                </span>
              )}
            </div>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default DesktopSidebar;
