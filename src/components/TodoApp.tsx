import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTodos } from '../hooks/useTodos';
import type { Category, TodoStatusFilter } from '../types';
import EmptyState from './EmptyState';
import GradientBackground from './GradientBackground';
import NetworkErrorBanner from './NetworkErrorBanner';
import ProfileModal from './ProfileModal';
import SwipeableTodoItem from './SwipeableTodoItem';
import TodoForm from './TodoForm';

const FILTERS: { value: TodoStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

export default function TodoApp() {
  const insets = useSafeAreaInsets();
  const { user, token, logout } = useAuth();
  const { colors, commonStyles, radius, shadows, toggleTheme, isDark } =
    useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [addingProject, setAddingProject] = useState(false);

  const {
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
  } = useTodos(token);

  useEffect(() => {
    setNetworkError(!!error && error.toLowerCase().includes("can't reach"));
  }, [error]);

  const onRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const pendingCount = todos.filter(t => !t.completed).length;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        scroll: { paddingHorizontal: 20, gap: 20 },
        headerTop: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
        },
        greeting: { flex: 1 },
        greetingLine: {
          fontSize: 14,
          color: colors.textMuted,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        },
        greetingName: {
          fontSize: 30,
          fontWeight: '800',
          color: colors.text,
          letterSpacing: -0.8,
          marginTop: 2,
        },
        headerActions: {
          flexDirection: 'row',
          gap: 8,
          alignItems: 'center',
          paddingTop: 2,
        },
        iconBtn: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.surfaceMuted,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        },
        iconBtnText: { fontSize: 16 },
        avatarBtn: {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          ...shadows.primary,
        },
        avatarText: {
          color: colors.onPrimary,
          fontSize: 18,
          fontWeight: '700',
        },
        offlineBanner: {
          backgroundColor: colors.secondaryLight,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: 12,
        },
        offlineText: { color: colors.secondary, fontSize: 14, fontWeight: '600' },
        categoryRow: { gap: 12, paddingRight: 4 },
        projectRow: { gap: 8, paddingVertical: 4 },
        projectChip: {
          paddingHorizontal: 14,
          paddingVertical: 9,
          borderRadius: radius.pill,
          backgroundColor: colors.surfaceMuted,
          borderWidth: 1,
          borderColor: colors.border,
        },
        projectChipActive: {
          backgroundColor: colors.primaryLight,
          borderColor: colors.primaryBorder,
        },
        projectChipText: {
          color: colors.textMuted,
          fontSize: 13,
          fontWeight: '600',
        },
        projectChipTextActive: { color: colors.primary },
        addProjectRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
        addProjectInput: {
          flex: 1,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.md,
          paddingHorizontal: 12,
          paddingVertical: 10,
          color: colors.text,
          backgroundColor: colors.surfaceMuted,
        },
        panel: { gap: 14 },
        searchWrap: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surfaceMuted,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 14,
        },
        searchIcon: { fontSize: 18, color: colors.textDim, marginRight: 8 },
        searchInput: {
          flex: 1,
          paddingVertical: 12,
          fontSize: 16,
          color: colors.text,
        },
        priorityFilter: { flexDirection: 'row', gap: 8 },
        priorityFilterChip: {
          flex: 1,
          paddingVertical: 9,
          borderRadius: radius.pill,
          backgroundColor: colors.surfaceMuted,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'transparent',
        },
        priorityFilterChipActive: {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.primaryBorder,
          ...shadows.sm,
        },
        priorityFilterText: {
          color: colors.textMuted,
          fontSize: 13,
          textTransform: 'capitalize',
        },
        priorityFilterTextActive: {
          color: colors.primary,
          fontWeight: '600',
        },
        sectionTitle: {
          fontSize: 17,
          fontWeight: '700',
          color: colors.text,
          marginTop: 6,
        },
        swipeHint: {
          fontSize: 12,
          color: colors.textDim,
          marginBottom: 4,
        },
        list: { gap: 12 },
        pagination: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
          marginTop: 8,
        },
        statsTitle: {
          fontSize: 17,
          fontWeight: '700',
          color: colors.text,
          marginBottom: 12,
        },
        statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
        statBox: {
          width: '47%',
          flexGrow: 1,
          backgroundColor: colors.surfaceMuted,
          borderRadius: radius.lg,
          padding: 14,
          borderWidth: 1,
          borderColor: colors.border,
        },
        statDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          marginBottom: 8,
        },
        statBoxValue: {
          fontSize: 22,
          fontWeight: '800',
          color: colors.text,
        },
        statBoxLabel: {
          fontSize: 13,
          color: colors.textMuted,
          marginTop: 2,
        },
        categoryCard: {
          width: 132,
          backgroundColor: colors.surface,
          borderRadius: radius.xl,
          padding: 14,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadows.sm,
          gap: 2,
          overflow: 'hidden',
        },
        categoryCardActive: {
          borderColor: colors.primaryBorder,
          ...shadows.md,
        },
        categoryAccent: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
        },
        categoryCount: {
          fontSize: 26,
          color: colors.text,
          fontWeight: '800',
          marginTop: 4,
        },
        categoryLabel: {
          fontSize: 14,
          fontWeight: '600',
          color: colors.textMuted,
          marginBottom: 10,
        },
        progressTrack: {
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.surfaceMuted,
          overflow: 'hidden',
        },
        progressFill: { height: '100%', borderRadius: 2 },
        reminderBanner: {
          backgroundColor: colors.dangerLight,
          borderWidth: 1,
          borderColor: colors.dangerBorder,
          borderRadius: radius.lg,
          padding: 12,
        },
        reminderText: { color: colors.danger, fontSize: 15 },
        reminderStrong: { fontWeight: '700' },
      }),
    [colors, radius, shadows],
  );

  const categoryMap = useMemo(
    () => new Map(categories.map((c: Category) => [c.id, c.name])),
    [categories],
  );

  async function submitNewProject() {
    if (!newProjectName.trim()) return;
    await handleCreateCategory(newProjectName.trim());
    setNewProjectName('');
    setAddingProject(false);
  }

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.greeting}>
              <Text style={styles.greetingLine}>Good day 👋</Text>
              <Text style={styles.greetingName}>{user?.name?.split(' ')[0]}</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable style={styles.iconBtn} onPress={toggleTheme}>
                <Text style={styles.iconBtnText}>{isDark ? '☀️' : '🌙'}</Text>
              </Pressable>
              <Pressable
                style={styles.avatarBtn}
                onPress={() => setShowProfile(true)}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() ?? '?'}
                </Text>
              </Pressable>
              <Pressable style={styles.iconBtn} onPress={logout}>
                <Text style={styles.iconBtnText}>⎋</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}>
          <CategoryCard
            label="All tasks"
            count={pagination.total}
            progress={1}
            accent={colors.primary}
            active={filter === 'all'}
            onPress={() => setFilter('all')}
            styles={styles}
          />
          <CategoryCard
            label="Pending"
            count={pendingCount}
            progress={todos.length > 0 ? pendingCount / todos.length : 0}
            accent={colors.secondary}
            active={filter === 'pending'}
            onPress={() => setFilter('pending')}
            styles={styles}
          />
          <CategoryCard
            label="Overdue"
            count={overdueCount}
            progress={
              pagination.total > 0
                ? Math.min(overdueCount / pagination.total, 1)
                : 0
            }
            accent={colors.danger}
            active={filter === 'overdue'}
            onPress={() => setFilter('overdue')}
            styles={styles}
          />
        </ScrollView>

        {(isOffline || pendingSyncCount > 0) && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>
              {isOffline
                ? 'Offline mode — showing cached tasks'
                : `${pendingSyncCount} change(s) waiting to sync`}
            </Text>
          </View>
        )}

        {overdueCount > 0 && !networkError && (
          <View style={styles.reminderBanner}>
            <Text style={styles.reminderText}>
              You have <Text style={styles.reminderStrong}>{overdueCount}</Text>{' '}
              overdue task{overdueCount > 1 ? 's' : ''}.
            </Text>
          </View>
        )}

        {networkError && error ? (
          <NetworkErrorBanner message={error} onRetry={onRefresh} />
        ) : null}

        <View style={[commonStyles.panel, styles.panel]}>
          <Text style={commonStyles.sectionLabel}>Projects</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.projectRow}>
            <Pressable
              style={[
                styles.projectChip,
                !categoryFilter && styles.projectChipActive,
              ]}
              onPress={() => setCategoryFilter('')}>
              <Text
                style={[
                  styles.projectChipText,
                  !categoryFilter && styles.projectChipTextActive,
                ]}>
                All projects
              </Text>
            </Pressable>
            {categories.map(cat => (
              <Pressable
                key={cat.id}
                style={[
                  styles.projectChip,
                  categoryFilter === cat.id && styles.projectChipActive,
                ]}
                onLongPress={() => handleDeleteCategory(cat.id)}
                onPress={() => setCategoryFilter(cat.id)}>
                <Text
                  style={[
                    styles.projectChipText,
                    categoryFilter === cat.id && styles.projectChipTextActive,
                  ]}>
                  {cat.icon} {cat.name}
                </Text>
              </Pressable>
            ))}
            <Pressable
              style={styles.projectChip}
              onPress={() => setAddingProject(v => !v)}>
              <Text style={styles.projectChipText}>+ New</Text>
            </Pressable>
          </ScrollView>
          {addingProject ? (
            <View style={styles.addProjectRow}>
              <TextInput
                style={styles.addProjectInput}
                placeholder="Project name"
                placeholderTextColor={colors.textDim}
                value={newProjectName}
                onChangeText={setNewProjectName}
              />
              <Pressable style={commonStyles.btnPrimary} onPress={submitNewProject}>
                <Text style={commonStyles.btnPrimaryText}>Add</Text>
              </Pressable>
            </View>
          ) : null}

          <Text style={commonStyles.sectionLabel}>New task</Text>
          <TodoForm categories={categories} onSubmit={handleCreate} />

          <Text style={commonStyles.sectionLabel}>Search & filter</Text>
          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search todos..."
              placeholderTextColor={colors.textDim}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <View style={styles.priorityFilter}>
            {(['', 'low', 'medium', 'high'] as const).map(p => (
              <Pressable
                key={p || 'all'}
                style={[
                  styles.priorityFilterChip,
                  priorityFilter === p && styles.priorityFilterChipActive,
                ]}
                onPress={() => setPriorityFilter(p)}>
                <Text
                  style={[
                    styles.priorityFilterText,
                    priorityFilter === p && styles.priorityFilterTextActive,
                  ]}>
                  {p === '' ? 'All' : p}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={[commonStyles.segmentBar, styles.filterBar]}>
            {FILTERS.map(item => (
              <Pressable
                key={item.value}
                style={[
                  commonStyles.segmentButton,
                  filter === item.value && commonStyles.segmentButtonActive,
                ]}
                onPress={() => setFilter(item.value)}>
                <Text
                  style={[
                    commonStyles.segmentText,
                    filter === item.value && commonStyles.segmentTextActive,
                  ]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {error && !networkError ? (
            <Text style={commonStyles.errorText}>{error}</Text>
          ) : null}

          {loading && !refreshing ? (
            <Text style={commonStyles.mutedText}>Loading todos...</Text>
          ) : todos.length === 0 && !networkError ? (
            <EmptyState
              title={
                filter === 'all' && !search
                  ? 'No todos yet'
                  : 'No matches found'
              }
              subtitle={
                filter === 'all' && !search
                  ? 'Add your first task above to get started.'
                  : 'Try changing your search or filters.'
              }
            />
          ) : todos.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Today's Tasks</Text>
              <Text style={styles.swipeHint}>
                Swipe right to complete · Swipe left to delete
              </Text>
              <View style={styles.list}>
                {todos.map(todo => (
                  <SwipeableTodoItem
                    key={todo.id}
                    todo={todo}
                    categoryName={
                      todo.categoryId
                        ? categoryMap.get(todo.categoryId)
                        : undefined
                    }
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                ))}
              </View>
            </>
          ) : null}

          {pagination.totalPages > 1 && (
            <View style={styles.pagination}>
              <Pressable
                style={commonStyles.btnSecondary}
                disabled={page <= 1}
                onPress={() => setPage(p => p - 1)}>
                <Text style={commonStyles.btnSecondaryText}>Previous</Text>
              </Pressable>
              <Text style={commonStyles.mutedText}>
                Page {pagination.page} of {pagination.totalPages}
              </Text>
              <Pressable
                style={commonStyles.btnSecondary}
                disabled={page >= pagination.totalPages}
                onPress={() => setPage(p => p + 1)}>
                <Text style={commonStyles.btnSecondaryText}>Next</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={[commonStyles.panel, styles.statsCard]}>
          <Text style={styles.statsTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatBox
              label="Total"
              value={String(pagination.total)}
              tint={colors.primary}
              styles={styles}
            />
            <StatBox
              label="On page"
              value={String(todos.length)}
              tint={colors.secondary}
              styles={styles}
            />
            <StatBox
              label="Pending"
              value={String(pendingCount)}
              tint="#8b5cf6"
              styles={styles}
            />
            <StatBox
              label="Overdue"
              value={String(overdueCount)}
              tint={colors.danger}
              styles={styles}
            />
          </View>
        </View>
      </ScrollView>

      <ProfileModal
        visible={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </GradientBackground>
  );
}

function CategoryCard({
  label,
  count,
  progress,
  accent,
  active,
  onPress,
  styles,
}: {
  label: string;
  count: number;
  progress: number;
  accent: string;
  active: boolean;
  onPress: () => void;
  styles: ReturnType<typeof StyleSheet.create>;
}) {
  return (
    <Pressable
      style={[styles.categoryCard, active && styles.categoryCardActive]}
      onPress={onPress}>
      <View style={[styles.categoryAccent, { backgroundColor: accent }]} />
      <Text style={styles.categoryCount}>{count}</Text>
      <Text style={styles.categoryLabel}>{label}</Text>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.round(Math.max(0, Math.min(progress, 1)) * 100)}%`,
              backgroundColor: accent,
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

function StatBox({
  label,
  value,
  tint,
  styles,
}: {
  label: string;
  value: string;
  tint: string;
  styles: ReturnType<typeof StyleSheet.create>;
}) {
  return (
    <View style={styles.statBox}>
      <View style={[styles.statDot, { backgroundColor: tint }]} />
      <Text style={styles.statBoxValue}>{value}</Text>
      <Text style={styles.statBoxLabel}>{label}</Text>
    </View>
  );
}
