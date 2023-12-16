import * as z from "zod";

export const AuthSchema = z.object({
  email: z
    .string({ required_error: "Harap masukkan email anda" })
    .min(0, {
      message: "Harap masukkan email anda",
    })
    .email({ message: "Invalid email format" }),
  password: z.string({ required_error: "Harap Masukkan password" }).min(8, {
    message: "Password minimal 8 character",
  }),
});

export type AuthForm = z.infer<typeof AuthSchema>;
