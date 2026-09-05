import { Badge, Group, IconButton, Text } from "@chakra-ui/react";
import { FiEdit3, FiTrash2, FiMapPin } from "react-icons/fi";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { formatCurrency } from "@/utils/formatters";
import type { Unit } from "@/schemas/services/units.dto.schema";

interface UnitListProps {
  data?: Unit[];
  isLoading: boolean;
  onEdit: (unit: Unit) => void;
  onDelete: (unit: Unit) => void;
}

export function UnitList({ data, isLoading, onEdit, onDelete }: UnitListProps) {
  const columns: DataTableColumn<Unit>[] = [
    {
      key: "name",
      header: "Unidade",
      cell: (unit) => (
        <>
          <Text fontWeight="bold" color="navy.600">
            {unit.name}
          </Text>
          <Text fontSize="xs" color="gray.500" lineClamp={1}>
            {unit.description || "Sem descrição"}
          </Text>
        </>
      ),
    },
    {
      key: "location",
      header: "Localização",
      cell: (unit) => (
        <Group gap={1} color="gray.600">
          <FiMapPin size={12} />
          <Text fontSize="sm">
            {unit.city}, {unit.state}
          </Text>
        </Group>
      ),
    },
    {
      key: "pricePerHour",
      header: "Preço/Hora",
      cell: (unit) => (
        <Text fontWeight="medium" color="gray.700">
          {formatCurrency(unit.pricePerHour)}
        </Text>
      ),
    },
    {
      key: "requiresConfirmation",
      header: "Status",
      cell: (unit) => (
        <Badge colorPalette={unit.requiresConfirmation ? "orange" : "green"} variant="subtle">
          {unit.requiresConfirmation ? "Confirmação Manual" : "Reserva Direta"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Ações",
      align: "end",
      cell: (unit) => (
        <Group gap={2} justifyContent="flex-end">
          <IconButton aria-label="Editar unidade" variant="ghost" size="sm" onClick={() => onEdit(unit)}>
            <FiEdit3 />
          </IconButton>
          <IconButton
            aria-label="Excluir unidade"
            variant="ghost"
            size="sm"
            colorPalette="red"
            onClick={() => onDelete(unit)}
          >
            <FiTrash2 />
          </IconButton>
        </Group>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={data}
      rowKey={(unit) => unit.id}
      isLoading={isLoading}
      loadingMessage="Carregando unidades..."
      emptyMessage="Nenhuma unidade cadastrada."
    />
  );
}
