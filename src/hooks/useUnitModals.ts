import { useState } from "react";
import type { Unit } from "@/schemas/services/units.dto.schema";

export function useUnitModals() {
  const [mode, setMode] = useState<"create" | "edit" | "delete" | "details" | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const openCreate = () => { setMode("create"); setSelectedUnit(null); };
  const openEdit = (unit: Unit) => { setMode("edit"); setSelectedUnit(unit); };
  const openDelete = (unit: Unit) => { setMode("delete"); setSelectedUnit(unit); };
  const openDetails = (unit: Unit) => { setMode("details"); setSelectedUnit(unit); };
  
  const closeAll = () => { setMode(null); setSelectedUnit(null); };

  return {
    mode,
    selectedUnit,
    actions: { openCreate, openEdit, openDelete, openDetails, closeAll }
  };
}