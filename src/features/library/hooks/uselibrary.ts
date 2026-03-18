import { useQuery } from "@tanstack/react-query";
import { getAllLibraryArticles } from "../api/library";
import { LibraryQueryParams } from "../type/library";

export function useLibrary(params: LibraryQueryParams = {}) {
  return useQuery({
    queryKey: [
      "library-articles",
      params.page ?? 1,
      params.limit ?? 10,
      params.search ?? "",
      params.speciality ?? "",
      params.bodyArea ?? "",
    ],
    queryFn: () => getAllLibraryArticles(params),
  });
}
