import api from './axios';

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getCategory = async (id: string) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

export const getCategoryBySlug = async (slug: string) => {
  const response = await api.get(`/categories/slug/${slug}`);
  return response.data;
};

