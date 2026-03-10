// src/features/usermanage/hooks/useSingleUser.ts
import { useQuery } from "@tanstack/react-query";
import { getSingleUser } from "../api/usermanage.api";

export function useSingleUser(userId: string | null) {
  return useQuery({
    queryKey: ["single-user", userId],
    queryFn: () => getSingleUser(userId!),
    enabled: !!userId,
  });
}
