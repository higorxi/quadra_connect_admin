export const ReservationStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
  FINISHED: "FINISHED",
} as const;

export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus];
