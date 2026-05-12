import { BaseModal } from "@/components/ui/BaseModal";
import { ContentBlock } from "@/components/ContentBlock";
import { PageContainer } from "@/components/PageContainer";
import { ReservationStatus, type ReservationStatus as ReservationStatusType } from "@/enums/reservation-status";
import { ReviewsService } from "@/services/reviews.service";
import { ReservationsService, type ReservationSummary } from "@/services/reservations.service";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import {
  formatReservationStatus,
  inactiveReservationStatuses,
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
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FiCheck, FiEye, FiFlag, FiRefreshCw, FiShield, FiX } from "react-icons/fi";

export default function Reservas() {
  const queryClient = useQueryClient();
  const [selectedReservation, setSelectedReservation] = useState<ReservationSummary | null>(null);

  const { data: reservations, isLoading, isError, refetch } = useQuery({
    queryKey: ["reservations", "company"],
    queryFn: ReservationsService.getCompanyReservations,
  });

  const selectedReservationId = selectedReservation?.id;

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
          <Metric label="Total" value={metrics.total} />
          <Metric label="Pendentes" value={metrics.pending} tone="orange" />
          <Metric label="Confirmadas" value={metrics.confirmed} tone="green" />
          <Metric label="Concluídas" value={metrics.completed} tone="blue" />
        </SimpleGrid>

        <ContentBlock title="Reservas da empresa">
          {isLoading && (
            <Center h="240px">
              <VStack gap={4}>
                <Spinner size="xl" color="brand.500" />
                <Text color="gray.500">Carregando reservas...</Text>
              </VStack>
            </Center>
          )}

          {isError && (
            <Center h="220px" border="2px dashed" borderColor="red.200" borderRadius="md">
              <VStack gap={3}>
                <Text color="red.500" fontWeight="semibold">
                  Não foi possível carregar as reservas.
                </Text>
                <Button size="sm" onClick={() => refetch()}>
                  Tentar novamente
                </Button>
              </VStack>
            </Center>
          )}

          {!isLoading && !isError && (!reservations || reservations.length === 0) && (
            <Center h="220px" border="2px dashed" borderColor="gray.200" borderRadius="md">
              <Text color="gray.400">Nenhuma reserva encontrada.</Text>
            </Center>
          )}

          {!isLoading && !isError && reservations && reservations.length > 0 && (
            <Box overflowX="auto" borderRadius="md" border="1px solid" borderColor="gray.100">
              <Table.Root variant="line" size="sm">
                <Table.Header bg="gray.50">
                  <Table.Row>
                    <Table.ColumnHeader>Período</Table.ColumnHeader>
                    <Table.ColumnHeader>Unidade</Table.ColumnHeader>
                    <Table.ColumnHeader>Cliente</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Caução</Table.ColumnHeader>
                    <Table.ColumnHeader>Total</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {reservations.map((reservation) => (
                    <Table.Row key={reservation.id} bg="white" _hover={{ bg: "gray.50" }}>
                      <Table.Cell>
                        <Text fontWeight="semibold" color="navy.600">
                          {formatDateTime(reservation.startTime)}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          até {formatDateTime(reservation.endTime)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.700" lineClamp={1}>
                          {reservation.unitId}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.700" lineClamp={1}>
                          {reservation.customerId}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge colorPalette={reservationStatusColors[reservation.status]} variant="subtle">
                          {formatReservationStatus(reservation.status)}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge colorPalette={reservation.bailPaid ? "green" : "gray"} variant="subtle">
                          {reservation.bailPaid ? "Paga" : "Pendente"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontWeight="semibold">{formatCurrency(reservation.totalPrice)}</Text>
                      </Table.Cell>
                      <Table.Cell textAlign="end">
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
        isOpen={!!selectedReservation}
        onClose={() => setSelectedReservation(null)}
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
              {!inactiveReservationStatuses.includes(activeReservation.status) && (
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
                <DetailItem label="Unidade" value={activeReservation.unitId} />
                <DetailItem label="Cliente" value={activeReservation.customerId} />
                <DetailItem label="Caução" value={activeReservation.bailPaid ? "Paga" : "Pendente"} />
                <DetailItem label="Reserva dividida" value={activeReservation.isSplit ? "Sim" : "Não"} />
              </SimpleGrid>

              <Box borderTop="1px solid" borderColor="gray.100" pt={4}>
                <Text fontWeight="bold" color="navy.500" mb={3}>
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

function Metric({ label, value, tone = "gray" }: { label: string; value: number; tone?: string }) {
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

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">
        {label}
      </Text>
      <Text color="navy.500" fontWeight="medium" wordBreak="break-word">
        {value}
      </Text>
    </Box>
  );
}
