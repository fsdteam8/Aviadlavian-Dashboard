import { useQuery } from "@tanstack/react-query";
import { getAllArticles } from "../api/article.api";

export const useArticles = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["articles", page, limit],
    queryFn: () => getAllArticles(page, limit),
  });
};
