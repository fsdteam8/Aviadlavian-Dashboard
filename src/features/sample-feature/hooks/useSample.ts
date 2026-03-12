import { useQuery } from "@tanstack/react-query";
import { getSampleItems } from "../api/sample.api";
import { api } from "@/lib/api";
import { getSession } from "next-auth/react";

export function useSampleItems() {
  return useQuery({
    queryKey: ["sample-items"],
    queryFn: getSampleItems,
  });
}

export function useMyProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const session = await getSession();
      const res = await api.get("/user/get-my-profile", {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      return res.data;
    },
  });
}
