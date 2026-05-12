import { apiRoutes } from "@/constants/api-routes";
import { api } from "./api";

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export interface ReservationSummary {
  id: string;
  customerId: string;
  unitId: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  totalPrice: string;
  bailPaid: boolean;
  isSplit: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateReservationDTO {
  status?: ReservationStatus;
  bailPaid?: boolean;
}

const getCompanyReservations = async (): Promise<ReservationSummary[]> => {
  const response = await api.get<ReservationSummary[]>(apiRoutes.reservations.company());
  return response.data;
};

const getReservation = async (id: string): Promise<ReservationSummary> => {
  const response = await api.get<ReservationSummary>(apiRoutes.reservations.get(id));
  return response.data;
};

const updateReservation = async (
  id: string,
  data: UpdateReservationDTO
): Promise<ReservationSummary> => {
  const response = await api.patch<ReservationSummary>(apiRoutes.reservations.update(id), data);
  return response.data;
};

export const ReservationsService = {
  getCompanyReservations,
  getReservation,
  updateReservation,
};
