# CLAUDE.md — Tianquiz Catalog Template

Contexto de agente para el template **Tianquiz SaaS** multitenant (Taller 07 Studio).

> **Propósito de este archivo:** guiar a Claude Code en dos tipos de trabajo sobre este repositorio — (1) personalización visual para un nuevo cliente y (2) cambios funcionales o técnicos. Léelo completo antes de escribir una sola línea de código.

---

## 1. Propósito del Repositorio

Este repositorio es una **landing/catálogo digital reutilizable**. Cada implementación apunta a un negocio diferente vía `NEXT_PUBLIC_BUSINESS_ID`. La arquitectura y funcionalidad son estables; lo que cambia en cada cliente es la **capa visual**.

- La estructura funcional se mantiene intacta entre clientes.
- La personalización principal ocurre en estilos, tipografías, colores, composición y copy de presentación.
- Cada cliente debe sentir que la landing fue diseñada exclusivamente para su marca — aunque todos partan de la misma base técnica.
- Los datos del negocio (nombre, logo, productos, horarios, WhatsApp) se obtienen siempre de Supabase. **Nunca se hardcodean en el código.**

**Comandos**
```bash
npm run dev      # Dev server
npm run build    # Build de producción
npm start        # Servidor de producción
```

---

## 2. Regla Fundamental — Visual ≠ Funcionalidad

> **Cambiar la apariencia sin cambiar lo que la aplicación hace.**

### Capa visual — Claude puede modificar

- `app/globals.css` — variables CSS, tokens de diseño, paleta, grain texture, animaciones.
- `app/layout.tsx` — fuentes de Google, sin romper `generateMetadata`.
- Estilos inline en componentes (colores, tipografías, espaciados, bordes, sombras).
- Composición visual y layout cuando mejore la presentación.
- Microinteracciones y transiciones.
- Copy de presentación estático (eyebrows, taglines, CTAs genéricos, textos fijos del template).

### Capa funcional — Claude debe preservar

- `lib/business.ts` — fetchers y tipos TypeScript.
- `lib/format.ts` — `formatMXN`, `getActiveItems`.
- `lib/supabase.ts` — cliente Supabase.
- `lib/whatsapp.ts` — lógica de resolución de WhatsApp.
- `store/cartStore.ts` — estado del carrito.
- `hooks/useCart.ts` — wrapper SSR-safe del carrito.
- Lógica de `useSearchParams`, `router.push`, parámetros de URL.
- Props funcionales y contratos TypeScript de todos los componentes.
- `export const revalidate = 60` en `page.tsx`.
- Comportamiento del carrito, ProductSheet, CartDrawer.
- Feature flag `has_cart`.
- Integración con Supabase (sin `createBrowserClient`, sin auth, sin writes).

---

## 3. Proceso de Auditoría — Antes de Escribir Código

**No empezar a modificar archivos sin haber explorado primero.**

Antes de cualquier trabajo de personalización visual, Claude debe:

1. Leer `CLAUDE.md` y `DESIGN.md` completos.
2. Revisar la estructura de `app/` y `components/`.
3. Identificar qué componentes son Server Components y cuáles son Client Components.
4. Leer `app/globals.css` — entender los tokens CSS existentes.
5. Leer `app/layout.tsx` — identificar las fuentes activas.
6. Identificar qué componentes contienen lógica funcional intocable.
7. Identificar qué partes son puramente visuales y pueden modificarse con seguridad.

Antes de modificar cualquier componente, definir explícitamente:

- **"Qué voy a cambiar"** — lista concreta de archivos y secciones.
- **"Qué no debo tocar"** — lista de archivos/lógica fuera de límites.

---

## 4. Estructura del Proyecto

