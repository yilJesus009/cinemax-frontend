const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getToken = () => localStorage.getItem('cinemax_token');

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('cinemax_user'));
  } catch {
    return null;
  }
};

export const saveSession = ({ token, usuario }) => {
  localStorage.setItem('cinemax_token', token);
  localStorage.setItem('cinemax_user', JSON.stringify(usuario));
};

export const clearSession = () => {
  localStorage.removeItem('cinemax_token');
  localStorage.removeItem('cinemax_user');
};

export const backendAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = API_URL.replace(/\/api$/, '');
  const assetPath = path.startsWith('/') ? path : `/uploads/${path.startsWith('uploads/') ? path.slice(8) : path}`;
  return `${base}${assetPath}`;
};

export async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  let body = options.body;

  if (options.auth) {
    const token = getToken();
    if (!token) throw new Error('Necesitás iniciar sesión.');
    headers.Authorization = `Bearer ${token}`;
  }

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = data?.message || data?.error || data || `Error ${response.status}`;
    throw new Error(Array.isArray(message) ? message.join('. ') : message);
  }

  return data;
}
