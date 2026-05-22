const BASE_URL = import.meta.env.VITE_API_URL || '';

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const ordersApi = {
  create: async (orderData) => {
    try {
      const json = await fetchJSON(`${BASE_URL}/api/orders/`, {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      const d = json.data ?? json;
      return {
        data: {
          orderId: d.order_id ?? d.orderId,
          status: d.status,
          total: d.total,
          customer: orderData.customer,
        },
      };
    } catch (e) {
      throw new Error(e.message);
    }
  },
};
