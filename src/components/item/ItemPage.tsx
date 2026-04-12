import AppBackgroundLighting from '@/components/AppBackgroundLighting';
import BottomNavigation from '@/components/BottomNavigation';
import MovieRow from '@/components/MovieRow';
import SectionHeader from '@/components/SectionHeader';
import TasteInsightCard from '@/components/TasteInsightCard';
import type { ItemDetail } from '@/types/item';
import ItemBackdrop from './ItemBackdrop';
import ItemCreditsGrid from './ItemCreditsGrid';
import ItemPageHeroBlock from './ItemPageHeroBlock';

type ItemPageProps = {
  item: ItemDetail;
};

export default function ItemPage({ item }: ItemPageProps) {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[390px] overflow-x-hidden bg-[#161620]">
      <AppBackgroundLighting />
      <ItemBackdrop posterUrl={item.posterUrl} alt="" />

      <div className="relative z-[1] flex flex-col px-4 pb-40 pt-3">
        <ItemPageHeroBlock item={item} />

        <section className="mt-10" aria-labelledby="item-overview-heading">
          <h2
            id="item-overview-heading"
            className="text-[12px] font-normal uppercase leading-none tracking-[1.2px] text-[rgba(255,255,255,0.5)]"
          >
            Overview
          </h2>
          <p className="mt-3 max-w-[358px] text-[14px] font-normal leading-5 text-white">{item.overview}</p>
        </section>

        <section className="mt-10" aria-label="Credits">
          <ItemCreditsGrid credits={item.credits} />
        </section>

        <div className="mt-8">
          <TasteInsightCard
            entryCount={item.tasteInsight.entryCount}
            description={item.tasteInsight.description}
          />
        </div>

        <section className="mt-8 flex flex-col gap-4">
          <SectionHeader title="Similar for you" actionLabel="See all" />
          <MovieRow items={item.similar} />
        </section>

        <BottomNavigation activeItem="discover" />
      </div>
    </div>
  );
}
