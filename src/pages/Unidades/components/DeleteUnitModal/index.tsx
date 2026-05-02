import { BaseModal } from "@/components/ui/BaseModal";
import { Button } from "@/components/ui/button";
import { Text } from "@chakra-ui/react";
import { useUnits } from "@/hooks/useUnits";
import type { Unit } from "@/schemas/services/units.dto.schema";

interface DeleteUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit | null;
}

export function DeleteUnitModal({ isOpen, onClose, unit }: DeleteUnitModalProps) {
  const { deleteMutation } = useUnits();

  const handleDelete = async () => {
    if (unit) {
      await deleteMutation.mutateAsync(unit.id);
      onClose();
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Confirmar Exclusão"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button 
            colorPalette="red" 
            onClick={handleDelete} 
            loading={deleteMutation.isPending}
          >
            Excluir
          </Button>
        </>
      }
    >
      <Text>
        Tem certeza que deseja excluir a unidade <strong>{unit?.name}</strong>? 
        Esta ação não pode ser desfeita.
      </Text>
    </BaseModal>
  );
}