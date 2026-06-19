import { request } from './client.js';

export const getAsientosOcupados = (funcionId) => request(`/reserva/funcion/${funcionId}/asientos`, {
  auth: true
});

export const createReserva = (payload) => request('/reserva', {
  method: 'POST',
  auth: true,
  body: payload
});

export const getMisReservas = () => request('/reserva/mis-reservas', {
  auth: true
});
