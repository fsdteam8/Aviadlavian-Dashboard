// src/features/usermanage/hooks/useUserList.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllUsers } from "../api/usermanage.api";

interface UseUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: string;
}

export function useUserList({
  page = 1,
  limit = 6,
  search = "",
  filter = "",
}: UseUserListParams = {}) {
  return useQuery({
    queryKey: ["users-list", page, limit, search, filter],
    queryFn: () => getAllUsers(page, limit, search, filter),
    placeholderData: keepPreviousData,
  });
}
