import { apiRoutes } from "@/constants/api-routes";
import { api } from "./api";

export interface CompanyTopUnitStatistics {
  unitId: string;
  name: string;
  reservationsCount: number;
}

export interface CompanyStatistics {
  companyId: string;
  companyName: string;
  units: {
    total: number;
  };
  reservations: {
    total: number;
    upcoming: number;
    byStatus: Record<string, number>;
  };
  revenue: {
    estimated: string;
  };
  reviews: {
    total: number;
    averageRating: number;
  };
  topUnitsByReservations: CompanyTopUnitStatistics[];
}

export const StatisticsService = {
  getCompanyStatistics: async (): Promise<CompanyStatistics> => {
    const response = await api.get<CompanyStatistics>(apiRoutes.statistics.company());
    return response.data;
  },
};
