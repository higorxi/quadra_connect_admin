import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { FiTool } from "react-icons/fi";

interface UnderConstructionProps {
  title?: string;
  description?: string;
}

export function UnderConstruction({
  title = "Em construção",
  description = "Esta área será liberada quando os contratos necessários estiverem disponíveis no backend.",
}: UnderConstructionProps) {
  return (
    <Box
      border="1px dashed"
      borderColor="gray.300"
      borderRadius="md"
      bg="gray.50"
      px={6}
      py={10}
    >
      <VStack gap={3} textAlign="center">
        <Box color="brand.500" fontSize="3xl">
          <FiTool />
        </Box>
        <Heading size="md" color="navy.500">
          {title}
        </Heading>
        <Text color="gray.500" maxW="520px">
          {description}
        </Text>
      </VStack>
    </Box>
  );
}
