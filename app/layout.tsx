import type { Metadata } from 'next';
import './globals.css';
import { inter } from '@/app/lib/fonts';

export const metadata: Metadata = {
  title: 'Next-E-Guitars',
  description: 'Full-stack e-commerce project on Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
