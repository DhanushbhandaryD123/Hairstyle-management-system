const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Token ${token}` } : {}),
  };
};

const request = async (method, path, body = null) => {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : null,
    });

    // Handle empty response safely
    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const api = {
  // ===== AUTH =====
  register: (data) => request("POST", "/auth/register/", data),
  login: (data) => request("POST", "/auth/login/", data),
  logout: () => request("POST", "/auth/logout/"),
  profile: () => request("GET", "/auth/profile/"),

  // ===== HAIRSTYLES =====
  getCategories: () => request("GET", "/categories/"),
  getHairstyles: (categoryId) =>
    request(
      "GET",
      `/hairstyles/${categoryId ? `?category=${categoryId}` : ""}`
    ),
  getHairstyle: (id) => request("GET", `/hairstyles/${id}/`),

  // ===== SALONS =====
  getSalons: (hairstyleId, lat, lng) => {
    let q = hairstyleId ? `?hairstyle=${hairstyleId}` : "?";
    if (lat && lng) q += `&lat=${lat}&lng=${lng}`;
    return request("GET", `/salons/${q}`);
  },

  // ===== APPOINTMENTS =====
  getAppointments: () => request("GET", "/appointments/"),
  createAppointment: (data) =>
    request("POST", "/appointments/", data),
  updateAppointment: (id, data) =>
    request("PATCH", `/appointments/${id}/`, data),
  cancelAppointment: (id) =>
    request("PATCH", `/appointments/${id}/`, {
      status: "cancelled",
    }),
};