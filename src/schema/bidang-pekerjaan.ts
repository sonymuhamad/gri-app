import * as z from "zod";

export const RegisterBidangPekerjaanSchema = z.object({
  nama: z.string({ required_error: "Nama is Required" }).min(1, {
    message: "Nama is Required",
  }),
  kode: z.string({ required_error: "Kode is Required" }).min(1, {
    message: "Kode is Required",
  }),
  notes: z.string(),
  id_proyek: z.number({ required_error: "Id Proyek is Required" }),
});

export type RegisterBidangPekerjaanForm = z.infer<
  typeof RegisterBidangPekerjaanSchema
>;
