import { NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, Wallet, PiggyBank, Car, Settings, Landmark, HandCoins, Building2, Shield } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/accounts", label: "Accounts", icon: Landmark },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/income", label: "Income", icon: Wallet },
  { to: "/payables", label: "Payables", icon: HandCoins },
  { to: "/savings", label: "Savings", icon: PiggyBank },
  { to: "/car-loan", label: "Car Loan", icon: Car },
  { to: "/assets", label: "Assets", icon: Building2 },
  { to: "/national-savings", label: "Nat. Savings", icon: Shield },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function DesktopSidebar() {
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
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export function MobileBottomNav() {
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
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default DesktopSidebar;
