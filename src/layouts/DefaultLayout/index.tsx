import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { appPaths } from '../../constants/app-paths';
import {
  Box,
  Flex,
  VStack,
  Text,
  Button,
  Heading,
  Separator,
  Circle,
  Image
} from "@chakra-ui/react";
import { FiGrid, FiMapPin, FiLogOut, FiUser, FiBell, FiCalendar, FiBarChart, FiCreditCard, FiStar } from "react-icons/fi";
import { SidebarLink } from './components/SideBarLink';

export function DefaultLayout() {
  const { signOut, user } = useContext(AuthContext);

  return (
    <Flex h="100vh" bg="bg.canvas" overflow="hidden">
      <Box
        as="aside"
        w="260px"
        bg="navy.600"
        color="white"
        p={6}
        display="flex"
        flexDirection="column"
      >
        <Flex align="center" gap={3} mb={10}>
          <Image src="/favicon.svg" alt="QuadraConnect" width={12} height={12} />
          <Heading size="md" fontWeight="bold" letterSpacing="tight">
            QuadraConnect
          </Heading>
        </Flex>

        <VStack align="stretch" flex={1} gap={2}>
          <SidebarLink to={appPaths.dashboard()} icon={<FiGrid />} label="Dashboard" />
          <SidebarLink to={appPaths.unidades()} icon={<FiMapPin />} label="Unidades" />
          <SidebarLink to={appPaths.reservas()} icon={<FiCalendar />} label="Reservas" />
          <SidebarLink to={appPaths.reviews()} icon={<FiStar />} label="Avaliações" />
          <SidebarLink to={appPaths.transacoes()} icon={<FiCreditCard />} label="Transações" />
          <SidebarLink to={appPaths.relatorios()} icon={<FiBarChart />} label="Relatórios" />
          <SidebarLink to={appPaths.perfil()} icon={<FiUser />} label="Perfil" />
        </VStack>

        <Box mt="auto">
          <Separator opacity={0.1} mb={4} />
          <Button
            variant="ghost"

            width="full"
            justifyContent="flex-start"

            onClick={signOut}
            gap={3}
          >
            <FiLogOut size={20} />
            <Text fontWeight="medium">Sair do Sistema</Text>
          </Button>
        </Box>
      </Box>

      <Box as="main" flex={1} display="flex" flexDirection="column" bg="#F4F7FE">
        <Flex
          as="header"
          h="70px"
          px={8}
          bg="white"
          borderBottom="1px solid"
          borderColor="gray.200"
          justify="space-between"
          align="center"
        >
          <Box>
            <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">
              Visão Geral
            </Text>
            <Text color="navy.500" fontSize="lg" fontWeight="semibold">
              Olá, {user?.email} 👋
            </Text>
          </Box>

          <Flex align="center" gap={4}>
            <Circle size="40px" bg="gray.50" color="gray.600" border="1px solid" borderColor="gray.200" cursor="pointer" _hover={{ bg: "gray.100" }}>
              <FiBell size={18} />
            </Circle>
            <Separator orientation="vertical" h="30px" />
            <Flex align="center" gap={3}>
              <Box textAlign="right" display={{ base: "none", md: "block" }}>
                <Text fontSize="sm" fontWeight="bold" color="navy.500">{(user as any)?.name}</Text>
                <Text fontSize="xs" color="brand.600">Locador</Text>
              </Box>
              <Circle size="45px" bg="brand.500" border="2px solid" borderColor="brand.100" color="white">
                <FiUser size={24} />
              </Circle>
            </Flex>
          </Flex>
        </Flex>
        
        <Box p={8} overflowY="auto" flex={1}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}
