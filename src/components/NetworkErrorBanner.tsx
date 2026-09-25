import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface NetworkErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export default function NetworkErrorBanner({
  message,
  onRetry,
}: NetworkErrorBannerProps) {
  const { colors, commonStyles, radius } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        banner: {
          backgroundColor: colors.dangerLight,
          borderWidth: 1,
          borderColor: colors.dangerBorder,
          borderRadius: radius.lg,
          padding: 14,
          gap: 8,
        },
        title: {
          color: colors.danger,
          fontWeight: '700',
          fontSize: 15,
        },
        message: {
          color: colors.danger,
          fontSize: 14,
          lineHeight: 20,
        },
      }),
    [colors, radius],
  );

  return (
    <View style={styles.banner}>
      <Text style={styles.title}>Connection problem</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable style={commonStyles.btnSecondary} onPress={onRetry}>
          <Text style={commonStyles.btnSecondaryText}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
