import { Box, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface DetailItemProps {
  label: string;
  value: ReactNode;
}

export function DetailItem({ label, value }: DetailItemProps) {
  return (
    <Box>
      <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">
        {label}
      </Text>
      <Text fontWeight="medium" wordBreak="break-word">
        {value}
      </Text>
    </Box>
  );
}
