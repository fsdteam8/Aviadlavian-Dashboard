// src/features/usermanage/hooks/useUserList.ts
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../api/usermanage.api";

export function useUserList() {
  return useQuery({
    queryKey: ["users-list"],
    queryFn: getAllUsers,
  });
}
