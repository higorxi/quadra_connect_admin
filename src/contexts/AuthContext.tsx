import { createContext, useState, type ReactNode, useEffect } from 'react';
import { AuthService, type LoginParams } from '../services/auth.service';
import { api } from '../services/api';

interface AuthContextType {
  signed: boolean;
  user: object | null;
  signIn: (credentials: object) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<object | null>(null);

  useEffect(() => {
    const storagedToken = AuthService.getAccessToken();
    if (storagedToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
      setUser({ name: 'Higor' });
    }
  }, []);

  async function signIn(credentials: LoginParams) {
    const response = await AuthService.login({ email: credentials.email, password: credentials.password });
    
    setUser(response.user);
    AuthService.setAccessToken(response.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
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