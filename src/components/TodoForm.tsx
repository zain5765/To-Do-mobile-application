import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import type { Category, TodoPriority } from '../types';
import DatePickerField from './DatePickerField';

interface TodoFormProps {
  categories: Category[];
  onSubmit: (data: {
    title: string;
    description?: string;
    dueDate?: string | null;
    priority?: TodoPriority;
    tags?: string[];
    categoryId?: string | null;
  }) => Promise<void>;
}

const PRIORITIES: { value: TodoPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function TodoForm({ categories, onSubmit }: TodoFormProps) {
  const { colors, commonStyles, radius, shadows } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        form: { gap: 12 },
        row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
        titleInput: { flex: 1 },
        addBtn: {
          width: 48,
          height: 48,
          minWidth: 48,
          borderRadius: 24,
          paddingVertical: 0,
          paddingHorizontal: 0,
        },
        addBtnText: {
          color: colors.onPrimary,
          fontSize: 26,
          fontWeight: '400',
          lineHeight: 28,
          marginTop: -1,
        },
        disabled: { opacity: 0.7 },
        priorityRow: { flexDirection: 'row', gap: 8 },
        priorityChip: {
          flex: 1,
          paddingVertical: 9,
          borderRadius: radius.pill,
          backgroundColor: colors.surfaceMuted,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'transparent',
        },
        priorityChipActive: {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.primaryBorder,
          ...shadows.sm,
        },
        priorityChipText: {
          color: colors.textMuted,
          fontSize: 14,
          fontWeight: '500',
        },
        priorityChipTextActive: {
          color: colors.primary,
          fontWeight: '600',
        },
        categoryRow: { gap: 8 },
        categoryChip: {
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: radius.pill,
          backgroundColor: colors.surfaceMuted,
          borderWidth: 1,
          borderColor: 'transparent',
        },
        categoryChipActive: {
          backgroundColor: colors.primaryLight,
          borderColor: colors.primaryBorder,
        },
        categoryChipText: {
          fontSize: 13,
          color: colors.textMuted,
          fontWeight: '500',
        },
        categoryChipTextActive: {
          color: colors.primary,
          fontWeight: '700',
        },
      }),
    [colors, radius, shadows],
  );

  async function handleSubmit() {
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || null,
        priority,
        tags: tags.length ? tags : undefined,
        categoryId,
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setCategoryId(null);
      setTagsInput('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.form}>
      <View style={styles.row}>
        <TextInput
          style={[commonStyles.input, styles.titleInput]}
          placeholder="What needs to be done?"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />
        <Pressable
          style={[
            commonStyles.btnPrimary,
            styles.addBtn,
            submitting && styles.disabled,
          ]}
          onPress={handleSubmit}
          disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color={colors.onPrimary} size="small" />
          ) : (
            <Text style={styles.addBtnText}>+</Text>
          )}
        </Pressable>
      </View>

      <TextInput
        style={commonStyles.input}
        placeholder="Description (optional)"
        placeholderTextColor={colors.textMuted}
        value={description}
        onChangeText={setDescription}
      />

      <DatePickerField
        value={dueDate}
        onChange={setDueDate}
        placeholder="Due date (optional)"
      />

      {categories.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}>
          <Pressable
            style={[
              styles.categoryChip,
              categoryId === null && styles.categoryChipActive,
            ]}
            onPress={() => setCategoryId(null)}>
            <Text
              style={[
                styles.categoryChipText,
                categoryId === null && styles.categoryChipTextActive,
              ]}>
              No project
            </Text>
          </Pressable>
          {categories.map(cat => (
            <Pressable
              key={cat.id}
              style={[
                styles.categoryChip,
                categoryId === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setCategoryId(cat.id)}>
              <Text
                style={[
                  styles.categoryChipText,
                  categoryId === cat.id && styles.categoryChipTextActive,
                ]}>
                {cat.icon} {cat.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      <View style={styles.priorityRow}>
        {PRIORITIES.map(item => (
          <Pressable
            key={item.value}
            style={[
              styles.priorityChip,
              priority === item.value && styles.priorityChipActive,
            ]}
            onPress={() => setPriority(item.value)}>
            <Text
              style={[
                styles.priorityChipText,
                priority === item.value && styles.priorityChipTextActive,
              ]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        style={commonStyles.input}
        placeholder="Tags (comma separated)"
        placeholderTextColor={colors.textMuted}
        value={tagsInput}
        onChangeText={setTagsInput}
      />
    </View>
  );
}
