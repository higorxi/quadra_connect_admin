import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { NotFound } from '../pages/404';
import { appPaths } from '../constants/app-paths';
import Unidades from '@/pages/Unidades';
import Reservas from '@/pages/Reservas';
import Reviews from '@/pages/Reviews';
import Relatorios from '@/pages/Relatorios';
import Perfil from '@/pages/Perfil';
import Transacoes from '@/pages/Transacoes';
import { Center, Spinner } from '@chakra-ui/react';

export function AppRoutes() {
  const { signed, isLoadingSession } = useContext(AuthContext);

  if (isLoadingSession) {
    return (
      <Center minH="100vh" bg="#F4F7FE">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Navigate to={signed ? appPaths.dashboard() : appPaths.login()} replace />} 
      />
      <Route path={appPaths.login()} element={!signed ? <Login /> : <Navigate to={appPaths.dashboard()} />} />

      <Route element={signed ? <DefaultLayout /> : <Navigate to={appPaths.login()} />}>
        <Route path={appPaths.dashboard()} element={<Dashboard />} />
        <Route path={appPaths.unidades()} element={<Unidades />} />
        <Route path={appPaths.reservas()} element={<Reservas />} />
        <Route path={appPaths.reviews()} element={<Reviews />} />
        <Route path={appPaths.transacoes()} element={<Transacoes />} />
        <Route path={appPaths.relatorios()} element={<Relatorios />} />
        <Route path={appPaths.perfil()} element={<Perfil />} />
      </Route>

      <Route path="*" element={<Navigate to={signed ? appPaths.dashboard() : appPaths.notFound()} />} />
      <Route path={appPaths.notFound()} element={<NotFound />} />
    </Routes>
  );
}
