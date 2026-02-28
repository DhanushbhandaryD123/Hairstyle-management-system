const BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Token ${token}` } : {}),
  };
};

const request = async (method, path, body = null) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : null,
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const api = {
  // Auth
  register: (data) => request('POST', '/auth/register/', data),
  login: (data) => request('POST', '/auth/login/', data),
  logout: () => request('POST', '/auth/logout/'),
  profile: () => request('GET', '/auth/profile/'),

  // Hairstyles
  getCategories: () => request('GET', '/categories/'),
  getHairstyles: (categoryId) => request('GET', `/hairstyles/${categoryId ? `?category=${categoryId}` : ''}`),
  getHairstyle: (id) => request('GET', `/hairstyles/${id}/`),

  // Salons
  getSalons: (hairstyleId, lat, lng) => {
    let q = hairstyleId ? `?hairstyle=${hairstyleId}` : '?';
    if (lat && lng) q += `&lat=${lat}&lng=${lng}`;
    return request('GET', `/salons/${q}`);
  },

  // Appointments
  getAppointments: () => request('GET', '/appointments/'),
  createAppointment: (data) => request('POST', '/appointments/', data),
  updateAppointment: (id, data) => request('PATCH', `/appointments/${id}/`, data),
  cancelAppointment: (id) => request('PATCH', `/appointments/${id}/`, { status: 'cancelled' }),
};
