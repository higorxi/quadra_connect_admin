import { z } from "zod";

export const UpdateCompanySchema = z.object({
  name: z.string().min(1, "Informe o nome da empresa"),
  phone: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export type UpdateCompanyDTO = z.infer<typeof UpdateCompanySchema>;

export interface Company {
  id: string;
  userId: string;
  name: string;
  cnpj: string;
  phone: string | null;
  description: string | null;
  evaluation: number;
  createdAt: string;
  updatedAt: string;
}
