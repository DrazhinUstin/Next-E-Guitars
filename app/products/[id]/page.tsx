import { getWixServerClient } from '@/app/lib/wix-client.server';
import { fetchProductById } from '@/app/lib/wix-api';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetails from './product-details';
import { Suspense } from 'react';
import RelatedProducts, { RelatedProductsSkeleton } from '@/app/components/related-products';
import ProductReviews, { ProductReviewsSkeleton } from './product-reviews';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const serverClient = await getWixServerClient();
  const product = await fetchProductById(serverClient, id);

  if (!product) {
    notFound();
  }

  const image = product.media?.mainMedia?.image;
  return {
    title: product.name,
    ...(image
      ? {
          openGraph: {
            images: [
              {
                url: image.url,
                width: image.width,
                height: image.height,
                alt: image.altText ?? '',
              },
            ],
          },
        }
      : {}),
  };
}

export default async function Page({ params }: Props) {
  const id = (await params).id;
  const serverClient = await getWixServerClient();
  const product = await fetchProductById(serverClient, id);

  if (!product) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <ProductDetails product={product} />
      <Suspense fallback={<ProductReviewsSkeleton />}>
        <ProductReviews product={product} />
      </Suspense>
      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProducts productId={product._id} />
      </Suspense>
    </main>
  );
}
