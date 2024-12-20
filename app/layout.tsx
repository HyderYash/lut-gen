import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import TanStackProvider from "./components/providers/TanStackProvider"
import AuthProvider from "./components/providers/AuthProvider"
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import SearchParamsWrapper from "./components/SearchParamsWrapper"
import { JsonLd } from "./components/JsonLd"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
  colorScheme: 'dark light'
}

export const metadata: Metadata = {
  metadataBase: new URL('https://lutbuilder.ai'),
  title: {
    default: 'LUTBuilder.ai - AI-Powered Color Grading & LUT Generation',
    template: '%s | LUTBuilder.ai'
  },
  description: 'Transform your visual storytelling with AI-powered LUT generation. Create professional-grade color grades instantly with our advanced machine learning technology.',
  keywords: [
    'LUT generation', 
    'AI color grading', 
    'video color correction', 
    'machine learning color', 
    'professional color grading', 
    'film color enhancement'
  ],
  openGraph: {
    title: 'LUTBuilder.ai - AI-Powered Color Grading',
    description: 'Transform your visual storytelling with AI-powered LUT generation.',
    url: 'https://lutbuilder.ai',
    siteName: 'LUTBuilder.ai',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LUTBuilder.ai - AI Color Grading'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUTBuilder.ai - AI-Powered Color Grading',
    description: 'Transform your visual storytelling with AI-powered LUT generation.',
    images: ['/twitter-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-site-verification-code',
    // Add other verification codes as needed
  },
  alternates: {
    canonical: 'https://lutbuilder.ai'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <JsonLd />
        <SearchParamsWrapper>
          <AuthProvider>
            <TanStackProvider>
              {children}
              <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
            </TanStackProvider>
          </AuthProvider>
        </SearchParamsWrapper>
      </body>
    </html>
  )
}