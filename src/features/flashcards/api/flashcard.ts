import { api } from "@/lib/api";
import { FlashcardsResponse } from "../types/flashCardType";

export interface FlashcardFilters {
  status?: string;
  filterBytopicId?: string;
  filterByAcuity?: string;
  filterByAgeGroup?: string;
  sortBy?: string;
  search?: string;
  speciality?: string;
  bodyArea?: string;
}

export async function getAllFlashcards(
  page: number = 1,
  limit: number = 8,
  filters: FlashcardFilters = {},
): Promise<FlashcardsResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (filters.status) params.set("status", filters.status);
  if (filters.filterBytopicId)
    params.set("filterBytopicId", filters.filterBytopicId);
  if (filters.filterByAcuity)
    params.set("filterByAcuity", filters.filterByAcuity);
  if (filters.filterByAgeGroup)
    params.set("filterByAgeGroup", filters.filterByAgeGroup);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.search) params.set("search", filters.search);
  if (filters.speciality) params.set("speciality", filters.speciality);
  if (filters.bodyArea) params.set("bodyArea", filters.bodyArea);

  const res = await api.get(`/flashcard/get-flashcards/?${params.toString()}`);
  return res.data;
}

export interface TopicOption {
  _id: string;
  Id: string;
  Name: string;
  Primary_Body_Region: string;
  Acuity?: string;
  Age_Group?: string;
}

export interface TopicOptionsResponse {
  message: string;
  statusCode: number;
  status: string;
  meta: { page: number; limit: number; total: number; pages: number };
  data: TopicOption[];
}

export async function getTopicsForFilter(
  page: number = 1,
  limit: number = 10,
): Promise<TopicOptionsResponse> {
  const res = await api.get(`/injury/get-all?page=${page}&limit=${limit}`);
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
