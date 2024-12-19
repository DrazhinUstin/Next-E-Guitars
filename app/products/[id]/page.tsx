import { fetchProductById } from '@/app/lib/data';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetails from './product-details';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const product = await fetchProductById(id);

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
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <ProductDetails product={product} />
    </main>
  );
}
