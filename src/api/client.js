import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL
});

export const getToken = () => localStorage.getItem('cinemax_token');

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('cinemax_user'));
  } catch {
    return null;
  }
};

export const saveSession = ({ token, usuario }) => {
  localStorage.setItem('cinemax_token', token);
  localStorage.setItem('cinemax_user', JSON.stringify(usuario));
};

export const clearSession = () => {
  localStorage.removeItem('cinemax_token');
  localStorage.removeItem('cinemax_user');
};

export const backendAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = API_URL.replace(/\/api$/, '');
  const assetPath = path.startsWith('/') ? path : `/uploads/${path.startsWith('uploads/') ? path.slice(8) : path}`;
  return `${base}${assetPath}`;
};

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Error inesperado.';

    return Promise.reject(new Error(Array.isArray(message) ? message.join('. ') : message));
  }
);
