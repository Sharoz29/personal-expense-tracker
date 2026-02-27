import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MonthYearProvider } from "./context/MonthYearContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Savings from "./pages/Savings";
import CarLoan from "./pages/CarLoan";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <MonthYearProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/income" element={<Income />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/car-loan" element={<CarLoan />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </MonthYearProvider>
    </BrowserRouter>
  );
}
