# DESIGN.md

Guía de diseño y rediseño para el template de landings de **Taller 07 Studio**.

Este template es una landing **completa y funcional** que se rediseña por cliente.
La capa de datos ya funciona y se conecta sola a Supabase según el `BUSINESS_ID`.
El trabajo de cada cliente es **transformar la capa visual** sin romper la de datos.

> **Regla de oro:** la capa de diseño es libre. La capa de datos es sagrada.
> Puedes reestructurar, recolorear y re-tipografiar todo lo visual, siempre que
> sigas consumiendo los mismos fetchers y respetando los mismos tipos.

---

## 1. Las dos capas

### Capa de DATOS — NO tocar al rediseñar

Estos archivos contienen la lógica que conecta con Supabase, el carrito y los
filtros. Su estructura no se modifica durante un rediseño. Solo se consumen.

| Archivo | Responsabilidad |
|---|---|
| `lib/business.ts` | Fetchers (`getBusiness`, `getCategories`, `getProducts`, `getBranches`) + tipos |
| `lib/format.ts` | `formatMXN`, `buildWhatsAppUrl` |
| `lib/supabase.ts` | Cliente Supabase (read-only, anon key) |
| `components/CartContext.tsx` | Estado del carrito (Context + useReducer + localStorage) |
| `components/CartDrawer.tsx` | Lógica del carrito y envío por WhatsApp |
| `components/ProductSheet.tsx` | Lógica de "Agregar a cotización" |
| `components/CatalogClient.tsx` | Filtros por URL (`useSearchParams`) |
| `components/Catalog.tsx` | Wrapper con Suspense |
| `components/ServiceCategoryCard.tsx` | Link de categoría → filtro por URL |

> Puedes cambiar **cómo se ven** estos componentes (markup visual, clases, estilos
> inline), pero NO **cómo obtienen o manejan los datos**. Si tocas el JSX visual,
> conserva intactos: los `useCart()`, los `useSearchParams()`, los fetchers, los
> tipos y las keys de `pushState` (`?cat`, `?sub`, `?product`).

### Capa de DISEÑO — libre para rediseñar

| Archivo | Qué puedes cambiar |
|---|---|
| `app/globals.css` | Paleta (CSS vars), grain texture, animaciones, tipografía base |
| `app/layout.tsx` | Fuentes de Google, metadata (sin romper `generateMetadata`) |
| `components/Hero.tsx` | Imagen, textos, layout, altura, overlay |
| `components/Services.tsx` | Layout del grid, estilo de las cards de categoría |
| `components/Header.tsx` | Logo, nav, estilo del botón, ícono del carrito |
| `components/Contact.tsx` | Estilo de la sección, colores, layout |
| `components/Footer.tsx` | Estilo, contenido adicional |
| Estructura de secciones | Reordenar, agregar o quitar secciones (ver §4) |

---

## 2. Contratos de datos — de dónde sale cada cosa

Todo viene de Supabase vía `NEXT_PUBLIC_BUSINESS_ID`. Los datos se fetchan en
`app/page.tsx` (Server Component) y fluyen por props hacia abajo. **Ningún
componente fetcha sus propios datos.**

### Tipos (definidos en `lib/business.ts`)

```typescript
type Business = {
  id: string; name: string; description: string | null
  whatsapp: string | null; city: string | null
  logo_url: string | null; has_catalog: boolean
}

type Subcategory = { id: string; name: string; slug: string; order_index: number | null }

type Category = {
  id: string; name: string; slug: string; image_url: string | null
  order_index: number | null; subcategories: Subcategory[]
}

type Product = {
  id: string; name: string; description: string | null
  price: number | null; image_url: string | null
  categoryAssignments: { categoryId: string; subcategoryId: string | null }[]
}

type Branch = {
  id: string; name: string; address: string | null
  email: string | null; whatsapp: string | null; order_index: number | null
}
```

### Fetchers (en `lib/business.ts`)

