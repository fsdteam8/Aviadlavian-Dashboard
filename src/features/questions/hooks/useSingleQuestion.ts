import { useQuery } from "@tanstack/react-query";
import { getSingleQuestion } from "../api/question.api";

export const useSingleQuestion = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["question", id],
    queryFn: () => getSingleQuestion(id),
    enabled: enabled && !!id,
  });
};
