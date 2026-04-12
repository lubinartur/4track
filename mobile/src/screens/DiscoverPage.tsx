import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

const HORIZONTAL = 16;

/** Discover tab — lightweight placeholder; swap for full Discover UI later. */
export function DiscoverPage() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Discover</Text>
      <Text style={styles.subtitle}>Search films, series, anime, and books.</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Discovery feed and search will connect here. This screen confirms tab navigation.
        </Text>
      </View>
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
    gap: 12,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
