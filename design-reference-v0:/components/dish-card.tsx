'use client'

import Image from 'next/image'
import { Plus } from 'lucide-react'
import { formatPrice, type Dish } from '@/lib/menu'
import { cn } from '@/lib/utils'

export function HeatMeter({
  heat,
  className,
}: {
  heat: number
  className?: string
}) {
  if (heat <= 0) return null
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span className="sr-only">{`Nivel de picante: ${heat} de 3`}</span>
      {[1, 2, 3].map((level) => (
        <span
          key={level}
          aria-hidden="true"
          className={cn(
            'h-1 w-3 rounded-full transition-colors',
            level <= heat ? 'bg-accent' : 'bg-current opacity-20',
          )}
        />
      ))}
    </span>
  )
}

export function DishCard({
  dish,
  onSelect,
  priority = false,
}: {
  dish: Dish
  onSelect: (dish: Dish) => void
  priority?: boolean
}) {
  return (
    <article className="group relative flex flex-col">
      <button
        type="button"
        onClick={() => onSelect(dish)}
        className="flex flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-[26px]"
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-[26px] bg-secondary shadow-sm ring-1 ring-border/60 transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/10">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />

          {dish.badge && (
            <span className="absolute left-3.5 top-3.5 rounded-full bg-background/92 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground shadow-sm backdrop-blur-md">
              {dish.badge}
            </span>
          )}

          <span
            aria-hidden="true"
            className="absolute bottom-3.5 right-3.5 inline-flex size-11 items-center justify-center rounded-full bg-background text-foreground shadow-lg transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:rotate-90"
          >
            <Plus className="size-5" />
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 px-1 pt-4">
          <div className="min-w-0">
            <h3 className="font-serif text-lg font-semibold leading-tight tracking-tight text-foreground">
              {dish.name}
            </h3>
            <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
              {dish.blurb}
            </p>
            <HeatMeter heat={dish.heat} className="mt-3 text-muted-foreground" />
          </div>
          <span className="shrink-0 font-serif text-lg font-semibold text-foreground tabular-nums">
            {formatPrice(dish.price)}
          </span>
        </div>
      </button>
    </article>
  )
}
