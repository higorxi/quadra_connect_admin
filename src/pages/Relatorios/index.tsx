import { ContentBlock } from "@/components/ContentBlock";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { PageContainer } from "@/components/PageContainer";
import { BaseModal } from "@/components/ui/BaseModal";
import { Field } from "@/components/ui/field";
import { useReports } from "@/hooks/useReports";
import { useUnits } from "@/hooks/useUnits";
import {
  ReportsService,
  type CreateReportDTO,
  type Report,
  type ReportModule,
  type ReportStatus,
} from "@/services/reports.service";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import {
  Badge,
  Box,
  Button,
  Center,
  HStack,
  IconButton,
  Input,
  NativeSelect,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FiDownload, FiEye, FiPlus, FiRefreshCw } from "react-icons/fi";

const moduleLabels: Record<ReportModule, string> = {
  RESERVATIONS: "Reservas",
  TRANSACTIONS: "Transações",
  REVIEWS: "Avaliações",
  UNITS: "Unidades",
};

const statusLabels: Record<ReportStatus, string> = {
  PENDING: "Na fila",
  PROCESSING: "Processando",
  COMPLETED: "Concluído",
  FAILED: "Falhou",
};

const statusColors: Record<ReportStatus, string> = {
  PENDING: "gray",
  PROCESSING: "blue",
  COMPLETED: "green",
  FAILED: "red",
};

const fieldLabels: Record<string, string> = {
  total: "Total",
  receita: "Receita",
  ticketMedio: "Ticket médio",
  valorTotal: "Valor total",
  valorConcluido: "Valor concluído",
  notaMedia: "Nota média",
  reservas: "Reservas",
  unidade: "Unidade",
  categoria: "Categoria",
  cidade: "Cidade",
  precoHora: "Preço/hora",
  cliente: "Cliente",
  inicio: "Início",
  fim: "Fim",
  status: "Status",
  tipo: "Tipo",
  valor: "Valor",
  reserva: "Reserva",
  nota: "Nota",
  comentario: "Comentário",
  criadaEm: "Criada em",
};

const moneyFields = new Set([
  "receita",
  "ticketMedio",
  "valorTotal",
  "valorConcluido",
  "precoHora",
  "valor",
]);

const reservationStatusOptions = [
  ["PENDING", "Pendente"],
  ["CONFIRMED", "Confirmada"],
  ["REJECTED", "Recusada"],
  ["CANCELLED", "Cancelada"],
  ["COMPLETED", "Concluída"],
];

const transactionStatusOptions = [
  ["PENDING", "Pendente"],
  ["COMPLETED", "Concluída"],
  ["FAILED", "Falhou"],
];

const transactionTypeOptions = [
  ["DEPOSIT", "Depósito"],
  ["PAYMENT", "Pagamento"],
  ["REFUND", "Reembolso"],
  ["BAIL_FORFEIT", "Caução retida"],
];

const valueLabels: Record<string, string> = {
  ...Object.fromEntries(reservationStatusOptions),
  ...Object.fromEntries(transactionStatusOptions),
  ...Object.fromEntries(transactionTypeOptions),
};

const emptyForm: CreateReportDTO = { module: "RESERVATIONS" };

