import { ReservationStatus, type ReservationStatus as ReservationStatusType } from "@/enums/reservation-status";

const reservationStatusLabels: Record<ReservationStatusType, string> = {
  [ReservationStatus.PENDING]: "Pendente",
  [ReservationStatus.CONFIRMED]: "Confirmada",
  [ReservationStatus.REJECTED]: "Rejeitada",
  [ReservationStatus.CANCELLED]: "Cancelada",
  [ReservationStatus.COMPLETED]: "Concluida",
  [ReservationStatus.FINISHED]: "Finalizada",
};

const reservationStatusPluralLabels: Record<ReservationStatusType, string> = {
  [ReservationStatus.PENDING]: "Pendentes",
  [ReservationStatus.CONFIRMED]: "Confirmadas",
  [ReservationStatus.REJECTED]: "Recusadas",
  [ReservationStatus.CANCELLED]: "Canceladas",
  [ReservationStatus.COMPLETED]: "Concluidas",
  [ReservationStatus.FINISHED]: "Finalizadas",
};

export const reservationStatusColors: Record<ReservationStatusType, string> = {
  [ReservationStatus.PENDING]: "orange",
  [ReservationStatus.CONFIRMED]: "green",
  [ReservationStatus.REJECTED]: "red",
  [ReservationStatus.CANCELLED]: "gray",
  [ReservationStatus.COMPLETED]: "blue",
  [ReservationStatus.FINISHED]: "purple",
};

export const finishedReservationStatuses = [
  ReservationStatus.COMPLETED,
  ReservationStatus.FINISHED,
] as const;

export const inactiveReservationStatuses = [
  ReservationStatus.CANCELLED,
  ReservationStatus.COMPLETED,
  ReservationStatus.FINISHED,
  ReservationStatus.REJECTED,
] as const;

export function formatReservationStatus(status: string, options?: { plural?: boolean }) {
  const labels = options?.plural ? reservationStatusPluralLabels : reservationStatusLabels;

  return labels[status as ReservationStatusType] || status.replaceAll("_", " ").toLowerCase();
}

export function getReservationStatusTotal(
  statisticsStatus: Record<string, number> | undefined,
  status: ReservationStatusType
) {
  return statisticsStatus?.[status] || 0;
}

export function getFinishedReservationStatusTotal(statisticsStatus: Record<string, number> | undefined) {
  return finishedReservationStatuses.reduce(
    (total, status) => total + getReservationStatusTotal(statisticsStatus, status),
    0
  );
}

export function isInactiveReservationStatus(status: ReservationStatusType) {
  return inactiveReservationStatuses.some((inactiveStatus) => inactiveStatus === status);
}
