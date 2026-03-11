import { useQuery } from "@tanstack/react-query";
import { getAllQuestions } from "../api/question.api";

export const useQuestions = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["questions", page, limit],
    queryFn: () => getAllQuestions(page, limit),
  });
};
