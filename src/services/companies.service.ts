import { apiRoutes } from "@/constants/api-routes";
import {
  UpdateCompanySchema,
  type Company,
  type UpdateCompanyDTO,
} from "@/schemas/services/companies.dto.schema";
import { api } from "./api";

const getMyCompany = async (): Promise<Company> => {
  const response = await api.get(apiRoutes.companies.me());
  return response.data;
};

const updateMyCompany = async (data: UpdateCompanyDTO): Promise<Company> => {
  const validatedData = UpdateCompanySchema.parse(data);
  const response = await api.patch(apiRoutes.companies.me(), validatedData);
  return response.data;
};

export const CompaniesService = {
  getMyCompany,
  updateMyCompany,
};
