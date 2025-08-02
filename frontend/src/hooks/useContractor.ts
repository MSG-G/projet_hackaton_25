import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Project, CartItem } from '@/types/contractor';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  addPhase,
  updatePhase,
  addTask,
  updateTask,
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  checkout
} from '@/api/contractor';

export const useProjects = () => {
  return useQuery({ queryKey: ['projects'], queryFn: getProjects });
};

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation<Project, Error, Partial<Project>>({
    mutationFn: createProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation<Project, Error, { id: string; data: Partial<Project> }>({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  });
};

// similarly you can expose hooks for phases, tasks, cart, etc.
export const useCart = () => useQuery({ queryKey: ['cart'], queryFn: getCart });
export const useAddCartItem = () => {
  const qc = useQueryClient();
  return useMutation<CartItem, Error, Partial<CartItem>>({
    mutationFn: addCartItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] })
  });
};
