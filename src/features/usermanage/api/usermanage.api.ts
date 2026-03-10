// src/features/usermanage/api/usermanage.api.ts

// get all users /user/get-all-users

import { api } from "@/lib/api";
import { GetAllUsersResponse } from "../types/usermanage.types";

export async function getAllUsers(): Promise<GetAllUsersResponse> {
  const res = await api.get<GetAllUsersResponse>("/user/get-all-users");
  return res.data;
}
