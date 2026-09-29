import api from "./client";
import type { Flashcard, CreateFlashcardDto } from "../types";

export const flashcardsApi = {
  getAll: async (): Promise<Flashcard[]> => {
    const res = await api.get("/flashcards");
    return res.data.data;
  },

  getById: async (id: number): Promise<Flashcard> => {
    const res = await api.get(`/flashcards/${id}`);
    return res.data.data;
  },

  create: async (data: CreateFlashcardDto): Promise<Flashcard> => {
    const res = await api.post("/flashcards", data);
    return res.data.data;
  },

  update: async (id: number, data: CreateFlashcardDto): Promise<Flashcard> => {
    const res = await api.put(`/flashcards/${id}`, data);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/flashcards/${id}`);
  },

  getDueForReview: async (): Promise<Flashcard[]> => {
    const res = await api.get("/flashcards/due");
    return res.data.data;
  },

  review: async (id: number, qualityRating: number): Promise<Flashcard> => {
    const res = await api.post(`/flashcards/${id}/review`, { quality_rating: qualityRating });
    return res.data.data;
  },

  uploadAudio: async (id: number, audioFile: Blob): Promise<Flashcard> => {
    const formData = new FormData();
    formData.append("audio", audioFile, "recording.webm");
    const res = await api.post(`/flashcards/${id}/audio`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
};
