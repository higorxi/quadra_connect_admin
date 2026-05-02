import { BaseModal } from "@/components/ui/BaseModal";
import { FormWrapper } from "@/components/FormWrapper";
import { UnitFields } from "@/pages/Unidades/components/UnitFields";
import { CreateUnitSchema, type CreateUnitDTO, type Unit } from "@/schemas/services/units.dto.schema";
import { useUnits } from "@/hooks/useUnits";

interface CreateEditUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit?: Unit | null;
}

export function CreateEditUnitModal({ isOpen, onClose, unit }: CreateEditUnitModalProps) {
  const { createMutation, updateMutation } = useUnits();
  
  const isEditing = !!unit;

  const handleSubmit = async (data: CreateUnitDTO) => {
    if (isEditing && unit) {
      await updateMutation.mutateAsync({ id: unit.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    onClose();
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? "Editar Unidade" : "Nova Unidade"}
      size="xl"
    >
      <FormWrapper
        schema={CreateUnitSchema}
        onSubmit={handleSubmit}
        defaultValues={unit || {}}
        isLoading={createMutation.isPending || updateMutation.isPending}
        buttonLabel={isEditing ? "Salvar Alterações" : "Cadastrar Unidade"}
      >
        {(methods) => <UnitFields methods={methods} />}
      </FormWrapper>
    </BaseModal>
  );
}