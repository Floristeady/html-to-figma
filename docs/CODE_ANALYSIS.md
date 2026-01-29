# Análisis Completo del Código HTML-to-Figma

**Fecha:** 2026-01-28 (Actualizado)
**Archivo Principal:** `src/code.ts`

---

## RESUMEN EJECUTIVO

~~El código tiene **problemas fundamentales de arquitectura** que impiden una conversión correcta de HTML a Figma.~~

**ACTUALIZACIÓN:** La mayoría de los problemas críticos han sido resueltos. El código ahora maneja correctamente:

1. ✅ ~~Layout Mode por defecto siempre VERTICAL~~ - Ahora detecta inline/inline-block
2. ✅ ~~Todos los divs fuerzan FILL width~~ - Respeta display inline
3. ✅ ~~CSS parsing incompleto~~ - Mejorado significativamente
4. ✅ ~~Herencia de estilos limitada~~ - Ahora 10+ propiedades
5. ✅ ~~display: inline/inline-block no existen~~ - Implementado

---

## 1. PROBLEMAS DE PARSING CSS

### 1.1 Orden de Especificidad CSS ✅ RESUELTO
- Usa `calculateSpecificity()` para ordenar selectores correctamente
- IDs = 100, Classes = 10, Elements = 1

### 1.2 Selector Universal (*) ✅ RESUELTO
- Ahora se aplica en `selectorMatches()`

### 1.3 Selectores Anidados ✅ MEJORADO
Ahora soporta:
- `.parent .child` (descendant)
- `.class1.class2` (combined classes)
- `.parent > .child` (child directo)
- `.parent + .sibling` (adjacent sibling)
- `.parent ~ .sibling` (general sibling)
- `.class1, .class2` (selectores con coma)

NO soporta:
- `:hover`, `:focus`, `:first-child`, etc. (pseudo-classes)

### 1.4 Múltiples Style Tags ✅ RESUELTO
Extrae y combina CSS de todos los `<style>` tags en el HTML.

### 1.5 Gap/Padding Zero ✅ RESUELTO
`gap: 0` y `padding: 0` ahora se respetan correctamente (antes 0 era tratado como falsy y se aplicaba default).

---

## 2. PROBLEMAS DE LAYOUT MODE

### 2.1 Default VERTICAL Para Todo ✅ RESUELTO
Ahora detecta:
- `display: flex` / `inline-flex`
- `display: grid`
- `display: inline` / `inline-block`

### 2.2 display: inline/inline-block ✅ RESUELTO
Implementado con `layoutMode = 'HORIZONTAL'` para elementos inline.

### 2.3 flex-wrap ✅ RESUELTO
Usa `frame.layoutWrap = 'WRAP'` para `flex-wrap: wrap`.

### 2.4 Grid Avanzado ✅ COMPLETO
Ahora soporta:
- `repeat(N, ...)` - cualquier repeat
- `auto-fill` / `auto-fit`
- Columnas mixtas: `200px 1fr 100px`
- `minmax(200px, 1fr)`
- `grid-template-areas` ✅ NEW - layouts bento complejos
- `grid-column: span N` / `grid-row: span N` ✅ NEW
- Sincronización de altura en filas con multi-row spans ✅ NEW

NO soporta:
- `grid-template-rows` (parcial - se infiere de areas)

---

## 3. PROBLEMAS DE SIZING

### 3.1 Todos Los Divs Fuerzan FILL Width ✅ RESUELTO
```typescript
const isInlineElement = display === 'inline' || display === 'inline-block' || display === 'inline-flex';
const needsFullWidth = !isInlineElement;
```

### 3.2 Porcentajes de Width ✅ RESUELTO
Implementado `parsePercentage()` y `calculatePercentageWidth()`.

### 3.3 max-width No Limita Realmente ✅ RESUELTO
Ahora usa `frame.maxWidth` de Figma API con fallback a resize.

### 3.4 min-width/min-height ✅ RESUELTO
Ahora usa `frame.minWidth`, `frame.minHeight` de Figma API con fallback a resize.

### 3.5 width: 100% en Auto-Layout ✅ NEW
Cuando `width: 100%` está en un contenedor auto-layout, usa `layoutSizingHorizontal = 'FILL'` en lugar de calcular píxeles fijos.

### 3.6 Detección Dinámica de Ancho ✅ NEW
`calculateDynamicWidth()` detecta patrones de layout comunes:
- Sidebar fijo (`position: fixed` + `width`) + contenido principal (`margin-left`)
- Ancho explícito en elementos raíz (búsqueda recursiva)
- Calcula ancho total automáticamente para layouts complejos

### 3.7 Propagación de FILL Vertical ✅ NEW
`_shouldFillVertical` se propaga a través de `inheritedStyles` para mantener altura FILL en contenedores anidados dentro de filas grid con multi-row spans.

---

## 4. PROBLEMAS DE TEXTO

### 4.1 Width de Texto Arbitrario ✅ RESUELTO
Ahora usa `layoutSizingHorizontal = 'FILL'` en lugar de 200px hardcodeado.

