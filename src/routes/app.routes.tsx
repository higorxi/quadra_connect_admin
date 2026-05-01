import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { NotFound } from '../pages/404';
import { appPaths } from '../constants/app-paths';

export function AppRoutes() {
  const { signed } = useContext(AuthContext);

  return (
    <Routes>
      <Route path={appPaths.login()} element={!signed ? <Login /> : <Navigate to={appPaths.dashboard()} />} />

      <Route element={signed ? <DefaultLayout /> : <Navigate to={appPaths.login()} />}>
        <Route path={appPaths.dashboard()} element={<Dashboard />} />
        {/* <Route path="/unidades" element={<Unidades />} />
        <Route path="/quadras" element={<Quadras />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/ajuda" element={<Ajuda />} />
        <Route path="/sobre" element={<Sobre />} /> */}
      </Route>

      <Route path="*" element={<Navigate to={signed ? appPaths.dashboard() : appPaths.notFound()} />} />
      <Route path={appPaths.notFound()} element={<NotFound />} />
    </Routes>
  );
}