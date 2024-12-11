import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: string | number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(
    Number(amount)
  );
}
