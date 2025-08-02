import api from '@/utils/api';

export interface Summary {
  activeProducts: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
}

export interface ProductInput {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  categoryId?: string;
  images?: string[];
}

export const supplierApi = {
  async getSummary() {
    const { data } = await api.get<Summary>('/supplier/summary');
    return data;
  },

  async getCategories() {
    const { data } = await api.get<{ id: string; name: string }[]>('/supplier/categories');
    return data;
  },

  async getProducts() {
    const { data } = await api.get('/supplier/products');
    return data;
  },

  async createProduct(payload: ProductInput | FormData) {
    let body: FormData;
    if (payload instanceof FormData) {
      body = payload;
    } else {
      body = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          v.forEach((item) => body.append(k, item as any));
        } else if (v !== undefined && v !== null) {
          body.append(k, String(v));
        }
      });
    }
    const { data } = await api.post('/supplier/products', body);
    return data;
  },

  async updateProduct(id: string, payload: Partial<ProductInput> | FormData) {
    let body: FormData;
    if (payload instanceof FormData) {
      body = payload;
    } else {
      body = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          v.forEach((item) => body.append(k, item as any));
        } else if (v !== undefined && v !== null) {
          body.append(k, String(v));
        }
      });
    }
    const { data } = await api.put(`/supplier/products/${id}`, body);
    return data;
  },

  async deleteProduct(id: string) {
    await api.delete(`/supplier/products/${id}`);
  },

  async getOrders() {
    const { data } = await api.get('/supplier/orders');
    return data;
  },

  async updateOrder(id: string, payload: any) {
    const { data } = await api.put(`/supplier/orders/${id}`, payload);
    return data;
  }

};
