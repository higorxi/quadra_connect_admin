import { apiRoutes } from "@/constants/api-routes";
import { api } from "./api";

export type ReportModule = "RESERVATIONS" | "TRANSACTIONS" | "REVIEWS" | "UNITS";
export type ReportStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface ReportResult {
  summary: Record<string, string | number>;
  columns: string[];
  rows: Record<string, string | number | null>[];
  truncated: boolean;
}

export interface Report {
  id: string;
  companyId: string;
  module: ReportModule;
  status: ReportStatus;
  filters: Record<string, string | number>;
  startDate: string | null;
  endDate: string | null;
  rowCount: number | null;
  result: ReportResult | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface PaginatedReports {
  data: Report[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface CreateReportDTO {
  module: ReportModule;
  startDate?: string;
  endDate?: string;
  unitId?: string;
  reservationStatus?: string;
  transactionStatus?: string;
  transactionType?: string;
  minRating?: number;
}

const listReports = async (params: {
  page: number;
  pageSize: number;
  module?: ReportModule;
  status?: ReportStatus;
}): Promise<PaginatedReports> => {
  const response = await api.get<PaginatedReports>(apiRoutes.reports.list(), { params });
  return response.data;
};

const getReport = async (id: string): Promise<Report> => {
  const response = await api.get<Report>(apiRoutes.reports.get(id));
  return response.data;
};

const createReport = async (data: CreateReportDTO): Promise<Report> => {
  const response = await api.post<Report>(apiRoutes.reports.create(), data);
  return response.data;
};

export const ReportsService = {
  listReports,
  getReport,
  createReport,
};
