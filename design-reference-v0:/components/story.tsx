import Image from 'next/image'
import { Reveal } from '@/components/reveal'

const pillars = [
  {
    n: '01',
    title: 'Llega a las 6 de la mañana',
    body: 'Compramos directo a las cooperativas de Topolobampo y Altata. Lo que no se vende, no se guarda para mañana.',
  },
  {
    n: '02',
    title: 'Chiltepín de molcajete',
    body: 'Nada de salsas industriales. El chile se tuesta y se muele a mano cada mañana, y por eso pica distinto cada día.',
  },
  {
    n: '03',
    title: 'Curado al minuto',
    body: 'El limón se exprime cuando pides. Cuatro minutos de curado, ni uno más, para que el camarón siga firme.',
  },
]

export function Story() {
  return (
    <section id="casa" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[30px] shadow-lg shadow-primary/10 ring-1 ring-border/50">
              <Image
                src="/images/ambiance.png"
                alt="Interior del restaurante El Imposible con muros de barro, mesas de madera y luz de tarde"
                fill
                sizes="(max-width: 768px) 92vw, 46vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                Desde 2013
              </span>
              <h2 className="mt-3 font-serif text-[clamp(2.25rem,7vw,3.5rem)] font-light leading-[0.95] tracking-[-0.025em] text-foreground text-balance">
                Se llama El Imposible por una razón
              </h2>
              <p className="mt-6 text-pretty text-[15px] leading-relaxed text-muted-foreground">
                Nos dijeron que era imposible abrir una marisquería a tres horas
                de la costa y servir camarón como si estuvieras en la playa. Doce
                años después seguimos en la misma esquina, con la misma hielera y
                el mismo proveedor.
              </p>
            </Reveal>

            <ul className="mt-10 flex flex-col divide-y divide-border">
              {pillars.map((p, i) => (
                <Reveal as="li" key={p.n} delay={i * 110} className="py-5 first:pt-0">
                  <div className="flex gap-5">
                    <span className="font-serif text-sm font-semibold text-accent tabular-nums">
                      {p.n}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-semibold leading-tight text-foreground">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
