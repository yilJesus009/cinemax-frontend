import { request } from './client.js';

export const getFunciones = () => request('/funcion');

export const getFuncion = (id) => request(`/funcion/${id}`);

export const createFuncion = (payload) => request('/funcion', {
  method: 'POST',
  auth: true,
  body: payload
});

export const updateFuncion = (id, payload) => request(`/funcion/${id}`, {
  method: 'PUT',
  auth: true,
  body: payload
});

export const deleteFuncion = (id) => request(`/funcion/${id}`, {
  method: 'DELETE',
  auth: true
});
