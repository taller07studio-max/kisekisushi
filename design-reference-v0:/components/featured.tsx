'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { formatPrice, type Dish } from '@/lib/menu'

export function Featured({
  dishes,
  onSelect,
}: {
  dishes: Dish[]
  onSelect: (dish: Dish) => void
}) {
  const [lead, ...rest] = dishes

  return (
    <section
      id="destacados"
      className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28"
    >
      <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
            Lo que hay que probar
          </span>
          <h2 className="mt-3 font-serif text-[clamp(2.25rem,7vw,3.75rem)] font-light leading-[0.95] tracking-[-0.025em] text-foreground text-balance">
            Cuatro razones para venir hoy
          </h2>
        </div>
        <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground md:text-right">
          Cambiamos la carta según lo que llegue del mar en la mañana. Estos
          cuatro nunca faltan.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-12 md:gap-5">
        {/* Lead editorial card */}
        {lead && (
          <Reveal className="md:col-span-7">
            <button
              type="button"
              onClick={() => onSelect(lead)}
              className="group relative block h-full w-full overflow-hidden rounded-[30px] bg-primary text-left shadow-sm ring-1 ring-border/50 transition-shadow duration-500 hover:shadow-2xl hover:shadow-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="relative aspect-[4/5] w-full sm:aspect-[16/11] md:aspect-auto md:h-full md:min-h-[440px]">
                <Image
                  src={lead.image}
                  alt={lead.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 92vw, 55vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-primary via-primary/35 to-transparent"
                />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                {lead.badge && (
                  <span className="inline-block rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground backdrop-blur-md">
                    {lead.badge}
                  </span>
                )}
                <h3 className="mt-4 font-serif text-[clamp(1.9rem,5.5vw,3rem)] font-light leading-[0.95] tracking-[-0.02em] text-primary-foreground">
                  {lead.name}
                </h3>
                <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-primary-foreground/80">
                  {lead.blurb}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-5 py-2.5 text-sm font-semibold text-primary transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                    {formatPrice(lead.price)}
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                  <span className="text-xs font-medium text-primary-foreground/70">
                    Ver detalle
                  </span>
                </div>
              </div>
            </button>
          </Reveal>
        )}

        {/* Secondary stack */}
        <div className="grid gap-4 md:col-span-5 md:gap-5">
          {rest.map((dish, i) => (
            <Reveal key={dish.id} delay={100 + i * 90}>
              <button
                type="button"
                onClick={() => onSelect(dish)}
                className="group flex w-full items-center gap-4 rounded-[26px] bg-card p-3.5 text-left shadow-sm ring-1 ring-border/60 transition-all duration-400 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-5 sm:p-4"
              >
                <div className="relative size-24 shrink-0 overflow-hidden rounded-[20px] bg-secondary sm:size-28">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    sizes="120px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  {dish.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                      {dish.badge}
                    </span>
                  )}
                  <h3 className="mt-1 font-serif text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-xl">
                    {dish.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-pretty text-[13px] leading-relaxed text-muted-foreground">
                    {dish.blurb}
                  </p>
                </div>
                <span className="shrink-0 self-start font-serif text-base font-semibold tabular-nums text-foreground sm:text-lg">
                  {formatPrice(dish.price)}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
