// Shared TypeScript interfaces for contractor domain

export interface Project {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  priority: 'low' | 'medium' | 'high';
  budget: number | null;
  startDate: string | null; // ISO string
  deadline: string | null;  // ISO string
  status: 'draft' | 'active' | 'completed' | 'archived';
}

export interface Phase {
  id: string;
  projectId: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  startDate: string | null;
  endDate: string | null;
}

export interface Task {
  id: string;
  phaseId: string | null;
  projectId: string;
  title: string;
  description: string | null;
  assignedTo: string | null; // userId
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string | null;
}

export interface CartItem {
  id: string;
  productId: string;
  contractorId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  contractorId: string;
  supplierId: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
}
