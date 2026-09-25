import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TodoPriority, TodoStatusFilter, User } from '../types';

const TOKEN_KEY = 'todoo_token';
const USER_KEY = 'todoo_user';
const PREFS_KEY = 'todoo_prefs';

export interface TodoPreferences {
  filter: TodoStatusFilter;
  search: string;
  priorityFilter: TodoPriority | '';
  categoryFilter: string;
}

export async function getStoredAuth(): Promise<{
  token: string | null;
  user: User | null;
}> {
  const [token, userJson] = await Promise.all([
    AsyncStorage.getItem(TOKEN_KEY),
    AsyncStorage.getItem(USER_KEY),
  ]);
  return {
    token,
    user: userJson ? (JSON.parse(userJson) as User) : null,
  };
}

export async function saveAuth(token: string, user: User): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(TOKEN_KEY, token),
    AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
  ]);
}

export async function clearAuth(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(TOKEN_KEY),
    AsyncStorage.removeItem(USER_KEY),
  ]);
}

export async function getTodoPreferences(): Promise<TodoPreferences | null> {
  const raw = await AsyncStorage.getItem(PREFS_KEY);
  return raw ? (JSON.parse(raw) as TodoPreferences) : null;
}

export async function saveTodoPreferences(
  prefs: TodoPreferences,
): Promise<void> {
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}
