import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getTopPerformingStudents,
  getOverallProgress,
} from "../api/overview.api";

export const useOverviewProgress = () => {
  return useQuery({
    queryKey: ["overview-progress"],
    queryFn: () => getOverallProgress(),
  });
};

export const useTopPerformingStudents = (
  page: number = 2,
  limit: number = 3,
) => {
  return useQuery({
    queryKey: ["top-performing-students", page, limit],
    queryFn: () => getTopPerformingStudents(page, limit),
    placeholderData: keepPreviousData,
  });
};
