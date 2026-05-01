import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes/app.routes';
import { Provider } from './components/ui/provider';


function App() {
  return (
    <Provider>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
    </Provider>
  );
}

export default App;