```
app/
  page.tsx        # Server Component. Fetches: business, categories, products, branches. revalidate=60.
  layout.tsx      # OG metadata dinámica, carga de fuentes Google.
  globals.css     # Sistema de diseño: CSS vars, tipografía, animaciones, tokens.

components/
  Header.tsx           # Server Component wrapper — pasa datos a HeaderClient.
  HeaderClient.tsx     # 'use client'. Logo, businessName, pills de categoría (scroll horizontal mobile).
  Hero.tsx             # Sección hero. Trust strip, CTAs, WA button.
  HeroWaButton.tsx     # 'use client'. Botón WhatsApp del hero.
  Catalog.tsx          # Wrapper con Suspense para CatalogClient.
  CatalogClient.tsx    # 'use client'. Productos agrupados por categoría. Controles de carrito si has_cart.
  ProductSheet.tsx     # 'use client'. Modal/sheet: imagen, nombre, precio, opciones, extras, cantidad.
  CartDrawer.tsx       # 'use client'. Carrito + checkout WhatsApp multi-sucursal.
  Contact.tsx          # Sección de contacto.
  ContactWaButton.tsx  # 'use client'. CTA WhatsApp en sección de contacto.
  Footer.tsx           # Footer.
  FooterWaButton.tsx   # 'use client'. Botón WhatsApp en footer.
  WaBranchSheet.tsx    # 'use client'. Selector de sucursal para WhatsApp.
  RevealOnScroll.tsx   # 'use client'. IntersectionObserver para animaciones .reveal.

lib/
  business.ts       # Fetchers de Supabase + tipos TypeScript.
  format.ts         # formatMXN, getActiveItems.
  supabase.ts       # Cliente Supabase (anon key, read-only).
  whatsapp.ts       # Resuelve número WhatsApp (Business → Branch → Modal). Sanitiza URLs +52.
  database.types.ts # Tipos generados de Supabase.

store/
  cartStore.ts    # Zustand store. Almacena IDs y cantidades ÚNICAMENTE.

hooks/
  useCart.ts      # Wrapper SSR-safe. ÚNICA forma válida de consumir el carrito.
```

---

## 5. Stack Tecnológico

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 · Tailwind CSS v4 |
| Lenguaje | TypeScript (strict) |
| Datos | Supabase (anon key, read-only) |
| Estado | Zustand (solo carrito) |
| Fuentes | next/font/google — variables CSS |

**Schema JSONB de productos** (campos `options` / `extras`):
```typescript
Array<{ id: string; name: string; price: number; active?: boolean; order?: number }>
```
Siempre filtrar `active === false` y ordenar por `order` ascendente antes de renderizar.

---

## 6. Reglas de Arquitectura — Funcional

### Data Fetching
- Todo el fetching en Server Components. `export const revalidate = 60` en `page.tsx` es innegociable.
- **NUNCA** usar `useEffect` para fetching. **NUNCA** agregar `"use client"` a `page.tsx` o `layout.tsx`.
- **NUNCA** usar `createBrowserClient` de `@supabase/ssr` — usar `createClient` de `@supabase/supabase-js`.

### URL como fuente de verdad
Los parámetros de URL controlan el estado de filtros y modales (`window.history.pushState`). No usar `useState` para estos concerns.
- `?cat=<slug>` → filtrar por categoría
- `?sub=<slug>` → filtrar por subcategoría
- `?product=<uuid>` → abrir ProductSheet

### Mobile — Prevención de Overflow
- Grids: **NUNCA** `1fr` — siempre `minmax(0, 1fr)`.
- Imágenes: `<article>` debe tener `width: 100%`. `<Image>` debe usar `fill` + `object-cover`.
- Texto largo: `wordBreak: 'break-word'` y `overflowWrap: 'break-word'`.

### Prohibiciones absolutas
- **NUNCA** hardcodear datos del negocio/tenant — siempre leer de Supabase vía `NEXT_PUBLIC_BUSINESS_ID`.
- **NUNCA** hardcodear URLs de WhatsApp — siempre usar `lib/whatsapp.ts`.
- **NUNCA** agregar autenticación o sesiones de usuario.
- **NUNCA** usar estado global (Zustand/Context) para nada excepto el carrito.

---

## 7. E-Commerce & Estado — Reglas Innegociables

### Feature Flag `has_cart`
`has_cart` (boolean, tabla `businesses`) es el único switch. Los componentes deben bloquear toda UI de carrito detrás de este flag. No renderizar controles de carrito, botones de checkout ni formularios de pedido cuando sea `false`.

