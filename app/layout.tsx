import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { CurrencyProvider } from '@/lib/currency-context'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from "@/components/theme-provider"
import './globals.css'

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: {
    default: 'Key Motion Real Estate | Properties in Sri Lanka',
    template: '%s | Key Motion Real Estate',
  },
  description: 'Find your dream property in Ahangama, Midigama And Kabalana Sri Lanka. Buy, sell, rent, or lease lands, luxury villas, and thriving businesses with ease.',
  keywords: ['real estate', 'Sri Lanka', 'property', 'land', 'house', 'apartment', 'commercial', 'rent', 'sale', 'lease'],
  authors: [{ name: 'Key Motion Real Estate' }],
  creator: 'Key Motion Real Estate',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://keymotionrealestate.com',
    siteName: 'Key Motion Real Estate',
    title: 'Key Motion Real Estate | Properties in Sri Lanka',
    description: 'Find your dream property in Ahangama, Midigama And Kabalana Sri Lanka. Buy, sell, rent, or lease lands, luxury villas, and thriving businesses with ease.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Key Motion Real Estate | Properties in Sri Lanka',
    description: 'Find your dream property in Ahangama, Midigama And Kabalana Sri Lanka. Buy, sell, rent, or lease lands, luxury villas, and thriving businesses with ease.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <AuthProvider>
          <CurrencyProvider>
            <Toaster position='top-right' duration={2000}/>
            {children}
          </CurrencyProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
