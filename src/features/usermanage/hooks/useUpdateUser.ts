import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../api/usermanage.api";
import { UpdateUserPayload } from "../types/usermanage.types";

export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["single-user", userId] });
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
  });
}
