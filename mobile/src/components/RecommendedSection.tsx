import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { RecommendedPoster } from '../data/mockHome';
import { colors } from '../theme/colors';

const POSTER_W = 120;
const POSTER_H = 180;

type RecommendedSectionProps = {
  title?: string;
  items: RecommendedPoster[];
  onSeeAll?: () => void;
};

export function RecommendedSection({
  title = 'More matches',
  items,
  onSeeAll,
}: RecommendedSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Pressable onPress={onSeeAll} hitSlop={8} style={({ pressed }) => pressed && { opacity: 0.8 }}>
          <View style={styles.seeAllRow}>
            <Text style={styles.seeAll}>See all</Text>
            <Text style={styles.arrow}> →</Text>
          </View>
        </Pressable>
      </View>
      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.posterWrap}>
            <Image source={{ uri: item.posterUrl }} style={styles.poster} resizeMode="cover" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '500',
  },
  seeAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAll: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '400',
  },
  arrow: {
    color: colors.accent,
    fontSize: 12,
  },
  listContent: {
    paddingVertical: 2,
    paddingRight: 16,
  },
  posterWrap: {
    width: POSTER_W,
    height: POSTER_H,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surfaceElevated,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  poster: {
    width: POSTER_W,
    height: POSTER_H,
  },
});
