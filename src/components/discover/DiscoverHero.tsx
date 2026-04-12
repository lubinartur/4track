'use client';

import SearchBar from '@/components/SearchBar';
import Tabs from '@/components/Tabs';
import TasteInsightCard from '@/components/TasteInsightCard';
import { discoverTabItems, tasteInsightContent } from '@/app/discover/mockData';

type DiscoverHeroProps = {
  activeTab: string;
  onTabChange: (id: string) => void;
  /** Search field placeholder (default matches main Discover). */
  searchPlaceholder?: string;
  /** Initial input value (e.g. active query on search results). */
  searchDefaultValue?: string;
  /** Orange border on search bar (Figma search-with-query). */
  searchEmphasized?: boolean;
  /** Search input `id` / label target (avoid duplicate ids on other screens). */
  searchInputId?: string;
  /** Controlled search value (Discover Search typing). */
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  /** Enter — trimmed query (navigate / update URL). */
  onSearchSubmit?: (query: string) => void;
  /** When false, omits taste insight (e.g. Discover Search results). Default true. */
  showTasteInsight?: boolean;
};

export default function DiscoverHero({
  activeTab,
  onTabChange,
  searchPlaceholder = 'Search films...',
  searchDefaultValue,
  searchEmphasized = false,
  searchInputId = 'discover-search',
  searchValue,
  onSearchValueChange,
  onSearchSubmit,
  showTasteInsight = true,
}: DiscoverHeroProps) {
  return (
    <>
      <h1 className="mt-5 text-[32px] font-bold leading-none tracking-normal text-white">
        Discover
      </h1>

      <div className="mt-4 min-w-0 w-full">
        <Tabs items={discoverTabItems} activeItem={activeTab} onChange={onTabChange} />
      </div>

      <div className="mt-[22px]">
        <SearchBar
          placeholder={searchPlaceholder}
          defaultValue={searchValue === undefined ? searchDefaultValue : undefined}
          value={searchValue}
          onValueChange={onSearchValueChange}
          onSubmitQuery={onSearchSubmit}
          emphasized={searchEmphasized}
          inputId={searchInputId}
        />
      </div>

      {showTasteInsight ? (
        <div className="mt-4">
          <TasteInsightCard description={tasteInsightContent.description} />
        </div>
      ) : null}
    </>
  );
}
