import { apiRoutes } from "@/constants/api-routes";
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

const getReservationReview = async (reservationId: string): Promise<ReservationReview | null> => {
  const response = await api.get<ReservationReview | null>(
    apiRoutes.reviews.byReservation(reservationId)
  );
  return response.data;
};

export const ReviewsService = {
  getReservationReview,
};
