import { useState, useEffect } from "react";
import { ClipboardList, Trophy } from "lucide-react";
import { frenchTestsApi } from "../../api/french-tests.api";
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">French Tests</h1>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <ClipboardList size={24} className="text-blue-600 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-blue-800 mb-1">Tests Coming Soon</h2>
            <p className="text-blue-700">
              French practice tests are being prepared. In the meantime, keep studying your flashcards!
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : testResults.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No test results yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Test History</h2>
          {testResults.map((result) => (
            <div key={result.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{result.test_name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(result.completed_at).toLocaleDateString()} •{" "}
                    {result.score}/{result.total_questions} correct
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${getGradeColor(result.percentage)}`}>
                    {result.percentage.toFixed(0)}%
                  </p>
                  {result.percentage >= 90 && (
                    <Trophy size={20} className="text-yellow-500 inline ml-2" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
