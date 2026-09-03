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
      {/* Seigaiha pattern — textura de fondo */}
      <div
        aria-hidden="true"
        className="seigaiha-pattern"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.14,
          pointerEvents: 'none',
        }}
      />

      {/* Gradiente central — asegura legibilidad */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(8,8,7,0.85) 0%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      {/* Marco decorativo dorado — esquina superior derecha */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '3rem',
          right: '3rem',
          width: '80px',
          height: '80px',
          borderTop: '1px solid rgba(201,146,42,0.22)',
          borderRight: '1px solid rgba(201,146,42,0.22)',
          pointerEvents: 'none',
        }}
      />

      {/* Marco decorativo dorado — esquina inferior izquierda */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '3rem',
          left: '3rem',
          width: '80px',
          height: '80px',
          borderBottom: '1px solid rgba(201,146,42,0.22)',
          borderLeft: '1px solid rgba(201,146,42,0.22)',
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
              fontSize: '0.5625rem',
              fontWeight: 400,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#c9922a',
              marginBottom: '1.75rem',
            }}
          >
            — Contáctanos
          </p>

          {/* Headline */}
          <h2
            className="reveal reveal-delay-1"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              color: '#f4f0e8',
              letterSpacing: '-0.025em',
              marginBottom: '1.5rem',
            }}
          >
            ¿Listo para{' '}
            <em
              style={{
                fontStyle: 'italic',
                color: '#c9922a',
              }}
            >
              ordenar?
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
              color: 'rgba(244,240,232,0.42)',
              maxWidth: '440px',
              margin: '0 auto 3rem',
            }}
          >
            Escríbenos por WhatsApp para hacer tu pedido,
            preguntar por el menú del día o reservar tu lugar.
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
                fontSize: '0.75rem',
                fontWeight: 300,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(201,146,42,0.30)',
              }}
            >
              {city}
            </p>
          )}
        </RevealOnScroll>
      </div>
    </section>
  )
}
