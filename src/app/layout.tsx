import type { Metadata } from 'next';
import { Inter, Orbitron, JetBrains_Mono } from 'next/font/google';

import { WalletProvider } from '@/components/wallet/WalletProvider';
import { Toaster } from '@/components/ui/Toaster';

import './globals.css';
import { JSX } from 'react';

// Font configurations
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Gorbagana Poker | Two-Card Indian Poker on Gorbagana Testnet',
  description: 'Experience lightning-fast Two-Card Indian Poker on the Gorbagana testnet. Bet with $GOR tokens in this psychological warfare card game.',
  keywords: ['poker', 'gorbagana', 'blockchain', 'gambling', 'testnet', 'GOR', 'solana'],
  authors: [{ name: 'Gorbagana Poker Team' }],
  creator: 'Gorbagana Poker',
  publisher: 'Gorbagana Poker',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://poker.gorbagana.wtf'),
  openGraph: {
    title: 'Gorbagana Poker | Two-Card Indian Poker',
    description: 'Lightning-fast Two-Card Indian Poker on Gorbagana testnet',
    url: 'https://poker.gorbagana.wtf',
    siteName: 'Gorbagana Poker',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Gorbagana Poker - Two-Card Indian Poker Game',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gorbagana Poker | Two-Card Indian Poker',
    description: 'Lightning-fast Two-Card Indian Poker on Gorbagana testnet',
    images: ['/og-image.png'],
    creator: '@Gorbagana_chain',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification codes when available
    // google: 'verification-code',
    // yandex: 'verification-code',
    // yahoo: 'verification-code',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://rpc.gorbagana.wtf" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#3a9f3a" />
        <meta name="msapplication-TileColor" content="#3a9f3a" />
        
        {/* Prevent zoom on mobile */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className="font-sans antialiased">
        {/* Background gradient overlay */}
        <div className="fixed inset-0 -z-10 bg-background-primary">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/20 via-transparent to-gor-950/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(16,185,129,0.1)_0%,transparent_50%),radial-gradient(circle_at_75%_75%,rgba(245,158,11,0.1)_0%,transparent_50%)]" />
        </div>

        {/* Wallet Provider and App Content */}
        <WalletProvider>
          <div className="relative min-h-screen">
            {/* Main app content */}
            <main className="relative z-10">
              {children}
            </main>
            
            {/* Toast notifications */}
            <Toaster />
          </div>
        </WalletProvider>
        
        {/* Analytics scripts would go here */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Add analytics scripts when ready */}
            {/* <Script src="https://analytics.example.com/script.js" /> */}
          </>
        )}
      </body>
    </html>
  );
}