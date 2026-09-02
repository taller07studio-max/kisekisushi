import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['SOFT', 'WONK'],
})

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'El Imposible — Mariscos Estilo Sinaloa',
  description:
    'Aguachiles, ceviches y pescado zarandeado preparados al momento con marisco del Pacífico. Menú digital, pedidos por WhatsApp. Culiacán, Sinaloa.',
  generator: 'v0.app',
  keywords: [
    'mariscos',
    'aguachile',
    'ceviche',
    'estilo Sinaloa',
    'pescado zarandeado',
    'Culiacán',
    'El Imposible',
  ],
  openGraph: {
    title: 'El Imposible — Mariscos Estilo Sinaloa',
    description:
      'Marisco fresco del Pacífico, preparado al momento. Mira el menú y pide por WhatsApp.',
    type: 'website',
    locale: 'es_MX',
    images: ['/images/hero-mariscos.png'],
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
  colorScheme: 'light',
  themeColor: '#faf6ef',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es-MX"
      className={`light bg-background ${display.variable} ${body.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
