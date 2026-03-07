import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInjury, CreateInjuryPayload } from "../api/create-injury.api";

export const useCreateInjury = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInjuryPayload) => createInjury(payload),
    onSuccess: (data) => {
      // Invalidate and refetch injuries list
      queryClient.invalidateQueries({ queryKey: ["injuries"] });

      console.log("Topic created successfully:", data);
    },
    onError: (error: Error) => {
      console.error("Failed to create topic:", error);
      alert(error.message || "Failed to create topic");
    },
  });
};
