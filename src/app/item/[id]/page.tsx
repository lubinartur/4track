import { notFound } from 'next/navigation';
import ItemPage from '@/components/item/ItemPage';
import { itemRouteIds } from '@/app/item/itemData';
import { resolveItemDetail } from '@/app/item/resolveItemDetail';

type PageProps = {
  params: Promise<{ id: string }>;
};

/** Allow any `/item/[id]` at request time; unknown slugs call `notFound()`. */
export const dynamicParams = true;

export default async function ItemRoutePage({ params }: PageProps) {
  const { id } = await params;
  const item = await resolveItemDetail(id);
  if (!item) notFound();
  return <ItemPage item={item} />;
}

export function generateStaticParams() {
  return itemRouteIds.map((id) => ({ id }));
}
