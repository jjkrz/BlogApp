// src/utils/axios.js
// Konfiguracja axios z automatycznym dodawaniem tokena JWT

import axios from 'axios';
import { getAccessToken, getRefreshToken, logout } from './auth';

// Utwórz instancję axios
const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Interceptor requestów - dodaje token do każdego żądania
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor responsów - odświeża token jeśli wygasł
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jeśli otrzymaliśmy 401 i nie próbowaliśmy jeszcze odświeżyć tokena
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        
        if (!refreshToken) {
          logout();
          return Promise.reject(error);
        }

        // Odśwież token
        const response = await axios.post('http://localhost:8000/auth/token/refresh/', {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Spróbuj ponownie wykonać oryginalne żądanie z nowym tokenem
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Jeśli odświeżenie tokena nie powiodło się, wyloguj użytkownika
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;