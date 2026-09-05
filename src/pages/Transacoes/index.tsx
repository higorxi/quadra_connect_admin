import { ContentBlock } from "@/components/ContentBlock";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { DetailItem } from "@/components/DetailItem";
import { MetricCard } from "@/components/MetricCard";
import { PageContainer } from "@/components/PageContainer";
import { BaseModal } from "@/components/ui/BaseModal";
import { EntityLink } from "@/components/EntityLink";
import { detailPath } from "@/utils/detail-path";
import { appPaths } from "@/constants/app-paths";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { TransactionsService, type TransactionSummary, type TransactionType } from "@/services/transactions.service";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Center,
  IconButton,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiEye, FiRefreshCw } from "react-icons/fi";

export default function Transacoes() {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionSummary | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { company } = useCompanyProfile();

  const { data: transactions, isLoading, isError, refetch } = useQuery({
    queryKey: ["transactions", "company"],
    queryFn: TransactionsService.getCompanyTransactions,
  });

  const activeTransactionId = selectedTransaction?.id ?? searchParams.get("detalhe") ?? undefined;

  const { data: linkedTransaction, isLoading: isLoadingLinked, isError: isErrorLinked } = useQuery({
    queryKey: ["transactions", activeTransactionId],
    queryFn: () => TransactionsService.getTransaction(activeTransactionId as string),
    enabled: !!activeTransactionId && !selectedTransaction,
  });

  const activeTransaction = selectedTransaction ?? linkedTransaction ?? null;

  const closeDetails = () => {
    setSelectedTransaction(null);
    if (searchParams.has("detalhe")) {
      searchParams.delete("detalhe");
      setSearchParams(searchParams, { replace: true });
    }
  };

  const metrics = useMemo(() => {
    const items = transactions ?? [];
    const completed = items.filter((transaction) => transaction.status === "COMPLETED");

    return {
      total: items.length,
      pending: items.filter((transaction) => transaction.status === "PENDING").length,
      completed: completed.length,
      revenue: completed.reduce((sum, transaction) => sum + Number(transaction.amount), 0),
    };
  }, [transactions]);

  const columns: DataTableColumn<TransactionSummary>[] = [
    {
      key: "createdAt",
      header: "Data",
      cell: (transaction) => (
        <>
          <Text fontWeight="semibold" color="navy.600">
            {formatDateTime(transaction.createdAt)}
          </Text>
          <Text fontSize="xs" color="gray.500">
            atualizada {formatDateTime(transaction.updatedAt)}
          </Text>
        </>
      ),
    },
    {
      key: "type",
      header: "Tipo",
      cell: (transaction) => (
        <Text fontSize="sm" color="gray.700">
          {formatTransactionType(transaction.type)}
        </Text>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (transaction) => (
        <Badge colorPalette={transactionStatusColors[transaction.status]} variant="subtle">
          {formatTransactionStatus(transaction.status)}
        </Badge>
      ),
    },
    {
      key: "reservationId",
      header: "Reserva",
      cell: (transaction) =>
        transaction.reservationId ? (
          <EntityLink
            to={detailPath(appPaths.reservas(), transaction.reservationId)}
            label={formatReservationLabel(transaction)}
            fallback={transaction.reservationId}
          />
        ) : (
          <Text fontSize="sm" color="gray.700">
            Sem reserva
          </Text>
        ),
    },
    {
      key: "customerId",
      header: "Cliente",
      cell: (transaction) => (
        <Text fontSize="sm" color="gray.700" lineClamp={1}>
          {transaction.customerName ?? transaction.customerId}
        </Text>
      ),
    },
    {
      key: "amount",
      header: "Valor",
      cell: (transaction) => <Text fontWeight="semibold">{formatCurrency(transaction.amount)}</Text>,
    },
    {
      key: "actions",
      header: "Ações",
      align: "end",
      cell: (transaction) => (
        <IconButton
          aria-label="Ver detalhes da transação"
          size="sm"
          variant="ghost"
          onClick={() => setSelectedTransaction(transaction)}
        >
          <FiEye />
        </IconButton>
      ),
    },
  ];

  return (
    <PageContainer
      title="Transações"
      description="Acompanhe pagamentos, reembolsos e depósitos vinculados à empresa."
      rightElement={
        <Button variant="outline" onClick={() => refetch()} loading={isLoading}>
          <FiRefreshCw /> Atualizar
        </Button>
      }
    >
      <VStack align="stretch" gap={6}>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
          <MetricCard label="Total" value={metrics.total} />
          <MetricCard label="Pendentes" value={metrics.pending} tone="orange" />
          <MetricCard label="Concluídas" value={metrics.completed} tone="green" />
          <MetricCard label="Recebido" value={formatCurrency(metrics.revenue)} tone="blue" />
        </SimpleGrid>

        <ContentBlock title="Transações da empresa">
          <DataTable
            columns={columns}
            rows={transactions}
            rowKey={(transaction) => transaction.id}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            loadingMessage="Carregando transações..."
            emptyMessage="Nenhuma transação encontrada."
            errorMessage="Não foi possível carregar as transações."
          />
        </ContentBlock>
      </VStack>

      <BaseModal
        isOpen={!!activeTransactionId}
        onClose={closeDetails}
        title="Detalhes da transação"
        size="lg"
      >
        {isLoadingLinked && (
          <Center h="180px">
            <Spinner color="brand.500" />
          </Center>
        )}

        {isErrorLinked && !activeTransaction && (
          <Text color="red.500">Não foi possível carregar esta transação.</Text>
        )}

        {activeTransaction && (
          <VStack align="stretch" gap={5}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <DetailItem label="Status" value={formatTransactionStatus(activeTransaction.status)} />
              <DetailItem label="Tipo" value={formatTransactionType(activeTransaction.type)} />
              <DetailItem label="Valor" value={formatCurrency(activeTransaction.amount)} />
              <DetailItem label="Criada em" value={formatDateTime(activeTransaction.createdAt)} />
              <DetailItem
                label="Cliente"
                value={activeTransaction.customerName ?? activeTransaction.customerId}
              />
              <DetailItem
                label="Empresa"
                value={company?.name ?? (activeTransaction.companyId ? "Empresa vinculada" : "Sem empresa vinculada")}
              />
              <DetailItem
                label="Reserva"
                value={
                  activeTransaction.reservationId ? (
                    <EntityLink
                      to={detailPath(appPaths.reservas(), activeTransaction.reservationId)}
                      label={formatReservationLabel(activeTransaction)}
                      fallback={activeTransaction.reservationId}
                    />
                  ) : (
                    "Sem reserva vinculada"
                  )
                }
              />
              <DetailItem label="PIX" value={activeTransaction.pixCode ?? "Sem código PIX"} />
            </SimpleGrid>
          </VStack>
        )}
      </BaseModal>
    </PageContainer>
  );
}

const transactionStatusColors = {
  PENDING: "orange",
  COMPLETED: "green",
  FAILED: "red",
} as const;

const transactionStatusLabels = {
  PENDING: "Pendente",
  COMPLETED: "Concluída",
  FAILED: "Falhou",
} as const;

const transactionTypeLabels: Record<TransactionType, string> = {
  DEPOSIT: "Depósito",
  PAYMENT: "Pagamento",
  REFUND: "Reembolso",
  BAIL_FORFEIT: "Caução retida",
};

function formatTransactionStatus(status: keyof typeof transactionStatusLabels) {
  return transactionStatusLabels[status];
}

function formatTransactionType(type: TransactionType) {
  return transactionTypeLabels[type];
}

function formatReservationLabel(transaction: TransactionSummary) {
  if (!transaction.reservationUnitName) return transaction.reservationId;
  if (!transaction.reservationStartTime) return transaction.reservationUnitName;
  return `${transaction.reservationUnitName} · ${formatDateTime(transaction.reservationStartTime)}`;
}
