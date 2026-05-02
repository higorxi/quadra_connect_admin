import { z } from "zod";

export const CreateUnitSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(3),
  description: z.string().nullable(),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().length(2),
  pricePerHour: z.coerce.number().min(0, "O preço deve ser maior que 0"),
  bailValue: z.coerce.number().min(0).nullable().optional(),
  requiresConfirmation: z.boolean().default(false),
});

export type CreateUnitDTO = z.infer<typeof CreateUnitSchema>;

export interface Unit extends CreateUnitDTO {
  id: string;
  createdAt: string;
  updatedAt: string;
}