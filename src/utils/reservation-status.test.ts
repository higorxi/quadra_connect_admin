import { describe, expect, it } from "vitest";
import { ReservationStatus } from "@/enums/reservation-status";
import {
  formatReservationStatus,
  getFinishedReservationStatusTotal,
  getReservationStatusTotal,
  isInactiveReservationStatus,
} from "./reservation-status";

describe("formatReservationStatus", () => {
  it("traduz o status para o rótulo em português", () => {
    expect(formatReservationStatus(ReservationStatus.PENDING)).toBe("Pendente");
    expect(formatReservationStatus(ReservationStatus.CONFIRMED)).toBe("Confirmada");
  });

  it("usa o rótulo no plural quando pedido", () => {
    expect(formatReservationStatus(ReservationStatus.CANCELLED, { plural: true })).toBe("Canceladas");
  });

  it("devolve um texto legível para status desconhecido", () => {
    expect(formatReservationStatus("EM_ANALISE")).toBe("em analise");
    expect(formatReservationStatus("AGUARDANDO_PAGAMENTO")).toBe("aguardando pagamento");
  });
});

describe("isInactiveReservationStatus", () => {
  it("considera inativas as reservas canceladas, rejeitadas e finalizadas", () => {
    expect(isInactiveReservationStatus(ReservationStatus.CANCELLED)).toBe(true);
    expect(isInactiveReservationStatus(ReservationStatus.REJECTED)).toBe(true);
    expect(isInactiveReservationStatus(ReservationStatus.COMPLETED)).toBe(true);
  });

  it("mantém ativas as pendentes e confirmadas", () => {
    expect(isInactiveReservationStatus(ReservationStatus.PENDING)).toBe(false);
    expect(isInactiveReservationStatus(ReservationStatus.CONFIRMED)).toBe(false);
  });
});

describe("totais das estatísticas por status", () => {
  it("retorna o total de um status e zero quando ausente", () => {
    expect(getReservationStatusTotal({ CONFIRMED: 4 }, ReservationStatus.CONFIRMED)).toBe(4);
    expect(getReservationStatusTotal({ CONFIRMED: 4 }, ReservationStatus.PENDING)).toBe(0);
    expect(getReservationStatusTotal(undefined, ReservationStatus.PENDING)).toBe(0);
  });

  it("soma concluídas e finalizadas", () => {
    expect(getFinishedReservationStatusTotal({ COMPLETED: 3, FINISHED: 2, PENDING: 9 })).toBe(5);
    expect(getFinishedReservationStatusTotal(undefined)).toBe(0);
  });
});
