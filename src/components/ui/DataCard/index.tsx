import { Box, Flex, Text, Heading, Icon } from "@chakra-ui/react";

interface DataCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  helpText?: string;
  color: string;
}

export const DataCard = ({ label, value, icon, helpText, color }: DataCardProps) => (
  <Box bg="white" p={6} borderRadius="xl" shadow="sm" borderLeft="4px solid" borderColor={color} h="full">
    <Flex justify="space-between" mb={2}>
      <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">{label}</Text>
      <Icon as={icon} color={color} />
    </Flex>
    <Heading size="xl" color="navy.500" mb={1}>{value}</Heading>
    {helpText && <Text fontSize="2xs" color="gray.400" fontWeight="bold">{helpText}</Text>}
  </Box>
);