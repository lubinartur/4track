import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';

type ActionButtonsRowProps = {
  onAdd?: () => void;
  onWatched?: () => void;
  onFavorite?: () => void;
};

export function ActionButtonsRow({ onAdd, onWatched, onFavorite }: ActionButtonsRowProps) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add to queue"
        onPress={onAdd}
        style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      >
        <Ionicons name="add" size={18} color={colors.text} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Mark as watched"
        onPress={onWatched}
        style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      >
        <Ionicons name="checkmark" size={18} color={colors.text} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Favorite"
        onPress={onFavorite}
        style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      >
        <Ionicons name="star-outline" size={18} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 13,
  },
  btn: {
    width: 57,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.85,
  },
});
