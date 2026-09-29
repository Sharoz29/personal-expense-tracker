import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Volume2, ArrowLeft } from "lucide-react";
import { flashcardsApi } from "../../api/flashcards.api";
import type { Flashcard } from "../../types";

export default function Study() {
  const navigate = useNavigate();
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDueCards();
  }, []);

  const loadDueCards = async () => {
    setLoading(true);
    try {
      const data = await flashcardsApi.getDueForReview();
      setDueCards(data);
    } catch (error) {
      console.error("Failed to load cards", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (rating: number) => {
    const currentCard = dueCards[currentIndex];
    try {
      await flashcardsApi.review(currentCard.id, rating);

      if (currentIndex < dueCards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        // Reload to get fresh due cards
        await loadDueCards();
        setCurrentIndex(0);
        setShowAnswer(false);
      }
    } catch (error) {
      console.error("Failed to review card", error);
    }
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (dueCards.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">All caught up!</h1>
          <p className="text-gray-600 mb-6">No cards due for review right now. Great job!</p>
          <button
            onClick={() => navigate("/learning")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentCard = dueCards[currentIndex];

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/learning")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <p className="text-sm text-gray-600">
            Card {currentIndex + 1} of {dueCards.length}
          </p>
        </div>

        <div
          className="bg-white rounded-xl border-2 border-gray-200 p-8 min-h-[300px] flex items-center justify-center cursor-pointer hover:border-green-300 transition-colors"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <p className="text-3xl font-bold text-gray-800">{currentCard.french_text}</p>
              {currentCard.audio_url && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(currentCard.audio_url!);
                  }}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                >
                  <Volume2 size={24} />
                </button>
              )}
            </div>
            {showAnswer && (
              <p className="text-xl text-gray-600 mt-4">{currentCard.english_meaning}</p>
            )}
            {!showAnswer && (
              <p className="text-sm text-gray-400 mt-8">Click to reveal answer</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Show Answer
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleRating(1)}
                className="py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Hard
              </button>
              <button
                onClick={() => handleRating(3)}
                className="py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                Good
              </button>
              <button
                onClick={() => handleRating(5)}
                className="py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Easy
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Hard: 1 day • Good: 3-6 days • Easy: 6+ days
        </p>
      </div>
    </div>
  );
}
