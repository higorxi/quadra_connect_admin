import {
  Box,
  Button,
  Center,
  HStack,
  Spinner,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState, type ReactNode } from "react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  align?: "start" | "end";
  cell: (row: T) => ReactNode;
}

export interface DataTablePagination {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows?: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  loadingMessage?: string;
  emptyMessage?: string;
  errorMessage?: string;
  pageSize?: number;
  pagination?: DataTablePagination;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  isError,
  onRetry,
  loadingMessage = "Carregando...",
  emptyMessage = "Nenhum registro encontrado.",
  errorMessage = "Não foi possível carregar os dados.",
  pageSize = 10,
  pagination,
}: DataTableProps<T>) {
  const [clientPage, setClientPage] = useState(1);

  const items = rows ?? [];
  const totalPages = pagination
    ? pagination.totalPages
    : Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(pagination?.page ?? clientPage, totalPages);
  const total = pagination?.total ?? items.length;
  const visibleRows = pagination
    ? items
    : items.slice((page - 1) * pageSize, page * pageSize);

  const goToPage = (nextPage: number) => {
    if (pagination) {
      pagination.onPageChange(nextPage);
      return;
    }
    setClientPage(nextPage);
  };

  if (isLoading) {
    return (
      <Center h="240px">
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" />
          <Text color="gray.500">{loadingMessage}</Text>
        </VStack>
      </Center>
    );
  }

  if (isError) {
    return (
      <Center h="220px" border="2px dashed" borderColor="red.200" borderRadius="md">
        <VStack gap={3}>
          <Text color="red.500" fontWeight="semibold">
            {errorMessage}
          </Text>
          {onRetry && (
            <Button size="sm" onClick={onRetry}>
              Tentar novamente
            </Button>
          )}
        </VStack>
      </Center>
    );
  }

  if (items.length === 0) {
    return (
      <Center h="220px" border="2px dashed" borderColor="gray.200" borderRadius="md">
        <Text color="gray.400">{emptyMessage}</Text>
      </Center>
    );
  }

  return (
    <VStack align="stretch" gap={4}>
      <Box overflowX="auto" borderRadius="md" border="1px solid" borderColor="gray.100">
        <Table.Root variant="line" size="sm">
          <Table.Header bg="gray.50">
            <Table.Row>
              {columns.map((column) => (
                <Table.ColumnHeader
                  key={column.key}
                  textAlign={column.align ?? "start"}
                  fontWeight="semibold"
                  borderColor="gray.200"
                >
                  {column.header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {visibleRows.map((row) => (
              <Table.Row
                key={rowKey(row)}
                bg="white"
                _hover={{ bg: "gray.50" }}
                transition="background 0.2s"
              >
                {columns.map((column) => (
                  <Table.Cell
                    key={column.key}
                    textAlign={column.align ?? "start"}
                    borderColor="gray.100"
                    color="gray.700"
                  >
                    {column.cell(row)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      <HStack justify="space-between" flexWrap="wrap" gap={3}>
        <Text fontSize="sm" color="gray.500">
          {total} registro(s) · página {page} de {totalPages}
        </Text>
        <HStack>
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            Anterior
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Próxima
          </Button>
        </HStack>
      </HStack>
    </VStack>
  );
}
