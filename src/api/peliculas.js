import { api } from './client.js';

export const getPeliculas = (filters = {}) => api.get('/pelicula', {
  params: {
    titulo: filters.titulo || undefined,
    genero: filters.genero || undefined
  }
});

export const getPelicula = (id) => api.get(`/pelicula/${id}`);

export const createPelicula = (formData) => api.post('/pelicula', formData);

export const updatePelicula = (id, formData) => api.put(`/pelicula/${id}`, formData);

export const deletePelicula = (id) => api.delete(`/pelicula/${id}`);
