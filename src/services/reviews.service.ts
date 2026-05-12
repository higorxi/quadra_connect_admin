import { apiRoutes } from "@/constants/api-routes";
import type { ReservationStatus } from "@/enums/reservation-status";
import { api } from "./api";

export interface ReservationReview {
  id: string;
  reservationId: string;
  customerId: string;
  unitId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyReviewSummary {
  id: string;
  reservationId: string;
  unitId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  reservation: {
    id: string;
    startTime: string;
    endTime: string;
    status: ReservationStatus;
  };
  unit: {
    id: string;
    name: string;
  };
}

const getCompanyReviews = async (): Promise<CompanyReviewSummary[]> => {
  const response = await api.get<CompanyReviewSummary[]>(apiRoutes.reviews.company());
  return response.data;
};

const getReservationReview = async (reservationId: string): Promise<ReservationReview | null> => {
  const response = await api.get<ReservationReview | null>(
    apiRoutes.reviews.byReservation(reservationId)
  );
  return response.data;
};

export const ReviewsService = {
  getCompanyReviews,
  getReservationReview,
};
