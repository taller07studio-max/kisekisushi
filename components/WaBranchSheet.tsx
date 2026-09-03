'use client'

import type { Branch } from '@/lib/business'
import { formatWhatsAppUrl } from '@/lib/whatsapp'

type Props = {
  open: boolean
  onClose: () => void
  branches: Branch[]
  message: string
}

const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function WaBranchSheet({ open, onClose, branches, message }: Props) {
  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 1001,
        }}
      />

      {/* Sheet / Modal */}
      <div
        className="wa-branch-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Selecciona una sucursal"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#0f0e0c',
          borderRadius: '14px 14px 0 0',
          borderTop: '1px solid rgba(201,146,42,0.28)',
          zIndex: 1002,
          padding: '2.5rem 1.5rem 3rem',
          animation: 'waSheetUp 0.32s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(244,240,232,0.04)',
            border: '1px solid rgba(201,146,42,0.20)',
            borderRadius: '4px',
            width: '1.875rem',
            height: '1.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'rgba(244,240,232,0.45)',
          }}
        >
          <CloseIcon />
        </button>

        {/* Label */}
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '0.5625rem',
          fontWeight: 500,
          letterSpacing: '0.20em',
          textTransform: 'uppercase',
          color: 'rgba(201,146,42,0.55)',
          marginBottom: '1.25rem',
        }}>
          ¿A qué sucursal deseas escribir?
        </p>

        {/* Branch list */}
        <div>
          {branches.map((branch, i) => (
            <a
              key={branch.id}
              href={formatWhatsAppUrl(branch.whatsapp!, message)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '1rem 0',
                borderTop: i === 0 ? '1px solid rgba(201,146,42,0.16)' : undefined,
                borderBottom: '1px solid rgba(201,146,42,0.16)',
                textDecoration: 'none',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.25rem',
                fontWeight: 400,
                color: '#f4f0e8',
                letterSpacing: '-0.01em',
              }}>
                {branch.name}
              </span>
              <span style={{ color: '#c9922a', display: 'flex', alignItems: 'center' }}>
                <ChevronRight />
              </span>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes waSheetUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @media (min-width: 640px) {
          .wa-branch-sheet {
            top: 50% !important;
            left: 50% !important;
            right: auto !important;
            bottom: auto !important;
            width: min(420px, 92vw) !important;
            border-radius: 14px !important;
            transform: translate(-50%, -50%);
            animation: waModalIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both !important;
          }
        }
        @keyframes waModalIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.97); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  )
}
