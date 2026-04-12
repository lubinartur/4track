import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';

type MovieMetaRowProps = {
  rating: string;
  year: number;
  genresLabel: string;
};

export function MovieMetaRow({ rating, year, genresLabel }: MovieMetaRowProps) {
  return (
    <View style={styles.row}>
      <Ionicons name="star" size={14} color={colors.accent} />
      <Text style={styles.rating}>{rating}</Text>
      <View style={styles.dot} />
      <Text style={styles.meta}>{year}</Text>
      <View style={styles.dot} />
      <Text style={styles.meta}>{genresLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  rating: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '500',
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textSecondary,
  },
});