| Función | Devuelve | Notas |
|---|---|---|
| `getBusiness()` | `Business \| null` | Nombre, logo, whatsapp, descripción, ciudad |
| `getCategories()` | `Category[]` | Categorías + subcategorías anidadas, ordenadas |
| `getProducts()` | `Product[]` | Solo si `has_catalog`; activos y no borrados |
| `getBranches()` | `Branch[]` | Sucursales (para selector de WhatsApp en carrito) |

### Cómo se consume cada dato en la UI

| Dato | Origen | Dónde se usa hoy (puedes moverlo) |
|---|---|---|
| Nombre del negocio | `business.name` | Header, Hero, Footer, metadata |
| Logo | `business.logo_url` | Header, OG image |
| Descripción | `business.description` | Hero subtitle, metadata |
| WhatsApp | `business.whatsapp` | Botón "Cotizar", CartDrawer, Contact |
| Ciudad | `business.city` | Contact, Footer |
| Categorías | `getCategories()` | Sección Services (con imagen por categoría) |
| Subcategorías | `category.subcategories` | Tabs de filtro en Catalog |
| Productos | `getProducts()` | Grid de Catalog + ProductSheet |
| Sucursales | `getBranches()` | Selector de destino en CartDrawer |

---

## 3. Comportamientos que deben sobrevivir a cualquier rediseño

Sin importar cómo se vea la landing, estos comportamientos NO se rompen:

- **Filtros por URL** — `?cat=<slug>`, `?sub=<slug>` controlan el catálogo.
  Las categorías de Services enlazan al catálogo escribiendo `?cat=<slug>`.
- **Product sheet por URL** — `?product=<uuid>` abre el detalle del producto.
- **Carrito** — agregar desde ProductSheet, persistencia en localStorage
  (key por `BUSINESS_ID`), badge en Header, drawer con steppers.
- **Envío de cotización** — un solo mensaje de WhatsApp con todos los items,
  con selector de sucursal cuando hay 2+ destinos.
- **ISR** — `export const revalidate = 60` en `page.tsx` NUNCA se quita.
- **Read-only** — sin auth, sin mutations, sin Server Actions, anon key only.
- **Animaciones `reveal`** — solo dentro de `<RevealOnScroll>` (ver CLAUDE.md).
- **Suspense** — cualquier componente con `useSearchParams()` va dentro de `<Suspense>`.

> Detalle técnico completo de cada comportamiento: ver `CLAUDE.md`.

---

## 4. Reestructurar secciones (permitido)

Tienes libertad para reordenar, agregar o quitar secciones. La única condición es
que cada sección siga tomando sus datos del contrato correcto.

**Ejemplos válidos:**
- Mover el catálogo arriba de servicios.
- Agregar una sección de testimonios (estática o nueva tabla en Supabase + nuevo fetcher en `lib/business.ts`).
- Dividir el Hero en dos bloques.
- Cambiar el grid de Services por un carrusel.

**Condiciones:**
- Si agregas una sección con datos nuevos, el fetcher va en `lib/business.ts` y el
  fetch en `page.tsx` (Server Component) — nunca en un Client Component.
- Si quitas el catálogo, recuerda que depende de `has_catalog`; respeta ese flag.
- Si una sección usa `useSearchParams()`, envuélvela en `<Suspense>`.

---

## 5. Workflow de onboarding de nuevo cliente (manual)

> Este proceso lo hace Felix manualmente.

1. **Alta en Tianquiz admin** → crear el negocio → copiar el `BUSINESS_ID` (UUID).
2. **Llenar datos en Supabase** (o desde el dashboard del cliente): nombre,
   descripción, whatsapp, ciudad, logo, `has_catalog`, slug, sucursales.
3. **Crear el repo del cliente** → en GitHub: "Use this template" sobre
   `taller07-landing-base` → nombrar `nombre-cliente`.
