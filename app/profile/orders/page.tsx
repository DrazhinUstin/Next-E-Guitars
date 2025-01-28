import type { Metadata } from 'next';
import Orders from './orders';

export const metadata: Metadata = {
  title: 'Orders',
};

export default function Page() {
  return (
    <main>
      <Orders />
    </main>
  );
}
