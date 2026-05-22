const BASE_URL = '/api/admin';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}`,
});

async function req(url, options = {}) {
  const res = await fetch(url, { headers: getAuthHeaders(), ...options });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
      throw new Error('Сессия истекла');
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const adminApi = {
  login: async (username, password) => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Ошибка авторизации');
    }
    return res.json();
  },

  getProducts: () => req(`${BASE_URL}/products`),
  getProduct: (id) => req(`${BASE_URL}/products/${id}`),
  createProduct: (data) => req(`${BASE_URL}/products`, { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => req(`${BASE_URL}/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => req(`${BASE_URL}/products/${id}`, { method: 'DELETE' }),

  getOrders: (status = '') => {
    const params = status ? `?status_filter=${status}` : '';
    return req(`${BASE_URL}/orders${params}`);
  },
  getOrder: (id) => req(`${BASE_URL}/orders/${id}`),
  updateOrderStatus: (id, status) =>
    req(`${BASE_URL}/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  getStats: () => req(`${BASE_URL}/stats`),
};