export default function Relatorios() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    page,
    setPage,
    module,
    setModule,
    status,
    setStatus,
    createMutation,
  } = useReports();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState<CreateReportDTO>(emptyForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { units } = useUnits();
  const totalPages = data?.totalPages ?? 1;

  const { data: selectedReport, isLoading: isLoadingSelected } = useQuery({
    queryKey: ["reports", selectedId],
    queryFn: () => ReportsService.getReport(selectedId!),
    enabled: !!selectedId,
    refetchInterval: (query) =>
      query.state.data?.status === "PENDING" || query.state.data?.status === "PROCESSING"
        ? 3000
        : false,
    refetchIntervalInBackground: true,
  });

  const submitReport = () => {
    createMutation.mutate(
      {
        ...form,
        startDate: form.startDate ? new Date(`${form.startDate}T00:00:00`).toISOString() : undefined,
        endDate: form.endDate ? new Date(`${form.endDate}T23:59:59`).toISOString() : undefined,
        minRating: form.minRating ? Number(form.minRating) : undefined,
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          setForm(emptyForm);
        },
      }
    );
  };

  const columns: DataTableColumn<Report>[] = [
    {
      key: "createdAt",
      header: "Criado em",
      cell: (report) => (
        <Text fontWeight="semibold" color="navy.600">
          {formatDateTime(report.createdAt)}
        </Text>
      ),
    },
    {
      key: "module",
      header: "Módulo",
      cell: (report) => moduleLabels[report.module],
    },
    {
      key: "period",
      header: "Período",
      cell: (report) => (
        <Text fontSize="sm" color="gray.700">
          {formatPeriod(report.startDate, report.endDate)}
        </Text>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (report) => (
        <Badge colorPalette={statusColors[report.status]} variant="subtle">
          {statusLabels[report.status]}
        </Badge>
      ),
    },
    {
      key: "rowCount",
      header: "Registros",
      cell: (report) => report.rowCount ?? "-",
    },
    {
      key: "actions",
      header: "Ações",
      align: "end",
      cell: (report) => (
        <IconButton
          aria-label="Ver relatório"
          size="sm"
          variant="ghost"
          disabled={report.status !== "COMPLETED" && report.status !== "FAILED"}
          onClick={() => setSelectedId(report.id)}
        >
          <FiEye />
        </IconButton>
      ),
    },
  ];

  return (
    <PageContainer
      title="Relatórios"
      description="Gere relatórios por módulo e período. O processamento é assíncrono."
      rightElement={
        <HStack>
          <Button variant="outline" onClick={() => refetch()} loading={isFetching}>
            <FiRefreshCw /> Atualizar
          </Button>
          <Button colorPalette="brand" onClick={() => setIsCreateOpen(true)}>
            <FiPlus /> Novo relatório
          </Button>
        </HStack>
      }
    >
      <ContentBlock title="Relatórios gerados">
        <VStack align="stretch" gap={4}>
          <HStack gap={3} flexWrap="wrap">
            <NativeSelect.Root size="sm" maxW="220px">
              <NativeSelect.Field
                placeholder="Todos os módulos"
                value={module ?? ""}
                onChange={(event) => {
                  setModule((event.currentTarget.value || undefined) as ReportModule | undefined);
                  setPage(1);
                }}
              >
                {Object.entries(moduleLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>

            <NativeSelect.Root size="sm" maxW="220px">
              <NativeSelect.Field
                placeholder="Todos os status"
                value={status ?? ""}
                onChange={(event) => {
                  setStatus((event.currentTarget.value || undefined) as ReportStatus | undefined);
                  setPage(1);
                }}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </HStack>

          <DataTable
            columns={columns}
            rows={data?.data}
            rowKey={(report) => report.id}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            loadingMessage="Carregando relatórios..."
            emptyMessage="Nenhum relatório gerado ainda."
            errorMessage="Não foi possível carregar os relatórios."
            pagination={{
              page,
              totalPages,
              total: data?.total ?? 0,
              onPageChange: setPage,
            }}
          />
        </VStack>
      </ContentBlock>

      <BaseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Novo relatório"
        size="lg"
        footer={
          <HStack>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button
              colorPalette="brand"
              loading={createMutation.isPending}
              onClick={submitReport}
            >
              Gerar relatório
            </Button>
          </HStack>
        }
      >
        <VStack align="stretch" gap={4}>
          <Field label="Módulo" required>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={form.module}
                onChange={(event) =>
                  setForm({ module: event.currentTarget.value as ReportModule })
                }
              >
                {Object.entries(moduleLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Field label="Data inicial">
              <Input
                type="date"
                value={form.startDate ?? ""}
                onChange={(event) =>
                  setForm({ ...form, startDate: event.currentTarget.value || undefined })
                }
              />
            </Field>
            <Field label="Data final">
              <Input
                type="date"
                value={form.endDate ?? ""}
                onChange={(event) =>
                  setForm({ ...form, endDate: event.currentTarget.value || undefined })
                }
              />
            </Field>
          </SimpleGrid>

          {(form.module === "RESERVATIONS" || form.module === "REVIEWS") && (
            <Field label="Unidade">
              <NativeSelect.Root>
                <NativeSelect.Field
                  placeholder="Todas as unidades"
                  value={form.unitId ?? ""}
                  onChange={(event) =>
                    setForm({ ...form, unitId: event.currentTarget.value || undefined })
                  }
                >
                  {(units ?? []).map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field>
          )}

          {form.module === "RESERVATIONS" && (
            <Field label="Status da reserva">
              <NativeSelect.Root>
                <NativeSelect.Field
                  placeholder="Todos os status"
                  value={form.reservationStatus ?? ""}
                  onChange={(event) =>
                    setForm({ ...form, reservationStatus: event.currentTarget.value || undefined })
                  }
                >
                  {reservationStatusOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field>
          )}

          {form.module === "TRANSACTIONS" && (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Field label="Status da transação">
                <NativeSelect.Root>
                  <NativeSelect.Field
                    placeholder="Todos os status"
                    value={form.transactionStatus ?? ""}
                    onChange={(event) =>
                      setForm({ ...form, transactionStatus: event.currentTarget.value || undefined })
                    }
                  >
                    {transactionStatusOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field>
              <Field label="Tipo da transação">
                <NativeSelect.Root>
                  <NativeSelect.Field
                    placeholder="Todos os tipos"
                    value={form.transactionType ?? ""}
                    onChange={(event) =>
                      setForm({ ...form, transactionType: event.currentTarget.value || undefined })
                    }
                  >
                    {transactionTypeOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field>
            </SimpleGrid>
          )}

          {form.module === "REVIEWS" && (
            <Field label="Nota mínima">
              <Input
                type="number"
                min={0}
                max={10}
                value={form.minRating ?? ""}
                onChange={(event) =>
                  setForm({
                    ...form,
                    minRating: event.currentTarget.value ? Number(event.currentTarget.value) : undefined,
                  })
                }
              />
            </Field>
          )}

          {createMutation.isError && (
            <Text color="red.500" fontSize="sm">
              Não foi possível criar o relatório. Revise os filtros e tente novamente.
            </Text>
          )}
        </VStack>
      </BaseModal>

      <BaseModal
        isOpen={!!selectedId}
        onClose={() => setSelectedId(null)}
        title="Resultado do relatório"
        size="xl"
        footer={
          selectedReport?.result ? (
            <Button variant="outline" onClick={() => downloadCsv(selectedReport.id, selectedReport.result!)}>
              <FiDownload /> Baixar CSV
            </Button>
          ) : undefined
        }
      >
        {isLoadingSelected && (
          <Center h="160px">
            <Spinner color="brand.500" />
          </Center>
        )}

        {selectedReport?.status === "FAILED" && (
          <Text color="red.500">{selectedReport.error ?? "Falha ao gerar o relatório."}</Text>
        )}

        {selectedReport?.result && (
          <VStack align="stretch" gap={5}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              {Object.entries(selectedReport.result.summary).map(([label, value]) => (
                <Box key={label} bg="gray.50" borderRadius="lg" p={4}>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="bold">
                    {fieldLabels[label] ?? label}
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color="navy.600">
                    {formatCellValue(label, value)}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>

            {selectedReport.result.truncated && (
              <Text fontSize="sm" color="orange.500">
                Exibindo apenas os primeiros registros do período.
              </Text>
            )}

            <DataTable
              columns={selectedReport.result.columns.map((column) => ({
                key: column,
                header: fieldLabels[column] ?? column,
                cell: (row: Record<string, string | number | null>) =>
                  formatCellValue(column, row[column]),
              }))}
              rows={selectedReport.result.rows}
              rowKey={(row) => String(row.id ?? JSON.stringify(row))}
              emptyMessage="O relatório não retornou registros."
            />
          </VStack>
        )}
      </BaseModal>
    </PageContainer>
  );
}

function formatCellValue(field: string, value: string | number | null) {
  if (value === null || value === "") return "-";
  if (moneyFields.has(field)) return formatCurrency(value);
  if (typeof value === "string" && valueLabels[value]) return valueLabels[value];
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return formatDateTime(value);
  }
  return value;
}

function formatPeriod(startDate: string | null, endDate: string | null) {
  if (!startDate && !endDate) return "Todo o período";
  const start = startDate ? new Date(startDate).toLocaleDateString("pt-BR") : "início";
  const end = endDate ? new Date(endDate).toLocaleDateString("pt-BR") : "hoje";
  return `${start} → ${end}`;
}

function downloadCsv(reportId: string, result: { columns: string[]; rows: Record<string, string | number | null>[] }) {
  const escape = (value: string | number | null) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [
    result.columns.map((column) => fieldLabels[column] ?? column).join(","),
    ...result.rows.map((row) => result.columns.map((column) => escape(row[column])).join(",")),
  ].join("\n");

  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio-${reportId}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
