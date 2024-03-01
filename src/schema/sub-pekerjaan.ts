import * as z from "zod";

export const SubPekerjaanSchema = z.object({
  nama: z.string({ required_error: "Nama is Required" }).min(1, {
    message: "Nama is Required",
  }),
  id_pekerjaan: z.number({
    required_error: "Id pekerjaan is required",
  }),
  id_satuan: z
    .object({
      id: z.number(),
      nama: z.string(),
    })
    .transform((v) => v.id)
    .refine((value) => value !== undefined, {
      message: "Satuan is Required",
    }),
  target_volume: z
    .number({ required_error: "Target Volume is Required" })
    .refine((value) => value !== undefined, {
      message: "Target Volume is Required",
    }),
  bobot: z
    .number({ required_error: "Bobot is Required" })
    .refine((value) => value !== undefined, {
      message: "Bobot is Required",
    })
    .refine((value) => !(value > 100), {
      message: "Bobot tidak boleh lebih dari 100 persen",
    }),
  notes: z.string(),
});

export type SubPekerjaanForm = z.input<typeof SubPekerjaanSchema>;
export type RegisterSubPekerjaanForm = z.infer<typeof SubPekerjaanSchema>;
