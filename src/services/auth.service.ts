import { apiRoutes } from '../constants/api-routes';
import { api } from './api';

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LoginParams {
  email: string;
  password: string;
}

const login = async (credentials: LoginParams): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(apiRoutes.auth.login, credentials);
  return response.data;
};

const setAccessToken = async (token: string): Promise<void> => {
  localStorage.setItem('@QuadraConnect:token', token);
};

const getAccessToken = async (): Promise<string> => {
  return localStorage.getItem('@QuadraConnect:token');
};

const logout = async (): Promise<void> => {
  localStorage.removeItem('@QuadraConnect:token');
};

const getCurrentUser = async (token: string): Promise<LoginResponse> => {
  const response = await api.get<LoginResponse>(apiRoutes.auth.me);
  return response.data;
};

export const AuthService = {
  login,
  setAccessToken,
  getAccessToken,
  logout,
  getCurrentUser
};