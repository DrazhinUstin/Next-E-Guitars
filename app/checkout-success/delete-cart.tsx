'use client';

import { useDeleteCartMutation } from '@/app/hooks/cart';
import { useEffect } from 'react';

export default function DeleteCart() {
  const { mutate } = useDeleteCartMutation();

  useEffect(() => {
    mutate();
  }, [mutate]);

  return null;
}