### Zustand — Seguridad de Hidratación
- `store/cartStore.ts` es el **único** estado global permitido.
- **SIEMPRE** consumir vía `hooks/useCart.ts`. Este hook devuelve carrito vacío en SSR y lo hidrata client-side vía `useEffect`, previniendo Hydration Mismatches. Nunca leer de `cartStore` directamente en componentes.

### Anti-Staleness Rule
`CartItem` almacena **solo IDs y cantidades** — nunca precios, nombres ni descripciones:
```typescript
type CartItem = {
  productId: string;
  selectedOptionId?: string;
  selectedExtraIds: string[];
  quantity: number;
};
```
Todos los precios y datos de display se calculan en runtime cruzando IDs con datos frescos del servidor.

### WhatsApp Multi-Sucursal
- El checkout resuelve al campo `whatsapp` de los registros `branches` — NO al teléfono principal del negocio.
- `CartDrawer.tsx` debe filtrar sucursales sin campo `whatsapp` válido.
- Si hay múltiples sucursales válidas, el usuario selecciona una vía radio group antes de habilitar el checkout.

### Orphan Safety
Si un `productId` en localStorage ya no existe en la DB, el cálculo del carrito lo descarta silenciosamente — sin excepciones, sin crashes de UI.

---

## 8. Sistema de Estilos — Dónde Vive el Diseño

### `app/globals.css`

Este archivo es el **único punto de entrada para el sistema de diseño**.

Estructura recomendada:
```css
@import "tailwindcss";

@theme inline {
  /* Variables de fuente → mapeadas desde next/font */
  --font-display: var(--font-[nombre]);
  --font-ui:      var(--font-[nombre]);
  --font-serif:   var(--font-[nombre]);
  --font-sans:    var(--font-[nombre]);

  /* Escala de border-radius */
  --radius-sm:  calc(var(--radius) * 0.5);
  --radius-md:  var(--radius);
  /* ... */
}

/* ══ PALETA DEL CLIENTE ══════════════════════════════ */
:root {
  /* Colores de marca */
  --brand-primary:   #...;
  --brand-secondary: #...;
  /* ... */

  /* Tokens funcionales */
  --background: #...;
  --foreground: #...;
  /* ... */

  /* Radio global */
  --radius: 0.5rem;
}

/* Textura, animaciones, utilidades globales */
```

Cuando se personaliza para un cliente nuevo, actualizar el bloque `/* ══ PALETA DEL CLIENTE ══ */` y el bloque de fuentes en `@theme inline`. El resto del archivo (animaciones, grain, utilidades) puede mantenerse o ajustarse según la dirección artística.

### `app/layout.tsx`

Gestiona la carga de fuentes vía `next/font/google`. Cada fuente se mapea a una variable CSS usada en `globals.css`. Para cambiar tipografías de un cliente, modificar únicamente las importaciones de fuentes y sus variables — sin alterar `generateMetadata`.

---

## 9. Guía de Personalización Visual — Nuevo Cliente

Esta sección cubre el proceso completo para adaptar el template a la identidad de una marca nueva.

### 9.1 Interpretación de Referencias Visuales

Cuando el usuario proporcione referencias de marca (imágenes, URLs, nombres de marcas, mood boards), identificar:

- **Personalidad y vibe** — formal, relajado, artesanal, industrial, lujoso, irreverente…
- **Paleta cromática** — colores dominantes, secundarios, acentos, temperatura.
- **Tipografía** — display condensado, serif editorial, sans geométrica, manuscrita…
- **Composición** — simétrica, editorial, asimétrica, reticular.
- **Uso del espacio** — denso, aireado, equilibrado.
- **Textura y materialidad** — limpio, rugoso, impreso, digital.
- **Bordes y formas** — cuadrado, sello (4–8px), pill, orgánico.
- **Nivel de ornamentación** — minimalista vs. decorado.
- **Fotografía** — editorial, lifestyle, producto, ilustración.

La tarea es **extraer principios visuales y traducirlos a un sistema de diseño web coherente** — no copiar una referencia literalmente.

### 9.2 Crear el Sistema Visual Primero

Antes de modificar cualquier componente, definir el sistema completo:

