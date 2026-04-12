import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../theme/colors';

type AppBackgroundProps = {
  children: React.ReactNode;
};

/** Soft orange ambient glow — mirrors web SVG lighting without extra assets */
export function AppBackground({ children }: AppBackgroundProps) {
  return (
    <View style={styles.root}>
      <View style={styles.glowTopLeft} pointerEvents="none">
        <LinearGradient
          colors={['rgba(255,91,0,0.22)', 'transparent']}
          style={styles.glowBlob}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>
      <View style={styles.glowBottomRight} pointerEvents="none">
        <LinearGradient
          colors={['rgba(255,91,0,0.18)', 'transparent']}
          style={styles.glowBlob}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
        />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  glowTopLeft: {
    position: 'absolute',
    left: -80,
    top: -60,
    width: 280,
    height: 280,
    opacity: 0.9,
  },
  glowBottomRight: {
    position: 'absolute',
    right: -100,
    bottom: 120,
    width: 320,
    height: 320,
    opacity: 0.85,
  },
  glowBlob: {
    flex: 1,
    borderRadius: 200,
  },
});
