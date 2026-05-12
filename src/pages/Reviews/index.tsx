import { ContentBlock } from "@/components/ContentBlock";
import { PageContainer } from "@/components/PageContainer";
import { UnderConstruction } from "@/components/UnderConstruction";

export default function Reviews() {
    return (
        <PageContainer
            title="Avaliações"
            description="Avaliações aparecem nos detalhes da reserva enquanto a listagem geral não existe."
        >
            <ContentBlock title="Avaliações">
                <UnderConstruction description="Hoje existe apenas GET /reviews/reservation/:reservationId. Para esta tela dedicada, falta o endpoint de listagem da empresa, como GET /reviews/company." />
            </ContentBlock>
        </PageContainer>
    );
}
