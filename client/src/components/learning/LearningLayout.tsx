import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { BookOpen, Brain, FileText, ClipboardList, ArrowLeft } from "lucide-react";

const links = [
  { to: "/learning", label: "Dashboard", icon: BookOpen },
  { to: "/learning/flashcards", label: "Flashcards", icon: FileText },
  { to: "/learning/study", label: "Study", icon: Brain },
  { to: "/learning/tests", label: "Tests", icon: ClipboardList },
];

export default function LearningLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 min-h-screen p-4 flex-col">
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Modules
          </button>
          <h1 className="text-xl font-bold text-gray-800">French Learning</h1>
        </div>
        <nav className="flex flex-col gap-1">
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
      </aside>
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center py-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/learning"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                  isActive ? "text-green-700" : "text-gray-500"
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
