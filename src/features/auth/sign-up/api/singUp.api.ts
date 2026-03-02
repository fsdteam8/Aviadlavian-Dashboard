import { signUpSchema } from "./../schema/signUpSchema";
import { api } from "@/lib/api";
import { z } from "zod";

type SignUpFormData = z.infer<typeof signUpSchema>;

export async function registerUser(
  payload: SignUpFormData,
): Promise<SignUpFormData> {
  const res = await api.post("/user/register-user", payload);
  return res.data;
}
