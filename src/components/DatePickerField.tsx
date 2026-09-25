import { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';

interface DatePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function formatDisplay(value: string): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DatePickerField({
  value,
  onChange,
  placeholder = 'Select due date',
}: DatePickerFieldProps) {
  const { colors, commonStyles } = useTheme();
  const [show, setShow] = useState(false);
  const date = value ? new Date(value) : new Date();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        field: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        value: { color: colors.text, fontSize: 16 },
        placeholder: { color: colors.textMuted, fontSize: 16 },
        clear: { color: colors.primary, fontSize: 14, fontWeight: '600' },
        doneBtn: {
          alignSelf: 'flex-end',
          paddingVertical: 8,
          paddingHorizontal: 4,
        },
        doneText: { color: colors.primary, fontWeight: '600', fontSize: 16 },
      }),
    [colors],
  );

  function handleChange(event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (event.type === 'dismissed') {
      setShow(false);
      return;
    }
    if (selected) {
      onChange(selected.toISOString().slice(0, 10));
    }
  }

  return (
    <View>
      <Pressable
        style={[commonStyles.input, styles.field]}
        onPress={() => setShow(true)}>
        <Text style={value ? styles.value : styles.placeholder}>
          {value ? formatDisplay(value) : placeholder}
        </Text>
        {value ? (
          <Pressable
            onPress={e => {
              e.stopPropagation?.();
              onChange('');
            }}
            hitSlop={8}>
            <Text style={styles.clear}>Clear</Text>
          </Pressable>
        ) : null}
      </Pressable>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}

      {show && Platform.OS === 'ios' && (
        <Pressable style={styles.doneBtn} onPress={() => setShow(false)}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      )}
    </View>
  );
}
