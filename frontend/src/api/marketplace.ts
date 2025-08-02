import api from '@/utils/api';

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number | string;
  unit: string;
  image: string | null;
  category: string;
  supplier: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  discount?: number | null;
}

export const marketplaceApi = {
  async getProducts(params?: Record<string, string | number | undefined>) {
    const { data } = await api.get<MarketplaceProduct[]>('/marketplace/products', { params });
    return data;
  }
};
