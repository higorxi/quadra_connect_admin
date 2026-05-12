import { ContentBlock } from "@/components/ContentBlock";
import { PageContainer } from "@/components/PageContainer";
import { UnderConstruction } from "@/components/UnderConstruction";

export default function Relatorios() {
    return (
        <PageContainer
            title="Relatórios"
            description="Indicadores consolidados dependem dos endpoints de filtros e financeiro."
        >
            <ContentBlock title="Relatórios">
                <UnderConstruction description="Esta área ficará em construção até existirem filtros/paginação de reservas e listagem financeira por empresa para consolidar receitas e desempenho." />
            </ContentBlock>
        </PageContainer>
    );
}