### 4.2 Contenido Mixto (texto + elementos) ✅ RESUELTO
El parser ahora usa `mixedContent` array para preservar el orden de texto y elementos.
En Figma se crean nodos inline en el orden correcto.

### 4.3 white-space ✅ RESUELTO
Implementado soporte para `white-space: nowrap`, `pre`, `pre-wrap`.

### 4.4 text-overflow ✅ RESUELTO
Implementado soporte para `text-overflow: ellipsis` con `textTruncation`.

### 4.5 Line-height Unitless ✅ RESUELTO
`line-height: 1.5` (sin unidad) ahora se convierte a porcentaje (150%).

### 4.6 font-style: italic ✅ RESUELTO
Soporte para texto en itálica con carga de fuente "Inter Italic".

---

## 5. PROBLEMAS DE HERENCIA

### 5.1 Solo 4 Propiedades Se Heredan ✅ RESUELTO
Ahora hereda 10+ propiedades:
- `color`, `font-family`, `font-size`, `font-weight`, `font-style`
- `line-height`, `text-align`, `letter-spacing`, `word-spacing`, `text-transform`

### 5.2 Orden de Herencia ❌ PENDIENTE

---

## 6. PROBLEMAS DE ALINEACIÓN

### 6.1 justify-content ✅ COMPLETO
Soporta: `center`, `flex-start`, `flex-end`, `space-between`, `space-around`, `space-evenly`
Nota: `space-evenly` usa SPACE_BETWEEN como aproximación (Figma no tiene SPACE_EVENLY nativo)

### 6.2 align-items ✅ COMPLETO
Soporta: `center`, `flex-start`, `start`, `flex-end`, `end`, `baseline`
Nota: `stretch` es comportamiento por defecto en Figma, no requiere configuración explícita.

### 6.3 align-self ✅ RESUELTO
Usa `frame.layoutAlign` para center, flex-start, flex-end, stretch.

---

## 7. PROBLEMAS DE ELEMENTOS ESPECÍFICOS

### 7.1 Form Siempre Gris ✅ RESUELTO
Ahora usa `form.fills = []` - transparente, CSS controla.

### 7.2 Button Siempre Azul ✅ RESUELTO
Ahora usa CSS `background-color` o gris claro por defecto.

### 7.3 Table Cells Fijas ✅ RESUELTO
Ahora usa CSS `width`/`height` o defaults razonables.

---

## 8. PROBLEMAS DE POSICIONAMIENTO

### 8.1 position: absolute/relative ✅ RESUELTO
Usa `frame.layoutPositioning = 'ABSOLUTE'` con constraints.

### 8.2 z-index ✅ RESUELTO
Implementado ordenamiento de nodos según z-index.

### 8.3 top/right/bottom/left ✅ RESUELTO
Aplica como `x`/`y` y configura constraints.

---

## 9. CSS NO IMPLEMENTADO

| Propiedad | Estado |
|-----------|--------|
| `overflow: hidden` | ✅ Implementado (clipsContent) |
| `visibility: hidden` | ✅ Implementado (opacity: 0) |
| `display: none` | ✅ Implementado (skip element) |
| `@media queries` | ✅ Ignoradas gracefully |
| `CSS variables (--var)` | ✅ Implementado |
| `calc()` | ✅ Implementado (básico) |
| `transition/animation` | N/A para Figma |
| `transform: scale/translate` | ❌ Parcial (solo rotate) |
| `filter` | ❌ No implementado |
| `backdrop-filter` | ❌ No implementado |
| `clip-path` | ❌ No implementado |

---

## 10. RESUMEN DE ESTADO

### ✅ RESUELTOS (50 issues)
1. Especificidad CSS
2. Selector universal (*)
3. Layout mode para inline elements
4. display: inline/inline-block/inline-flex
5. flex-wrap
6. Grid mejorado
7. needsFullWidth lógica
8. Width porcentajes
9. Text width (FILL vs 200px)
10. Herencia de estilos (10+ props)
11. Form sin gris hardcodeado
12. Button sin azul hardcodeado
13. Table cells sin 85px hardcodeado
14. position: absolute
15. top/left/right/bottom
16. CSS variables
17. calc()
18. Media queries (ignoradas)
19. Contenido mixto (texto + elementos)
20. max-width real
21. min-width/min-height desde CSS
22. Selectores CSS avanzados (>, +, ~)
23. align-self
24. display: none
25. visibility: hidden
26. white-space
27. text-overflow
28. z-index
29. grid-template-areas
30. grid-column/row span
31. width: 100% → FILL en auto-layout
32. Detección dinámica de ancho (sidebar + main)
33. Propagación FILL vertical para grid rows
34. Selectores con coma (.class1, .class2)
35. Múltiples `<style>` tags
36. Gap: 0 respetado
37. Padding: 0 respetado
38. Line-height unitless (1.5 → 150%)
39. font-style: italic
40. justify-content: space-evenly
41. align-items: start, end, baseline
42. overflow: hidden (clipsContent)
43. **blockquote, figure, figcaption** - elementos semánticos como frames ✅ NEW
44. **Flex row children HUG** - hijos en flex horizontal usan HUG no FILL ✅ NEW
45. **Text en contenedores HUG** - texto se adapta al contenido ✅ NEW
46. **Propagación width constraint** - no se propaga en flex horizontal ✅ NEW
47. **Elementos inline (strong, em, code, etc.)** - 14+ nuevos elementos ✅ NEW
48. **Styling inline (bold, italic, mono)** - estilos automáticos ✅ NEW
49. **Empty text fix** - elementos con hijos procesan hijos ✅ NEW
50. **hexToRgb null guard** - previene crash con colores null ✅ NEW

