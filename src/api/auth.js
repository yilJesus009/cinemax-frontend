import { request } from './client.js';

export const loginUser = (payload) => request('/auth/login', { method: 'POST', body: payload });

export const registerUser = (payload) => request('/auth/register', { method: 'POST', body: payload });

export const getMe = async () => {
  const data = await request('/auth/me', { auth: true });
  return data.usuario || data.user || data;
};