| Token | Qué define |
|---|---|
| Primary / Background | Color dominante del sitio |
| Secondary / Foreground | Texto y elementos principales |
| Accent | Énfasis, CTAs, precios |
| Surface / Muted | Superficies secundarias |
| Border | Separadores |
| Section Dark / Mid | Fondos de secciones alternas |
| Font Display | Headings de impacto |
| Font UI | Labels, pills, navegación |
| Font Serif | Acento editorial, taglines |
| Font Body | Texto corrido, descripciones |
| Radius | Base del sistema de bordes |
| Texture | Grain, ruido, patrón — si aplica |

Centralizar todos los tokens en `:root` de `globals.css` antes de estilizar componentes.

### 9.3 Tipografía

Seleccionar las fuentes según la personalidad de la marca:

- **Display** — para headlines de máximo impacto. Condensadas, bold, con carácter.
- **UI / Labels** — para pills de categoría, etiquetas, botones. Legibles y directas.
- **Serif / Acento** — opcional. Para taglines o frases editoriales. Italic con personalidad.
- **Body** — para descripciones, precios, UI general. Altamente legible.

Reglas:
- Reutilizar fuentes ya cargadas en el proyecto antes de agregar nuevas.
- Máximo 3–4 familias. Más es ruido.
- La jerarquía tipográfica debe ser clara: display > UI > body.
- No introducir fuentes externas fuera de `next/font/google` sin razón.
- La tipografía es parte de la identidad — no un detalle cosmético posterior.

Cargar fuentes en `app/layout.tsx` con `next/font/google`, mapearlas a variables CSS (`--font-[rol]`), y aplicar esas variables en componentes via `fontFamily: 'var(--font-[rol])'`.

### 9.4 Color

- Derivar la paleta de las referencias del cliente — no asumir colores por categoría o giro.
- Definir un color dominante claro. El resto apoya o contrasta.
- Máximo 5–6 colores en paleta activa. Más genera inconsistencia.
- Verificar contraste WCAG mínimo en textos sobre fondos.
- Evitar blanco/negro puro si la marca tiene temperatura — usar tonos cálidos o fríos.
- Un mismo color puede usarse en múltiples tokens con distintos nombres semánticos (`--accent`, `--wood`, etc.).

### 9.5 Border Radius

El radio de borde comunica personalidad. No usar un solo valor para todo:

| Uso | Radio sugerido |
|---|---|
| Micro (badges, tags) | 2–4px |
| Botones, pills de navegación | 4–6px (`sello`) |
| Cards de producto | 6–8px |
| Modales y drawers | 12–16px en esquinas superiores |
| Steppers de cantidad, avatares | 9999px (pill completo, permitido) |

Evitar usar `9999px` en todos los elementos — rompe la coherencia editorial.

### 9.6 Secciones y Componentes — Qué Personalizar

| Componente | Qué personalizar |
|---|---|
| `globals.css` | Toda la paleta, fuentes, grain, animaciones |
| `layout.tsx` | Fuentes Google |
| `Hero.tsx` | Fondo, headline, subtítulo, trust strip, CTAs |
| `HeaderClient.tsx` | Business name, pills de categoría, estilos de hover |
| `Catalog.tsx` | Headline de sección, eyebrow |
| `CatalogClient.tsx` | Pills de filtro, headings de categoría, estilo de cards, precios |
| `ProductSheet.tsx` | Backdrop, corners del modal, título, precio, botón |
| `CartDrawer.tsx` | Backdrop, título, estilo de items, total, botón checkout |
| `Contact.tsx` | Fondo, headline, subtítulo, eyebrow |
| `Footer.tsx` | Business name, tagline, estilos |
| `ContactWaButton.tsx` | Color, radius, texto del CTA |
| `FooterWaButton.tsx` | Color, radius |
| `HeroWaButton.tsx` | Color, border, texto |

### 9.7 Logo y Assets

- Usar siempre los assets proporcionados por el cliente.
- No redibujar ni reemplazar logos existentes.
- No sustituir logos por emojis ni placeholders de texto sin autorización.
- Mantener proporciones originales del logo.
- No agregar efectos (sombras, glow, filtros) al logo sin solicitud expresa.
- Los elementos gráficos de la marca (sellos, iconos, separadores) pueden reutilizarse como decoración visual.