### ⚠️ PENDIENTES - BAJA PRIORIDAD (3)
1. **Orden de herencia** - cascada CSS completa
2. **transform: scale/translate** - solo rotate implementado
3. **filter/backdrop-filter/clip-path** - efectos visuales avanzados

---

## 11. PROBLEMAS CRÍTICOS IDENTIFICADOS (2026-01-23)

**ACTUALIZACIÓN 2026-01-28:** La mayoría de estos problemas han sido resueltos.

### 11.1 Unidades REM ✅ RESUELTO (commit f535881)
- Detecta `font-size` en `html` o `:root` para base dinámica
- Soporta porcentajes (`62.5%` = 10px base)
- `CSS_CONFIG.remBase` se actualiza dinámicamente

### 11.2 Viewport Units (vh, vw) ✅ RESUELTO (commit f535881)
- `vw` usa el ancho detectado del diseño
- `vh` usa 900px por defecto (altura desktop razonable)

### 11.3 linear-gradient() ✅ RESUELTO
- Implementado en `src/utils/effects.ts` → `parseLinearGradient()`
- Soporta gradientes con rgba() anidado
- Extrae color fallback cuando hay gradiente + color

### 11.4 Colores RGBA ✅ RESUELTO
- Implementado en `src/utils/colors.ts` → `hexToRgba()`
- Parsea `rgba(r, g, b, a)` correctamente
- Aplica alpha channel a fills

### 11.5 Grid con fracciones decimales ✅ RESUELTO
- Implementado `parseGridColumnWidths()` en `src/utils/grid.ts`
- Calcula anchos proporcionales para `1.3fr 2.7fr`, mixtos `200px 1fr 100px`, etc.
- Usa `layoutGrow` proporcional para cada columna

### 11.6 position: fixed ✅ RESUELTO (commit 5032cec)
- Convierte a `position: relative`
- Propaga `_shouldFillWidth` a hijos
- Headers fijos se posicionan correctamente

### 11.7 border-radius grandes ✅ RESUELTO
- `cornerRadius` se aplica correctamente en todos los casos

### 11.8 Inline styles priority ✅ RESUELTO (commit d3a34fb)
- Cascade CSS correcto: CSS normal → inline normal → CSS !important → inline !important
- Strip de `!important` para parsing limpio

### 11.9 Ancho del diseño ✅ RESUELTO (commit 5032cec)
- Detección automática desde meta tags y CSS
- Grids de 8+ columnas usan 1920px
- Soporta `<meta name="figma-width" content="375">`
- Soporta `<meta name="figma-viewport" content="mobile|tablet|desktop|large|wide">`
- Soporta comentario HTML `<!-- figma-width: 1920 -->`

---

## 12. PRIORIZACIÓN DE FIXES

### ✅ CRÍTICOS - TODOS RESUELTOS
| # | Problema | Estado |
|---|----------|--------|
| 1 | REM units | ✅ RESUELTO (commit f535881) |
| 2 | Viewport units (vh/vw) | ✅ RESUELTO (commit f535881) |
| 3 | linear-gradient() | ✅ RESUELTO (effects.ts) |

### ✅ ALTOS - TODOS RESUELTOS
| # | Problema | Estado |
|---|----------|--------|
| 4 | RGBA backgrounds | ✅ RESUELTO (colors.ts) |
| 5 | Ancho fijo 1440px | ✅ RESUELTO (commit 5032cec) |
| 6 | position: fixed | ✅ RESUELTO (commit 5032cec) |
| 7 | Inline style priority | ✅ RESUELTO (commit d3a34fb) |

### 🟡 PENDIENTES (Low priority)
| # | Problema | Esfuerzo | Impacto |
|---|----------|----------|---------|
| 1 | Complex calc() | Bajo | Bajo - casos edge |
| 2 | transform: scale/translate | Bajo | Bajo - solo rotate funciona |
| 3 | filter/backdrop-filter | Alto | Bajo - efectos avanzados |

---

## 📊 ESTADO ACTUALIZADO: 59/62 (95% completo)

- ✅ Resueltos: 59
- ❌ Críticos pendientes: 0
- ⚠️ Altos pendientes: 0
- 🔷 Bajos pendientes: 3
