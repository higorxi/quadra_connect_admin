import { useUnits } from "@/hooks/useUnits";
import { useUnitModals } from "@/hooks/useUnitModals";
import { CreateEditUnitModal } from "./components/CreateEditUnitModal";
import { DeleteUnitModal } from "./components/DeleteUnitModal";
import { ContentBlock } from "@/components/ContentBlock";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { UnitList } from "./components/UnitList";

export default function Unidades() {
  const { units, isLoading } = useUnits();
  const { mode, selectedUnit, actions } = useUnitModals();

  return (
    <PageContainer 
      title="Gestão de Unidades" 
      rightElement={
        <Button onClick={actions.openCreate} colorPalette="green">
          <FiPlus /> Nova Unidade
        </Button>
      }
    >
      <ContentBlock title="Minhas Unidades" >
        <UnitList 
           data={units} 
           isLoading={isLoading} 
           onEdit={actions.openEdit} 
           onDelete={actions.openDelete} 
        />
      </ContentBlock>


      <CreateEditUnitModal 
        isOpen={mode === "create" || mode === "edit"} 
        onClose={actions.closeAll}
        unit={selectedUnit}
      />

      <DeleteUnitModal 
        isOpen={mode === "delete"} 
        onClose={actions.closeAll}
        unit={selectedUnit}
      />
    </PageContainer>
  );
}