import { ContentBlock } from "@/components/ContentBlock";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { DetailItem } from "@/components/DetailItem";
import { MetricCard } from "@/components/MetricCard";
import { PageContainer } from "@/components/PageContainer";
import { BaseModal } from "@/components/ui/BaseModal";
import { EntityLink } from "@/components/EntityLink";
import { detailPath } from "@/utils/detail-path";
import { appPaths } from "@/constants/app-paths";
import { ReviewsService, type CompanyReviewSummary } from "@/services/reviews.service";
import { formatDateTime } from "@/utils/formatters";
import { formatReservationStatus, reservationStatusColors } from "@/utils/reservation-status";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Box,
  Button,
  IconButton,
  SimpleGrid,
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

  const columns: DataTableColumn<CompanyReviewSummary>[] = [
    {
      key: "createdAt",
      header: "Data",
      cell: (review) => (
        <>
          <Text fontWeight="semibold" color="navy.600">
            {formatDateTime(review.createdAt)}
          </Text>
          <Text fontSize="xs" color="gray.500">
            atualizada {formatDateTime(review.updatedAt)}
          </Text>
        </>
      ),
    },
    {
      key: "unit",
      header: "Unidade",
      cell: (review) => (
        <EntityLink
          to={detailPath(appPaths.unidades(), review.unitId)}
          label={review.unit.name}
        />
      ),
    },
    {
      key: "period",
      header: "Período",
      cell: (review) => (
        <>
          <Text fontSize="sm" color="gray.700">
            {formatDateTime(review.reservation.startTime)}
          </Text>
          <Text fontSize="xs" color="gray.500">
            até {formatDateTime(review.reservation.endTime)}
          </Text>
        </>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (review) => (
        <Badge colorPalette={reservationStatusColors[review.reservation.status]} variant="subtle">
          {formatReservationStatus(review.reservation.status)}
        </Badge>
      ),
    },
    {
      key: "rating",
      header: "Nota",
      cell: (review) => <Text fontWeight="semibold">{review.rating}/10</Text>,
    },
    {
      key: "comment",
      header: "Comentário",
      cell: (review) => (
        <Text fontSize="sm" color="gray.700" lineClamp={1}>
          {review.comment || "Sem comentário"}
        </Text>
      ),
    },
    {
      key: "actions",
      header: "Ações",
      align: "end",
      cell: (review) => (
        <IconButton
          aria-label="Ver detalhes da avaliação"
          size="sm"
          variant="ghost"
          onClick={() => setSelectedReview(review)}
        >
          <FiEye />
        </IconButton>
      ),
    },
  ];

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
          <MetricCard label="Total" value={metrics.total} />
          <MetricCard label="Média" value={metrics.averageRating.toFixed(1)} tone="blue" />
          <MetricCard label="Notas 8+" value={metrics.highRatings} tone="green" />
          <MetricCard label="Com comentário" value={metrics.withComment} tone="purple" />
        </SimpleGrid>

        <ContentBlock title="Avaliações da empresa">
          <DataTable
            columns={columns}
            rows={reviews}
            rowKey={(review) => review.id}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            loadingMessage="Carregando avaliações..."
            emptyMessage="Nenhuma avaliação encontrada."
            errorMessage="Não foi possível carregar as avaliações."
          />
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
              <DetailItem
                label="Reserva"
                value={
                  <EntityLink
                    to={detailPath(appPaths.reservas(), selectedReview.reservationId)}
                    label={`Reserva de ${formatDateTime(selectedReview.reservation.startTime)}`}
                  />
                }
              />
              <DetailItem
                label="Abrir unidade"
                value={
                  <EntityLink
                    to={detailPath(appPaths.unidades(), selectedReview.unitId)}
                    label={selectedReview.unit.name}
                  />
                }
              />
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
