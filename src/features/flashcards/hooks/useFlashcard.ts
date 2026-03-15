import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAllFlashcards,
  getinjuryFilterOptions,
  getInjuriesByRegion,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  getTopicsForFilter,
  type FlashcardFilters,
} from "../api/flashcard";
import { toast } from "sonner";

export const useFlashcards = (
  page: number = 1,
  limit: number = 8,
  filters: FlashcardFilters = {},
) => {
  return useQuery({
    queryKey: ["flashcards", page, limit, filters],
    queryFn: () => getAllFlashcards(page, limit, filters),
    placeholderData: keepPreviousData,
  });
};

export const useTopicsForFilter = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["topics-filter", page, limit],
    queryFn: () => getTopicsForFilter(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
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
