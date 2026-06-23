import { api } from './client.js';

export const getSalas = () => api.get('/sala');

export const getSala = (id) => api.get(`/sala/${id}`);

export const createSala = (payload) => api.post('/sala', payload);

export const updateSala = (id, payload) => api.put(`/sala/${id}`, payload);

export const deleteSala = (id) => api.delete(`/sala/${id}`);
