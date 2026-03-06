import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MonthYearProvider } from "./context/MonthYearContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import PinScreen from "./components/auth/PinScreen";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Savings from "./pages/Savings";
import CarLoan from "./pages/CarLoan";
import Settings from "./pages/Settings";
import Payables from "./pages/Payables";
import Assets from "./pages/Assets";
import NationalSavings from "./pages/NationalSavings";

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
    <MonthYearProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/income" element={<Income />} />
          <Route path="/payables" element={<Payables />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/car-loan" element={<CarLoan />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/national-savings" element={<NationalSavings />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </MonthYearProvider>
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
