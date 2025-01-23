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

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
    typeof date === 'string' ? new Date(date) : date
  );
}

export function mapObject<T, R>(obj: Record<string, T>, mapFn: (arg: T) => R): Record<string, R> {
  return Object.fromEntries(Object.entries(obj).map(([key, val]) => [key, mapFn(val)]));
}

export function findProductVariant(
  product: products.Product,
  selectedOptions: Record<string, string>
) {
  const selectedOptionsArr = Object.entries(selectedOptions);

  if (!selectedOptionsArr.length) return undefined;

  return product.variants?.find((variant) =>
    selectedOptionsArr.every(([name, value]) => variant.choices?.[name] === value)
  );
}
