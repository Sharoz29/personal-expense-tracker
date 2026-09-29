import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Brain, ClipboardList, TrendingUp } from "lucide-react";
import { flashcardsApi } from "../../api/flashcards.api";
import { frenchTestsApi } from "../../api/french-tests.api";

export default function LearningDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCards: 0,
    cardsDue: 0,
    testsCompleted: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [allCards, dueCards, testResults] = await Promise.all([
          flashcardsApi.getAll(),
          flashcardsApi.getDueForReview(),
          frenchTestsApi.getAllResults(),
        ]);
        setStats({
          totalCards: allCards.length,
          cardsDue: dueCards.length,
          testsCompleted: testResults.length,
        });
      } catch (error) {
        console.error("Failed to load stats", error);
      }
    };
    loadStats();
  }, []);

  const cards = [
    {
      title: "Flashcards",
      value: stats.totalCards,
      icon: BookOpen,
      color: "bg-blue-500",
      route: "/learning/flashcards",
    },
    {
      title: "Cards Due",
      value: stats.cardsDue,
      icon: Brain,
      color: "bg-green-500",
      route: "/learning/study",
    },
    {
      title: "Tests Completed",
      value: stats.testsCompleted,
      icon: ClipboardList,
      color: "bg-purple-500",
      route: "/learning/tests",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">French Learning Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              onClick={() => navigate(card.route)}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {stats.cardsDue > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <TrendingUp size={24} className="text-green-600 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-green-800 mb-1">Ready to Study!</h2>
              <p className="text-green-700 mb-4">
                You have {stats.cardsDue} flashcard{stats.cardsDue !== 1 ? "s" : ""} ready for review.
              </p>
              <button
                onClick={() => navigate("/learning/study")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Studying
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
