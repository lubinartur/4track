import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';

type TasteInsightCardProps = {
  headline: string;
  similarLine: string;
  similarTitles: string;
  onExploreTaste?: () => void;
};

export function TasteInsightCard({
  headline,
  similarLine,
  similarTitles,
  onExploreTaste,
}: TasteInsightCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>TASTE INSIGHT</Text>
      <Text style={styles.headline}>{headline}</Text>
      <View>
        <Text style={[styles.body, styles.muted]}>{similarLine}</Text>
        <Text style={[styles.body, styles.titles]}>{similarTitles}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onExploreTaste}
        style={({ pressed }) => [styles.ctaRow, pressed && { opacity: 0.8 }]}
      >
        <Text style={styles.cta}>Explore taste</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.accent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 326,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    padding: 16,
    gap: 12,
  },
  eyebrow: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  headline: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  muted: {
    color: colors.textSecondary,
    marginBottom: 4,
  },
  titles: {
    color: colors.text,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cta: {
    color: colors.accent,
    fontSize: 12,
  },
});
