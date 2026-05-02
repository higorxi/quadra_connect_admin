import { Flex, VStack, Heading, Text, Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  description?: string;
  rightElement?: ReactNode; // Para botões de "Novo", "Exportar", etc.
  children: ReactNode;
}

export const PageContainer = ({ title, description, rightElement, children }: PageContainerProps) => {
  return (
    <Flex direction="column" minH="100%" gap={6}>
      {/* Header da Página */}
      <Flex justify="space-between" align="flex-end">
        <VStack align="start" gap={1}>
          <Heading size="2xl" color="navy.500" letterSpacing="tight">
            {title}
          </Heading>
          {description && (
            <Text color="gray.500" fontSize="md">
              {description}
            </Text>
          )}
        </VStack>
        
        {rightElement && <Box>{rightElement}</Box>}
      </Flex>

      {/* Conteúdo Variável */}
      <Box flex={1}>
        {children}
      </Box>
    </Flex>
  );
};