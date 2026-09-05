import { useUnits } from "@/hooks/useUnits";
import { useUnitModals } from "@/hooks/useUnitModals";
import { CreateEditUnitModal } from "./components/CreateEditUnitModal";
import { DeleteUnitModal } from "./components/DeleteUnitModal";
import { ContentBlock } from "@/components/ContentBlock";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { UnitList } from "./components/UnitList";
import { useSearchParams } from "react-router-dom";

export default function Unidades() {
  const { units, isLoading } = useUnits();
  const { mode, selectedUnit, actions } = useUnitModals();
  const [searchParams, setSearchParams] = useSearchParams();
  const linkedUnit = units?.find((unit) => unit.id === searchParams.get("detalhe")) ?? null;

  const closeAll = () => {
    actions.closeAll();
    if (searchParams.has("detalhe")) {
      searchParams.delete("detalhe");
      setSearchParams(searchParams, { replace: true });
    }
  };

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
        isOpen={mode === "create" || mode === "edit" || (!!linkedUnit && mode === null)}
        onClose={closeAll}
        unit={mode === "create" ? null : (selectedUnit ?? linkedUnit)}
      />

      <DeleteUnitModal
        isOpen={mode === "delete"}
        onClose={closeAll}
        unit={selectedUnit}
      />
    </PageContainer>
  );
}