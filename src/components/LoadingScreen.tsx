import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import GradientBackground from './GradientBackground';

export default function LoadingScreen() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        text: {
          marginTop: 12,
          color: colors.textMuted,
          fontSize: 15,
        },
      }),
    [colors],
  );

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </GradientBackground>
  );
}
