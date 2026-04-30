import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    template: '%s | BeeHouseholds',
    default: 'BeeHouseholds - Smart Home & Decor Nairobi',
  },
  description:
    "Nairobi's trusted destination for warm duvets, mosquito nets, bedside essentials, and modern home accessories. Countrywide delivery. M-Pesa accepted.",
  keywords: [
    'smart home gadgets Nairobi',
    'warm duvets Kenya',
    'mosquito nets delivery Nairobi',
    'home decor Moi Avenue',
    'bedside furniture Kenya',
    'carpets and rugs Nairobi',
    'BeeHouseholds',
  ],
  openGraph: {
    title: 'BeeHouseholds - Smart Home & Decor',
    description: 'Making your home smarter, warmer, and safer.',
    siteName: 'BeeHouseholds',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BeeHouseholds',
    description: 'Smart home gadgets & premium decor in Nairobi',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-KE">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <CartProvider>
            <ConditionalLayout publicNav={<Navbar />} publicFooter={<Footer />}>
              {children}
            </ConditionalLayout>
            <Toaster position="top-right" richColors closeButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}