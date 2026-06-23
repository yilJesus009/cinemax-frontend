import { api } from './client.js';

export const getAsientosOcupados = (funcionId) => api.get(`/reserva/funcion/${funcionId}/asientos`);

export const createReserva = (payload) => api.post('/reserva', payload);

export const getMisReservas = () => api.get('/reserva/mis-reservas');
