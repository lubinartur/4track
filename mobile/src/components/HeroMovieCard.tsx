import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import type { HeroMovie } from '../data/mockHome';
import { colors } from '../theme/colors';
import { ActionButtonsRow } from './ActionButtonsRow';
import { MovieMetaRow } from './MovieMetaRow';
import { ReasonTagChip } from './ReasonTagChip';

type HeroMovieCardProps = {
  movie: HeroMovie;
  cardWidth: number;
};

export function HeroMovieCard({ movie, cardWidth }: HeroMovieCardProps) {
  const heroHeight = Math.round((470 / 326) * cardWidth);

  return (
    <View style={[styles.card, { width: cardWidth, height: heroHeight }]}>
      <Image source={{ uri: movie.posterUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />

      <LinearGradient
        colors={['rgba(92,92,134,0)', 'rgba(16,16,24,0.28)', colors.surface]}
        locations={[0, 0.45, 1]}
        style={styles.gradient}
      />

      <View style={styles.badgeWrap}>
        <View style={styles.badge}>
          <Ionicons name="flash" size={14} color={colors.accent} />
          <Text style={styles.badgeText}>
            AI MATCH {movie.aiMatchPercent}%
          </Text>
        </View>
      </View>

      <View style={styles.bottomContent}>
        <Text style={styles.title}>{movie.title}</Text>
        <View style={styles.metaWrap}>
          <MovieMetaRow rating={movie.rating} year={movie.year} genresLabel={movie.genresLabel} />
        </View>
        <View style={styles.tagsRow}>
          {movie.reasonTags.map((tag) => (
            <ReasonTagChip key={tag} label={tag} />
          ))}
        </View>
        <ActionButtonsRow onAdd={() => {}} onWatched={() => {}} onFavorite={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '62%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  badgeWrap: {
    position: 'absolute',
    top: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '400',
  },
  bottomContent: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  metaWrap: {
    width: '100%',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    maxWidth: 260,
  },
});
