import { StyleSheet } from 'react-native';
import type { ThemeColors } from './palettes';
import { createShadows, radius } from './palettes';

export function createCommonStyles(colors: ThemeColors) {
  const shadows = createShadows(colors);

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.lg,
    },
    panel: {
      backgroundColor: colors.surface,
      borderRadius: radius.xxl,
      padding: 22,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.md,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.8,
    },
    subtitle: {
      fontSize: 15,
      color: colors.textMuted,
      marginTop: 6,
      lineHeight: 22,
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 10,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textMuted,
      marginBottom: 8,
      letterSpacing: 0.2,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: 16,
      paddingVertical: 13,
      backgroundColor: colors.surfaceMuted,
      color: colors.text,
      fontSize: 16,
    },
    btnPrimary: {
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      paddingVertical: 14,
      paddingHorizontal: 18,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.primary,
    },
    btnPrimaryText: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    btnSecondary: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      paddingVertical: 11,
      paddingHorizontal: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.sm,
    },
    btnSecondaryText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    btnGhost: {
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    btnGhostText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    btnGhostDangerText: {
      color: colors.danger,
      fontSize: 14,
      fontWeight: '600',
    },
    errorText: {
      color: colors.danger,
      fontSize: 14,
    },
    successText: {
      color: colors.success,
      fontSize: 14,
    },
    mutedText: {
      color: colors.textMuted,
      fontSize: 15,
    },
    segmentBar: {
      flexDirection: 'row',
      gap: 4,
      padding: 4,
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    segmentButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: radius.md,
      alignItems: 'center',
    },
    segmentButtonActive: {
      backgroundColor: colors.surfaceElevated,
      ...shadows.sm,
    },
    segmentText: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: '600',
    },
    segmentTextActive: {
      color: colors.primary,
      fontWeight: '700',
    },
  });
}
