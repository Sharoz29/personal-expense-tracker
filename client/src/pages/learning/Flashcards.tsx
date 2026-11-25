import { useState, useEffect } from "react";
import { Plus, Edit, Trash, Play, RefreshCw, Volume2 } from "lucide-react";
import { flashcardsApi } from "../../api/flashcards.api";
import Loader from "../../components/common/Loader";
import type { Flashcard } from "../../types";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Flashcard | null>(null);
  const [deleting, setDeleting] = useState<Flashcard | null>(null);
  const [regenerating, setRegenerating] = useState<number | null>(null);

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    setLoading(true);
    try {
      const data = await flashcardsApi.getAll();
      setFlashcards(data);
    } catch (error) {
      console.error("Failed to load flashcards", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      french_text: formData.get("french_text") as string,
      english_meaning: formData.get("english_meaning") as string,
      category: formData.get("category") as string || "general",
      difficulty_level: formData.get("difficulty_level") as string || "beginner",
    };

    try {
      if (editing) {
        await flashcardsApi.update(editing.id, data);
      } else {
        await flashcardsApi.create(data);
      }
      setShowForm(false);
      setEditing(null);
      loadFlashcards();
    } catch (error) {
      console.error("Failed to save flashcard", error);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await flashcardsApi.delete(deleting.id);
      setDeleting(null);
      loadFlashcards();
    } catch (error) {
      console.error("Failed to delete flashcard", error);
    }
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  const handleRegenerateAudio = async (id: number) => {
    setRegenerating(id);
    try {
      await flashcardsApi.generateAudio(id);
      loadFlashcards();
    } catch (error) {
      console.error("Failed to regenerate audio", error);
      alert("Failed to regenerate audio. Please check your Google Cloud TTS setup.");
    } finally {
      setRegenerating(null);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">Flashcards</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 sm:bg-green-600 sm:text-white text-green-600 rounded-lg text-sm sm:hover:bg-green-700 hover:bg-green-50 transition-colors shrink-0"
        >
          <Plus size={20} className="sm:hidden" />
          <Plus size={16} className="hidden sm:block" />
          <span className="hidden sm:inline">Add Flashcard</span>
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Volume2 size={20} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-1 text-sm sm:text-base">Auto-Generated Pronunciation</h3>
            <p className="text-xs sm:text-sm text-blue-700">
              French pronunciation audio is automatically generated using Google Cloud Text-to-Speech when you create or edit flashcards.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader module="learning" />
      ) : flashcards.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm mb-4">No flashcards yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {flashcards.map((card) => (
            <div key={card.id} className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base sm:text-lg text-gray-800">{card.french_text}</p>
                  <p className="text-sm sm:text-base text-gray-600">{card.english_meaning}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {card.category}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {card.difficulty_level}
                    </span>
                  </div>
                </div>
                {card.audio_url && (
                  <button
                    onClick={() => playAudio(card.audio_url!)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Play size={20} />
                  </button>
                )}
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => { setEditing(card); setShowForm(true); }}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleRegenerateAudio(card.id)}
                  disabled={regenerating === card.id}
                  className="text-sm text-gray-600 hover:text-green-600 transition-colors disabled:opacity-50"
                  title="Regenerate audio"
                >
                  <RefreshCw size={16} className={regenerating === card.id ? "animate-spin" : ""} />
                </button>
                <button
                  onClick={() => setDeleting(card)}
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? "Edit Flashcard" : "Add Flashcard"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              French Text
            </label>
            <input
              type="text"
              name="french_text"
              defaultValue={editing?.french_text}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              English Meaning
            </label>
            <input
              type="text"
              name="english_meaning"
              defaultValue={editing?.english_meaning}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              defaultValue={editing?.category || "general"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select
              name="difficulty_level"
              defaultValue={editing?.difficulty_level || "beginner"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700">
              💡 French pronunciation audio will be automatically generated using Google TTS
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditing(null); }}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              {editing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Flashcard"
        message={`Delete "${deleting?.french_text}"? This will also delete any audio associated with it.`}
      />
    </div>
  );
}
