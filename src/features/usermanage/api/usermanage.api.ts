// src/features/usermanage/api/usermanage.api.ts
import { api } from "@/lib/api";
import {
  GetAllUsersResponse,
  GetSingleUserResponse,
  UpdateUserPayload,
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

export async function updateUser(
  userId: string,
  payload: UpdateUserPayload,
): Promise<GetSingleUserResponse> {
  const session = await getSession();

  const formData = new FormData();
  if (payload.FirstName) formData.append("FirstName", payload.FirstName);
  if (payload.LastName) formData.append("LastName", payload.LastName);
  if (payload.country) formData.append("country", payload.country);
  if (payload.status) formData.append("status", payload.status);
  if (payload.image) formData.append("image", payload.image);

  const res = await api.patch<GetSingleUserResponse>(
    `/user/update-user/${userId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
}

export async function deleteUser(
  userId: string,
): Promise<GetSingleUserResponse> {
  const session = await getSession();
  const res = await api.delete<GetSingleUserResponse>(
    `/user/delete-account/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    },
  );
  return res.data;
}
