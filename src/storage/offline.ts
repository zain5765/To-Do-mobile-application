import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Category, PaginationMeta, Todo } from '../types';

const CACHE_PREFIX = 'todoo_cache_';
const QUEUE_PREFIX = 'todoo_sync_queue_';

export interface TodoCache {
  todos: Todo[];
  categories: Category[];
  pagination: PaginationMeta;
  overdueCount: number;
  updatedAt: string;
}

export type SyncAction =
  | {
      id: string;
      type: 'create';
      tempId: string;
      payload: Record<string, unknown>;
      createdAt: string;
    }
  | {
      id: string;
      type: 'update';
      todoId: string;
      payload: Record<string, unknown>;
      createdAt: string;
    }
  | {
      id: string;
      type: 'delete';
      todoId: string;
      createdAt: string;
    };

function cacheKey(userId: string) {
  return `${CACHE_PREFIX}${userId}`;
}

function queueKey(userId: string) {
  return `${QUEUE_PREFIX}${userId}`;
}

export async function getTodoCache(userId: string): Promise<TodoCache | null> {
  const raw = await AsyncStorage.getItem(cacheKey(userId));
  return raw ? (JSON.parse(raw) as TodoCache) : null;
}

export async function saveTodoCache(
  userId: string,
  cache: TodoCache,
): Promise<void> {
  await AsyncStorage.setItem(cacheKey(userId), JSON.stringify(cache));
}

export async function getSyncQueue(userId: string): Promise<SyncAction[]> {
  const raw = await AsyncStorage.getItem(queueKey(userId));
  return raw ? (JSON.parse(raw) as SyncAction[]) : [];
}

export async function saveSyncQueue(
  userId: string,
  queue: SyncAction[],
): Promise<void> {
  await AsyncStorage.setItem(queueKey(userId), JSON.stringify(queue));
}

export async function clearOfflineData(userId: string): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(cacheKey(userId)),
    AsyncStorage.removeItem(queueKey(userId)),
  ]);
}

export function makeTempId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
