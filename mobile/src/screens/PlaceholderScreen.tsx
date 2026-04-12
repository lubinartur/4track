import { ScrollView, StyleSheet, Text } from 'react-native';

import { colors } from '../theme/colors';

const HORIZONTAL = 16;

type PlaceholderScreenProps = {
  title: string;
};

export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.muted}>Coming soon.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: HORIZONTAL,
    paddingTop: 8,
    paddingBottom: 120,
    gap: 8,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
  },
  muted: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
