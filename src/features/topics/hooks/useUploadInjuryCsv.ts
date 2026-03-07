import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  uploadInjuryCsv,
  UploadInjuryCsvResponse,
} from "../api/upload-injury-csv.api";

export const useUploadInjuryCsv = () => {
  const queryClient = useQueryClient();

  return useMutation<UploadInjuryCsvResponse, unknown, File>({
    mutationFn: (file: File) => uploadInjuryCsv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["injuries"] });
    },
  });
};
