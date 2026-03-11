import { useQuery } from "@tanstack/react-query";
import { getAllTopicsForDropdown } from "../api/topics-dropdown.api";

export const useTopicsDropdown = () => {
  return useQuery({
    queryKey: ["topics-dropdown"],
    queryFn: () => getAllTopicsForDropdown(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
