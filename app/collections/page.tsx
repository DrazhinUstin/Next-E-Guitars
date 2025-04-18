import { fetchCollections } from '@/app/lib/wix-api.collections';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import WixImage from '@/app/components/wix-image';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collections',
};

export default async function Page() {
  const wixClient = await getWixServerClient();
  const collections = await fetchCollections(wixClient);
  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-semibold">Collections</h2>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(288px,_1fr))] gap-8">
        {collections.map((collection) => (
          <Link key={collection._id} href={`/collections/${collection.slug}`}>
            <article className="group relative overflow-hidden rounded-lg text-white">
              <WixImage
                wixMediaIdentifier={collection.media?.mainMedia?.image?.url}
                targetWidth={500}
                targetHeight={500}
                scaleToFill
                alt={collection.media?.mainMedia?.image?.altText}
                className="h-80 w-full transform object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col justify-center gap-y-2 px-2">
                <div className="flex items-center justify-center gap-x-2">
                  <h2 className="text-2xl font-semibold">{collection.name}</h2>
                  <ChevronRightIcon className="transition-transform duration-1000 group-hover:translate-x-1" />
                </div>
                <p className="text-center font-medium">
                  {collection.numberOfProducts}{' '}
                  {(collection.numberOfProducts ?? 0) > 1 ? 'products' : 'product'}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
