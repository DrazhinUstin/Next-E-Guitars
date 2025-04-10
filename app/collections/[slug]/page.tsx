import PaginatedProducts, {
  PaginatedProductsSkeleton,
} from '@/app/components/products/paginated-products';
import { fetchCollectionBySlug } from '@/app/lib/wix-api.collections';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import WixImage from '@/app/components/wix-image';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const wixClient = await getWixServerClient();
  const collection = await fetchCollectionBySlug(wixClient, slug);

  if (!collection) {
    notFound();
  }

  const mainImage = collection.media?.mainMedia?.image;
  return {
    title: collection.name,
    description: collection.description,
    openGraph: {
      images: mainImage && [
        {
          url: mainImage.url,
          width: mainImage.width,
          height: mainImage.height,
          alt: mainImage.altText ?? '',
        },
      ],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const slug = (await params).slug;
  const page = (await searchParams).page;
  const wixClient = await getWixServerClient();
  const collection = await fetchCollectionBySlug(wixClient, slug);

  if (!collection) {
    return notFound();
  }

  const mainImage = collection.media?.mainMedia?.image;
  return (
    <main className="space-y-8">
      {mainImage ? (
        <div className="relative">
          <WixImage
            wixMediaIdentifier={mainImage.url}
            targetWidth={1280}
            targetHeight={400}
            scaleToFill
            alt={mainImage.altText}
          />
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-b from-black/10 via-black/50 to-black">
            <h2 className="text-center text-2xl font-semibold text-white md:text-4xl">
              {collection.name}
            </h2>
          </div>
        </div>
      ) : (
        <h2 className="text-center text-2xl font-semibold">{collection.name}</h2>
      )}
      <Suspense key={page} fallback={<PaginatedProductsSkeleton />}>
        <PaginatedProducts
          queryOptions={{
            filters: { collectionIds: collection._id ?? undefined },
            page: Number(page) || undefined,
          }}
        />
      </Suspense>
    </main>
  );
}
