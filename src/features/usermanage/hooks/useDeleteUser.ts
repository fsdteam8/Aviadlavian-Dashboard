// src/features/usermanage/hooks/useDeleteUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../api/usermanage.api";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
  });
}
