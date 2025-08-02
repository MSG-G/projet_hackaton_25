import axios from 'axios';
import type { Project, Phase, Task, CartItem, Order } from '@/types/contractor';
import { getAuthToken } from '@/utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:4000',
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    // Ensure headers object exists before assignment (required in strict mode)
    config.headers = {
      ...(config.headers ?? {}),
      Authorization: `Bearer ${token}`,
    } as typeof config.headers;
  }
  return config;
});

// Projects
// TODO: Define a proper `Project` interface that matches backend shape
export const getProjects = async (): Promise<Project[]> => {
  const { data } = await api.get<{ projects: Project[] }>('/contractor/projects');
  return data.projects;
};

export const createProject = async (payload: Partial<Project>): Promise<Project> => {
  const { data } = await api.post<{ project: Project }>('/contractor/projects', payload);
  return data.project;
};

export const updateProject = async (id: string, payload: Partial<Project>): Promise<Project> => {
  const { data } = await api.put<{ project: Project }>(`/contractor/projects/${id}`, payload);
  return data.project;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/contractor/projects/${id}`);
};

// Phases
export const addPhase = async (projectId: string, payload: Partial<Phase>): Promise<Phase> => {
  // Backend route: contractorRouter.use('/phases', phasesRouter) where phasesRouter defines POST '/:projectId/phases'
  // -> Full path is /contractor/phases/:projectId/phases
  const { data } = await api.post<{ phase: Phase }>(`/contractor/phases/${projectId}/phases`, payload);
  return data.phase;
};

export const updatePhase = async (phaseId: string, payload: Partial<Phase>): Promise<Phase> => {
  const { data } = await api.patch<{ phase: Phase }>(`/contractor/phases/${phaseId}`, payload);
  return data.phase;
};

// Tasks
export const addTask = async (payload: Partial<Task>): Promise<Task> => {
  const { data } = await api.post<{ task: Task }>('/contractor/tasks', payload);
  return data.task;
};

export const updateTask = async (taskId: string, payload: Partial<Task>): Promise<Task> => {
  const { data } = await api.patch<{ task: Task }>(`/contractor/tasks/${taskId}`, payload);
  return data.task;
};

// Cart & Orders
export const getCart = async (): Promise<CartItem[]> => {
  const { data } = await api.get<{ items: CartItem[] }>('/contractor/cart');
  return data.items;
};

export const addCartItem = async (payload: Partial<CartItem>): Promise<CartItem> => {
  const { data } = await api.post<{ item: CartItem }>('/contractor/cart/items', payload);
  return data.item;
};

export const updateCartItem = async (itemId: string, payload: Partial<CartItem>): Promise<CartItem> => {
  const { data } = await api.patch<{ item: CartItem }>(`/contractor/cart/items/${itemId}`, payload);
  return data.item;
};

export const deleteCartItem = async (itemId: string): Promise<void> => {
  await api.delete(`/contractor/cart/items/${itemId}`);
};

export const checkout = async (payload?: Record<string, unknown>): Promise<Order> => {
  const { data } = await api.post<{ order: Order }>('/contractor/cart/checkout', payload);
  return data.order;
};
