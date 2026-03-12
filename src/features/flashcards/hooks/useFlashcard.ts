import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllFlashcards,
  getinjuryFilterOptions,
  getInjuriesByRegion,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from "../api/flashcard";
import { toast } from "sonner";

export const useFlashcards = (page: number = 1, limit: number = 5) => {
  return useQuery({
    queryKey: ["flashcards", page, limit],
    queryFn: () => getAllFlashcards(page, limit),
  });
};

export const useInjuryFilters = () => {
  return useQuery({
    queryKey: ["injuryFilterOptions"],
    queryFn: getinjuryFilterOptions,
  });
};

export const useInjuriesByRegion = (region: string) => {
  return useQuery({
    queryKey: ["injuriesByRegion", region],
    queryFn: () => getInjuriesByRegion(region),
    enabled: !!region,
  });
};

export const useCreateFlashcard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFlashcard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      toast.success("Flashcard created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create flashcard");
    },
  });
};

export const useUpdateFlashcard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateFlashcard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      toast.success("Flashcard updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update flashcard");
    },
  });
};

export const useDeleteFlashcard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFlashcard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
    },
  });
};

// added new flashcard
export const useInjuryFilterOptions = () => {
  return useQuery({
    queryKey: ["injuryFilterOptions"],
    queryFn: () => getinjuryFilterOptions(),
  });
};
