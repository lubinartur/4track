import type { ReactElement } from 'react';

import type { TabId } from '../components/BottomNavigation';
import { DiscoverPage } from '../screens/DiscoverPage';
import { FigmaHomePage } from '../screens/FigmaHomePage';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

/**
 * Single place that maps tab id → screen component.
 * Home tab must only ever mount `FigmaHomePage` (Figma 92:368).
 */
export function renderMainTab(tab: TabId): ReactElement | null {
  switch (tab) {
    case 'home':
      return <FigmaHomePage key="route-home" />;
    case 'discover':
      return <DiscoverPage key="route-discover" />;
    case 'library':
      return <PlaceholderScreen key="route-library" title="Library" />;
    case 'profile':
      return <PlaceholderScreen key="route-profile" title="Profile" />;
    default:
      return null;
  }
}
