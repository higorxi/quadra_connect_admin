import { ContentBlock } from "@/components/ContentBlock"
import { PageContainer } from "@/components/PageContainer"
import { SimpleGrid, Text } from "@chakra-ui/react"

export default function Reservas() {
    return (
        <PageContainer title="Gestão de Reservas" description="Visualize e gerencie todas as suas reservas.">
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                <ContentBlock title="Lista de Reservas">
                    <Text color="gray.400" fontSize="sm">Tabela de reservas em desenvolvimento...</Text>
                </ContentBlock>
            </SimpleGrid>
        </PageContainer>
    );
}