import { Outlet, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { appPaths } from '../constants/app-paths';

export function DefaultLayout() {
  const { signOut, user } = useContext(AuthContext);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: '250px', background: '#1a1a1a', color: '#fff', padding: '20px' }}>
        <h3>Quadra Connect</h3>
        <nav style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link to={appPaths.dashboard()} style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
          <Link to={appPaths.unidades()} style={{ color: '#fff', textDecoration: 'none' }}>Unidades</Link>
          <button onClick={signOut} style={{ marginTop: '20px', cursor: 'pointer' }}>Sair</button>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '40px', background: '#f4f4f4', overflowY: 'auto' }}>
        <header style={{ marginBottom: '20px' }}>
          <span>Bem-vindo, <strong>{(user as any)?.name}</strong></span>
        </header>
        
        <Outlet />
      </main>
    </div>
  );
}