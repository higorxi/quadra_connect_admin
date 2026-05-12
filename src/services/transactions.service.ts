import { apiRoutes } from "@/constants/api-routes";
import { api } from "./api";

export type TransactionType = "DEPOSIT" | "PAYMENT" | "REFUND" | "BAIL_FORFEIT";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface TransactionSummary {
  id: string;
  customerId: string;
  amount: string;
  type: TransactionType;
  status: TransactionStatus;
  pixCode: string;
  createdAt: string;
  updatedAt: string;
}

const getTransaction = async (id: string): Promise<TransactionSummary> => {
  const response = await api.get<TransactionSummary>(apiRoutes.transactions.get(id));
  return response.data;
};

const updateTransactionStatus = async (
  id: string,
  status: TransactionStatus
): Promise<TransactionSummary> => {
  const response = await api.patch<TransactionSummary>(apiRoutes.transactions.updateStatus(id), {
    status,
  });
  return response.data;
};

export const TransactionsService = {
  getTransaction,
  updateTransactionStatus,
};
