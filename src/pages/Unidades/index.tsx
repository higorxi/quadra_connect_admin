import { ContentBlock } from "@/components/ContentBlock";
import { PageContainer } from "@/components/PageContainer";
import { Button, SimpleGrid, Text, Box } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";


export default function Unidades() {
  return (
    <PageContainer 
      title="Gestão de Unidades" 
      description="Visualize e gerencie todas as suas quadras e espaços."
      rightElement={
        <Button gap={2}>
          <FiPlus /> Nova Unidade
        </Button>
      }
    >
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        <ContentBlock title="Lista de Quadras">
           <Text color="gray.400" fontSize="sm">Tabela de unidades em desenvolvimento...</Text>
        </ContentBlock>
        
        <ContentBlock title="Localização Geográfica">
           <Box h="300px" bg="gray.100" borderRadius="md" display="flex" justifyContent="center" alignItems="center">
              <Text color="gray.400">Mapa de Unidades</Text>
           </Box>
        </ContentBlock>
      </SimpleGrid>
    </PageContainer>
  );
}