import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInjury } from "../api/injury.api";

export const useDeleteInjury = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteInjury(id),
    onSuccess: () => {
      // Invalidate and refetch injuries list
      queryClient.invalidateQueries({ queryKey: ["injuries"] });

      console.log("Topic deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to delete topic:", error);
      alert(error.message || "Failed to delete topic");
    },
  });
};
