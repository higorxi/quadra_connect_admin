import { PageContainer } from "@/components/PageContainer";
import { DataCard } from "@/components/DataCard";
import { ReservationsService } from "@/services/reservations.service";
import { UnitsService } from "@/services/units.service";
import { useQuery } from "@tanstack/react-query";
import { SimpleGrid } from "@chakra-ui/react";
import { FiClock, FiDollarSign, FiStar, FiCheckCircle } from "react-icons/fi";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function Dashboard() {
  const { data: units } = useQuery({
    queryKey: ["units"],
    queryFn: UnitsService.getUnits,
  });

  const { data: reservations } = useQuery({
    queryKey: ["reservations", "company"],
    queryFn: ReservationsService.getCompanyReservations,
  });

  const pendingReservations = reservations?.filter(
    (reservation) => reservation.status === "PENDING"
  ).length ?? 0;
  const completedReservations = reservations?.filter(
    (reservation) => reservation.status === "COMPLETED"
  ) ?? [];
  const estimatedRevenue = completedReservations.reduce(
    (total, reservation) => total + Number(reservation.totalPrice),
    0
  );

  return (
    <PageContainer
      title="Gestão de Espaços"
      description="Controle de unidades, reservas e operação da empresa."
    >
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
        <DataCard
          label="Unidades"
          value={units?.length ?? 0}
          icon={FiCheckCircle}
          helpText="Cadastradas"
          color="brand.500"
        />
        <DataCard
          label="Pendentes"
          value={pendingReservations}
          icon={FiClock}
          helpText="Aguardando ação"
          color="orange.400"
        />
        <DataCard
          label="Concluídas"
          value={completedReservations.length}
          icon={FiStar}
          helpText="Reservas finalizadas"
          color="yellow.400"
        />
        <DataCard
          label="Receita"
          value={formatCurrency(estimatedRevenue)}
          icon={FiDollarSign}
          helpText="Reservas concluídas"
          color="action.500"
        />
      </SimpleGrid>
    </PageContainer>
  );
}
