import WixImage from '@/app/components/wix-image';
import { fetchProductById } from '@/app/lib/wix-api';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import { ArrowLeftIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReviewsInfiniteList from '@/app/components/reviews/reviews-infinite-list';
import { fetchReviewsCount } from '@/app/lib/wix-api.reviews';
import CreateReviewButton from '@/app/components/reviews/create-review-button';
import { fetchLoggedInMember } from '@/app/lib/wix-api.members';

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
    title: `${product.name} reviews`,
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
  const wixClient = await getWixServerClient();
  const [product, reviewsCount, member] = await Promise.all([
    fetchProductById(wixClient, id),
    fetchReviewsCount(wixClient, { productId: id }),
    fetchLoggedInMember(wixClient),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <div>
        <Link href={`/products/${product._id}`} className="group flex w-max items-center gap-x-2">
          <span className="group-hover:text-primary">
            <ArrowLeftIcon />
          </span>
          <WixImage
            wixMediaIdentifier={product.media?.mainMedia?.image?.url}
            alt={product.media?.mainMedia?.image?.altText}
            targetWidth={64}
            targetHeight={64}
            scaleToFill
            className="rounded-lg border"
          />
          <h4 className="font-semibold">{product.name}</h4>
        </Link>
      </div>
      <hr />
      <div>
        <CreateReviewButton product={product} loggedInMember={member} />
      </div>
      <h2 className="text-center text-2xl font-semibold">Reviews ({reviewsCount})</h2>
      <ReviewsInfiniteList filters={{ productId: product._id }} loggedInMember={member} />
    </main>
  );
}
