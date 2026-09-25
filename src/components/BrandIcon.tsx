import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function BrandIcon() {
  const { colors, shadows } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          width: 68,
          height: 68,
          borderRadius: 34,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
          backgroundColor: colors.primaryLight,
          borderWidth: 1,
          borderColor: colors.primaryBorder,
          ...shadows.md,
        },
        icon: {
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          ...shadows.primary,
        },
        check: {
          color: colors.onPrimary,
          fontSize: 22,
          fontWeight: '700',
        },
      }),
    [colors, shadows],
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Text style={styles.check}>✓</Text>
      </View>
    </View>
  );
}
