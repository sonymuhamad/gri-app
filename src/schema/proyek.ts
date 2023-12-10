import * as z from "zod";

export const RegisterProyekSchema = z.object({
  nama: z
    .string({
      required_error: "Nama is Required",
    })
    .min(1, { message: "Nama is Required" }),
  kode: z
    .string({
      required_error: "Kode is Required",
    })
    .min(1, { message: "Kode is Required" }),
  tanggal: z.date({ required_error: "Tanggal is Required" }),
  lokasi: z.string().min(1, { message: "Lokasi is Required" }),
  notes: z.string(),
});

export type RegisterProyekForm = z.infer<typeof RegisterProyekSchema>;