### 9.8 Fotografía de Producto

- La comida/producto es el protagonista — no compite con el diseño.
- Usar siempre `<Image fill object-cover>` — nunca deformar proporciones.
- No agregar overlays que reduzcan la legibilidad o el color de la fotografía.
- Diseñar la presentación alrededor de las imágenes existentes.
- No reemplazar fotografías reales por stock sin autorización explícita.

### 9.9 Texturas y Elementos Gráficos

Las texturas (grain SVG, ruido, papel) pueden reforzar la identidad, pero siempre de forma intencional:
- Debe existir una razón visual relacionada con la marca.
- La opacidad del grain actual está en `body::after` (`globals.css`) y puede ajustarse por cliente.
- No usar textura simplemente porque "se ve bonito".
- Otros elementos (separadores, marcos, patrones) son válidos si están en las referencias de la marca.

---

## 10. Copy y Contenido

Cuando el usuario proporcione información real del negocio, usarla literalmente:

- No inventar ubicaciones, horarios, procedencias ni atributos de producto.
- No mantener copy genérico del template que no aplique al negocio real.
- El diseño puede reinterpretar visualmente el contenido, pero no puede fabricar información comercial.
- Si el cliente no proporciona un dato, dejar el campo vacío o usar el fallback de Supabase — no inventar.

Datos que siempre vienen de Supabase (no hardcodear):
- Nombre del negocio (`business.name`)
- Descripción (`business.description`)
- Ciudad (`business.city`)
- Logo (`business.logo_url`)
- WhatsApp (`business.whatsapp`, `branch.whatsapp`)
- Productos, categorías, sucursales

Copy estático del template que SÍ puede actualizarse por cliente:
- Textos del trust strip del Hero
- Eyebrows y taglines de secciones
- CTAs genéricos
- Placeholder de descripción en Hero (si `description` es null)

---

## 11. Anti-Patterns — Qué Evitar

### De diseño
- Aplicar tendencias de UI sin relación con la marca (glassmorphism, neón, etc.).
- Gradientes genéricos que no se derivan de la paleta.
- Exceso de sombras o border-radius.
- Cards genéricas sin carácter.
- Colores arbitrarios no respaldados por el sistema de tokens.
- Iconos genéricos de icon packs sin relación con la marca.

### De código
- Refactors de código no solicitados durante un trabajo de diseño.
- Cambios de arquitectura motivados por razones visuales.
- Modificar lógica funcional para resolver problemas de presentación.
- Agregar dependencias nuevas para resolver un problema visual que CSS puede solucionar.
- Agregar funcionalidades no solicitadas.
- Duplicar componentes cuando basta con ajustar sus estilos.
- Reescribir un componente completo cuando solo cambian sus estilos.

### De contenido
- Inventar datos del negocio.
- Mantener copy del cliente anterior en el template.
- Hardcodear información de contacto, ubicación u horarios.

---

## 12. Eficiencia — Cómo Trabajar en Este Repositorio

**Leer primero. Cambiar después.**

- Identificar el archivo y la línea exacta antes de proponer un cambio.
- Hacer cambios pequeños y controlados — un componente a la vez.
- Verificar el resultado (visual o con `npm run build`) después de cada cambio importante.
- Reutilizar tokens CSS existentes antes de crear nuevas variables.
- No modificar archivos que no sean relevantes para la tarea en curso.
- No hacer exploraciones innecesarias una vez localizada la implementación.
- Centralizar cualquier valor nuevo en `globals.css :root` — no esparcir valores magic en los componentes.
- Si un cambio visual requiere tocar la lógica, detenerse y replantear el enfoque.

---

## 13. Responsive — Validación

Todo rediseño debe verse correctamente en:

| Breakpoint | Prioridad |
|---|---|
| 375px (iPhone SE) | Crítico |
| 390px (iPhone 14) | Crítico |
| 430px (iPhone Plus) | Alto |
| 768px (tablet) | Medio |
| 1280px+ (desktop) | Alto |

