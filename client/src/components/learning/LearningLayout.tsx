import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { BookOpen, Brain, FileText, ClipboardList, ArrowLeft, Menu, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";

const links = [
  { to: "/learning", label: "Dashboard", icon: BookOpen },
  { to: "/learning/flashcards", label: "Flashcards", icon: FileText },
  { to: "/learning/study", label: "Study", icon: Brain },
  { to: "/learning/tests", label: "Tests", icon: ClipboardList },
];

export default function LearningLayout() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
            <nav className="flex flex-col gap-1 items-center flex-1">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/learning"}
                  className={({ isActive }) =>
                    `flex items-center justify-center p-2.5 rounded-lg transition-colors ${
                      isActive ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                  title={label}
                >
                  <Icon size={20} />
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
                <h1 className="text-xl font-bold text-gray-800">French Learning</h1>
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Collapse sidebar"
                >
                  <PanelLeftClose size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
            <nav className="flex flex-col gap-1 flex-1">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/learning"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon size={20} />
                  {label}
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

            <h1 className="text-lg font-bold text-gray-800 flex-1">French Learning</h1>
          </div>

          {/* Tablet horizontal nav — md to lg */}
          <nav className="hidden md:flex lg:hidden border-t border-gray-100 px-2 overflow-x-auto">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/learning"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? "border-green-600 text-green-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </header>

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
              <h2 className="text-lg font-bold text-gray-800">French Learning</h2>
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
                  end={to === "/learning"}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon size={20} />
                  {label}
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
