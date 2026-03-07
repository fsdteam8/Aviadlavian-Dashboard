import { useQuery } from "@tanstack/react-query";
import { getAllInjuries } from "../api/injury.api";

export const useInjuries = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["injuries", page, limit],
    queryFn: () => getAllInjuries(page, limit),
  });
};