4. **Clonar en la Mac** → `git clone` del nuevo repo.
5. **Configurar entorno local** → `cp .env.example .env.local` y llenar:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://bhiedgjptfkowbukaqek.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
   NEXT_PUBLIC_BUSINESS_ID=<uuid del cliente>
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
6. **Instalar y levantar** → `npm install` → `npm run dev`.
   Verás la landing con los datos del cliente y la paleta neutra del template.
7. **Rediseñar** → abrir Claude Code + skill de diseño (ver §6).
8. **Deploy en Vercel** → importar el repo → configurar las 4 env vars
   (`NEXT_PUBLIC_SITE_URL` = dominio de producción) → deploy.
9. **Dominio** → conectar el dominio del cliente en Vercel → Settings → Domains.

---

## 6. Rediseñar con Claude Code + skill de diseño

El template ya es una landing funcional con paleta neutra. La skill de diseño la
**transforma**, no la construye desde cero.

### Qué tocar al rediseñar
- `app/globals.css` — la paleta (bloque marcado `/* === PALETA DEL CLIENTE === */`),
  el grain texture, las animaciones.
- `app/layout.tsx` — las fuentes de Google (Cormorant/Inter → las del cliente).
- `Hero.tsx` — imagen de fondo, textos, altura, overlay.
- Estilos inline de los componentes visuales.

### Qué NO tocar
- Todo lo de la **capa de DATOS** (§1).
- Los `useCart()`, `useSearchParams()`, fetchers, tipos.
- `export const revalidate = 60` en `page.tsx`.

### Prompt de ejemplo para rediseñar

```
Este es el template base de landing de Taller 07 Studio. Quiero rediseñar la
capa visual para un cliente nuevo, SIN tocar la capa de datos.

Lee primero DESIGN.md y CLAUDE.md para entender qué es sagrado.

Cliente: [NOMBRE DEL NEGOCIO]
Giro: [qué vende / a qué se dedica]
Personalidad de marca: [ej. elegante y minimalista / vibrante y juvenil / rústico y cálido]
Paleta deseada: [colores o sensación de color]
Tipografía deseada: [serif elegante / sans moderna / lo que aplique]
Referencias visuales: [opcional — marcas o estilos que le gusten]

Rediseña SOLO la capa visual:
- globals.css: nueva paleta en el bloque /* === PALETA DEL CLIENTE === */,
  grain texture y animaciones acordes a la marca.
- layout.tsx: cambia las fuentes de Google a las que correspondan.
- Hero.tsx: nueva dirección visual (imagen, textos, overlay, altura).
- Ajusta estilos inline de Header, Services, Catalog, Contact, Footer para que
  todo sea coherente con la marca.
- Tienes libertad de reestructurar secciones si mejora el diseño (respetando
  los contratos de datos de DESIGN.md §4).

NO toques: lib/business.ts, lib/format.ts, lib/supabase.ts, CartContext.tsx,
ni la lógica de useCart/useSearchParams/fetchers. No quites revalidate=60.
Los datos (productos, categorías, sucursales, logo, whatsapp) ya fluyen desde
Supabase y no deben tocarse.

Al terminar, corre npm run build para verificar que no se rompió nada.
```

> Después de este prompt, puedes seguir conversando con Claude Code para iterar
> el diseño (ajustar colores, espaciados, una sección específica, etc.).

---

## 7. Checklist de "cliente listo"

- [ ] `BUSINESS_ID` correcto en `.env.local` (local) y en Vercel (producción).
- [ ] Datos del negocio cargados en Supabase (nombre, logo, whatsapp, descripción).
- [ ] `has_catalog` configurado según si el cliente muestra catálogo.
- [ ] Categorías y productos con imágenes en el dashboard.
- [ ] Rediseño visual aplicado y coherente con la marca.
- [ ] `npm run build` pasa sin errores.
- [ ] OG card se ve bien (probar en opengraph.xyz con `NEXT_PUBLIC_SITE_URL`).
- [ ] WhatsApp de cotización llega al número correcto.
- [ ] Dominio conectado en Vercel.
