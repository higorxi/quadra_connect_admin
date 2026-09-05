import { Box, Text } from "@chakra-ui/react";

interface MetricCardProps {
  label: string;
  value: string | number;
  tone?: string;
}

export function MetricCard({ label, value, tone = "gray" }: MetricCardProps) {
  return (
    <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.100" p={5}>
      <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">
        {label}
      </Text>
      <Text fontSize="2xl" color={`${tone}.500`} fontWeight="bold">
        {value}
      </Text>
    </Box>
  );
}
