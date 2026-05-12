import { ContentBlock } from "@/components/ContentBlock";
import { DetailItem } from "@/components/DetailItem";
import { PageContainer } from "@/components/PageContainer";
import { BaseModal } from "@/components/ui/BaseModal";
import { ReviewsService, type CompanyReviewSummary } from "@/services/reviews.service";
import { formatDateTime } from "@/utils/formatters";
import { formatReservationStatus, reservationStatusColors } from "@/utils/reservation-status";
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

export default function Reviews() {
  const [selectedReview, setSelectedReview] = useState<CompanyReviewSummary | null>(null);

  const { data: reviews, isLoading, isError, refetch } = useQuery({
    queryKey: ["reviews", "company"],
    queryFn: ReviewsService.getCompanyReviews,
  });

  const metrics = useMemo(() => {
    const items = reviews ?? [];
    const totalRating = items.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = items.length > 0 ? totalRating / items.length : 0;

    return {
      total: items.length,
      averageRating,
      highRatings: items.filter((review) => review.rating >= 8).length,
      withComment: items.filter((review) => !!review.comment).length,
    };
  }, [reviews]);

  return (
    <PageContainer
      title="Avaliações"
      description="Veja as avaliações recebidas por unidade e reserva."
      rightElement={
        <Button variant="outline" onClick={() => refetch()} loading={isLoading}>
          <FiRefreshCw /> Atualizar
        </Button>
      }
    >
      <VStack align="stretch" gap={6}>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
          <Metric label="Total" value={String(metrics.total)} />
          <Metric label="Média" value={metrics.averageRating.toFixed(1)} tone="blue" />
          <Metric label="Notas 8+" value={String(metrics.highRatings)} tone="green" />
          <Metric label="Com comentário" value={String(metrics.withComment)} tone="purple" />
        </SimpleGrid>

        <ContentBlock title="Avaliações da empresa">
          {isLoading && (
            <Center h="240px">
              <VStack gap={4}>
                <Spinner size="xl" color="brand.500" />
                <Text color="gray.500">Carregando avaliações...</Text>
              </VStack>
            </Center>
          )}

          {isError && (
            <Center h="220px" border="2px dashed" borderColor="red.200" borderRadius="md">
              <VStack gap={3}>
                <Text color="" fontWeight="semibold">
                  Não foi possível carregar as avaliações.
                </Text>
                <Button size="sm" onClick={() => refetch()}>
                  Tentar novamente
                </Button>
              </VStack>
            </Center>
          )}

          {!isLoading && !isError && (!reviews || reviews.length === 0) && (
            <Center h="220px" border="2px dashed" borderColor="gray.200" borderRadius="md">
              <Text color="gray.400">Nenhuma avaliação encontrada.</Text>
            </Center>
          )}

          {!isLoading && !isError && reviews && reviews.length > 0 && (
            <Box overflowX="auto" borderRadius="md" border="1px solid" borderColor="gray.100">
              <Table.Root variant="line" size="sm">
                <Table.Header bg="gray.50">
                  <Table.Row>
                    <Table.ColumnHeader>Data</Table.ColumnHeader>
                    <Table.ColumnHeader>Unidade</Table.ColumnHeader>
                    <Table.ColumnHeader>Período</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Nota</Table.ColumnHeader>
                    <Table.ColumnHeader>Comentário</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {reviews.map((review) => (
                    <Table.Row key={review.id} bg="white" _hover={{ bg: "gray.50" }}>
                      <Table.Cell>
                        <Text fontWeight="semibold" color="navy.600">
                          {formatDateTime(review.createdAt)}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          atualizada {formatDateTime(review.updatedAt)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.700" lineClamp={1}>
                          {review.unit.name}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.700">
                          {formatDateTime(review.reservation.startTime)}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          até {formatDateTime(review.reservation.endTime)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge colorPalette={reservationStatusColors[review.reservation.status]} variant="subtle">
                          {formatReservationStatus(review.reservation.status)}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontWeight="semibold">{review.rating}/10</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.700" lineClamp={1}>
                          {review.comment || "Sem comentário"}
                        </Text>
                      </Table.Cell>
                      <Table.Cell textAlign="end">
                        <IconButton
                          aria-label="Ver detalhes da avaliação"
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedReview(review)}
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
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        title="Detalhes da avaliação"
        size="lg"
      >
        {selectedReview && (
          <VStack align="stretch" gap={5}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <DetailItem label="Nota" value={`${selectedReview.rating}/10`} />
              <DetailItem label="Unidade" value={selectedReview.unit.name} />
              <DetailItem label="Status da reserva" value={formatReservationStatus(selectedReview.reservation.status)} />
              <DetailItem label="Criada em" value={formatDateTime(selectedReview.createdAt)} />
              <DetailItem label="Início" value={formatDateTime(selectedReview.reservation.startTime)} />
              <DetailItem label="Fim" value={formatDateTime(selectedReview.reservation.endTime)} />
              <DetailItem label="Reserva" value={selectedReview.reservationId} />
              <DetailItem label="Unidade ID" value={selectedReview.unitId} />
            </SimpleGrid>

            <Box borderTop="1px solid" borderColor="gray.100" pt={4}>
              <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase" mb={2}>
                Comentário
              </Text>
              <Text fontWeight="medium" wordBreak="break-word">
                {selectedReview.comment || "Sem comentário."}
              </Text>
            </Box>
          </VStack>
        )}
      </BaseModal>
    </PageContainer>
  );
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
