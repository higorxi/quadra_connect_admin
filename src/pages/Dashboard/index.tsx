import { PageContainer } from "@/components/PageContainer";
import { DataCard } from "@/components/DataCard";
import { ContentBlock } from "@/components/ContentBlock";
import { useCompanyStatistics } from "@/hooks/useCompanyStatistics";
import { Box, Flex, Heading, Icon, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react";
import { FiActivity, FiCalendar, FiClock, FiDollarSign, FiHome, FiStar } from "react-icons/fi";

const statusLabels: Record<string, string> = {
  PENDING: "Pendentes",
  CONFIRMED: "Confirmadas",
  CANCELLED: "Canceladas",
  CANCELED: "Canceladas",
  COMPLETED: "Concluidas",
  FINISHED: "Finalizadas",
  REJECTED: "Recusadas",
};

function formatCurrency(value?: string) {
  const numericValue = Number(value);

  if (!value || Number.isNaN(numericValue)) {
    return value || "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
}

function formatStatus(status: string) {
  return statusLabels[status] || status.replaceAll("_", " ").toLowerCase();
}

function getStatusTotal(statisticsStatus: Record<string, number> | undefined, status: string) {
  return statisticsStatus?.[status] || 0;
}

export function Dashboard() {
  const { statistics, isLoading, isError } = useCompanyStatistics();
  const byStatus = statistics?.reservations.byStatus || {};
  const topReservationCount = Math.max(
    ...((statistics?.topUnitsByReservations || []).map((unit) => unit.reservationsCount)),
    1
  );

  return (
    <PageContainer
      title={statistics?.companyName || "Gestão de Espaços"}
      description="Acompanhe unidades, reservas, receita e avaliações da empresa."
    >
      {isError && (
        <Box bg="red.50" color="red.700" p={4} borderRadius="md" mb={6} fontWeight="medium">
          Nao foi possivel carregar as estatisticas da empresa.
        </Box>
      )}

      {isLoading && (
        <Flex align="center" gap={3} color="gray.500" mb={6}>
          <Spinner size="sm" />
          <Text>Carregando estatisticas...</Text>
        </Flex>
      )}

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
        <DataCard
          label="Unidades"
          value={statistics?.units.total ?? "-"}
          icon={FiHome}
          helpText="Total cadastradas"
          color="brand.500"
        />
        <DataCard
          label="Reservas"
          value={statistics?.reservations.total ?? "-"}
          icon={FiCalendar}
          helpText={`${statistics?.reservations.upcoming ?? 0} proximas`}
          color="action.500"
        />
        <DataCard
          label="Avaliação"
          value={statistics?.reviews.averageRating?.toFixed(1) ?? "-"}
          icon={FiStar}
          helpText={`${statistics?.reviews.total ?? 0} reviews`}
          color="yellow.400"
        />
        <DataCard
          label="Receita"
          value={formatCurrency(statistics?.revenue.estimated)}
          icon={FiDollarSign}
          helpText="Estimativa total"
          color="green.500"
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} mt={6}>
        <ContentBlock title="Reservas por status" badge={`${statistics?.reservations.upcoming ?? 0} futuras`}>
          <VStack align="stretch" gap={4}>
            {Object.entries(byStatus).length === 0 && (
              <Text color="gray.400" fontSize="sm">Nenhuma reserva encontrada.</Text>
            )}

            {Object.entries(byStatus).map(([status, count]) => {
              const percent = statistics?.reservations.total
                ? Math.round((count / statistics.reservations.total) * 100)
                : 0;

              return (
                <Box key={status}>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Flex align="center" gap={2}>
                      <Icon as={status === "PENDING" ? FiClock : FiActivity} color="gray.500" />
                      <Text color="navy.500" fontWeight="bold" textTransform="capitalize">
                        {formatStatus(status)}
                      </Text>
                    </Flex>
                    <Text color="gray.500" fontSize="sm" fontWeight="semibold">
                      {count} ({percent}%)
                    </Text>
                  </Flex>
                  <Box h="8px" bg="gray.100" borderRadius="full" overflow="hidden">
                    <Box h="full" w={`${percent}%`} bg="brand.500" borderRadius="full" />
                  </Box>
                </Box>
              );
            })}
          </VStack>
        </ContentBlock>

        <ContentBlock title="Top unidades por reservas" badge={`${statistics?.topUnitsByReservations.length ?? 0} unidades`}>
          <VStack align="stretch" gap={4}>
            {(statistics?.topUnitsByReservations.length ?? 0) === 0 && (
              <Text color="gray.400" fontSize="sm">Nenhuma unidade ranqueada ainda.</Text>
            )}

            {statistics?.topUnitsByReservations.map((unit, index) => {
              const percent = Math.round((unit.reservationsCount / topReservationCount) * 100);

              return (
                <Flex key={unit.unitId} gap={3} align="center">
                  <Flex
                    align="center"
                    justify="center"
                    bg="brand.50"
                    color="brand.600"
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight="bold"
                    minW="36px"
                    h="36px"
                  >
                    {index + 1}
                  </Flex>
                  <Box flex={1}>
                    <Flex justify="space-between" gap={3} mb={2}>
                      <Heading size="sm" color="navy.500">{unit.name}</Heading>
                      <Text color="gray.500" fontSize="sm" fontWeight="semibold">
                        {unit.reservationsCount}
                      </Text>
                    </Flex>
                    <Box h="8px" bg="gray.100" borderRadius="full" overflow="hidden">
                      <Box h="full" w={`${percent}%`} bg="action.500" borderRadius="full" />
                    </Box>
                  </Box>
                </Flex>
              );
            })}
          </VStack>
        </ContentBlock>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mt={6}>
        <DataCard
          label="Pendentes"
          value={getStatusTotal(byStatus, "PENDING")}
          icon={FiClock}
          helpText="Aguardando acao"
          color="orange.400"
        />
        <DataCard
          label="Confirmadas"
          value={getStatusTotal(byStatus, "CONFIRMED")}
          icon={FiActivity}
          helpText="Reservas aprovadas"
          color="brand.500"
        />
        <DataCard
          label="Finalizadas"
          value={getStatusTotal(byStatus, "COMPLETED") || getStatusTotal(byStatus, "FINISHED")}
          icon={FiCalendar}
          helpText="Reservas concluidas"
          color="purple.400"
        />
      </SimpleGrid>
    </PageContainer>
  );
}
