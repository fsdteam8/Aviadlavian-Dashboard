import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateQuestion } from "../api/question.api";
import { UpdateQuestionPayload } from "../type/question.types";

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateQuestionPayload;
    }) => updateQuestion(id, payload),
    onSuccess: (data, variables) => {
      toast.success("Question updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["question", variables.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update question");
    },
  });
};
