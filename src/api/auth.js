import { api } from './client.js';

export const loginUser = (payload) => api.post('/auth/login', payload);

export const registerUser = (payload) => api.post('/auth/register', payload);

export const getMe = async () => {
  const data = await api.get('/auth/me');
  return data.usuario || data.user || data;
};