Verificar siempre:
- Overflow horizontal (el más frecuente).
- Texto que desborda o se corta.
- Imágenes deformadas.
- Botones con área de toque insuficiente.
- Pills de categoría con scroll horizontal correcto.
- Cards con grid que no revienta (`minmax(0, 1fr)`).
- Jerarquía tipográfica legible en móvil.

La estética nunca debe comprometer la usabilidad en móvil.

---

## 14. Microinteracciones y Animaciones

Permitidas:
- Hover en cards, botones y links.
- Focus visible para accesibilidad.
- Transiciones de entrada (`.reveal`, `.hero-label`, etc.).
- Animaciones de pulse en CTAs de WhatsApp.
- Micro-transforms en hover de cards de producto.

Regla:
> La animación debe mejorar la percepción de calidad, no convertirse en el protagonista.

- Siempre incluir `@media (prefers-reduced-motion: reduce)` en animaciones de scroll.
- Duraciones: 200–300ms para hover, 600–900ms para entradas.
- No animar simultáneamente más de 2 propiedades si no es necesario.

---

## 15. Checklist de Validación Final

### Visual
- [ ] Jerarquía clara en mobile y desktop.
- [ ] Contraste suficiente en texto sobre fondos.
- [ ] Tipografías coherentes con la dirección de marca.
- [ ] Imágenes sin deformación.
- [ ] Espaciado consistente.
- [ ] Pills, botones y badges con radius adecuado (no todo pill, no todo cuadrado).
- [ ] La identidad de la marca es reconocible sin leer el nombre.

### Técnico
- [ ] `npm run build` pasa sin errores de TypeScript.
- [ ] Sin errores en consola del navegador.
- [ ] Las rutas y parámetros de URL funcionan igual que antes.
- [ ] Los datos de Supabase siguen cargando correctamente.
- [ ] No se introdujeron dependencias nuevas innecesarias.
- [ ] `revalidate = 60` sigue presente en `page.tsx`.

### Funcional
- [ ] Filtros por categoría y subcategoría funcionan (`?cat=`, `?sub=`).
- [ ] ProductSheet se abre y cierra (`?product=`).
- [ ] Carrito agrega, modifica y elimina items correctamente.
- [ ] WhatsApp de cotización llega al número correcto.
- [ ] Selector de sucursal aparece cuando hay múltiples ramas.
- [ ] `has_cart === false` no muestra ninguna UI de carrito.
- [ ] OG metadata se genera correctamente desde los datos del negocio.

---

## 16. Workflow para un Nuevo Cliente

```
1. Recibir brief de marca
   → Nombre, giro, personalidad, paleta, tipografía, referencias visuales
        ↓
2. Auditar el template
   → Leer CLAUDE.md + DESIGN.md
   → Identificar capas visual y funcional
   → Inventariar componentes, tokens existentes, fuentes activas
        ↓
3. Definir sistema visual
   → Paleta (5–6 colores → tokens en globals.css)
   → Tipografías (2–4 fuentes → variables CSS)
   → Radius base
   → Textura (si aplica)
        ↓
4. Implementar tokens en globals.css
   → Actualizar bloque :root
   → Actualizar @theme inline (fuentes)
   → Actualizar layout.tsx (fuentes Google)
        ↓
5. Personalizar sección por sección
   → Hero → Header → Catalog → ProductSheet → CartDrawer → Contact → Footer
   → Verificar mobile después de cada sección
        ↓
6. Actualizar copy estático
   → Trust strip, eyebrows, taglines, CTAs, textos del template
   → Usar siempre la información real proporcionada por el cliente
        ↓
7. Validar responsive
   → 375px · 390px · 430px · 768px · 1280px
        ↓
8. Verificar identidad de marca
   → ¿Se siente único? ¿Coherente? ¿Reconocible?
        ↓
9. Ejecutar npm run build
   → Sin errores TypeScript
        ↓
10. Validar funcionalidad
    → Filtros, modales, carrito, WhatsApp, OG
```

---

## 17. Principio Final

> **El template proporciona la arquitectura y funcionalidad.
> La marca proporciona la personalidad.
> Claude Code conecta ambas sin romper ninguna.**

El resultado de cada cliente debe sentirse único aunque todos partan de la misma base técnica. Un rediseño exitoso es aquel donde nadie adivina que existe un template detrás.
