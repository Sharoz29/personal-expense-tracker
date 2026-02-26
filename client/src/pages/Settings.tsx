import ExpenseTypeManager from "../components/settings/ExpenseTypeManager";
import IncomeSourceManager from "../components/settings/IncomeSourceManager";

export default function Settings() {
  return (
    <>
      <header className="px-6 py-4 bg-white border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      </header>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ExpenseTypeManager />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <IncomeSourceManager />
          </div>
        </div>
      </div>
    </>
  );
}
