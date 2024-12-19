import { cn } from '@/app/lib/utils';
import { products } from '@wix/stores';

export default function ProductPrice({ priceData }: { priceData: products.PriceData }) {
  const discountedPrice = priceData.discountedPrice;
  const price = priceData.price;
  const formattedDiscountedPrice = priceData.formatted?.discountedPrice;
  const formattedPrice = priceData.formatted?.price;
  const hasDiscount = discountedPrice !== price;
  return (
    <p className="text-xl font-medium">
      <span className={cn(hasDiscount && 'text-destructive line-through')}>{formattedPrice}</span>
      {hasDiscount && <> {formattedDiscountedPrice}</>}
    </p>
  );
}
