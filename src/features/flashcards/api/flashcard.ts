import { api } from "@/lib/api";
import { FlashcardsResponse } from "../types/flashCardType";

export async function getAllFlashcards(
  page: number = 1,
  limit: number = 5,
): Promise<FlashcardsResponse> {
  const res = await api.get(
    `/flashcard/get-flashcards/?page=${page}&limit=${limit}`,
  );
  return res.data;
}

//add new flashcard

export async function getinjuryFilterOptions() {
  const res = await api.get(`/injury/filter-options/`);
  return res.data;
}

export async function getInjuriesByRegion(region: string) {
  const res = await api.get(`/injury/region/${region}`);
  return res.data;
}

export async function createFlashcard(data: FormData) {
  const res = await api.post("/flashcard/create-flashcard", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function updateFlashcard(id: string, data: FormData) {
  const res = await api.patch(`/flashcard/update-flashcard/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function deleteFlashcard(id: string) {
  const res = await api.delete(`/flashcard/delete-flashcard/${id}`);
  return res.data;
}
