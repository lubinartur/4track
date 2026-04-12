import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground } from './src/components/AppBackground';
import { BottomNavigation, type TabId } from './src/components/BottomNavigation';
import { renderMainTab } from './src/navigation/renderMainTab';
import { colors } from './src/theme/colors';

export default function App() {
  const [tab, setTab] = useState<TabId>('home');

  const handleTabPress = (id: TabId) => {
    setTab(id);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <AppBackground>
          <StatusBar style="light" />
          <View style={styles.screenStack} collapsable={false}>
            {renderMainTab(tab)}
          </View>
          {/* Must sit above main content and capture touches; box-none was letting taps fall through to ScrollView */}
          <View style={styles.navDock} pointerEvents="auto">
            <BottomNavigation active={tab} onTabPress={handleTabPress} onFabPress={() => {}} />
          </View>
        </AppBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenStack: {
    flex: 1,
    zIndex: 0,
  },
  navDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 24,
  },
});
