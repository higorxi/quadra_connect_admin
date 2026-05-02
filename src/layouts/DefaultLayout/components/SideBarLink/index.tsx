import { Flex, Text, Link } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export function SidebarLink({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
    return (
        <Link
            asChild
            variant="plain"
            p={3}
            borderRadius="lg"
            color="gray.300"
            _hover={{ bg: "whiteAlpha.200", color: "brand.500", textDecoration: "none" }}
            transition="all 0.2s"
        >
            <NavLink to={to}>
            <Flex align="center" gap={3}>
                {icon}
                <Text fontWeight="semibold" fontSize="sm">{label}</Text>
            </Flex>
            </NavLink>
        </Link>
    );
}