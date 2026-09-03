import type { Branch } from '@/lib/business'
import FooterWaButton from './FooterWaButton'

type Props = {
  businessName: string
  city: string | null
  businessWhatsapp: string | null
  branches: Branch[]
}

const PinIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const InstagramIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
  </svg>
)

const ArrowDiagIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ flexShrink: 0, opacity: 0.55 }}
  >
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
)

export default function Footer({ businessName, city, businessWhatsapp, branches }: Props) {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        backgroundColor: 'var(--section-dark)',
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
          opacity: 0.12,
          pointerEvents: 'none',
        }}
      />

      {/* Línea dorada superior */}
      <div
        aria-hidden="true"
        style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent 0%, rgba(201,146,42,0.35) 30%, rgba(201,146,42,0.35) 70%, transparent 100%)',
        }}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '3rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.875rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Identidad */}
        <span
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1.625rem',
            fontWeight: 400,
            color: '#f4f0e8',
            letterSpacing: '0.02em',
          }}
        >
          {businessName}
        </span>

        {city && (
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.5625rem',
              fontWeight: 300,
              letterSpacing: '0.20em',
              color: 'rgba(201,146,42,0.40)',
              textTransform: 'uppercase',
            }}
          >
            {city}
          </p>
        )}

        {/* WhatsApp — CTA principal */}
        <div style={{ marginTop: '0.5rem' }}>
          <FooterWaButton
            businessWhatsapp={businessWhatsapp}
            branches={branches}
            businessName={businessName}
          />
        </div>

        {/* Separador */}
        <div
          aria-hidden="true"
          style={{
            width: '2rem',
            height: '1px',
            backgroundColor: 'rgba(201,146,42,0.20)',
            marginTop: '0.375rem',
          }}
        />

        {/* Accesos secundarios — Maps e Instagram */}
        <div className="footer-secondary-links">
          <a
            href="https://maps.app.goo.gl/NtB9my75wopqJUkZA"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link-secondary"
            aria-label="Ubicación en Google Maps"
          >
            <span className="footer-link-label">Ubicación</span>
            <span className="footer-link-main">
              <PinIcon />
              Google Maps
              <ArrowDiagIcon />
            </span>
          </a>

          <a
            href="https://www.instagram.com/kisekicln/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link-secondary"
            aria-label="Instagram de Kiseki Sushi"
          >
            <span className="footer-link-label">Instagram</span>
            <span className="footer-link-main">
              <InstagramIcon />
              @kisekicln
              <ArrowDiagIcon />
            </span>
          </a>
        </div>

        {/* Copyright */}
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.625rem',
            fontWeight: 300,
            letterSpacing: '0.08em',
            color: 'rgba(244,240,232,0.16)',
            marginTop: '0.375rem',
          }}
        >
          © {year} {businessName}
        </p>
      </div>

      <style>{`
        .footer-secondary-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.625rem;
          width: 100%;
          max-width: 320px;
        }

        .footer-link-secondary {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(201,146,42,0.22);
          border-radius: 4px;
          text-decoration: none;
          transition: border-color 0.22s ease, color 0.22s ease;
          color: rgba(244,240,232,0.65);
        }

        .footer-link-secondary:hover {
          border-color: rgba(201,146,42,0.55);
          color: #c9922a;
        }

        .footer-link-label {
          font-family: var(--font-inter);
          font-size: 0.5rem;
          font-weight: 500;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: rgba(201,146,42,0.45);
          line-height: 1;
        }

        .footer-link-main {
          display: flex;
          align-items: center;
          gap: 0.3125rem;
          font-family: var(--font-inter);
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.02em;
          line-height: 1.2;
          color: inherit;
        }

        .footer-link-secondary:hover .footer-link-label {
          color: rgba(201,146,42,0.65);
        }

        @media (max-width: 360px) {
          .footer-secondary-links {
            grid-template-columns: 1fr;
            max-width: 200px;
          }
        }
      `}</style>
    </footer>
  )
}
