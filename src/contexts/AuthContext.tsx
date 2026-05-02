import { createContext, useState, type ReactNode, useEffect } from 'react';
import { AuthService, type LoginParams } from '../services/auth.service';
import { api } from '../services/api';

interface AuthContextType {
  signed: boolean;
  user: UserAuthenticated | null;
  signIn: (credentials: LoginParams) => Promise<void>;
  signOut: () => void;
}

export interface UserAuthenticated {
  id: string;
  email: string;
  role: 'LOCATOR' | 'CUSTOMER';
  profileType: 'ADMIN' | 'USER';
  companyId: string | null;
  customerId: string | null;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserAuthenticated | null>(null);

  useEffect(() => {
    const storagedToken = AuthService.getAccessToken();
    if (storagedToken && typeof storagedToken === 'string') {
      api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
      AuthService.getCurrentUser().then((data) => {
        setUser(data.user);
      });
    }
  }, []);

  async function signIn(credentials: LoginParams) {
    try {
      const response = await AuthService.login(credentials);
  
      AuthService.setAccessToken(response.accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`;
  
      setUser(response.user);
      
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  }

  function signOut() {
    alert(`fazendo logout`)
    AuthService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
