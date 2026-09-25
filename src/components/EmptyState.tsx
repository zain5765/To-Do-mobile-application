import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BrandIcon from './BrandIcon';
import { useTheme } from '../context/ThemeContext';

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

export default function EmptyState({ title, subtitle }: EmptyStateProps) {
  const { colors, commonStyles } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: 'center',
          paddingVertical: 24,
          gap: 8,
        },
        iconWrap: {
          transform: [{ scale: 0.85 }],
          marginBottom: 4,
        },
        title: {
          fontSize: 18,
          fontWeight: '600',
          color: colors.text,
          textAlign: 'center',
        },
      }),
    [colors],
  );

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <BrandIcon />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={commonStyles.mutedText}>{subtitle}</Text>
    </View>
  );
}
