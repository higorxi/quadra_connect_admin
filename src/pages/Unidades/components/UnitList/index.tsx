import { 
    Table, 
    Badge, 
    Text, 
    IconButton, 
    Group, 
    Center, 
    Spinner,
    Box,
    VStack
  } from "@chakra-ui/react";
  import { FiEdit3, FiTrash2, FiMapPin } from "react-icons/fi";
  import type { Unit } from "@/schemas/services/units.dto.schema";
  
  interface UnitListProps {
    data?: Unit[];
    isLoading: boolean;
    onEdit: (unit: Unit) => void;
    onDelete: (unit: Unit) => void;
  }
  
  export function UnitList({ data, isLoading, onEdit, onDelete }: UnitListProps) {
    if (isLoading) {
      return (
        <Center h="200px">
          <VStack gap={4}>
            <Spinner size="xl" color="brand.500" />
            <Text color="gray.500">Carregando unidades...</Text>
          </VStack>
        </Center>
      );
    }
  
    if (!data || data.length === 0) {
      return (
        <Center h="200px" border="2px dashed" borderColor="gray.200" borderRadius="md">
          <Text color="gray.400">Nenhuma unidade cadastrada.</Text>
        </Center>
      );
    }
  
    return (
      <Box overflowX="auto">
        <Table.Root variant="line" size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Unidade</Table.ColumnHeader>
              <Table.ColumnHeader>Localização</Table.ColumnHeader>
              <Table.ColumnHeader>Preço/Hora</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
  
          <Table.Body>
            {data.map((unit) => (
              <Table.Row key={unit.id} _hover={{ bg: "gray.50" }} transition="bg 0.2s">
                <Table.Cell>
                  <Text fontWeight="bold" color="navy.600">{unit.name}</Text>
                  <Text fontSize="xs" color="gray.500" lineClamp={1}>{unit.description || "Sem descrição"}</Text>
                </Table.Cell>
  
                <Table.Cell>
                  <Group gap={1} color="gray.600">
                    <FiMapPin size={12} />
                    <Text fontSize="sm">{unit.city}, {unit.state}</Text>
                  </Group>
                </Table.Cell>
  
                <Table.Cell>
                  <Text fontWeight="medium">
                    R$ {unit.pricePerHour}
                  </Text>
                </Table.Cell>
  
                <Table.Cell>
                  {unit.requiresConfirmation ? (
                    <Badge colorPalette="orange" variant="subtle">
                      Confirmação Manual
                    </Badge>
                  ) : (
                    <Badge colorPalette="green" variant="subtle">
                      Reserva Direta
                    </Badge>
                  )}
                </Table.Cell>
  
                <Table.Cell textAlign="end">
                  <Group gap={2} justifyContent="flex-end">
                    <IconButton
                      aria-label="Editar unidade"
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(unit)}
                    >
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
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    );
  }