import { products as localProducts } from '../data/products';

const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const productsApi = {
  getAll: async () => {
    try {
      return await request('/api/products');
    } catch {
      return localProducts;
    }
  },
  getById: async (id) => {
    try {
      return await request(`/api/products/${id}`);
    } catch {
      const product = localProducts.find(p => p.id === Number(id));
      if (!product) throw new Error('Товар не найден');
      return product;
    }
  },
};

export const ordersApi = {
  create: async (orderData) => {
    try {
      return await request('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    } catch {
      return {
        orderId: Math.floor(Math.random() * 900000) + 100000,
        status: 'created',
        ...orderData,
      };
    }
  },
};
