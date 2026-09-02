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
        background: [
          'radial-gradient(ellipse 80% 60% at 50% 100%, oklch(0.22 0.06 240 / 0.6) 0%, transparent 70%)',
          'linear-gradient(170deg, oklch(0.08 0.04 260) 0%, oklch(0.12 0.05 240) 50%, oklch(0.10 0.06 220) 100%)',
        ].join(', '),
      }}
    >
      {/* Radial color accents */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: [
            'radial-gradient(circle at 15% 85%, oklch(0.53 0.19 30 / 0.10) 0%, transparent 50%)',
            'radial-gradient(circle at 85% 15%, oklch(0.38 0.10 220 / 0.12) 0%, transparent 50%)',
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
              borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.2)',
              backgroundColor: 'rgba(255,255,255,0.08)',
              padding: '0.375rem 0.875rem',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '9999px',
                backgroundColor: 'var(--lime-fresh)',
                flexShrink: 0,
              }}
            />
            Marisco del día
          </span>

          {city && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.65)',
              }}
            >
              <svg
                width="14"
                height="14"
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

        {/* Main headline */}
        <h1
          className="hero-title"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(3.25rem, 11vw, 9.5rem)',
            fontWeight: 300,
            lineHeight: 0.9,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            marginBottom: '1.75rem',
          }}
        >
          {businessName}
        </h1>

        {/* Description */}
        <div className="hero-subtitle" style={{ maxWidth: '560px', marginBottom: '2rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'clamp(0.875rem, 1.4vw, 1.0625rem)',
              fontWeight: 300,
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.72)',
              margin: 0,
            }}
          >
            {description ?? 'Del Pacífico a tu mesa. Frescura, tradición y sabor sinaloense.'}
          </p>
        </div>

        {/* CTAs */}
        <div
          className="hero-cta"
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: '3rem',
          }}
        >
          <a
            href="#catalogo"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: 'oklch(0.10 0.02 255)',
              backgroundColor: '#ffffff',
              padding: '1rem 1.875rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              boxShadow: '0 8px 32px rgba(10,10,40,0.25)',
              transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
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
            gap: '1.25rem 1.5rem',
            paddingTop: '1.75rem',
            borderTop: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {([
            { value: 'Fresco', label: 'Cada día' },
            { value: 'Sinaloa', label: 'Estilo auténtico' },
            { value: '6 a.m.', label: 'Llega el marisco' },
            { value: 'Pacífico', label: 'Origen del camarón' },
          ] as const).map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <dt
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)',
                  fontWeight: 500,
                  lineHeight: 1,
                  color: '#ffffff',
                }}
              >
                {stat.value}
              </dt>
              <dd
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.45)',
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
          color: 'rgba(255,255,255,0.28)',
          zIndex: 10,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: '1px',
            height: '36px',
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.28))',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.575rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          Scroll
        </span>
      </div>
    </section>
  )
}
