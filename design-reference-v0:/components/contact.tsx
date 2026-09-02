import { Clock, MapPin, Phone } from 'lucide-react'
import { InstagramIcon, WhatsAppIcon } from '@/components/icons'
import { Reveal } from '@/components/reveal'
import { orderLink } from '@/lib/menu'

const hours = [
  { day: 'Martes a jueves', time: '11:00 — 19:00' },
  { day: 'Viernes y sábado', time: '11:00 — 21:00' },
  { day: 'Domingo', time: '10:00 — 18:00' },
  { day: 'Lunes', time: 'Cerrado' },
]

export function Contact() {
  return (
    <section
      id="contacto"
      className="scroll-mt-20 border-t border-border bg-secondary/40 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <Reveal>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                Visítanos
              </span>
              <h2 className="mt-3 font-serif text-[clamp(2.25rem,7vw,3.5rem)] font-light leading-[0.95] tracking-[-0.025em] text-foreground text-balance">
                Te esperamos en la esquina de siempre
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <ul className="mt-9 flex flex-col gap-6">
                <li className="flex gap-4">
                  <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-accent shadow-sm ring-1 ring-border/60">
                    <MapPin className="size-4.5" />
                  </span>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Dirección
                    </h3>
                    <address className="mt-1.5 not-italic text-[15px] leading-relaxed text-foreground">
                      Av. Álvaro Obregón 1420, Col. Guadalupe
                      <br />
                      80220 Culiacán, Sinaloa
                    </address>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-accent shadow-sm ring-1 ring-border/60">
                    <Phone className="size-4.5" />
                  </span>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Teléfono
                    </h3>
                    <a
                      href="tel:+526671234567"
                      className="mt-1.5 block text-[15px] text-foreground transition-colors hover:text-accent"
                    >
                      667 123 4567
                    </a>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-accent shadow-sm ring-1 ring-border/60">
                    <InstagramIcon className="size-4.5" />
                  </span>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Instagram
                    </h3>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 block text-[15px] text-foreground transition-colors hover:text-accent"
                    >
                      @elimposible.mariscos
                    </a>
                  </div>
                </li>
              </ul>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <div className="rounded-[30px] bg-card p-7 shadow-sm ring-1 ring-border/60 md:p-9">
              <div className="flex items-center gap-2.5 text-foreground">
                <Clock className="size-4.5 text-accent" />
                <h3 className="font-serif text-xl font-semibold tracking-tight">
                  Horarios
                </h3>
              </div>

              <ul className="mt-6 flex flex-col divide-y divide-border">
                {hours.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-baseline justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                  >
                    <span className="text-sm text-muted-foreground">{h.day}</span>
                    <span
                      className={
                        h.time === 'Cerrado'
                          ? 'text-sm font-medium text-muted-foreground/60'
                          : 'text-sm font-semibold tabular-nums text-foreground'
                      }
                    >
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 rounded-2xl bg-secondary p-5">
                <p className="text-pretty text-[13px] leading-relaxed text-secondary-foreground">
                  Los fines de semana hay fila. Escríbenos antes y te apartamos
                  mesa o dejamos tu pedido listo para recoger.
                </p>
              </div>

              <a
                href={orderLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-accent active:scale-[0.98]"
              >
                <WhatsAppIcon className="size-4" />
                Apartar por WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
