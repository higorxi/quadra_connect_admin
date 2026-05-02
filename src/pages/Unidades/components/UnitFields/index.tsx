import { createListCollection, SimpleGrid, Input, Textarea } from "@chakra-ui/react";
import type { UseFormReturn } from "react-hook-form";
import type { CreateUnitDTO } from "@/schemas/services/units.dto.schema";
import { Field } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { useCategories } from "@/hooks/useCategories";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";

interface UnitFieldsProps {
  methods: UseFormReturn<CreateUnitDTO>;
}

export function UnitFields({ methods }: UnitFieldsProps) {
  const { register, formState: { errors }, setValue, watch } = methods;
  const { categories, isLoading } = useCategories();

  const categoryIdValue = watch("categoryId");

  const collection = createListCollection({
    items: categories || [],
    itemToString: (item) => item.name,
    itemToValue: (item) => item.id,
  });

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
      <Field 
        label="Categoria da Unidade" 
        invalid={!!errors.categoryId} 
        errorText={errors.categoryId?.message}
        gridColumn="span 2"
      >
        <SelectRoot
          collection={collection}
          value={categoryIdValue ? [categoryIdValue] : []}
          onValueChange={(e) => setValue("categoryId", e.value[0], { shouldValidate: true })}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValueText placeholder={isLoading ? "Carregando..." : "Selecione a categoria"} />
          </SelectTrigger>
          <SelectContent portalRef={undefined}>
            {collection.items.map((cat) => (
              <SelectItem item={cat} key={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      </Field>

      <Field 
      required
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
        <Textarea {...register("description")} placeholder="Opcional" />
      </Field>

      <Field 
        label="Endereço" 
        invalid={!!errors.address} 
        errorText={errors.address?.message}
        gridColumn="span 2"
      >
        <Input {...register("address")} />
      </Field>

      <Field label="Cidade" invalid={!!errors.city} errorText={errors.city?.message}>
        <Input {...register("city")} />
      </Field>

      <Field label="Estado (UF)" invalid={!!errors.state} errorText={errors.state?.message}>
        <Input {...register("state")} maxLength={2} />
      </Field>

      <Field label="Preço por Hora" invalid={!!errors.pricePerHour} errorText={errors.pricePerHour?.message}>
        <Input {...register("pricePerHour")} type="text" />
      </Field>

      <Field label="Caução" invalid={!!errors.bailValue} errorText={errors.bailValue?.message}>
        <Input {...register("bailValue")} placeholder="Opcional" />
      </Field>

      <Checkbox 
        {...register("requiresConfirmation")} 
        paddingY={2}
      >
        Requer confirmação manual?
      </Checkbox>
    </SimpleGrid>
  );
}