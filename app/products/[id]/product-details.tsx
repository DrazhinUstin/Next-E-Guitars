'use client';

import { products } from '@wix/stores';
import ProductMedia from './product-media';
import ProductPrice from './product-price';
import ProductOptions from './product-options';
import { useState } from 'react';
import Badge from '@/app/components/badge';
import { findProductVariant } from '@/app/lib/utils';

export default function ProductDetails({ product }: { product: products.Product }) {
  const {
    name,
    brand,
    ribbon,
    discount,
    description,
    additionalInfoSections,
    productOptions,
    media,
    priceData,
  } = product;

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    productOptions?.reduce(
      (acc, item) => ({ ...acc, [item.name ?? '']: item.choices?.[0].description ?? '' }),
      {} as Record<string, string>
    ) ?? {}
  );

  const selectedOptionsMediaItems = Object.entries(selectedOptions).reduce((acc, [name, value]) => {
    const mediaItems =
      productOptions
        ?.find((opt) => opt.name === name)
        ?.choices?.find((choice) => choice.description === value)?.media?.items ?? [];
    return [...acc, ...mediaItems];
  }, [] as products.MediaItem[]);

  const selectedProductVariant = findProductVariant(product, selectedOptions);

  return (
    <div className="grid gap-8 md:grid-cols-[2fr_3fr] md:items-start">
      <ProductMedia
        key={selectedOptionsMediaItems[0]._id}
        mediaItems={
          selectedOptionsMediaItems.length ? selectedOptionsMediaItems : (media?.items ?? [])
        }
      />
      <div className="space-y-5">
        <h2 className="text-2xl font-semibold">{name}</h2>
        {!!brand && <p className="text-muted-foreground">{brand}</p>}
        <div className="space-x-2">
          {!!ribbon && <Badge className="inline-block text-base">{ribbon}</Badge>}
          {discount?.type === products.DiscountType.PERCENT && (
            <Badge className="inline-block bg-destructive text-base text-destructive-foreground">
              -{discount.value}%
            </Badge>
          )}
        </div>
        {!!description && (
          <div
            className="prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
        {!!priceData && (
          <ProductPrice priceData={selectedProductVariant?.variant?.priceData ?? priceData} />
        )}
        {!!productOptions && (
          <ProductOptions
            product={product}
            selectedOptions={selectedOptions}
            onOptionSelected={setSelectedOptions}
          />
        )}
        {!!additionalInfoSections &&
          additionalInfoSections.map(({ title, description }, index) => (
            <div key={index} className="space-y-5">
              <h4 className="text-xl font-semibold">{title}</h4>
              <div
                className="prose dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: description ?? '' }}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
