import { Suspense } from 'react'
import type { Branch, Product, Category } from '@/lib/business'
import RevealOnScroll from './RevealOnScroll'
import CatalogClient from './CatalogClient'

type Props = {
  products: Product[]
  categories: Category[]
  hasCart?: boolean
  branches?: Branch[]
  businessName?: string
}

export default function Catalog({ products, categories, hasCart = false, branches = [], businessName = '' }: Props) {
  if (products.length === 0) return null

  return (
    <section
      id="catalogo"
      style={{
        backgroundColor: 'var(--section-mid)',
        padding: 'clamp(5rem, 10vw, 8rem) 2rem',
        scrollMarginTop: '80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Seigaiha muy sutil como textura de fondo */}
      <div
        aria-hidden="true"
        className="seigaiha-pattern"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.07,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
        {/* Section header */}
        <RevealOnScroll>
          <div style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
            <p
              className="reveal"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.625rem',
                fontWeight: 400,
                letterSpacing: '0.30em',
                textTransform: 'uppercase',
                color: '#c9922a',
                marginBottom: '1.25rem',
              }}
            >
              — Nuestro Menú
            </p>
            <h2
              className="reveal reveal-delay-1"
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 300,
                lineHeight: 1.05,
                color: '#f4f0e8',
                letterSpacing: '-0.025em',
                maxWidth: '600px',
              }}
            >
              Hecho con{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  color: '#c9922a',
                  fontWeight: 300,
                }}
              >
                precisión.
              </em>
            </h2>
          </div>
        </RevealOnScroll>

        <Suspense fallback={null}>
          <CatalogClient
            products={products}
            categories={categories}
            hasCart={hasCart}
            branches={branches}
            businessName={businessName}
          />
        </Suspense>
      </div>
    </section>
  )
}
