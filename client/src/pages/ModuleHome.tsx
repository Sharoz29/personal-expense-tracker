import { useNavigate } from "react-router-dom";
import { Wallet, BookOpen, Bell, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface ModuleCard {
  id: string;
  name: string;
  description: string;
  icon: typeof Wallet;
  route: string;
  enabled: boolean;
  color: string;
}

const modules: ModuleCard[] = [
  {
    id: "finance",
    name: "Finance",
    description: "Track expenses, income, savings, and investments",
    icon: Wallet,
    route: "/finance",
    enabled: true,
    color: "blue",
  },
  {
    id: "learning",
    name: "Learning",
    description: "French language flashcards and tests",
    icon: BookOpen,
    route: "/learning",
    enabled: true,
    color: "green",
  },
  {
    id: "reminders",
    name: "Reminders",
    description: "Task and reminder management",
    icon: Bell,
    route: "/reminders",
    enabled: false,
    color: "purple",
  },
  {
    id: "medical",
    name: "Medical Records",
    description: "Health records and prescriptions",
    icon: Heart,
    route: "/medical",
    enabled: false,
    color: "red",
  },
];

const colorClassMap: Record<string, {
  border: string;
  bg: string;
  hover: string;
  iconBg: string;
  iconText: string;
}> = {
  blue: {
    border: "border-blue-200",
    bg: "bg-white",
    hover: "hover:border-blue-400 hover:shadow-lg",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
  },
  green: {
    border: "border-green-200",
    bg: "bg-white",
    hover: "hover:border-green-400 hover:shadow-lg",
    iconBg: "bg-green-100",
    iconText: "text-green-600",
  },
  purple: {
    border: "border-gray-200",
    bg: "bg-gray-50",
    hover: "",
    iconBg: "bg-gray-200",
    iconText: "text-gray-400",
  },
  red: {
    border: "border-gray-200",
    bg: "bg-gray-50",
    hover: "",
    iconBg: "bg-gray-200",
    iconText: "text-gray-400",
  },
};

export default function ModuleHome() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleModuleClick = (module: ModuleCard) => {
    if (module.enabled) {
      navigate(module.route);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">My Apps</h1>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            const isEnabled = module.enabled;
            const colorClasses = colorClassMap[module.color] || colorClassMap.blue;

            return (
              <button
                key={module.id}
                onClick={() => handleModuleClick(module)}
                disabled={!isEnabled}
                className={`
                  relative p-6 rounded-xl border-2 text-left transition-all
                  ${colorClasses.border} ${colorClasses.bg} ${isEnabled ? `${colorClasses.hover} cursor-pointer` : "cursor-not-allowed opacity-60"}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${colorClasses.iconBg}`}>
                    <Icon size={24} className={colorClasses.iconText} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                      {module.name}
                    </h2>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>
                </div>
                {!isEnabled && (
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-600 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
