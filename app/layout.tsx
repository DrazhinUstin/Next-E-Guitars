import type { Metadata } from 'next';
import './globals.css';
import 'react-medium-image-zoom/dist/styles.css';
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
      <body>
        <div className="mx-auto w-[90vw] max-w-7xl py-8">{children}</div>
      </body>
    </html>
  );
}
