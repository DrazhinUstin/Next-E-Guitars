/* eslint-disable @next/next/no-img-element */
import { products } from '@wix/stores';
import WixImage from '@/app/components/wix-image';
import Badge from '@/app/components/badge';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { EyeIcon } from 'lucide-react';
import { formatCurrency } from '@/app/lib/utils';

export default function ProductCard({ product }: { product: products.Product }) {
  const { _id, name, description, media, ribbon, priceData } = product;
  return (
    <article className="group relative space-y-4 rounded-lg border bg-card p-4 text-center text-card-foreground shadow-md">
      <div className="relative">
        <WixImage
          wixMediaIdentifier={media?.mainMedia?.image?.url}
          scaleToFill={true}
          targetWidth={500}
          targetHeight={500}
          alt={media?.mainMedia?.image?.altText}
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-2">
          {ribbon && <Badge>{ribbon}</Badge>}
          {priceData && <PriceBadge data={priceData} />}
        </div>
      </div>
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

function PriceBadge({ data: { price, discountedPrice, formatted } }: { data: products.PriceData }) {
  if (!price) return null;
  const formattedPrice = formatted?.price ?? formatCurrency(price);
  return (
    <Badge className="bg-secondary text-secondary-foreground">
      {discountedPrice && discountedPrice !== price ? (
        <>
          <span className="text-destructive line-through">{formattedPrice}</span>{' '}
          {formatted?.discountedPrice ?? formatCurrency(discountedPrice)}
        </>
      ) : (
        formattedPrice
      )}
    </Badge>
  );
}
