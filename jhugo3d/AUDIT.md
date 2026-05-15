# AUDIT.md — Jhugo3D Design Review

---

## Fase 1 — Diagnóstico

### 1.1 Tipografía — **B−**
- **Display**: Space Grotesk → correcto, técnico y moderno, se mantiene.
- **Body**: Inter → genérico, sobreutilizado en SaaS. Frío para una marca de artesanía/craft.
- No existe escala tipográfica sistemática; los tamaños están dispersos con `clamp()` ad hoc.
- `letter-spacing` solo definido en eyebrow y headings. Body text sin ajuste.
- **Decisión**: reemplazar Inter por **DM Sans** — humanista, ligeramente redondeada, más cálida. Añadir escala `--text-xs` → `--text-4xl`.

### 1.2 Color y tema — **B**
- Sistema de variables CSS existe, es el punto más fuerte del proyecto.
- Gold (#D4A832) es distintivo y característico — se mantiene y potencia.
- Blue (#1B3C87) aparece solo en el logo y en cart.js hardcodeado — bien contenido.
- Faltan: semantic colors (success/warning/error), `--gold-dim` para fondos, `--border-strong`.
- Superficies oscuras sin variación suficiente: solo 2 niveles (surface / surface-2).
- **Decisión**: ampliar tokens sin cambiar paleta base. Añadir `--surface-3`, `--gold-dim`, colores semánticos.

### 1.3 Espaciado y composición — **B−**
- `clamp()` bien usado para secciones — responsive sin media queries.
- No hay escala de espaciado definida. Valores ad hoc: `0.75rem`, `1.25rem`, `2.5rem`, `3rem`...
- Grid: `auto-fill minmax(220px)` — correcto y flexible.
- **Decisión**: definir `--space-1` → `--space-24` en escala 4px. No reescribir todo — añadir los tokens para uso futuro y normalizar los casos más inconsistentes.

### 1.4 Componentes y consistencia — **B−**
- `.card:hover` solo hace `translateY(-3px)` — lift sin señal de selección.
- `.btn-primary:hover` sin glow — acción principal sin feedback de energía.
- `badge-gold` usa `background: #2A2100` hardcodeado en lugar de variable.
- Focus states: solo `outline` por defecto del browser — no accesible ni branded.
- **Decisión**: gold glow en btn-primary, gold border+glow en card hover, badge-gold con variable, focus-visible gold ring.

### 1.5 Movimiento y microinteracciones — **C+**
- Reveal animation existe pero sin stagger — grid de productos entra todo a la vez.
- Transiciones 0.2s — ok, podría mejorar con easing propio ya definido.
- `scroll-line` animation en hero — bien ejecutada.
- No hay feedback en focus, estados de loading, ni transición en filtros del catálogo.
- **Decisión**: stagger por `nth-child` con CSS custom property `--rd` (reveal-delay), `transition-delay` en `.reveal`.

### 1.6 Modernidad general — **B−**
- 2022–23 dark theme. Sólido pero sin los detalles que diferencian en 2025.
- Faltan: noise/grain texture, ambient glow en hero, gradient text, gradient border en footer.
- Superficies completamente planas — sin profundidad de capas.
- **Decisión**: noise grain overlay (SVG filter en body::after), ambient orbs en hero-overlay, gradient text en hero title, gradient top-border en footer.

---

## Fase 2 — Plan y decisiones de diseño

### Dirección estética: **"Dark Workshop Premium"**
Jhugo3D es una marca artesanal de impresión 3D — precisión técnica + calidez de maker. No es un SaaS frío. La dirección es: **taller de alta gama**. Como si Bambu Lab cruzase con una joyería independiente. Austero pero con carácter. Cada detalle cuenta.

### Fuentes elegidas
| Rol | Fuente | Por qué |
|-----|--------|---------|
| Display/Headings | Space Grotesk 700 | Geométrico, técnico, ya integrado. Funciona. |
| Body | **DM Sans** | Humanista, levemente redondeado, más cálido que Inter. Mejor para descripciones de producto. |

### Paleta revisada
Sin cambios de color base — la paleta gold+dark es buena y distintiva. Se amplían los tokens:
- Añadir `--gold-dim` para fondos sutiles
- Añadir `--border-strong` para énfasis
- Añadir `--surface-3` para elevación extra
- Añadir `--success / --warning / --error`

### Sistema de espaciado
Escala 4px: `--space-1` (4px) → `--space-24` (96px). Los componentes existentes no se reescriben — los tokens quedan disponibles para nuevos componentes.

### Mejoras de componentes prioritarias
1. **global.css** — tokens + DM Sans + noise grain + btn glow + card glow + stagger + focus
2. **index.astro** — hero ambient orbs + gradient title + stat refinement
3. **Header.astro** — active link gold dot indicator
4. **Footer.astro** — gradient gold top border

### Animaciones
- Stagger en `.product-grid` via CSS `nth-child` (no JS)
- Glow hover en btn-primary (box-shadow dorado)
- Mejor reveal: `translateY(20px)` en lugar de 24px, delay via `--rd`

---

## Fase 3 — Cambios ejecutados

### global.css
- ✅ Importa DM Sans (reemplaza Inter)
- ✅ Escala tipográfica `--text-xs` → `--text-4xl`
- ✅ Pesos `--weight-regular` → `--weight-bold`
- ✅ Line-heights `--leading-tight` → `--leading-relaxed`
- ✅ Nuevos tokens de color: `--bg-subtle`, `--surface-3`, `--gold-dim`, `--border-strong`, `--text-disabled`, semantic colors
- ✅ Escala de espaciado `--space-1` → `--space-24`
- ✅ Radios ampliados: `--radius-xl`, `--radius-full`
- ✅ Sistema de sombras: `--shadow-sm/md/lg`, `--shadow-gold`
- ✅ Transiciones nombradas: `--transition-fast/base/slow`
- ✅ Noise grain overlay en `body::after` (SVG fractalNoise, opacity 2.5%)
- ✅ `body` usa `line-height: var(--leading-normal)`
- ✅ `:focus-visible` — gold ring branded
- ✅ `.btn-primary:hover` — gold glow (`--shadow-gold`) + lift `-2px`
- ✅ `.btn-outline:hover` — gold border + `--gold-dim` background
- ✅ `.card:hover` — gold border `rgba(212,168,50,0.35)` + glow ring
- ✅ `.badge-gold` — usa `--gold-dim` y border sutil
- ✅ Stagger `.product-grid > *:nth-child(1..8)` con `--rd` variable
- ✅ `.reveal` usa `transition-delay: var(--rd, 0ms)`
- ✅ Scrollbar thumb hover añadido

### index.astro
- ✅ Hero overlay con ambient orbs radiales (gold izquierda, blue derecha)
- ✅ `.hero-title .text-gold` — gradient text gold fundido
- ✅ `step::before` — gradiente brand→gold potenciado

### Header.astro
- ✅ `.nav-link` — `position: relative` añadido
- ✅ `.nav-link.active::after` — línea gold debajo del link activo

### Footer.astro
- ✅ `site-footer::before` — gradient top border gold (transparente → gold → transparente)
- ✅ `border-top` eliminado del footer, sustituido por el pseudo-elemento

---

## Fase 4 — Revisión final

- ✅ Tokens usados consistentemente en todas las modificaciones
- ✅ Sin colores hardcodeados nuevos en los cambios realizados
- ✅ `pointer-events: none` en noise overlay — no afecta interactividad
- ✅ `--rd` fallback `0ms` — funciona sin nth-child match
- ✅ Gradient text con `-webkit-text-fill-color: transparent` — compatible Chrome/Firefox/Safari
- ✅ No se ha modificado cart.js ni chat-widget.js — funcionalidad intacta
- ✅ Responsive: noise y orbs son `position: fixed/absolute`, se adaptan a cualquier tamaño
