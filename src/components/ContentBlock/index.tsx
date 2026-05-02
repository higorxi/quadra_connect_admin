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
      bg={{ base: "white", _dark: "navy.600" }} 
      color={{ base: "inherit", _dark: "white" }}
      p={6} 
      borderRadius="xl" 
      shadow="sm" 
      borderWidth="1px"
      borderStyle="solid"
      borderColor={{ base: "gray.100", _dark: "transparent" }}
      h="full"
      flex={flex}
      display="flex"
      flexDirection="column"
    >
      <Flex justify="space-between" align="center" mb={6}>
        <Heading 
          size="md" 
          color={{ base: "navy.500", _dark: "white" }}
          fontWeight="bold"
          letterSpacing="tight"
        >
          {title}
        </Heading>
        
        {badge && (
          <Badge 
            colorPalette={{ base: "green", _dark: "blue" }} 
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