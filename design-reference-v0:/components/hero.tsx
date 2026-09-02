import Image from 'next/image'
import { ArrowDown, MapPin, Star } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons'
import { orderLink } from '@/lib/menu'

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-primary"
    >
      <Image
        src="/images/hero-mariscos.png"
        alt="Mesa con aguachile de camarón, tostadas de ceviche, limones y hielo"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover object-center"
      />
      {/* Legibility scrims */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-primary/45"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-primary via-primary/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-primary/70 to-transparent"
      />

      <div className="mx-auto w-full max-w-6xl px-5 pb-12 pt-28 md:px-8 md:pb-16">
        {/* Eyebrow */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-primary-foreground/80">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-lime-fresh" />
            Marisco del día
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium">
            <MapPin className="size-3.5" />
            Culiacán, Sinaloa
          </span>
        </div>

        {/* Display headline */}
        <h1 className="mt-7 font-serif text-[clamp(3.25rem,15vw,9.5rem)] font-light leading-[0.86] tracking-[-0.03em] text-primary-foreground text-balance">
          El Imposible
        </h1>

        <div className="mt-7 flex max-w-xl flex-col gap-7">
          <p className="text-pretty text-base leading-relaxed text-primary-foreground/85 md:text-lg">
            Mariscos estilo Sinaloa. Camarón del Pacífico, chiltepín molido en
            molcajete y limón exprimido al momento. Nada se prepara antes de que
            lo pidas.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={orderLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-accent-foreground shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
            >
              <WhatsAppIcon className="size-4" />
              Pedir por WhatsApp
            </a>
            <a
              href="#menu"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-primary-foreground/30 bg-primary-foreground/5 px-7 py-4 text-sm font-semibold text-primary-foreground backdrop-blur-md transition-all duration-300 hover:bg-primary-foreground/15"
            >
              Ver el menú
              <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* Trust strip */}
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-primary-foreground/15 pt-7 sm:grid-cols-4 md:mt-14">
          {[
            { value: '4.9', label: 'En Google Maps', star: true },
            { value: '12 años', label: 'En la misma esquina' },
            { value: '6 a.m.', label: 'Llega el marisco' },
            { value: '25 min', label: 'Entrega promedio' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <dt className="flex items-center gap-1.5 font-serif text-2xl font-semibold leading-none text-primary-foreground md:text-3xl">
                {stat.value}
                {stat.star && (
                  <Star className="size-4 fill-lime-fresh text-lime-fresh" />
                )}
              </dt>
              <dd className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary-foreground/60">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
