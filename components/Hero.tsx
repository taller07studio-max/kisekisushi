import type { Branch } from '@/lib/business'
import HeroWaButton from './HeroWaButton'

type Props = {
  businessWhatsapp: string | null
  branches: Branch[]
  businessName: string
  description?: string | null
  city?: string | null
}

export default function Hero({ businessWhatsapp, branches, businessName, description, city }: Props) {

  return (
    <section
      id="inicio"
      style={{
        position: 'relative',
        height: '100svh',
        minHeight: '640px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: '#080807',
      }}
    >
      {/* Seigaiha pattern — textura de fondo muy sutil */}
      <div
        aria-hidden="true"
        className="seigaiha-pattern"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.18,
          pointerEvents: 'none',
        }}
      />

      {/* Gradient overlay — asegura legibilidad */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: [
            'linear-gradient(to top, rgba(8,8,7,0.96) 0%, rgba(8,8,7,0.55) 55%, rgba(8,8,7,0.15) 100%)',
            'radial-gradient(ellipse 90% 60% at 50% 100%, rgba(11,10,8,0.7) 0%, transparent 70%)',
          ].join(', '),
          pointerEvents: 'none',
        }}
      />

      {/* Dorado radial — acento muy sutil en esquinas */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: [
            'radial-gradient(circle at 85% 12%, rgba(201,146,42,0.06) 0%, transparent 45%)',
            'radial-gradient(circle at 15% 90%, rgba(205,122,150,0.04) 0%, transparent 40%)',
          ].join(', '),
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1152px',
          margin: '0 auto',
          width: '100%',
          padding: 'clamp(3rem, 6vw, 4rem) clamp(1.25rem, 5vw, 2rem)',
        }}
      >
        {/* Eyebrow */}
        <div
          className="hero-label"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '3px',
              border: '1px solid rgba(201,146,42,0.30)',
              backgroundColor: 'rgba(201,146,42,0.06)',
              padding: '0.375rem 0.875rem',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.625rem',
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(244,240,232,0.75)',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '9999px',
                backgroundColor: '#c9922a',
                flexShrink: 0,
              }}
            />
            Menú del día
          </span>

          {city && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.75rem',
                fontWeight: 400,
                color: 'rgba(244,240,232,0.5)',
                letterSpacing: '0.04em',
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {city}
            </span>
          )}
        </div>

        {/* Línea decorativa dorada */}
        <div
          aria-hidden="true"
          style={{
            width: '2.5rem',
            height: '1px',
            backgroundColor: 'rgba(201,146,42,0.55)',
            marginBottom: '1.5rem',
          }}
        />

        {/* Main headline */}
        <h1
          className="hero-title"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(3.5rem, 12vw, 10rem)',
            fontWeight: 300,
            lineHeight: 0.88,
            color: '#f4f0e8',
            letterSpacing: '-0.02em',
            marginBottom: '1.875rem',
          }}
        >
          {businessName}
        </h1>

        {/* Description */}
        <div className="hero-subtitle" style={{ maxWidth: '520px', marginBottom: '2.25rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'clamp(0.875rem, 1.4vw, 1rem)',
              fontWeight: 300,
              lineHeight: 1.8,
              color: 'rgba(244,240,232,0.62)',
              margin: 0,
              letterSpacing: '0.01em',
            }}
          >
            {description ?? 'Arte japonés en cada pieza. Ingredientes frescos, técnica precisa y sabor que perdura.'}
          </p>
        </div>

        {/* CTAs */}
        <div
          className="hero-cta"
          style={{
            display: 'flex',
            gap: '0.875rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: '3rem',
          }}
        >
          <a
            href="#catalogo"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#0b0a08',
              backgroundColor: '#c9922a',
              padding: '0.9375rem 2rem',
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'background-color 0.25s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            Ver el Menú
          </a>

          <HeroWaButton
            businessWhatsapp={businessWhatsapp}
            branches={branches}
            businessName={businessName}
          />
        </div>

        {/* Trust strip */}
        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '1.25rem 1.75rem',
            paddingTop: '1.75rem',
            borderTop: '1px solid rgba(201,146,42,0.18)',
          }}
        >
          {([
            { value: 'Artesanal', label: 'Cada pieza' },
            { value: 'Premium', label: 'Ingredientes frescos' },
            { value: 'Kiseki', label: 'Experiencia única' },
            { value: 'Tradicional', label: 'Técnica japonesa' },
          ] as const).map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <dt
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
                  fontWeight: 500,
                  lineHeight: 1,
                  color: '#f4f0e8',
                  letterSpacing: '0.01em',
                }}
              >
                {stat.value}
              </dt>
              <dd
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.625rem',
                  fontWeight: 400,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,146,42,0.6)',
                  margin: 0,
                }}
              >
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Scroll indicator */}
      <div
        className="hero-scroll"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.625rem',
          color: 'rgba(201,146,42,0.3)',
          zIndex: 10,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: '1px',
            height: '36px',
            background: 'linear-gradient(to bottom, transparent, rgba(201,146,42,0.35))',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.5rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
          }}
        >
          Scroll
        </span>
      </div>
    </section>
  )
}
