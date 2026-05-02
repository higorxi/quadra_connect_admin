import { ContentBlock } from "@/components/ContentBlock";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";

export default function Relatorios() {
    return (
        <PageContainer
            title="Relatórios"
            rightElement={
                <Button>
                    <FiEdit />
                </Button>
            }
        >
            <ContentBlock title="Relatórios">
                <h1>Relatórios</h1>
            </ContentBlock>
        </PageContainer>
    );
}