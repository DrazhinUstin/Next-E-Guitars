import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { products } from '@wix/stores';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: string | number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(
    Number(amount)
  );
}

export function findProductVariant(
  product: products.Product,
  selectedOptions: Record<string, string>
) {
  return product.variants?.find((variant) =>
    Object.entries(selectedOptions).every(([name, value]) => variant.choices?.[name] === value)
  );
}
