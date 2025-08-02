export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: string;
  progress?: number;
  assignee?: string;
  photos?: string[];
  checklist: ChecklistItem[];
  createdAt?: string;
}

export interface ProjectBasic {
  id: string;
  title: string;
}
