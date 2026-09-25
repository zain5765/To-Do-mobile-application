import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errors';
import { useTheme } from '../context/ThemeContext';
import BrandIcon from './BrandIcon';
import GradientBackground from './GradientBackground';

type AuthMode = 'login' | 'register' | 'forgot';

export default function AuthPage() {
  const { login, register } = useAuth();
  const { colors, commonStyles } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        flex: { flex: 1 },
        scroll: {
          flexGrow: 1,
          justifyContent: 'center',
          padding: 24,
        },
        card: {
          width: '100%',
          maxWidth: 440,
          alignSelf: 'center',
          padding: 32,
        },
        brand: { alignItems: 'center', marginBottom: 28 },
        tagline: {
          color: colors.textMuted,
          fontSize: 15,
          textAlign: 'center',
          marginTop: 8,
        },
        authSubtitle: {
          fontSize: 20,
          fontWeight: '600',
          color: colors.text,
          textAlign: 'center',
          marginBottom: 16,
        },
        field: { marginBottom: 14 },
        disabled: { opacity: 0.7 },
        link: {
          color: colors.primary,
          textAlign: 'center',
          marginTop: 12,
          fontSize: 15,
        },
      }),
    [colors],
  );
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password.trim()) {
          throw new Error('Email and password are required');
        }
        await login(email, password);
      } else if (mode === 'register') {
        if (!name.trim() || !email.trim() || !password.trim()) {
          throw new Error('All fields are required');
        }
        await register(email, password, name);
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          throw new Error('Email is required');
        }
        const res = await api.forgotPassword(email);
        setSuccess(res.message);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          <View style={[commonStyles.card, styles.card]}>
            <View style={styles.brand}>
              <BrandIcon />
              <Text style={commonStyles.title}>Todoo</Text>
              <Text style={styles.tagline}>
                Organize your day, one task at a time.
              </Text>
            </View>

            {mode === 'login' || mode === 'register' ? (
              <View style={commonStyles.segmentBar}>
                <Pressable
                  style={[
                    commonStyles.segmentButton,
                    mode === 'login' && commonStyles.segmentButtonActive,
                  ]}
                  onPress={() => setMode('login')}>
                  <Text
                    style={[
                      commonStyles.segmentText,
                      mode === 'login' && commonStyles.segmentTextActive,
                    ]}>
                    Sign in
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    commonStyles.segmentButton,
                    mode === 'register' && commonStyles.segmentButtonActive,
                  ]}
                  onPress={() => setMode('register')}>
                  <Text
                    style={[
                      commonStyles.segmentText,
                      mode === 'register' && commonStyles.segmentTextActive,
                    ]}>
                    Register
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Text style={styles.authSubtitle}>Forgot password</Text>
            )}

            {mode === 'register' && (
              <View style={styles.field}>
                <Text style={commonStyles.label}>Name</Text>
                <TextInput
                  style={commonStyles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="words"
                />
              </View>
            )}

            {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
              <View style={styles.field}>
                <Text style={commonStyles.label}>Email</Text>
                <TextInput
                  style={commonStyles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            )}

            {(mode === 'login' || mode === 'register') && (
              <View style={styles.field}>
                <Text style={commonStyles.label}>Password</Text>
                <TextInput
                  style={commonStyles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="8+ chars, upper, lower, number"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                />
              </View>
            )}

            {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}
            {success ? (
              <Text style={commonStyles.successText}>{success}</Text>
            ) : null}

            <Pressable
              style={[commonStyles.btnPrimary, submitting && styles.disabled]}
              onPress={handleSubmit}
              disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={commonStyles.btnPrimaryText}>
                  {mode === 'login'
                    ? 'Sign in'
                    : mode === 'register'
                      ? 'Create account'
                      : 'Send reset link'}
                </Text>
              )}
            </Pressable>

            {mode === 'login' && (
              <Pressable
                onPress={() => {
                  setMode('forgot');
                  setError('');
                  setSuccess('');
                }}>
                <Text style={styles.link}>Forgot password?</Text>
              </Pressable>
            )}

            {mode === 'forgot' && (
              <Pressable
                onPress={() => {
                  setMode('login');
                  setError('');
                  setSuccess('');
                }}>
                <Text style={styles.link}>Back to sign in</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}
