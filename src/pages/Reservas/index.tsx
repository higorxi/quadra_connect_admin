import { BaseModal } from "@/components/ui/BaseModal";
import { EntityLink } from "@/components/EntityLink";
import { detailPath } from "@/utils/detail-path";
import { appPaths } from "@/constants/app-paths";
import { ContentBlock } from "@/components/ContentBlock";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { DetailItem } from "@/components/DetailItem";
import { MetricCard } from "@/components/MetricCard";
import { PageContainer } from "@/components/PageContainer";
import { ReservationStatus, type ReservationStatus as ReservationStatusType } from "@/enums/reservation-status";
import { ReviewsService } from "@/services/reviews.service";
import { ReservationsService, type ReservationSummary } from "@/services/reservations.service";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import {
  formatReservationStatus,
  isInactiveReservationStatus,
  reservationStatusColors,
} from "@/utils/reservation-status";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Group,
  HStack,
  IconButton,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiCheck, FiEye, FiFlag, FiRefreshCw, FiShield, FiX } from "react-icons/fi";

export default function Reservas() {
  const queryClient = useQueryClient();
  const [selectedReservation, setSelectedReservation] = useState<ReservationSummary | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: reservations, isLoading, isError, refetch } = useQuery({
    queryKey: ["reservations", "company"],
    queryFn: ReservationsService.getCompanyReservations,
  });

  const selectedReservationId = selectedReservation?.id ?? searchParams.get("detalhe") ?? undefined;

  const closeDetails = () => {
    setSelectedReservation(null);
    if (searchParams.has("detalhe")) {
      searchParams.delete("detalhe");
      setSearchParams(searchParams, { replace: true });
    }
  };

  const { data: reservationDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["reservations", selectedReservationId],
    queryFn: () => ReservationsService.getReservation(selectedReservationId as string),
    enabled: !!selectedReservationId,
  });

  const { data: review, isLoading: isLoadingReview } = useQuery({
    queryKey: ["reviews", "reservation", selectedReservationId],
    queryFn: () => ReviewsService.getReservationReview(selectedReservationId as string),
    enabled: !!selectedReservationId,
  });

  const updateReservationMutation = useMutation({
    mutationFn: ({
      id,
      status,
      bailPaid,
    }: {
      id: string;
      status?: ReservationStatusType;
      bailPaid?: boolean;
    }) => ReservationsService.updateReservation(id, { status, bailPaid }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservations", "company"] });
      queryClient.invalidateQueries({ queryKey: ["reservations", variables.id] });
    },
    onError: () => {
      alert("Não foi possível atualizar a reserva.");
    },
  });

  const metrics = useMemo(() => {
    const items = reservations ?? [];
    return {
      total: items.length,
      pending: items.filter((reservation) => reservation.status === ReservationStatus.PENDING).length,
      confirmed: items.filter((reservation) => reservation.status === ReservationStatus.CONFIRMED).length,
      completed: items.filter((reservation) => reservation.status === ReservationStatus.COMPLETED).length,
    };
  }, [reservations]);

  const activeReservation = reservationDetails ?? selectedReservation;
  const isUpdating = updateReservationMutation.isPending;

  function updateReservation(
    reservation: ReservationSummary,
    data: { status?: ReservationStatusType; bailPaid?: boolean }
  ) {
    updateReservationMutation.mutate({ id: reservation.id, ...data });
  }

  const columns: DataTableColumn<ReservationSummary>[] = [
    {
      key: "period",
      header: "Período",
      cell: (reservation) => (
        <>
          <Text fontWeight="semibold" color="navy.600">
            {formatDateTime(reservation.startTime)}
          </Text>
          <Text fontSize="xs" color="gray.500">
            até {formatDateTime(reservation.endTime)}
          </Text>
        </>
      ),
    },
    {
      key: "unitId",
      header: "Unidade",
      cell: (reservation) => (
        <EntityLink
          to={detailPath(appPaths.unidades(), reservation.unitId)}
          label={reservation.unitName}
          fallback={reservation.unitId}
        />
      ),
    },
    {
      key: "customerId",
      header: "Cliente",
      cell: (reservation) => (
        <Text fontSize="sm" color="gray.700" lineClamp={1}>
          {reservation.customerName ?? reservation.customerId}
        </Text>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (reservation) => (
        <Badge colorPalette={reservationStatusColors[reservation.status]} variant="subtle">
          {formatReservationStatus(reservation.status)}
        </Badge>
      ),
    },
    {
      key: "bailPaid",
      header: "Caução",
      cell: (reservation) => (
        <Badge colorPalette={reservation.bailPaid ? "green" : "gray"} variant="subtle">
          {reservation.bailPaid ? "Paga" : "Pendente"}
        </Badge>
      ),
    },
    {
      key: "totalPrice",
      header: "Total",
      cell: (reservation) => <Text fontWeight="semibold">{formatCurrency(reservation.totalPrice)}</Text>,
    },
    {
      key: "actions",
      header: "Ações",
      align: "end",
      cell: (reservation) => (
        <Group gap={2} justifyContent="flex-end">
          {reservation.status === ReservationStatus.PENDING && (
            <>
              <IconButton
                aria-label="Confirmar reserva"
                size="sm"
                colorPalette="green"
                variant="ghost"
                loading={isUpdating}
                onClick={() => updateReservation(reservation, { status: ReservationStatus.CONFIRMED })}
              >
                <FiCheck />
              </IconButton>
              <IconButton
                aria-label="Rejeitar reserva"
                size="sm"
                colorPalette="red"
                variant="ghost"
                loading={isUpdating}
                onClick={() => updateReservation(reservation, { status: ReservationStatus.REJECTED })}
              >
                <FiX />
              </IconButton>
            </>
          )}
          {!reservation.bailPaid && (
            <IconButton
              aria-label="Marcar caução como paga"
              size="sm"
              colorPalette="blue"
              variant="ghost"
              loading={isUpdating}
              onClick={() => updateReservation(reservation, { bailPaid: true })}
            >
              <FiShield />
            </IconButton>
          )}
          <IconButton
            aria-label="Ver detalhes da reserva"
            size="sm"
            variant="ghost"
            onClick={() => setSelectedReservation(reservation)}
          >
            <FiEye />
          </IconButton>
        </Group>
      ),
    },
  ];

  return (
    <PageContainer
      title="Gestão de Reservas"
      description="Acompanhe reservas da empresa, confirme solicitações e registre caução."
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
          <MetricCard label="Confirmadas" value={metrics.confirmed} tone="green" />
          <MetricCard label="Concluídas" value={metrics.completed} tone="blue" />
        </SimpleGrid>

        <ContentBlock title="Reservas da empresa">
          <DataTable
            columns={columns}
            rows={reservations}
            rowKey={(reservation) => reservation.id}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            loadingMessage="Carregando reservas..."
            emptyMessage="Nenhuma reserva encontrada."
            errorMessage="Não foi possível carregar as reservas."
          />
        </ContentBlock>
      </VStack>

      <BaseModal
        isOpen={!!selectedReservationId}
        onClose={closeDetails}
        title="Detalhes da reserva"
        size="lg"
        footer={
          activeReservation && (
            <HStack gap={3} justify="flex-end" w="full">
              {activeReservation.status === ReservationStatus.CONFIRMED && (
                <Button
                  colorPalette="blue"
                  loading={isUpdating}
                  onClick={() => updateReservation(activeReservation, { status: ReservationStatus.COMPLETED })}
                >
                  <FiFlag /> Concluir
                </Button>
              )}
              {!isInactiveReservationStatus(activeReservation.status) && (
                <Button
                  colorPalette="red"
                  variant="outline"
                  loading={isUpdating}
                  onClick={() => updateReservation(activeReservation, { status: ReservationStatus.CANCELLED })}
                >
                  <FiX /> Cancelar
                </Button>
              )}
            </HStack>
          )
        }
      >
        {isLoadingDetails ? (
          <Center h="180px">
            <Spinner color="brand.500" />
          </Center>
        ) : (
          activeReservation && (
            <VStack align="stretch" gap={5}>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <DetailItem label="Status" value={formatReservationStatus(activeReservation.status)} />
                <DetailItem label="Total" value={formatCurrency(activeReservation.totalPrice)} />
                <DetailItem label="Início" value={formatDateTime(activeReservation.startTime)} />
                <DetailItem label="Fim" value={formatDateTime(activeReservation.endTime)} />
                <DetailItem
                  label="Unidade"
                  value={
                    <EntityLink
                      to={detailPath(appPaths.unidades(), activeReservation.unitId)}
                      label={activeReservation.unitName}
                      fallback={activeReservation.unitId}
                    />
                  }
                />
                <DetailItem
                  label="Cliente"
                  value={activeReservation.customerName ?? activeReservation.customerId}
                />
                <DetailItem label="Caução" value={activeReservation.bailPaid ? "Paga" : "Pendente"} />
                <DetailItem label="Reserva dividida" value={activeReservation.isSplit ? "Sim" : "Não"} />
              </SimpleGrid>

              <Box borderTop="1px solid" borderColor="gray.100" pt={4}>
                <Text fontWeight="bold" mb={3}>
                  Avaliação do cliente
                </Text>
                {isLoadingReview && <Text color="gray.500">Buscando avaliação...</Text>}
                {!isLoadingReview && !review && (
                  <Text color="gray.500">Esta reserva ainda não foi avaliada.</Text>
                )}
                {!isLoadingReview && review && (
                  <Box bg="gray.50" borderRadius="md" p={4}>
                    <Flex justify="space-between" gap={4} mb={2}>
                      <Text fontWeight="bold" color="navy.500">
                        Nota {review.rating}/10
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {formatDateTime(review.createdAt)}
                      </Text>
                    </Flex>
                    <Text color="gray.600">{review.comment || "Sem comentário."}</Text>
                  </Box>
                )}
              </Box>
            </VStack>
          )
        )}
      </BaseModal>
    </PageContainer>
  );
}
