import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import { getBusiness } from '@/lib/business'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500'],
})

export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusiness()

  const title = business?.name ?? 'Mi Negocio'
  const description =
    business?.description ?? 'Catálogo de productos y servicios.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: 'es_MX',
      type: 'website',
      url: process.env.NEXT_PUBLIC_SITE_URL ?? '',
      ...(business?.logo_url && {
        images: [
          {
            url: business.logo_url,
            width: 400,
            height: 400,
            alt: title,
          },
        ],
      }),
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased overflow-x-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
