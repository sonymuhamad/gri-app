import * as z from "zod";

export const RegisterPekerjaanSchema = z.object({
  nama: z.string({ required_error: "Nama is Required" }).min(1, {
    message: "Nama is Required",
  }),
  notes: z.string(),
  id_bidang_pekerjaan: z.number({ required_error: "Id Proyek is Required" }),
});

export type RegisterPekerjaanForm = z.infer<typeof RegisterPekerjaanSchema>;
