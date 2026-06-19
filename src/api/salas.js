import { request } from './client.js';

export const getSalas = () => request('/sala', { auth: true });

export const getSala = (id) => request(`/sala/${id}`, { auth: true });

export const createSala = (payload) => request('/sala', {
  method: 'POST',
  auth: true,
  body: payload
});

export const updateSala = (id, payload) => request(`/sala/${id}`, {
  method: 'PUT',
  auth: true,
  body: payload
});

export const deleteSala = (id) => request(`/sala/${id}`, {
  method: 'DELETE',
  auth: true
});
