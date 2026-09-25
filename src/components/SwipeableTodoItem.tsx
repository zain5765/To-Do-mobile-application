import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from '../context/ThemeContext';
import type { Todo, TodoPriority } from '../types';
import TodoItem from './TodoItem';

interface SwipeableTodoItemProps {
  todo: Todo;
  categoryName?: string;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (
    id: string,
    data: {
      title?: string;
      description?: string | null;
      dueDate?: string | null;
      priority?: TodoPriority;
      tags?: string[];
      categoryId?: string | null;
    },
  ) => Promise<void>;
}

export default function SwipeableTodoItem(props: SwipeableTodoItemProps) {
  const { colors } = useTheme();
  const swipeRef = useRef<Swipeable>(null);
  const { todo, onToggle, onDelete } = props;

  function renderLeftAction(
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) {
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0.5, 1],
      extrapolate: 'clamp',
    });

    return (
      <Pressable
        style={[styles.action, { backgroundColor: colors.success }]}
        onPress={() => {
          swipeRef.current?.close();
          onToggle(todo.id, !todo.completed);
        }}>
        <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
          {todo.completed ? 'Undo' : 'Done'}
        </Animated.Text>
      </Pressable>
    );
  }

  function renderRightAction(
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <Pressable
        style={[styles.action, { backgroundColor: colors.danger }]}
        onPress={() => {
          swipeRef.current?.close();
          onDelete(todo.id);
        }}>
        <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
          Delete
        </Animated.Text>
      </Pressable>
    );
  }

  return (
    <Swipeable
      ref={swipeRef}
      friction={2}
      overshootFriction={8}
      renderLeftActions={renderLeftAction}
      renderRightActions={renderRightAction}>
      <TodoItem {...props} />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  action: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 88,
    marginVertical: 2,
    borderRadius: 18,
    marginHorizontal: 4,
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
