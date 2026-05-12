import { ContentBlock } from "@/components/ContentBlock";
import { DetailItem } from "@/components/DetailItem";
import { PageContainer } from "@/components/PageContainer";
import { BaseModal } from "@/components/ui/BaseModal";
import { TransactionsService, type TransactionSummary, type TransactionType } from "@/services/transactions.service";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Box,
  Button,
  Center,
  IconButton,
  SimpleGrid,
  Spinner,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FiEye, FiRefreshCw } from "react-icons/fi";

export default function Transacoes() {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionSummary | null>(null);

  const { data: transactions, isLoading, isError, refetch } = useQuery({
    queryKey: ["transactions", "company"],
    queryFn: TransactionsService.getCompanyTransactions,
  });

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
          <Metric label="Total" value={String(metrics.total)} />
          <Metric label="Pendentes" value={String(metrics.pending)} tone="orange" />
          <Metric label="Concluídas" value={String(metrics.completed)} tone="green" />
          <Metric label="Recebido" value={formatCurrency(metrics.revenue)} tone="blue" />
        </SimpleGrid>

        <ContentBlock title="Transações da empresa">
          {isLoading && (
            <Center h="240px">
              <VStack gap={4}>
                <Spinner size="xl" color="brand.500" />
                <Text color="gray.500">Carregando transações...</Text>
              </VStack>
            </Center>
          )}

          {isError && (
            <Center h="220px" border="2px dashed" borderColor="red.200" borderRadius="md">
              <VStack gap={3}>
                <Text color="red.500" fontWeight="semibold">
                  Não foi possível carregar as transações.
                </Text>
                <Button size="sm" onClick={() => refetch()}>
                  Tentar novamente
                </Button>
              </VStack>
            </Center>
          )}

          {!isLoading && !isError && (!transactions || transactions.length === 0) && (
            <Center h="220px" border="2px dashed" borderColor="gray.200" borderRadius="md">
              <Text color="gray.400">Nenhuma transação encontrada.</Text>
            </Center>
          )}

          {!isLoading && !isError && transactions && transactions.length > 0 && (
            <Box overflowX="auto" borderRadius="md" border="1px solid" borderColor="gray.100">
              <Table.Root variant="line" size="sm">
                <Table.Header bg="gray.50">
                  <Table.Row>
                    <Table.ColumnHeader>Data</Table.ColumnHeader>
                    <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Reserva</Table.ColumnHeader>
                    <Table.ColumnHeader>Cliente</Table.ColumnHeader>
                    <Table.ColumnHeader>Valor</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {transactions.map((transaction) => (
                    <Table.Row key={transaction.id} bg="white" _hover={{ bg: "gray.50" }}>
                      <Table.Cell>
                        <Text fontWeight="semibold" color="navy.600">
                          {formatDateTime(transaction.createdAt)}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          atualizada {formatDateTime(transaction.updatedAt)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.700">
                          {formatTransactionType(transaction.type)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge colorPalette={transactionStatusColors[transaction.status]} variant="subtle">
                          {formatTransactionStatus(transaction.status)}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.700" lineClamp={1}>
                          {transaction.reservationId ?? "Sem reserva"}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.700" lineClamp={1}>
                          {transaction.customerId}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontWeight="semibold">{formatCurrency(transaction.amount)}</Text>
                      </Table.Cell>
                      <Table.Cell textAlign="end">
                        <IconButton
                          aria-label="Ver detalhes da transação"
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <FiEye />
                        </IconButton>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          )}
        </ContentBlock>
      </VStack>

      <BaseModal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title="Detalhes da transação"
        size="lg"
      >
        {selectedTransaction && (
          <VStack align="stretch" gap={5}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <DetailItem label="Status" value={formatTransactionStatus(selectedTransaction.status)} />
              <DetailItem label="Tipo" value={formatTransactionType(selectedTransaction.type)} />
              <DetailItem label="Valor" value={formatCurrency(selectedTransaction.amount)} />
              <DetailItem label="Criada em" value={formatDateTime(selectedTransaction.createdAt)} />
              <DetailItem label="Cliente" value={selectedTransaction.customerId} />
              <DetailItem label="Empresa" value={selectedTransaction.companyId ?? "Sem empresa vinculada"} />
              <DetailItem label="Reserva" value={selectedTransaction.reservationId ?? "Sem reserva vinculada"} />
              <DetailItem label="PIX" value={selectedTransaction.pixCode ?? "Sem código PIX"} />
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

function Metric({ label, value, tone = "gray" }: { label: string; value: string; tone?: string }) {
  return (
    <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.100" p={5}>
      <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">
        {label}
      </Text>
      <Text fontSize="2xl" color={`${tone}.500`} fontWeight="bold">
        {value}
      </Text>
    </Box>
  );
}
