import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllTopicsForDropdown } from "../api/topics-dropdown.api";

export const useTopicsDropdown = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["topics-dropdown", page, limit],
    queryFn: () => getAllTopicsForDropdown(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
