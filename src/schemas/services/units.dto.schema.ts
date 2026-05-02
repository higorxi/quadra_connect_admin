import { z } from "zod";

export const CreateUnitSchema = z.object({
  companyId: z.string().uuid(),
  categoryId: z.string().uuid(),
  name: z.string().min(3),
  description: z.string().nullable(),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().length(2),
  pricePerHour: z.string().refine((val) => !isNaN(Number(val))),
  requiresConfirmation: z.boolean().default(false),
  bailValue: z.string().nullable(),
});

export type CreateUnitDTO = z.infer<typeof CreateUnitSchema>;

export interface Unit extends CreateUnitDTO {
  id: string;
  createdAt: string;
  updatedAt: string;
}