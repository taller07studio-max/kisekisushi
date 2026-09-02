import { ShrimpMark } from '@/components/icons'
import { categories } from '@/lib/menu'

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <ShrimpMark className="size-9" />
              <span className="flex flex-col leading-none">
                <span className="font-serif text-xl font-semibold tracking-tight">
                  El Imposible
                </span>
                <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.22em] opacity-60">
                  Mariscos estilo Sinaloa
                </span>
              </span>
            </div>
            <p className="mt-6 max-w-sm text-pretty text-sm leading-relaxed text-primary-foreground/65">
              Marisco del Pacífico, chiltepín de molcajete y limón exprimido al
              momento. En la misma esquina de Culiacán desde 2013.
            </p>
          </div>

          <nav className="md:col-span-3" aria-label="Menú">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary-foreground/50">
              La carta
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <a
                    href="#menu"
                    className="text-sm text-primary-foreground/75 transition-colors hover:text-lime-fresh"
                  >
                    {cat.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-4" aria-label="Información">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary-foreground/50">
              Información
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <a
                  href="#casa"
                  className="text-sm text-primary-foreground/75 transition-colors hover:text-lime-fresh"
                >
                  Nuestra historia
                </a>
              </li>
              <li>
                <a
                  href="#contacto"
                  className="text-sm text-primary-foreground/75 transition-colors hover:text-lime-fresh"
                >
                  Horarios y ubicación
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-foreground/75 transition-colors hover:text-lime-fresh"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="tel:+526671234567"
                  className="text-sm text-primary-foreground/75 transition-colors hover:text-lime-fresh"
                >
                  667 123 4567
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-primary-foreground/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} El Imposible Mariscos. Todos los
            derechos reservados.
          </p>
          <p className="text-xs text-primary-foreground/50">
            Hecho en Culiacán, Sinaloa
          </p>
        </div>
      </div>
    </footer>
  )
}
