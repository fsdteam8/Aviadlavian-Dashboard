import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/singUp.api";
import { signUpSchema } from "../schema/signUpSchema";
import { z } from "zod";

type SignUpFormData = z.infer<typeof signUpSchema>;

export function useSignUp() {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (data: SignUpFormData) => registerUser(data),
  });
}
