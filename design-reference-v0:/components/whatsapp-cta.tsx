import Image from 'next/image'
import { WhatsAppIcon } from '@/components/icons'
import { Reveal } from '@/components/reveal'
import { orderLink } from '@/lib/menu'

export function WhatsAppCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8 md:pb-28">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[34px] bg-primary px-6 py-14 shadow-xl shadow-primary/20 md:px-16 md:py-20">
          <Image
            src="/images/limes-ice.png"
            alt=""
            fill
            sizes="(max-width: 768px) 92vw, 1152px"
            className="absolute inset-0 -z-10 object-cover opacity-35"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-primary/55"
          />

          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground backdrop-blur-md">
              <span className="size-1.5 animate-pulse rounded-full bg-lime-fresh" />
              Respondemos en minutos
            </span>

            <h2 className="mt-6 font-serif text-[clamp(2.25rem,8vw,4.25rem)] font-light leading-[0.92] tracking-[-0.03em] text-primary-foreground text-balance">
              Pide directo por WhatsApp
            </h2>

            <p className="mx-auto mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-primary-foreground/80">
              Sin apps, sin comisiones, sin registrarte. Nos escribes, te
              confirmamos qué hay hoy y lo preparamos al momento.
            </p>

            <a
              href={orderLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-lime-fresh px-8 py-4.5 text-sm font-bold text-primary shadow-2xl shadow-primary/40 transition-all duration-300 hover:scale-[1.04] hover:brightness-105 active:scale-[0.98]"
            >
              <WhatsAppIcon className="size-5" />
              Escribir al 667 123 4567
            </a>

            <p className="mt-5 text-xs font-medium text-primary-foreground/60">
              Entrega en Culiacán · Pedido mínimo $200 · Efectivo o transferencia
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
