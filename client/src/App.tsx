import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MonthYearProvider } from "./context/MonthYearContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PinScreen from "./components/auth/PinScreen";
import ModuleHome from "./pages/ModuleHome";
import ComingSoon from "./pages/ComingSoon";

// Finance Module
import FinanceLayout from "./components/layout/FinanceLayout";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Savings from "./pages/Savings";
import Loans from "./pages/Loans";
import Settings from "./pages/Settings";
import Payables from "./pages/Payables";
import Assets from "./pages/Assets";
import Investments from "./pages/Investments";
import AnnualStats from "./pages/AnnualStats";
import Installments from "./pages/Installments";

// Learning Module
import LearningLayout from "./components/learning/LearningLayout";
import LearningDashboard from "./pages/learning/Dashboard";
import Flashcards from "./pages/learning/Flashcards";
import Study from "./pages/learning/Study";
import Tests from "./pages/learning/Tests";

function AuthGate() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <PinScreen />;

  return (
    <Routes>
      {/* Module Selection Home */}
      <Route path="/" element={<ModuleHome />} />

      {/* Finance Module */}
      <Route
        path="/finance"
        element={
          <MonthYearProvider>
            <FinanceLayout />
          </MonthYearProvider>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="income" element={<Income />} />
        <Route path="payables" element={<Payables />} />
        <Route path="savings" element={<Savings />} />
        <Route path="loans" element={<Loans />} />
        <Route path="assets" element={<Assets />} />
        <Route path="investments" element={<Investments />} />
        <Route path="installments" element={<Installments />} />
        <Route path="annual-stats" element={<AnnualStats />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Learning Module */}
      <Route path="/learning" element={<LearningLayout />}>
        <Route index element={<LearningDashboard />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="study" element={<Study />} />
        <Route path="tests" element={<Tests />} />
      </Route>

      {/* Coming Soon Modules */}
      <Route path="/reminders" element={<ComingSoon name="Reminders" />} />
      <Route path="/medical" element={<ComingSoon name="Medical Records" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </BrowserRouter>
  );
}
