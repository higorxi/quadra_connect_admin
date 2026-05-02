import { CreateUnitSchema, type CreateUnitDTO, type Unit } from "@/schemas/services/units.dto.schema";
import { api } from "./api";
import { apiRoutes } from "@/constants/api-routes";


const getUnits = async (): Promise<Unit[]> => {
  const response = await api.get(apiRoutes.units.list());
  return response.data;
};

const getUnit = async (id: string): Promise<Unit> => {
  const response = await api.get(apiRoutes.units.get(id));
  return response.data;
};

const createUnit = async (data: CreateUnitDTO): Promise<Unit> => {
  const validatedData = CreateUnitSchema.parse(data);
  const response = await api.post(apiRoutes.units.create(), validatedData);
  return response.data;
};

const updateUnit = async (id: string, data: CreateUnitDTO): Promise<Unit> => {
  const validatedData = CreateUnitSchema.parse(data);
  const response = await api.patch(apiRoutes.units.update(id), validatedData);
  return response.data;
};

const deleteUnit = async (id: string): Promise<void> => {
  await api.delete(apiRoutes.units.delete(id));
};

export const UnitsService = {
  getUnits,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit,
};