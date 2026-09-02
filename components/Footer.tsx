import type { Branch } from '@/lib/business'
import FooterWaButton from './FooterWaButton'

type Props = {
  businessName: string
  city: string | null
  businessWhatsapp: string | null
  branches: Branch[]
}

export default function Footer({ businessName, city, businessWhatsapp, branches }: Props) {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        backgroundColor: 'var(--section-dark)',
        borderTop: '1px solid oklch(1 0 0 / 0.10)',
        padding: '3rem 2rem',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#ffffff',
            letterSpacing: '0.01em',
          }}
        >
          {businessName}
        </span>

        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.7rem',
            fontWeight: 300,
            letterSpacing: '0.12em',
            color: 'oklch(1 0 0 / 0.28)',
            textTransform: 'uppercase',
          }}
        >
          Mariscos · Sinaloa · México
        </p>

        <div style={{ marginTop: '0.5rem' }}>
          <FooterWaButton
            businessWhatsapp={businessWhatsapp}
            branches={branches}
            businessName={businessName}
          />
        </div>

        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.7rem',
            fontWeight: 300,
            letterSpacing: '0.06em',
            color: 'oklch(1 0 0 / 0.18)',
            marginTop: '0.5rem',
          }}
        >
          {city ? `${city} · ` : ''}© {year} {businessName}
        </p>
      </div>
    </footer>
  )
}
