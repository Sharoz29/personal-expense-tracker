import { useState, useEffect } from "react";
import { ClipboardList, Trophy } from "lucide-react";
import { frenchTestsApi } from "../../api/french-tests.api";
import Loader from "../../components/common/Loader";
import type { FrenchTestResult } from "../../types";

export default function Tests() {
  const [testResults, setTestResults] = useState<FrenchTestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setLoading(true);
    try {
      const data = await frenchTestsApi.getAllResults();
      setTestResults(data);
    } catch (error) {
      console.error("Failed to load test results", error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="p-4 md:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-lg sm:text-xl font-bold text-gray-800">French Tests</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6">
        <div className="flex items-start gap-3">
          <ClipboardList size={20} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-blue-800 mb-1">Tests Coming Soon</h2>
            <p className="text-sm sm:text-base text-blue-700">
              French practice tests are being prepared. In the meantime, keep studying your flashcards!
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader module="learning" />
      ) : testResults.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm">No test results yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Test History</h2>
          <div className="space-y-2">
            {testResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800">{result.test_name}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(result.completed_at).toLocaleDateString()} &middot;{" "}
                    {result.score}/{result.total_questions} correct
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className={`text-xl sm:text-2xl font-bold ${getGradeColor(result.percentage)}`}>
                    {result.percentage.toFixed(0)}%
                  </p>
                  {result.percentage >= 90 && (
                    <Trophy size={16} className="text-yellow-500 inline ml-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
