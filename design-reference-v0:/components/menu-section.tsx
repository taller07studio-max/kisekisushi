'use client'

import { useMemo, useState } from 'react'
import { DishCard } from '@/components/dish-card'
import { Reveal } from '@/components/reveal'
import { categories, dishes, type Dish } from '@/lib/menu'
import { cn } from '@/lib/utils'

const ALL = 'todo'

export function MenuSection({ onSelect }: { onSelect: (dish: Dish) => void }) {
  const [active, setActive] = useState<string>(ALL)

  const visible = useMemo(
    () => (active === ALL ? dishes : dishes.filter((d) => d.category === active)),
    [active],
  )

  const activeCategory = categories.find((c) => c.id === active)

  return (
    <section id="menu" className="scroll-mt-16 bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
            La carta completa
          </span>
          <h2 className="mt-3 font-serif text-[clamp(2.25rem,7vw,3.75rem)] font-light leading-[0.95] tracking-[-0.025em] text-foreground text-balance">
            Todo se prepara cuando lo pides
          </h2>
          <p className="mt-5 text-pretty text-[15px] leading-relaxed text-muted-foreground">
            Ningún ceviche lleva más de diez minutos hecho. Elige una categoría y
            toca cualquier platillo para ver de qué está hecho.
          </p>
        </Reveal>
      </div>

      {/* Sticky category nav — scrolls horizontally on mobile */}
      <div className="sticky top-16 z-30 mt-10 border-y border-border/60 bg-background/85 backdrop-blur-xl md:top-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div
            role="tablist"
            aria-label="Categorías del menú"
            className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-3.5 md:mx-0 md:flex-wrap md:px-0"
          >
            {[{ id: ALL, label: 'Todo', tagline: '' }, ...categories].map(
              (cat) => {
                const isActive = active === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(cat.id)}
                    className={cn(
                      'shrink-0 whitespace-nowrap rounded-full px-4.5 py-2.5 text-sm font-semibold transition-all duration-300',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-secondary text-secondary-foreground hover:bg-muted',
                    )}
                  >
                    {cat.label}
                  </button>
                )
              },
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {activeCategory && (
          <p
            key={`tagline-${activeCategory.id}`}
            className="animate-in fade-in slide-in-from-bottom-2 mt-8 font-serif text-lg italic text-muted-foreground duration-500"
          >
            {activeCategory.tagline}
          </p>
        )}

        <div
          key={`grid-${active}`}
          className="animate-in fade-in slide-in-from-bottom-4 mt-8 grid grid-cols-1 gap-x-5 gap-y-10 duration-500 ease-out sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((dish, i) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onSelect={onSelect}
              priority={i < 3}
            />
          ))}
        </div>

        <p className="mt-14 text-pretty text-center text-xs leading-relaxed text-muted-foreground">
          Precios en pesos mexicanos. El marisco depende de la pesca del día —
          si algo se acaba, te lo decimos por WhatsApp antes de confirmar.
        </p>
      </div>
    </section>
  )
}
