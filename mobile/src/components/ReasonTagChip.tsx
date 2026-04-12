import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

type ReasonTagChipProps = {
  label: string;
};

export function ReasonTagChip({ label }: ReasonTagChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.chipBg,
    borderRadius: 17,
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 32,
    justifyContent: 'center',
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '400',
  },
});
