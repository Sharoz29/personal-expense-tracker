import { useState } from "react";
import NationalSavings from "./NationalSavings";
import MutualFundsContent from "../components/mutual-funds/MutualFundsContent";

type Tab = "national-savings" | "mutual-funds";

export default function Investments() {
  const [activeTab, setActiveTab] = useState<Tab>("national-savings");

  const tabClass = (tab: Tab) =>
    `py-3 text-sm font-medium border-b-2 transition-colors ${
      activeTab === tab
        ? "border-blue-600 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700"
    }`;

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-white border-b border-gray-200">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Investments</h2>
      </header>

      <div className="bg-white border-b border-gray-200 px-4 md:px-6">
        <div className="flex gap-6">
          <button className={tabClass("national-savings")} onClick={() => setActiveTab("national-savings")}>
            National Savings
          </button>
          <button className={tabClass("mutual-funds")} onClick={() => setActiveTab("mutual-funds")}>
            Mutual Funds
          </button>
        </div>
      </div>

      {activeTab === "national-savings" && <NationalSavings />}
      {activeTab === "mutual-funds" && <MutualFundsContent />}
    </>
  );
}
