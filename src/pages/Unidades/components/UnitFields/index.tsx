import type { UseFormReturn } from "react-hook-form";
import type { CreateUnitDTO } from "@/schemas/services/units.dto.schema";
import { Field } from "@/components/ui/field";
import { Input, SimpleGrid, Textarea } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";

interface UnitFieldsProps {
  methods: UseFormReturn<CreateUnitDTO>;
}

export function UnitFields({ methods }: UnitFieldsProps) {
  const { register, formState: { errors } } = methods;

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
      <Field 
        label="Nome da Unidade" 
        invalid={!!errors.name} 
        errorText={errors.name?.message}
        gridColumn="span 2"
      >
        <Input {...register("name")} placeholder="Ex: Arena Beach" />
      </Field>

      <Field 
        label="Descrição" 
        invalid={!!errors.description} 
        errorText={errors.description?.message}
        gridColumn="span 2"
      >
        <Textarea {...register("description")} placeholder="Detalhes sobre o espaço..." />
      </Field>

      <Field 
        label="Endereço" 
        invalid={!!errors.address} 
        errorText={errors.address?.message}
        gridColumn="span 2"
      >
        <Input {...register("address")} />
      </Field>

      <Field 
        label="Cidade" 
        invalid={!!errors.city} 
        errorText={errors.city?.message}
      >
        <Input {...register("city")} />
      </Field>

      <Field 
        label="UF (Estado)" 
        invalid={!!errors.state} 
        errorText={errors.state?.message}
      >
        <Input {...register("state")} maxLength={2} />
      </Field>

      <Field 
        label="Preço por Hora" 
        invalid={!!errors.pricePerHour} 
        errorText={errors.pricePerHour?.message}
      >
        <Input {...register("pricePerHour")} type="text" />
      </Field>

      <Field 
        label="Valor do Caução (Opcional)" 
        invalid={!!errors.bailValue} 
        errorText={errors.bailValue?.message}
      >
        <Input {...register("bailValue")} type="text" />
      </Field>

      <Checkbox 
        {...register("requiresConfirmation")}
        alignItems="center"
        paddingTop={4}
      >
        Requer confirmação manual?
      </Checkbox>
    </SimpleGrid>
  );
}