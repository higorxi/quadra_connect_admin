import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Center,
  HStack,
  Input,
  Separator,
  SimpleGrid,
  Spinner,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContentBlock } from "@/components/ContentBlock";
import { PageContainer } from "@/components/PageContainer";
import { Field } from "@/components/ui/field";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import {
  UpdateCompanySchema,
  type UpdateCompanyDTO,
} from "@/schemas/services/companies.dto.schema";
import { FiEdit3, FiSave, FiX } from "react-icons/fi";

export default function Perfil() {
  const [isEditing, setIsEditing] = useState(false);
  const { company, isLoading, isError, updateMutation } = useCompanyProfile();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCompanyDTO>({
    resolver: zodResolver(UpdateCompanySchema),
    defaultValues: {
      name: "",
      phone: "",
      description: "",
    },
  });

  useEffect(() => {
    if (company) {
      reset({
        name: company.name,
        phone: company.phone ?? "",
        description: company.description ?? "",
      });
    }
  }, [company, reset]);

  const handleCancel = () => {
    if (company) {
      reset({
        name: company.name,
        phone: company.phone ?? "",
        description: company.description ?? "",
      });
    }
    setIsEditing(false);
  };

  const handleSave = async (data: UpdateCompanyDTO) => {
    await updateMutation.mutateAsync({
      name: data.name,
      phone: data.phone || null,
      description: data.description || null,
    });
    setIsEditing(false);
  };

  return (
    <PageContainer
      title="Perfil"
      description="Dados da empresa conectada à sua conta."
      rightElement={
        company && !isEditing ? (
          <Button onClick={() => setIsEditing(true)} colorPalette="green">
            <FiEdit3 /> Editar
          </Button>
        ) : null
      }
    >
      <ContentBlock
        title="Dados da empresa"
        badge={company ? `Avaliação ${company.evaluation.toFixed(1)}` : undefined}
      >
        {isLoading && (
          <Center h="240px">
            <VStack gap={4}>
              <Spinner size="xl" color="brand.500" />
              <Text color="gray.500">Carregando dados da empresa...</Text>
            </VStack>
          </Center>
        )}

        {isError && (
          <Center h="200px" border="2px dashed" borderColor="gray.200" borderRadius="md">
            <Text color="gray.500">Não foi possível carregar os dados da empresa.</Text>
          </Center>
        )}

        {company && (
          <Box as="form" onSubmit={handleSubmit(handleSave)}>
            <VStack align="stretch" gap={6}>
              <HStack justify="space-between" align="start" gap={4}>
                <Box>
                  <Text fontSize="2xl" fontWeight="bold" color="navy.600">
                    {company.name}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    CNPJ {company.cnpj}
                  </Text>
                </Box>

                <Badge colorPalette="green" variant="subtle" px={3} py={1} borderRadius="md">
                  Empresa
                </Badge>
              </HStack>

              <Separator />

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Field
                  label="Nome da empresa"
                  invalid={!!errors.name}
                  errorText={errors.name?.message}
                  gridColumn={{ base: "span 1", md: "span 2" }}
                >
                  <Input {...register("name")} disabled={!isEditing} />
                </Field>

                <Field label="CNPJ">
                  <Input value={company.cnpj} disabled />
                </Field>

                <Field
                  label="Telefone"
                  invalid={!!errors.phone}
                  errorText={errors.phone?.message}
                >
                  <Input {...register("phone")} disabled={!isEditing} placeholder="Opcional" />
                </Field>

                <Field
                  label="Descrição"
                  invalid={!!errors.description}
                  errorText={errors.description?.message}
                  gridColumn={{ base: "span 1", md: "span 2" }}
                >
                  <Textarea
                    {...register("description")}
                    disabled={!isEditing}
                    placeholder="Conte um pouco sobre a empresa"
                    minH="120px"
                  />
                </Field>
              </SimpleGrid>

              {isEditing && (
                <HStack justify="flex-end" gap={3}>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    <FiX /> Cancelar
                  </Button>
                  <Button type="submit" loading={updateMutation.isPending} colorPalette="green">
                    <FiSave /> Salvar alterações
                  </Button>
                </HStack>
              )}
            </VStack>
          </Box>
        )}
      </ContentBlock>
    </PageContainer>
  );
}
