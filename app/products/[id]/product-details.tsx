'use client';

import { products } from '@wix/stores';
import ProductMedia from './product-media';
import ProductPrice from './product-price';
import ProductOptions from './product-options';
import { useState } from 'react';
import Badge from '@/app/components/badge';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import AddToCartButton from '@/app/components/add-to-cart-button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import { findProductVariant } from '@/app/lib/utils';
import BackInStockNotificationButton from '@/app/components/back-in-stock-notification-button';

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
    stock,
  } = product;
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

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

  const inStock =
    selectedProductVariant?.stock?.inStock ??
    stock?.inventoryStatus !== products.InventoryStatus.OUT_OF_STOCK;

  const availableQuantity = selectedProductVariant?.stock?.quantity ?? stock?.quantity;

  const isAvailableQuantityExceeded = !!availableQuantity && selectedQuantity > availableQuantity;

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
        <div className="space-y-4 rounded-lg border bg-card p-4 text-card-foreground shadow-md">
          <div className="flex items-center gap-2">
            <Label htmlFor="quantity">Quantity:</Label>
            <Input
              type="number"
              id="quantity"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(+e.target.value)}
              disabled={!inStock}
              min={1}
              max={availableQuantity ?? undefined}
              step={1}
              className="max-w-16"
            />
            {isAvailableQuantityExceeded && (
              <span className="text-sm text-destructive">
                Up to {availableQuantity} items available!
              </span>
            )}
          </div>
          {inStock ? (
            <AddToCartButton
              className="w-full"
              product={product}
              selectedOptions={selectedOptions}
              quantity={selectedQuantity}
              disabled={!selectedQuantity || isAvailableQuantityExceeded}
            />
          ) : (
            <BackInStockNotificationButton
              variant="secondary"
              className="w-full"
              product={product}
              selectedOptions={selectedOptions}
            />
          )}
        </div>
        {!!additionalInfoSections?.length && (
          <Accordion type="single" collapsible className="w-full">
            {additionalInfoSections.map(({ title, description }) => (
              <AccordionItem key={title} value={title ?? ''}>
                <AccordionTrigger>{title}</AccordionTrigger>
                <AccordionContent>
                  <div
                    className="prose dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: description ?? '' }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
