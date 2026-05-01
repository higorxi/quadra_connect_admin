import { createContext, useState, type ReactNode, useEffect } from 'react';
import { AuthService, type LoginParams } from '../services/auth.service';
import { api } from '../services/api';

interface AuthContextType {
  signed: boolean;
  user: object | null;
  signIn: (credentials: LoginParams) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<object | null>(null);

  useEffect(() => {
    const storagedToken = AuthService.getAccessToken();
    if (storagedToken && typeof storagedToken === 'string') {
      api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
      AuthService.getCurrentUser().then((user) => {
        setUser(user);
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
    AuthService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};