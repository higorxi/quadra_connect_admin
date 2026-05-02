import { useState } from "react";
import { ContentBlock } from "@/components/ContentBlock";
import { PageContainer } from "@/components/PageContainer";
import { FormWrapper } from "@/components/FormWrapper";
import { UnitFields } from "@/pages/Unidades/components/UnitFields";
import { CreateUnitSchema, type CreateUnitDTO } from "@/schemas/services/units.dto.schema";
import { UnitsService } from "@/services/units.service";
import {
  Button,
  SimpleGrid,
  Text,
  Box,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogCloseTrigger,
  useDisclosure
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { apiRoutes } from "@/constants/api-routes";
import { useQueryClient } from "@tanstack/react-query";

export default function Unidades() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { open, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  
  const handleCreateUnit = async (data: CreateUnitDTO) => {
    setIsSubmitting(true);
    try {
      await UnitsService.createUnit(data);
      queryClient.invalidateQueries({ queryKey: [apiRoutes.units.list] });
      onClose();
    } catch (error) {
      console.error("Erro ao criar unidade:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer 
      title="Gestão de Unidades" 
      description="Visualize e gerencie todas as suas quadras e espaços."
      rightElement={
        <Button gap={2} colorPalette="primary" onClick={onOpen}>
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

      <DialogRoot open={open} onOpenChange={onClose} size="lg">
        <DialogContent>
          <DialogHeader>Cadastrar Nova Unidade</DialogHeader>
          <DialogCloseTrigger />
          <DialogBody pb={6}>
            <FormWrapper
              schema={CreateUnitSchema}
              onSubmit={handleCreateUnit}
              isLoading={isSubmitting}
              buttonLabel="Criar Unidade"
            >
              {(methods) => <UnitFields methods={methods} />}
            </FormWrapper>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </PageContainer>
  );
}