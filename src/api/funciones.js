import { api } from './client.js';

export const getFunciones = () => api.get('/funcion');

export const getFuncion = (id) => api.get(`/funcion/${id}`);

export const createFuncion = (payload) => api.post('/funcion', payload);

export const updateFuncion = (id, payload) => api.put(`/funcion/${id}`, payload);

export const deleteFuncion = (id) => api.delete(`/funcion/${id}`);
