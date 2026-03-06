import ExpenseTypeManager from "../components/settings/ExpenseTypeManager";
import IncomeSourceManager from "../components/settings/IncomeSourceManager";
import PayableTypeManager from "../components/settings/PayableTypeManager";
import AssetTypeManager from "../components/settings/AssetTypeManager";

export default function Settings() {
  return (
    <>
      <header className="px-4 py-3 md:px-6 md:py-4 bg-white border-b border-gray-200">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Settings</h2>
      </header>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <ExpenseTypeManager />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <IncomeSourceManager />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <PayableTypeManager />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <AssetTypeManager />
          </div>
        </div>
      </div>
    </>
  );
}
