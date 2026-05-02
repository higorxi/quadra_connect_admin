import { Button } from "@chakra-ui/react";  
import { ContentBlock } from "@/components/ContentBlock";
import { PageContainer } from "@/components/PageContainer";
import { FiEdit } from "react-icons/fi";

    export default function Perfil() {
    return (
        <PageContainer
            title="Perfil"
            rightElement={
                <Button>
                    <FiEdit />
                </Button>
            }
        >
            <ContentBlock title="Perfil">
                <h1>Perfil</h1>
            </ContentBlock>
        </PageContainer>
    );
}