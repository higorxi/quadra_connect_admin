import { ContentBlock } from "@/components/ContentBlock";
import { PageContainer } from "@/components/PageContainer";
import { UnderConstruction } from "@/components/UnderConstruction";

export default function Transacoes() {
    return (
        <PageContainer
            title="Transações"
            description="Área financeira aguardando contrato de listagem por empresa."
        >
            <ContentBlock title="Transações">
                <UnderConstruction description="O backend ainda precisa expor GET /transactions/company e relacionar transações com reserva ou empresa antes desta listagem ser liberada no admin." />
            </ContentBlock>
        </PageContainer>
    );
}
