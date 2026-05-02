import { ContentBlock } from "@/components/ContentBlock";
import { Button } from "@chakra-ui/react";
import { PageContainer } from "@/components/PageContainer";
import { FiEdit } from "react-icons/fi";

export default function Reviews() {
    return (
        <PageContainer
            title="Reviews"
            rightElement={
                <Button>
                    <FiEdit />
                </Button>
            }
        >
            <ContentBlock title="Reviews">
                <h1>Reviews</h1>
            </ContentBlock>
        </PageContainer>
    );
}