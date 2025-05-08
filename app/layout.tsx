import type { Metadata } from 'next';
import './globals.css';
import 'react-medium-image-zoom/dist/styles.css';
import { inter } from '@/app/lib/fonts';
import Navbar from './navbar';
import ReactQueryProvider from './react-query-provider';
import { Toaster } from '@/app/components/ui/toaster';
import { ThemeProvider } from '@/app/theme-provider';
import Footer from './footer';

export const metadata: Metadata = {
  title: {
    template: '%s | Next-E-Guitars',
    default: 'Next-E-Guitars',
  },
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
        <ReactQueryProvider>
          <ThemeProvider>
            <Navbar />
            <div className="py-page mx-auto min-h-page w-[90vw] max-w-7xl">{children}</div>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
