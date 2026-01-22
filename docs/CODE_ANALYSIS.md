# Análisis Completo del Código HTML-to-Figma

**Fecha:** 2026-01-22 (Actualizado)
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
- `.parent > .child` (child directo) ✅ NEW
- `.parent + .sibling` (adjacent sibling) ✅ NEW
- `.parent ~ .sibling` (general sibling) ✅ NEW

NO soporta:
- `:hover`, `:focus`, `:first-child`, etc. (pseudo-classes)

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

### 2.4 Grid Limitado ✅ MEJORADO
Ahora soporta:
- `repeat(N, ...)` - cualquier repeat
- `auto-fill` / `auto-fit`
- Columnas mixtas: `200px 1fr 100px`
- `minmax(200px, 1fr)`

NO soporta:
- `grid-template-rows`
- Áreas con nombre

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

---

## 4. PROBLEMAS DE TEXTO

### 4.1 Width de Texto Arbitrario ✅ RESUELTO
Ahora usa `layoutSizingHorizontal = 'FILL'` en lugar de 200px hardcodeado.

### 4.2 Contenido Mixto (texto + elementos) ✅ RESUELTO
El parser ahora usa `mixedContent` array para preservar el orden de texto y elementos.
En Figma se crean nodos inline en el orden correcto.

### 4.3 white-space ❌ PENDIENTE

### 4.4 text-overflow ❌ PENDIENTE

---

## 5. PROBLEMAS DE HERENCIA

### 5.1 Solo 4 Propiedades Se Heredan ✅ RESUELTO
Ahora hereda 10+ propiedades:
- `color`, `font-family`, `font-size`, `font-weight`, `font-style`
- `line-height`, `text-align`, `letter-spacing`, `word-spacing`, `text-transform`

### 5.2 Orden de Herencia ❌ PENDIENTE

---

## 6. PROBLEMAS DE ALINEACIÓN

### 6.1 justify-content Incompleto ⚠️ PARCIAL
Soporta: `center`, `flex-end`, `space-between`
Falta: `space-evenly`, `flex-start` como MIN

### 6.2 align-items ⚠️ PARCIAL

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

### 8.2 z-index ❌ PENDIENTE

### 8.3 top/right/bottom/left ✅ RESUELTO
Aplica como `x`/`y` y configura constraints.

---

## 9. CSS NO IMPLEMENTADO

| Propiedad | Estado |
|-----------|--------|
| `overflow` | ❌ No implementado |
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

### ✅ RESUELTOS (25 de 28)
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
22. Selectores CSS avanzados (>, +, ~) ✅ NEW
23. align-self ✅ NEW
24. display: none ✅ NEW
25. visibility: hidden ✅ NEW

### ❌ PENDIENTES (3)
1. white-space
2. text-overflow
3. z-index

---

## PRIORIDAD DE FIXES RESTANTES

### BAJOS
1. ❌ white-space
2. ❌ text-overflow
3. ❌ z-index
