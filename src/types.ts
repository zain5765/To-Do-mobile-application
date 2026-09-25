export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export type TodoPriority = 'low' | 'medium' | 'high';
export type TodoStatusFilter = 'all' | 'pending' | 'completed' | 'overdue';
export type TodoSortField = 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  priority: TodoPriority;
  tags: string[];
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
  pendingSync?: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedTodos {
  todos: Todo[];
  pagination: PaginationMeta;
}

export interface TodoQuery {
  status?: TodoStatusFilter;
  search?: string;
  sort?: TodoSortField;
  order?: SortOrder;
  page?: number;
  limit?: number;
  tag?: string;
  priority?: TodoPriority;
  categoryId?: string;
}
