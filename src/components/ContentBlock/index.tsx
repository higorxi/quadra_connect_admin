import { Box, Heading, Flex, Badge } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface ContentBlockProps {
  title: string;
  badge?: string;
  children: ReactNode;
  flex?: string | number;
}

export const ContentBlock = ({ 
  title, 
  badge, 
  children, 
  flex 
}: ContentBlockProps) => {
  return (
    <Box 
      bg="white"
      color="navy.500"
      p={6} 
      borderRadius="xl" 
      shadow="sm" 
      borderWidth="1px"
      borderStyle="solid"
      borderColor="gray.100"
      h="full"
      flex={flex}
      display="flex"
      flexDirection="column"
    >
      <Flex justify="space-between" align="center" mb={6}>
        <Heading 
          size="md" 
          color="navy.500"
          fontWeight="bold"
          letterSpacing="tight"
        >
          {title}
        </Heading>
        
        {badge && (
          <Badge 
            colorPalette="green"
            variant="subtle"
            px={2}
            borderRadius="md"
          >
            {badge}
          </Badge>
        )}
      </Flex>

      <Box flex={1}>
        {children}
      </Box>
    </Box>
  );
};
