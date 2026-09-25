import type {
  Category,
  PaginatedTodos,
  Todo,
  TodoPriority,
  TodoQuery,
  User,
} from './types';
import { API_BASE } from './config';
import { NetworkError } from './utils/errors';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new NetworkError(
      `Can't reach the server at ${API_BASE}. Make sure the backend is running and EXPO_PUBLIC_API_URL is set to your computer's IP.`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      (data as { error?: string; message?: string }).error ||
        (data as { error?: string; message?: string }).message ||
        'Request failed',
      response.status,
    );
  }

  return data as T;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const api = {
  register: (email: string, password: string, name: string) =>
    request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  login: (email: string, password: string) =>
    request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),

  me: (token: string) => request<User>('/api/auth/me', {}, token),

  updateProfile: (token: string, name: string) =>
    request<User>(
      '/api/profile',
      {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      },
      token,
    ),

  changePassword: (
    token: string,
    currentPassword: string,
    newPassword: string,
  ) =>
    request<{ message: string }>(
      '/api/profile/password',
      {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      },
      token,
    ),

  getTodos: (token: string, query: TodoQuery = {}) =>
    request<PaginatedTodos>(
      `/api/todos${buildQuery({
        status: query.status,
        search: query.search,
        sort: query.sort,
        order: query.order,
        page: query.page,
        limit: query.limit,
        tag: query.tag,
        priority: query.priority,
        categoryId: query.categoryId,
      })}`,
      {},
      token,
    ),

  getTags: (token: string) => request<string[]>('/api/todos/tags', {}, token),

  getOverdueReminders: (token: string) =>
    request<Todo[]>('/api/todos/overdue/reminders', {}, token),

  createTodo: (
    token: string,
    data: {
      title: string;
      description?: string;
      dueDate?: string | null;
      priority?: TodoPriority;
      tags?: string[];
      categoryId?: string | null;
    },
  ) =>
    request<Todo>(
      '/api/todos',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token,
    ),

  updateTodo: (
    token: string,
    id: string,
    data: {
      title?: string;
      description?: string | null;
      completed?: boolean;
      dueDate?: string | null;
      priority?: TodoPriority;
      tags?: string[];
      categoryId?: string | null;
    },
  ) =>
    request<Todo>(
      `/api/todos/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
      token,
    ),

  deleteTodo: (token: string, id: string) =>
    request<void>(`/api/todos/${id}`, { method: 'DELETE' }, token),

  getCategories: (token: string) =>
    request<Category[]>('/api/categories', {}, token),

  createCategory: (
    token: string,
    data: { name: string; color?: string; icon?: string },
  ) =>
    request<Category>(
      '/api/categories',
      { method: 'POST', body: JSON.stringify(data) },
      token,
    ),

  updateCategory: (
    token: string,
    id: string,
    data: { name?: string; color?: string; icon?: string },
  ) =>
    request<Category>(
      `/api/categories/${id}`,
      { method: 'PATCH', body: JSON.stringify(data) },
      token,
    ),

  deleteCategory: (token: string, id: string) =>
    request<void>(`/api/categories/${id}`, { method: 'DELETE' }, token),
};
