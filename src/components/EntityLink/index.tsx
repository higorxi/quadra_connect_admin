import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

interface EntityLinkProps {
  to: string;
  label?: string | null;
  fallback?: string;
}

export function EntityLink({ to, label, fallback = "-" }: EntityLinkProps) {
  if (!label) {
    return <>{fallback}</>;
  }

  return (
    <ChakraLink
      as={RouterLink}
      {...{ to }}
      color="action.500"
      fontWeight="medium"
      textDecoration="underline"
      textUnderlineOffset="3px"
      _hover={{ color: "action.600" }}
      lineClamp={1}
    >
      {label}
    </ChakraLink>
  );
}
