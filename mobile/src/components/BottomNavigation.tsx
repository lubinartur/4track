import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';

export type TabId = 'home' | 'discover' | 'library' | 'profile';

type BottomNavigationProps = {
  active: TabId;
  onTabPress?: (tab: TabId) => void;
  onFabPress?: () => void;
};

const tabs: { id: TabId; label: string; icon: keyof typeof Ionicons.glyphMap; iconActive: keyof typeof Ionicons.glyphMap }[] =
  [
    { id: 'home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
    { id: 'discover', label: 'Discover', icon: 'search-outline', iconActive: 'search' },
    { id: 'library', label: 'Library', icon: 'layers-outline', iconActive: 'layers' },
    { id: 'profile', label: 'Profile', icon: 'settings-outline', iconActive: 'settings' },
  ];

export function BottomNavigation({ active, onTabPress, onFabPress }: BottomNavigationProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.shell, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.bar}>
        {/* Left: equal-width columns so Home / Discover hits and order are unambiguous (LTR) */}
        <View style={styles.side}>
          <View style={styles.tabHalf}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Home"
              hitSlop={12}
              onPress={() => onTabPress?.('home')}
              style={styles.tab}
            >
              <Ionicons
                name={active === 'home' ? 'home' : 'home-outline'}
                size={24}
                color={active === 'home' ? colors.accent : colors.textSecondary}
              />
              <Text style={[styles.tabLabel, active === 'home' && styles.tabLabelActive]}>Home</Text>
            </Pressable>
          </View>
          <View style={styles.tabHalf}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Discover"
              hitSlop={12}
              onPress={() => onTabPress?.('discover')}
              style={styles.tab}
            >
              <Ionicons
                name={active === 'discover' ? 'search' : 'search-outline'}
                size={24}
                color={active === 'discover' ? colors.accent : colors.textSecondary}
              />
              <Text style={[styles.tabLabel, active === 'discover' && styles.tabLabelActive]}>Discover</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.fabSlot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add"
            onPress={onFabPress}
            style={({ pressed }) => [styles.fabOuter, pressed && { opacity: 0.9 }]}
          >
            <View style={styles.fabRotate}>
              <Ionicons name="add" size={26} color={colors.text} />
            </View>
          </Pressable>
        </View>

        <View style={styles.side}>
          <View style={styles.tabHalf}>
            <TabButton
              tab={tabs[2]}
              active={active}
              onPress={() => onTabPress?.('library')}
            />
          </View>
          <View style={styles.tabHalf}>
            <TabButton
              tab={tabs[3]}
              active={active}
              onPress={() => onTabPress?.('profile')}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function TabButton({
  tab,
  active,
  onPress,
}: {
  tab: (typeof tabs)[0];
  active: TabId;
  onPress?: () => void;
}) {
  const isActive = active === tab.id;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={tab.label}
      onPress={onPress}
      style={styles.tab}
    >
      <Ionicons
        name={isActive ? tab.iconActive : tab.icon}
        size={24}
        color={isActive ? colors.accent : colors.textSecondary}
      />
      <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: 'rgba(22,22,32,0.92)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 10,
    minHeight: 68,
    direction: 'ltr',
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    direction: 'ltr',
  },
  tabHalf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tab: {
    alignItems: 'center',
    gap: 4,
    minWidth: 64,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.accent,
  },
  fabSlot: {
    width: 72,
    alignItems: 'center',
    marginTop: -28,
  },
  fabOuter: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
    transform: [{ rotate: '45deg' }],
  },
  fabRotate: {
    transform: [{ rotate: '-45deg' }],
  },
});
