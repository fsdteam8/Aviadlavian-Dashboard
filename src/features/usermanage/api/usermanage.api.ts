// src/features/usermanage/api/usermanage.api.ts

import { api } from "@/lib/api";
import {
  GetAllUsersResponse,
  GetSingleUserResponse,
} from "../types/usermanage.types";
import { getSession } from "next-auth/react";

export async function getAllUsers(
  page: number = 1,
  limit: number = 6,
  search: string = "",
  filter: string = "",
): Promise<GetAllUsersResponse> {
  const session = await getSession();

  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (search) params.set("search", search);
  if (filter) params.set("filter", filter);

  const res = await api.get<GetAllUsersResponse>(
    `/user/get-all-users?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    },
  );
  return res.data;
}

export async function getSingleUser(
  userId: string,
): Promise<GetSingleUserResponse> {
  const session = await getSession();
  const res = await api.get<GetSingleUserResponse>(
    `/user/get-single-user/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    },
  );
  return res.data;
}

export async function updateStatus(
  userId: string,
  status: string,
): Promise<GetSingleUserResponse> {
  const session = await getSession();
  const res = await api.patch<GetSingleUserResponse>(
    `/user/update-status/${userId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    },
  );
  return res.data;
}
