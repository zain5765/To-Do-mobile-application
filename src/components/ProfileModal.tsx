import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ApiError, api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ProfileModal({ visible, onClose }: ProfileModalProps) {
  const { user, token, setUser } = useAuth();
  const { colors, commonStyles, radius, shadows } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: 'center',
          padding: 20,
        },
        card: {
          backgroundColor: colors.surface,
          borderRadius: radius.xxl,
          padding: 24,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadows.lg,
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        },
        title: {
          fontSize: 22,
          fontWeight: '700',
          color: colors.text,
        },
        close: {
          fontSize: 20,
          color: colors.textMuted,
          padding: 4,
        },
        field: { marginTop: 16, marginBottom: 12 },
        divider: {
          height: 1,
          backgroundColor: colors.border,
          marginVertical: 20,
        },
        disabled: { opacity: 0.7 },
      }),
    [colors, radius, shadows],
  );
  const [name, setName] = useState(user?.name ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleProfileSubmit() {
    if (!token || !name.trim()) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const updated = await api.updateProfile(token, name.trim());
      setUser(updated);
      setMessage('Profile updated');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Update failed');
    } finally {
      setBusy(false);
    }
  }

  async function handlePasswordSubmit() {
    if (!token) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await api.changePassword(token, currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setMessage('Password changed successfully');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Password change failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          <Text style={commonStyles.mutedText}>{user?.email}</Text>

          {message ? <Text style={commonStyles.successText}>{message}</Text> : null}
          {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}

          <View style={styles.field}>
            <Text style={commonStyles.label}>Name</Text>
            <TextInput
              style={commonStyles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          <Pressable
            style={[commonStyles.btnPrimary, busy && styles.disabled]}
            onPress={handleProfileSubmit}
            disabled={busy}>
            <Text style={commonStyles.btnPrimaryText}>Save name</Text>
          </Pressable>

          <View style={styles.divider} />

          <View style={styles.field}>
            <Text style={commonStyles.label}>Current password</Text>
            <TextInput
              style={commonStyles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />
          </View>
          <View style={styles.field}>
            <Text style={commonStyles.label}>New password</Text>
            <TextInput
              style={commonStyles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="8+ chars, upper, lower, number"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
            />
          </View>

          <Pressable
            style={[commonStyles.btnSecondary, busy && styles.disabled]}
            onPress={handlePasswordSubmit}
            disabled={busy}>
            <Text style={commonStyles.btnSecondaryText}>Change password</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
