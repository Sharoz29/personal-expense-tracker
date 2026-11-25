import { useAccountSnapshots } from "../hooks/useAccountSnapshots";
import { formatPKR } from "../utils/format";
import BalanceTrajectoryChart from "../components/accounts/BalanceTrajectoryChart";
import Loader from "../components/common/Loader";

export default function BalanceHistory() {
  const { trajectories, loading, error } = useAccountSnapshots();

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <Loader module="finance" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-lg sm:text-xl font-bold text-gray-800">Balance History</h1>
      <p className="text-sm text-gray-500">
        Monthly balance trajectory for each account, computed from all transactions.
      </p>

      {trajectories.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No account data available.
        </div>
      ) : (
        <div className="grid gap-6">
          {trajectories.map((t) => (
            <div
              key={t.account_id}
              className="bg-white rounded-xl border border-gray-200 p-4 md:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {t.account_name}
                </h2>
                <span className="text-sm font-medium text-blue-600">
                  Current: {formatPKR(t.current_balance)}
                </span>
              </div>
              <BalanceTrajectoryChart trajectory={t} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
