import * as z from "zod";
import { Role } from "@prisma/client";

export const RegisterUserSchema = z
  .object({
    name: z
      .string({ required_error: "Name is Required" })
      .min(1, { message: "Name is Required" }),
    email: z
      .string({ required_error: "Email is Required" })
      .min(1, {
        message: "Email is Required",
      })
      .email({ message: "Invalid Email" }),
    role: z.nativeEnum(Role).default(Role.ADMIN),
    password: z
      .string()
      .min(8, { message: "Password must contain at least 8 character(s)" }),
    confirmedPassword: z
      .string()
      .min(8, { message: "Password must contain at least 8 character(s)" }),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: "Passwords do not match",
    path: ["confirmedPassword"],
  })
  .transform(({ confirmedPassword, ...restData }) => restData);

export type RegisterUserForm = z.input<typeof RegisterUserSchema>;

export const EditUserSchema = z.object({
  name: z
    .string({ required_error: "Name is Required" })
    .min(1, { message: "Name is Required" }),
  email: z
    .string({ required_error: "Email is Required" })
    .min(1, {
      message: "Email is Required",
    })
    .email({ message: "Invalid Email" }),
  role: z.nativeEnum(Role).default(Role.ADMIN),
});

export type EditUserForm = z.input<typeof EditUserSchema>;
