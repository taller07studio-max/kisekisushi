'use client'

import { useState } from 'react'
import type { Branch } from '@/lib/business'
import { resolveWhatsApp } from '@/lib/whatsapp'
import WaBranchSheet from './WaBranchSheet'

type Props = {
  businessWhatsapp: string | null
  branches: Branch[]
  businessName: string
}

const ghostStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: '0.8125rem',
  fontWeight: 500,
  letterSpacing: '0.04em',
  color: 'rgba(255,255,255,0.85)',
  padding: '1rem 1.875rem',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  border: '1px solid rgba(255,255,255,0.25)',
  borderRadius: '9999px',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  backgroundColor: 'rgba(255,255,255,0.06)',
  transition: 'background-color 0.3s ease, border-color 0.3s ease',
  cursor: 'pointer',
}

export default function HeroWaButton({ businessWhatsapp, branches, businessName }: Props) {
  const [open, setOpen] = useState(false)

  const message = `Hola, ¿me pueden dar información sobre ${businessName}?`
  const resolution = resolveWhatsApp(businessWhatsapp, branches, message)

  if (resolution.type === 'none') return null

  if (resolution.type === 'direct') {
    return (
      <a
        href={resolution.url}
        target="_blank"
        rel="noopener noreferrer"
        style={ghostStyle}
      >
        Contáctanos
      </a>
    )
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} style={ghostStyle}>
        Contáctanos
      </button>
      <WaBranchSheet
        open={open}
        onClose={() => setOpen(false)}
        branches={resolution.branches}
        message={message}
      />
    </>
  )
}
