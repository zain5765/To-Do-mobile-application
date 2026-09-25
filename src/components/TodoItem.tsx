import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import type { Todo, TodoPriority } from '../types';
import DatePickerField from './DatePickerField';
import { tapSuccess, tapWarning } from '../utils/haptics';

interface TodoItemProps {
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

function formatDueDate(dueDate: string | null): string | null {
  if (!dueDate) return null;
  return new Date(dueDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isOverdue(todo: Todo): boolean {
  if (!todo.dueDate || todo.completed) return false;
  return new Date(todo.dueDate) < new Date();
}

export default function TodoItem({
  todo,
  categoryName,
  onToggle,
  onDelete,
  onUpdate,
}: TodoItemProps) {
  const { colors, commonStyles, radius, shadows } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        item: {
          flexDirection: 'row',
          gap: 14,
          padding: 16,
          borderWidth: 1,
          borderLeftWidth: 4,
          borderColor: colors.border,
          borderRadius: radius.lg,
          backgroundColor: colors.surface,
          alignItems: 'flex-start',
          ...shadows.sm,
        },
        completed: { opacity: 0.65, backgroundColor: colors.surfaceMuted },
        overdue: {
          borderColor: colors.dangerBorder,
          backgroundColor: colors.dangerBg,
        },
        check: {
          width: 26,
          height: 26,
          borderRadius: 13,
          borderWidth: 2,
          borderColor: colors.primary,
          backgroundColor: colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 2,
        },
        checkDone: { backgroundColor: colors.primary },
        checkMark: {
          color: colors.onPrimary,
          fontSize: 14,
          fontWeight: '700',
        },
        content: { flex: 1 },
        titleRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 8,
          marginBottom: 6,
        },
        title: {
          fontSize: 16,
          fontWeight: '600',
          color: colors.text,
          flexShrink: 1,
        },
        titleDone: {
          textDecorationLine: 'line-through',
          color: colors.textDim,
        },
        description: {
          color: colors.textMuted,
          fontSize: 15,
          marginBottom: 8,
        },
        priorityBadge: {
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: radius.pill,
        },
        priorityText: {
          fontSize: 12,
          textTransform: 'capitalize',
          fontWeight: '600',
        },
        badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
        dueBadge: {
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: radius.pill,
          backgroundColor: colors.primaryLight,
        },
        dueBadgeOverdue: { backgroundColor: colors.dangerLight },
        dueBadgeText: { fontSize: 13, color: colors.primary },
        dueBadgeTextOverdue: { color: colors.danger },
        categoryBadge: {
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: radius.pill,
          backgroundColor: colors.secondaryLight,
        },
        categoryText: { fontSize: 12, color: colors.secondary },
        tagBadge: {
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: radius.pill,
          backgroundColor: colors.primaryLight,
        },
        tagText: { fontSize: 12, color: colors.primary },
        syncBadge: {
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: radius.pill,
          backgroundColor: colors.dangerLight,
        },
        syncText: { fontSize: 11, color: colors.danger, fontWeight: '600' },
        actions: { gap: 4 },
        editForm: { gap: 10 },
        editActions: { flexDirection: 'row', gap: 8 },
        disabled: { opacity: 0.7 },
      }),
    [colors, radius, shadows],
  );

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? '');
  const [dueDate, setDueDate] = useState(
    todo.dueDate ? todo.dueDate.slice(0, 10) : '',
  );
  const [priority, setPriority] = useState<TodoPriority>(todo.priority);
  const [tagsInput, setTagsInput] = useState(todo.tags.join(', '));
  const [busy, setBusy] = useState(false);

  const priorityStyle = colors.priority[todo.priority];
  const dueLabel = formatDueDate(todo.dueDate);
  const overdue = isOverdue(todo);

  async function saveEdit() {
    setBusy(true);
    try {
      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
      await onUpdate(todo.id, {
        title: title.trim(),
        description: description.trim() || null,
        dueDate: dueDate || null,
        priority,
        tags,
      });
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  function handleDelete() {
    Alert.alert('Delete task', `Delete "${todo.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await tapWarning();
          onDelete(todo.id);
        },
      },
    ]);
  }

  return (
    <View
      style={[
        styles.item,
        { borderLeftColor: priorityStyle.accent },
        todo.completed && styles.completed,
        overdue && styles.overdue,
      ]}>
      <Pressable
        style={[styles.check, todo.completed && styles.checkDone]}
        onPress={async () => {
          await tapSuccess();
          onToggle(todo.id, !todo.completed);
        }}>
        {todo.completed ? <Text style={styles.checkMark}>✓</Text> : null}
      </Pressable>

      <View style={styles.content}>
        {editing ? (
          <View style={styles.editForm}>
            <TextInput
              style={commonStyles.input}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={commonStyles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
              placeholderTextColor={colors.textMuted}
            />
            <DatePickerField
              value={dueDate}
              onChange={setDueDate}
              placeholder="Due date (optional)"
            />
            <TextInput
              style={commonStyles.input}
              value={tagsInput}
              onChangeText={setTagsInput}
              placeholder="Tags (comma separated)"
              placeholderTextColor={colors.textMuted}
            />
            <View style={styles.editActions}>
              <Pressable
                style={commonStyles.btnSecondary}
                onPress={() => setEditing(false)}>
                <Text style={commonStyles.btnSecondaryText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[commonStyles.btnPrimary, busy && styles.disabled]}
                onPress={saveEdit}
                disabled={busy}>
                <Text style={commonStyles.btnPrimaryText}>Save</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.titleRow}>
              <Text
                style={[styles.title, todo.completed && styles.titleDone]}
                numberOfLines={2}>
                {todo.title}
              </Text>
              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: priorityStyle.bg },
                ]}>
                <Text
                  style={[styles.priorityText, { color: priorityStyle.text }]}>
                  {todo.priority}
                </Text>
              </View>
            </View>
            {todo.description ? (
              <Text style={styles.description}>{todo.description}</Text>
            ) : null}
            <View style={styles.badges}>
              {categoryName ? (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{categoryName}</Text>
                </View>
              ) : null}
              {dueLabel ? (
                <View
                  style={[styles.dueBadge, overdue && styles.dueBadgeOverdue]}>
                  <Text
                    style={[
                      styles.dueBadgeText,
                      overdue && styles.dueBadgeTextOverdue,
                    ]}>
                    {overdue ? `Overdue · ${dueLabel}` : `Due ${dueLabel}`}
                  </Text>
                </View>
              ) : null}
              {todo.pendingSync ? (
                <View style={styles.syncBadge}>
                  <Text style={styles.syncText}>Pending sync</Text>
                </View>
              ) : null}
              {todo.tags.map(tag => (
                <View key={tag} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      {!editing && (
        <View style={styles.actions}>
          <Pressable
            style={commonStyles.btnGhost}
            onPress={() => setEditing(true)}>
            <Text style={commonStyles.btnGhostText}>Edit</Text>
          </Pressable>
          <Pressable style={commonStyles.btnGhost} onPress={handleDelete}>
            <Text style={commonStyles.btnGhostDangerText}>Delete</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
