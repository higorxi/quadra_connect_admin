import { ContentBlock } from "@/components/ContentBlock";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";

export default function Transacoes() {
    return (
        <PageContainer
            title="Transações"
            rightElement={
                <Button>
                    <FiEdit />
                </Button>
            }
        >
            <ContentBlock title="Transações">
                <h1>Transações</h1>
            </ContentBlock>
        </PageContainer>
    );
}