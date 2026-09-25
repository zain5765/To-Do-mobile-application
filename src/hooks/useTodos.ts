import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNetworkStatus } from './useNetworkStatus';
import { scheduleTodoReminders } from '../services/notifications';
import {
  getTodoPreferences,
  saveTodoPreferences,
} from '../storage';
import {
  getSyncQueue,
  getTodoCache,
  makeTempId,
  saveSyncQueue,
  saveTodoCache,
  type SyncAction,
} from '../storage/offline';
import type {
  Category,
  PaginationMeta,
  Todo,
  TodoPriority,
  TodoSortField,
  TodoStatusFilter,
} from '../types';
import { getErrorMessage, NetworkError } from '../utils/errors';

export function useTodos(token: string | null) {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const { isOnline } = useNetworkStatus();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [overdueCount, setOverdueCount] = useState(0);
  const [filter, setFilter] = useState<TodoStatusFilter>('all');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TodoPriority | ''>('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  const sort: TodoSortField = 'createdAt';
  const order: 'asc' | 'desc' = 'desc';

  const persistCache = useCallback(
    async (
      nextTodos: Todo[],
      nextCategories: Category[],
      nextPagination: PaginationMeta,
      nextOverdue: number,
    ) => {
      if (!userId) return;
      await saveTodoCache(userId, {
        todos: nextTodos,
        categories: nextCategories,
        pagination: nextPagination,
        overdueCount: nextOverdue,
        updatedAt: new Date().toISOString(),
      });
    },
    [userId],
  );

  const refreshPendingCount = useCallback(async () => {
    if (!userId) return;
    const queue = await getSyncQueue(userId);
    setPendingSyncCount(queue.length);
  }, [userId]);

  const flushSyncQueue = useCallback(async () => {
    if (!token || !userId || !isOnline) return;

    const queue = await getSyncQueue(userId);
    if (!queue.length) return;

    const remaining: SyncAction[] = [];

    for (const action of queue) {
      try {
        if (action.type === 'create') {
          await api.createTodo(token, action.payload as Parameters<typeof api.createTodo>[1]);
        } else if (action.type === 'update') {
          if (!action.todoId.startsWith('local-')) {
            await api.updateTodo(token, action.todoId, action.payload);
          }
        } else if (action.type === 'delete') {
          if (!action.todoId.startsWith('local-')) {
            await api.deleteTodo(token, action.todoId);
          }
        }
      } catch {
        remaining.push(action);
      }
    }

    await saveSyncQueue(userId, remaining);
    setPendingSyncCount(remaining.length);
  }, [token, userId, isOnline]);

  useEffect(() => {
    getTodoPreferences().then(prefs => {
      if (prefs) {
        setFilter(prefs.filter);
        setSearch(prefs.search);
        setPriorityFilter(prefs.priorityFilter);
        setCategoryFilter(prefs.categoryFilter ?? '');
      }
      setPrefsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!prefsLoaded) return;
    saveTodoPreferences({ filter, search, priorityFilter, categoryFilter });
  }, [filter, search, priorityFilter, categoryFilter, prefsLoaded]);

  useEffect(() => {
    if (!userId) return;
    getTodoCache(userId).then(cache => {
      if (!cache) return;
      setTodos(cache.todos);
      setCategories(cache.categories);
      setPagination(cache.pagination);
      setOverdueCount(cache.overdueCount);
    });
    refreshPendingCount();
  }, [userId, refreshPendingCount]);

  const loadTodos = useCallback(
    async (isRefresh = false) => {
      if (!token || !userId) return;

      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError('');

      if (!isOnline) {
        setIsOffline(true);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      try {
        if (pendingSyncCount > 0 || (await getSyncQueue(userId)).length > 0) {
          await flushSyncQueue();
        }

        const [result, overdue, cats] = await Promise.all([
          api.getTodos(token, {
            status: filter,
            search: search || undefined,
            sort,
            order,
            page,
            limit: 10,
            priority: priorityFilter || undefined,
            categoryId: categoryFilter || undefined,
          }),
          api.getOverdueReminders(token),
          api.getCategories(token),
        ]);

        setTodos(result.todos);
        setPagination(result.pagination);
        setOverdueCount(overdue.length);
        setCategories(cats);
        setIsOffline(false);

        await persistCache(result.todos, cats, result.pagination, overdue.length);
        await scheduleTodoReminders([...result.todos, ...overdue]);
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        if (err instanceof NetworkError) {
          setIsOffline(true);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      token,
      userId,
      isOnline,
      filter,
      search,
      page,
      priorityFilter,
      categoryFilter,
      flushSyncQueue,
      persistCache,
      pendingSyncCount,
    ],
  );

  useEffect(() => {
    if (prefsLoaded) loadTodos();
  }, [loadTodos, prefsLoaded]);

  useEffect(() => {
    setPage(1);
  }, [filter, search, priorityFilter, categoryFilter]);

  useEffect(() => {
    if (isOnline && token && userId) {
      flushSyncQueue().then(() => loadTodos(true));
    }
  }, [isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = useCallback(() => loadTodos(true), [loadTodos]);

  const queueAction = useCallback(
    async (action: SyncAction) => {
      if (!userId) return;
      const queue = await getSyncQueue(userId);
      queue.push(action);
      await saveSyncQueue(userId, queue);
      setPendingSyncCount(queue.length);
    },
    [userId],
  );

  async function handleCreate(data: Parameters<typeof api.createTodo>[1]) {
    if (!token || !userId) return;

    if (!isOnline) {
      const tempId = makeTempId();
      const now = new Date().toISOString();
      const optimistic: Todo = {
        id: tempId,
        userId,
        title: data.title,
        description: data.description ?? null,
        completed: false,
        dueDate: data.dueDate ?? null,
        priority: data.priority ?? 'medium',
        tags: data.tags ?? [],
        categoryId: data.categoryId ?? null,
        createdAt: now,
        updatedAt: now,
        pendingSync: true,
      };
      const next = [optimistic, ...todos];
      setTodos(next);
      await persistCache(next, categories, pagination, overdueCount);
      await queueAction({
        id: makeTempId(),
        type: 'create',
        tempId,
        payload: data,
        createdAt: now,
      });
      return;
    }

    await api.createTodo(token, data);
    await loadTodos(true);
  }

  async function handleToggle(id: string, completed: boolean) {
    if (!token || !userId) return;

    const next = todos.map(t => (t.id === id ? { ...t, completed } : t));
    setTodos(next);

    if (!isOnline || id.startsWith('local-')) {
      await persistCache(next, categories, pagination, overdueCount);
      await queueAction({
        id: makeTempId(),
        type: 'update',
        todoId: id,
        payload: { completed },
        createdAt: new Date().toISOString(),
      });
      return;
    }

    await api.updateTodo(token, id, { completed });
    await loadTodos(true);
  }

  async function handleDelete(id: string) {
    if (!token || !userId) return;

    const next = todos.filter(t => t.id !== id);
    setTodos(next);

    if (!isOnline || id.startsWith('local-')) {
      await persistCache(next, categories, pagination, overdueCount);
      await queueAction({
        id: makeTempId(),
        type: 'delete',
        todoId: id,
        createdAt: new Date().toISOString(),
      });
      return;
    }

    await api.deleteTodo(token, id);
    await loadTodos(true);
  }

  async function handleUpdate(
    id: string,
    data: Parameters<typeof api.updateTodo>[2],
  ) {
    if (!token || !userId) return;

    const next = todos.map(t =>
      t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t,
    );
    setTodos(next);

    if (!isOnline || id.startsWith('local-')) {
      await persistCache(next, categories, pagination, overdueCount);
      await queueAction({
        id: makeTempId(),
        type: 'update',
        todoId: id,
        payload: data,
        createdAt: new Date().toISOString(),
      });
      return;
    }

    await api.updateTodo(token, id, data);
    await loadTodos(true);
  }

  async function handleCreateCategory(name: string) {
    if (!token || !isOnline) return;
    const cat = await api.createCategory(token, { name });
    setCategories(prev => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)));
    return cat;
  }

  async function handleDeleteCategory(id: string) {
    if (!token || !isOnline) return;
    await api.deleteCategory(token, id);
    setCategories(prev => prev.filter(c => c.id !== id));
    if (categoryFilter === id) setCategoryFilter('');
    await loadTodos(true);
  }

  return {
    todos,
    categories,
    pagination,
    overdueCount,
    filter,
    setFilter,
    search,
    setSearch,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    page,
    setPage,
    loading,
    refreshing,
    error,
    isOffline,
    pendingSyncCount,
    refresh,
    handleCreate,
    handleToggle,
    handleDelete,
    handleUpdate,
    handleCreateCategory,
    handleDeleteCategory,
  };
}
