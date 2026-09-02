import RevealOnScroll from './RevealOnScroll'
import ContactWaButton from './ContactWaButton'
import type { Branch } from '@/lib/business'

type Props = {
  businessWhatsapp: string | null
  branches: Branch[]
  city: string | null
  businessName: string
}

export default function Contact({ businessWhatsapp, branches, city, businessName }: Props) {

  return (
    <section
      id="contacto"
      style={{
        backgroundColor: 'var(--section-dark)',
        padding: 'clamp(5rem, 12vw, 9rem) 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative radial glow — coral */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, oklch(0.53 0.19 30 / 0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative ring */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          border: '1px solid oklch(1 0 0 / 0.04)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <RevealOnScroll>
          {/* Eyebrow */}
          <p
            className="reveal"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.675rem',
              fontWeight: 400,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'var(--wood)',
              marginBottom: '1.75rem',
            }}
          >
            — Visítanos
          </p>

          {/* Headline */}
          <h2
            className="reveal reveal-delay-1"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              color: '#ffffff',
              letterSpacing: '-0.025em',
              marginBottom: '1.5rem',
            }}
          >
            ¿Qué se te{' '}
            <em
              style={{
                fontStyle: 'italic',
                color: 'var(--wood)',
              }}
            >
              antoja hoy?
            </em>
          </h2>

          {/* Subtitle */}
          <p
            className="reveal reveal-delay-2"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'clamp(0.875rem, 1.4vw, 1rem)',
              fontWeight: 300,
              lineHeight: 1.9,
              color: 'oklch(1 0 0 / 0.5)',
              maxWidth: '440px',
              margin: '0 auto 3rem',
            }}
          >
            Escríbenos por WhatsApp para preguntar por el menú del día,
            reservar tu mesa o simplemente porque el antojo ya llegó.
          </p>

          {/* WhatsApp button */}
          <div className="reveal reveal-delay-3">
            <ContactWaButton
              businessWhatsapp={businessWhatsapp}
              branches={branches}
              businessName={businessName}
            />
          </div>

          {/* Location */}
          {city && (
            <p
              className="reveal reveal-delay-4"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.8rem',
                fontWeight: 300,
                letterSpacing: '0.1em',
                color: 'oklch(1 0 0 / 0.28)',
              }}
            >
              {city}, Sinaloa · México
            </p>
          )}
        </RevealOnScroll>
      </div>
    </section>
  )
}
