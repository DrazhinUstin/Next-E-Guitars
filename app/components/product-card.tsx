/* eslint-disable @next/next/no-img-element */
import { products } from '@wix/stores';
import { media as wixMedia } from '@wix/sdk';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { EyeIcon } from 'lucide-react';

export default function ProductCard({ product }: { product: products.Product }) {
  const { _id, name, description, media } = product;

  const scaledMainImageUrl =
    media?.mainMedia?.image?.url &&
    wixMedia.getScaledToFillImageUrl(`${media.mainMedia.image.url}`, 500, 500, {});

  return (
    <article className="group relative space-y-4 rounded-lg border bg-card p-4 text-center text-card-foreground shadow-md">
      <img
        src={scaledMainImageUrl ?? '/no_image_placeholder.png'}
        alt={media?.mainMedia?.image?.altText || 'Product image'}
      />
      <h4 className="font-semibold">{name}</h4>
      <div className="line-clamp-4" dangerouslySetInnerHTML={{ __html: description ?? '' }} />
      <div className="invisible absolute inset-0 grid place-items-center bg-card/50 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
        <Button asChild className="scale-0 transform transition-all group-hover:scale-100">
          <Link href={`/products/${_id}`}>
            <EyeIcon /> View
          </Link>
        </Button>
      </div>
    </article>
  );
}
