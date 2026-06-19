import { request } from './client.js';

export const getPeliculas = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.titulo) params.set('titulo', filters.titulo);
  if (filters.genero) params.set('genero', filters.genero);
  const query = params.toString();
  return request(`/pelicula${query ? `?${query}` : ''}`);
};

export const getPelicula = (id) => request(`/pelicula/${id}`);

export const createPelicula = (formData) => request('/pelicula', {
  method: 'POST',
  auth: true,
  body: formData
});

export const updatePelicula = (id, formData) => request(`/pelicula/${id}`, {
  method: 'PUT',
  auth: true,
  body: formData
});

export const deletePelicula = (id) => request(`/pelicula/${id}`, {
  method: 'DELETE',
  auth: true
});
