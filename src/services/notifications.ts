import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Todo } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Task reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleTodoReminders(todos: Todo[]): Promise<void> {
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const now = Date.now();

  for (const todo of todos) {
    if (todo.completed || !todo.dueDate) continue;

    const due = new Date(todo.dueDate).getTime();
    if (due <= now) continue;

    const reminderTime = due - 60 * 60 * 1000;
    const triggerMs = reminderTime > now ? reminderTime : due;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: reminderTime > now ? 'Task due in 1 hour' : 'Task due now',
        body: todo.title,
        data: { todoId: todo.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(triggerMs),
      },
    });
  }

  const overdue = todos.filter(
    t => !t.completed && t.dueDate && new Date(t.dueDate).getTime() < now,
  );

  if (overdue.length > 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Overdue tasks',
        body: `You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}.`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60,
      },
    });
  }
}
