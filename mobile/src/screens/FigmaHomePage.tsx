/**
 * Home tab — built from Figma HomePage frame (node 92:368).
 * Greeting, HeroMovieCard, TasteInsightCard, RecommendedSection (horizontal posters).
 */
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

import { HeroMovieCard } from '../components/HeroMovieCard';
import { RecommendedSection } from '../components/RecommendedSection';
import { TasteInsightCard } from '../components/TasteInsightCard';
import { mockHeroMovie, mockRecommended, mockTasteInsight } from '../data/mockHome';
import { colors } from '../theme/colors';

const { width: SCREEN_W } = Dimensions.get('window');
const HORIZONTAL = 16;
const HERO_W = Math.min(326, SCREEN_W - HORIZONTAL * 2);

export function FigmaHomePage() {
  return (
    <ScrollView
      testID="figma-home-page"
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>Hello, ar4</Text>

      <HeroMovieCard movie={mockHeroMovie} cardWidth={HERO_W} />

      <View style={styles.tasteBlock}>
        <TasteInsightCard
          headline={mockTasteInsight.headline}
          similarLine={mockTasteInsight.similarLine}
          similarTitles={mockTasteInsight.similarTitles}
          onExploreTaste={() => {}}
        />
      </View>

      <RecommendedSection items={mockRecommended} onSeeAll={() => {}} />
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
    gap: 24,
  },
  greeting: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  tasteBlock: {
    marginTop: 8,
  },
});
