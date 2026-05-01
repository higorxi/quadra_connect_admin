import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('@QuadraConnect:token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLoginRequest = error.config.url?.includes('/login') || error.config.url?.includes('/auth');

    if (status === 401 && !isLoginRequest) {
      localStorage.removeItem('@QuadraConnect:token');
      window.location.href = '/login';
    }

    if (status === 400) {
      console.error(error.response?.data?.message || 'Erro na requisição');
    }

    return Promise.reject(error);
  }
);

export { api };