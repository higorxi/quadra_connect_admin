import { PageContainer } from "@/components/PageContainer";
import { DataCard } from "@/components/DataCard";
import { SimpleGrid } from "@chakra-ui/react";
import { FiClock, FiDollarSign, FiStar, FiCheckCircle } from "react-icons/fi";


export function Dashboard() {
  return (
    <PageContainer title="Gestão de Espaços" description="Controle de unidades de uso único e disponibilidade.">
  
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
        <DataCard label="Unidades" value="12" icon={FiCheckCircle} helpText="8 em uso" color="brand.500" />
        <DataCard label="Pendentes" value="07" icon={FiClock} helpText="Aguardando" color="orange.400" />
        <DataCard label="Avaliação" value="4.9" icon={FiStar} helpText="Excelente" color="yellow.400" />
        <DataCard label="Receita" value="R$ 8.9k" icon={FiDollarSign} helpText="+15% mês" color="action.500" />
      </SimpleGrid>
    </PageContainer>
  );
}