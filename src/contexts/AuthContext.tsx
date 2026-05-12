import { createContext, useState, type ReactNode, useEffect } from 'react';
import { AuthService, type LoginParams } from '../services/auth.service';
import { api } from '../services/api';

interface AuthContextType {
  signed: boolean;
  user: UserAuthenticated | null;
  isLoadingSession: boolean;
  signIn: (credentials: LoginParams) => Promise<void>;
  signOut: () => void;
}

export interface UserAuthenticated {
  id: string;
  email: string;
  role: 'LOCATOR' | 'CUSTOMER';
  profileType: 'COMPANY' | 'CUSTOMER';
  companyId: string | null;
  customerId: string | null;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserAuthenticated | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStoredSession() {
      try {
        const storagedToken = await AuthService.getAccessToken();

        if (storagedToken && typeof storagedToken === 'string') {
          api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
          const data = await AuthService.getCurrentUser();

          if (data.user.profileType !== 'COMPANY') {
            await AuthService.logout();
            delete api.defaults.headers.common['Authorization'];
            return;
          }

          if (isMounted) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Erro ao restaurar sessão:", error);
        await AuthService.logout();
        delete api.defaults.headers.common['Authorization'];
      } finally {
        if (isMounted) {
          setIsLoadingSession(false);
        }
      }
    }

    loadStoredSession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function signIn(credentials: LoginParams) {
    try {
      const response = await AuthService.login(credentials);

      if (response.user.profileType !== 'COMPANY') {
        throw new Error('Acesso permitido apenas para contas de empresa.');
      }
  
      AuthService.setAccessToken(response.accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`;
  
      setUser(response.user);
      
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  }

  function signOut() {
    AuthService.logout();
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, isLoadingSession, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
