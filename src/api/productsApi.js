import { products as localProducts } from '../data/products';

const BASE_URL = import.meta.env.VITE_API_URL || '';

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

function toFrontendProduct(p) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    image: p.image,
    description: p.description,
    inStock: p.in_stock ?? 0,
    specifications: p.specifications ?? {
      power: p.power ?? '—',
      colorTemp: p.color_temp ?? '—',
      base: p.base_type ?? '—',
      luminousFlux: p.luminous_flux ?? '—',
    },
  };
}

export const productsApi = {
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const url = `${BASE_URL}/api/products/${params ? `?${params}` : ''}`;
      const json = await fetchJSON(url);
      const items = json.data ?? json;
      return { data: (Array.isArray(items) ? items : []).map(toFrontendProduct) };
    } catch {
      return { data: localProducts.map(p => ({ ...p, inStock: p.inStock ?? 10 })) };
    }
  },

  getById: async (id) => {
    try {
      const json = await fetchJSON(`${BASE_URL}/api/products/${id}`);
      const product = json.data ?? json;
      return { data: toFrontendProduct(product) };
    } catch {
      const product = localProducts.find((p) => p.id === Number(id));
      if (!product) throw new Error('Товар не найден');
      return { data: { ...product, inStock: product.inStock ?? 10 } };
    }
  },
};
