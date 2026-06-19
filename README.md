# Cinemax Frontend

Frontend en React + Vite + Tailwind para el práctico 4 de Cinemax. Consume el backend NestJS de `Alvarez-Dylan/Cinemax-Backend`.

## Cómo usarlo rápido

1. Levantá el backend:

```bash
npm install
npm run start:dev
```

2. Instalá y levantá el frontend:

```bash
npm install
npm run dev
```

3. Abrí `http://localhost:5173`.

La variable de entorno está en `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Funcionalidades cubiertas

- Cartelera pública.
- Búsqueda por nombre y filtro por género.
- Detalle de película con funciones disponibles.
- Registro, login y cierre de sesión.
- Reserva de una o varias butacas con mapa gráfico de asientos.
- Vista de reservas del cliente.
- Panel admin para crear, editar, eliminar y listar películas.
- Panel admin para crear salas con filas, columnas y capacidad.
- Panel admin para crear, editar y eliminar funciones.

## Rutas

- `/` → Cartelera pública
- `/pelicula/:id` → Detalle de película
- `/login` → Login
- `/register` → Registro
- `/reserva/:funcionId` → Reserva de asientos, solo cliente
- `/mis-reservas` → Reservas del cliente
- `/admin/peliculas` → Gestión de películas, solo admin
- `/admin/salas` → Gestión de salas, solo admin
- `/admin/funciones` → Gestión de funciones, solo admin

## Endpoints esperados

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/pelicula`
- `GET /api/pelicula/:id`
- `POST /api/pelicula`
- `PUT /api/pelicula/:id`
- `DELETE /api/pelicula/:id`
- `GET /api/sala`
- `POST /api/sala`
- `PUT /api/sala/:id`
- `DELETE /api/sala/:id`
- `GET /api/funcion`
- `GET /api/funcion/:id`
- `POST /api/funcion`
- `PUT /api/funcion/:id`
- `DELETE /api/funcion/:id`
- `GET /api/reserva/funcion/:funcionId/asientos`
- `GET /api/reserva/mis-reservas`
- `POST /api/reserva`

El front guarda el token JWT en `localStorage` y lo manda como `Authorization: Bearer <token>`.
