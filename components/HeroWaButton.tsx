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
  fontSize: '0.75rem',
  fontWeight: 400,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(201,146,42,0.85)',
  padding: '0.9375rem 2rem',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  border: '1px solid rgba(201,146,42,0.35)',
  borderRadius: '4px',
  backgroundColor: 'rgba(201,146,42,0.04)',
  transition: 'background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease',
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
