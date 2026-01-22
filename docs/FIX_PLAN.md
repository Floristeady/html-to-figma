# Plan de Fixes HTML-to-Figma

**Fecha:** 2026-01-22
**Estado:** EN PROGRESO (Fase 2)

## Problemas Identificados

### 1. CSS Parsing Limitado
- No manejaba selectores con coma (`.class1, .class2`)
- No soportaba múltiples `<style>` tags
- Selectores anidados muy básicos

### 2. Valores Default que Sobreescribían CSS
- `gap` siempre tenía default 16/12 aunque CSS dijera `gap: 0`
- `padding` similar problema

### 3. Line-height Unitless Ignorado
- `line-height: 1.5` (muy común) se ignoraba completamente

### 4. Text Sizing Inconsistente
- Lógica confusa de HUG vs FILL
- Textos podían quedar truncados

### 5. Herencia de Estilos Incompleta
- `font-weight` no se heredaba bien
- `text-align` se perdía en contenedores anidados

---

## Cambios Realizados

### BLOQUE 1: Layout

#### Fix 1.1: Gap Default (línea ~2636)
```typescript
// ANTES:
const gap = parseSize(node.styles?.gap) || (layoutMode === 'HORIZONTAL' ? 16 : 12);

// DESPUÉS:
let gap: number;
if (node.styles?.gap !== undefined) {
  gap = parseSize(node.styles.gap) ?? 0; // Respetar gap: 0
} else {
  gap = layoutMode === 'HORIZONTAL' ? 16 : 12; // Default solo si no hay CSS
}
```

#### Fix 1.2: Padding Default (línea ~2622)
```typescript
// ANTES: usaba || que trataba 0 como falsy
// DESPUÉS: usa ?? para respetar padding: 0
const basePadding = parseSize(node.styles?.padding);
const cssTopPadding = parseSize(node.styles?.['padding-top']) ?? basePadding ?? 0;
// ... igual para right, bottom, left
```

---

### BLOQUE 2: Texto

#### Fix 2.1: Line-height Unitless (línea ~2089)
```typescript
// ANTES: ignoraba line-height: 1.5
} else if (!isNaN(Number(value))) {
  // Unitless: NO aplicar nada
}

// DESPUÉS: convierte a porcentaje
} else if (!isNaN(Number(value))) {
  const multiplier = parseFloat(value);
  if (!isNaN(multiplier) && multiplier > 0) {
    text.lineHeight = { value: multiplier * 100, unit: 'PERCENT' };
  }
}
```

#### Fix 2.2: Herencia de Estilos (línea ~2724)
Agregado herencia de:
- `font-weight`
- `text-align`
- `letter-spacing`

#### Fix 2.3: Text Sizing (línea ~1950)
- Agregado `isGridChild` para detectar hijos de grid
- Umbral adaptativo: 40 chars para grid, 80 para otros
- Nueva regla D3: grid children siempre usan FILL

---

### BLOQUE 3: CSS Parsing

#### Fix 3.1 y 3.2: extractCSS Mejorado (línea ~862)
```typescript
// AHORA soporta:
// - Múltiples <style> tags
// - Selectores con coma: .class1, .class2 { }
// - Merge correcto de reglas duplicadas
```

---

## Cómo Probar

1. Abre Figma Desktop
2. Ve a Plugins > Development > Import plugin from manifest
3. Selecciona el archivo `manifest.json` de este proyecto
4. Abre el plugin y pega tu HTML de prueba

## Si Hay Más Problemas

Revisar en `src/code.ts`:
- `applyStylesToFrame()` - línea ~1668 - estilos de frames
- `applyStylesToText()` - línea ~2057 - estilos de texto
- `createFigmaNodesFromStructure()` - línea ~2498 - creación de nodos
- `setTextSizing()` - línea ~1922 - sizing de texto
- `extractCSS()` - línea ~862 - parsing CSS

## Comandos Útiles

```bash
# Compilar
npm run build

# Ver errores TypeScript
npx tsc --noEmit
```

---

## FASE 2: Fixes Críticos de Arquitectura (2026-01-22)

### BLOQUE 4: Text Sizing

#### Fix 4.1: Texto en DIV con 200px hardcodeado (línea ~2679)
```typescript
// ANTES: forzaba 200px mínimo
const maxWidth = Math.min(frame.width - frame.paddingLeft - frame.paddingRight, 800);
const textWidth = Math.max(maxWidth > 0 ? maxWidth : 400, 200);
textNode.resize(textWidth, textNode.height);
textNode.textAutoResize = 'HEIGHT';

// DESPUÉS: usa FILL para que el texto llene el contenedor
if (frame.layoutMode === 'HORIZONTAL' || frame.layoutMode === 'VERTICAL') {
  textNode.layoutSizingHorizontal = 'FILL';
  textNode.textAutoResize = 'HEIGHT';
} else {
  textNode.textAutoResize = 'WIDTH_AND_HEIGHT';
}
```

---

### BLOQUE 5: Display Inline/Inline-block

#### Fix 5.1: needsFullWidth ya no es siempre true (línea ~2534)
```typescript
// ANTES: siempre llenaba el ancho
const needsFullWidth = true;

// DESPUÉS: respeta display inline/inline-block
const display = node.styles?.display || 'block';
const isInlineElement = display === 'inline' || display === 'inline-block' || display === 'inline-flex';
const needsFullWidth = !isInlineElement;
```

#### Fix 5.2: Layout mode para inline elements (línea ~2452)
```typescript
// ANTES: solo manejaba flex y grid
let layoutMode: 'HORIZONTAL' | 'VERTICAL' = 'VERTICAL';
if (node.styles?.display === 'flex') { ... }

// DESPUÉS: también maneja inline, inline-block, inline-flex
if (node.styles?.display === 'flex' || node.styles?.display === 'inline-flex') {
  layoutMode = node.styles?.['flex-direction'] === 'column' ? 'VERTICAL' : 'HORIZONTAL';
} else if (node.styles?.display === 'inline' || node.styles?.display === 'inline-block') {
  layoutMode = 'HORIZONTAL';
}
```

---

### BLOQUE 6: Herencia de Estilos Expandida

#### Fix 6.1: inheritableStyles ampliado (línea ~2652)
Propiedades ahora heredadas:
- `color` ✅
- `font-family` ✅
- `font-size` ✅
- `font-weight` ✅ (NUEVO)
- `font-style` ✅ (NUEVO)
- `line-height` ✅
- `text-align` ✅ (NUEVO)
- `letter-spacing` ✅ (NUEVO)
- `word-spacing` ✅ (NUEVO)
- `text-transform` ✅ (NUEVO)

#### Fix 6.2: Soporte para font-style italic (línea ~2279)
```typescript
// NUEVO: soporte para italic
if (styles['font-style'] === 'italic') {
  figma.loadFontAsync({ family: "Inter", style: "Italic" }).then(() => {
    text.fontName = { family: "Inter", style: "Italic" };
  });
}
```

---

### BLOQUE 7: Estilos Hardcodeados (2026-01-22)

#### Fix 7.1: Form sin fondo hardcodeado (línea ~2747)
- Antes: `form.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }]`
- Ahora: `form.fills = []` - transparente, CSS controla el fondo

#### Fix 7.2: Button sin color azul hardcodeado (línea ~3027)
- Antes: Azul fijo `{ r: 0.2, g: 0.5, b: 1 }`
- Ahora: Usa CSS `background-color` o gris claro por defecto (como navegador)

#### Fix 7.3: Table cells sin 85px hardcodeado (línea ~2957)
- Antes: `cell.resize(85, 50)` fijo
- Ahora: Usa CSS `width`/`height` o defaults razonables (100px, 40px)

---

### BLOQUE 8: CSS Parsing Mejorado (2026-01-22)

#### Fix 8.1: Selector universal (*) ahora funciona (línea ~1113)
```typescript
// NUEVO: Universal selector matches all elements
if (selector === '*') {
  return true;
}
```

#### Fix 8.2: Width porcentajes (50%, 33%, etc.) (línea ~1769)
```typescript
// NUEVO: Funciones para calcular porcentajes
function parsePercentage(value: string): number | null
function calculatePercentageWidth(widthValue: string, parentFrame: FrameNode): number | null
```

---

## Problemas Pendientes del CODE_ANALYSIS

### CRÍTICOS
- ✅ Orden de especificidad CSS (RESUELTO - usa calculateSpecificity)
- ✅ Selector universal (*) (RESUELTO)

### ALTOS
- ✅ Width porcentajes (50%, 33%) (RESUELTO)
- ✅ Estilos hardcoded (form, button, table cells) (RESUELTO)

### MEDIOS
- ✅ flex-wrap (RESUELTO)
- ✅ Grid mejorado (columnas mixtas, minmax, auto-fill) (RESUELTO)
- ✅ position: absolute/relative con top/left/right/bottom (RESUELTO)

### BAJOS
- ✅ CSS variables (RESUELTO)
- ✅ calc() (RESUELTO)
- ✅ Media queries (RESUELTO - ignoradas gracefully)

---

### BLOQUE 10: CSS Avanzado (2026-01-22)

#### Fix 10.1: CSS Variables (línea ~955)
```typescript
// NUEVO: Extrae variables de :root y resuelve var()
var cssVariables = {};
// Extrae --var-name: value de :root
// Resuelve var(--var-name) y var(--var-name, fallback)
```

#### Fix 10.2: calc() (línea ~1795)
```typescript
// NUEVO: Parsea expresiones calc()
function parseCalc(value: string): number | null {
  // Maneja: calc(100px - 20px), calc(50px + 10px)
  // Para expresiones complejas, extrae el primer valor px
}
```

#### Fix 10.3: Media queries ignoradas (línea ~986)
```typescript
// NUEVO: Remueve bloques @media, @keyframes, @supports
// Evita que llaves anidadas rompan el parsing
function removeAtRuleBlocks(css) { ... }
```

---

### BLOQUE 9: Layout Avanzado (2026-01-22)

#### Fix 9.1: flex-wrap support (línea ~2520)
```typescript
// NUEVO: Support flex-wrap
if (node.styles?.['flex-wrap'] === 'wrap' || node.styles?.['flex-wrap'] === 'wrap-reverse') {
  frame.layoutWrap = 'WRAP';
}
```

#### Fix 9.2: Grid mejorado (línea ~2403)
Ahora soporta:
- `repeat(N, ...)` - cualquier repeat con count explícito
- `auto-fill` / `auto-fit` - estima columnas basado en minmax
- Columnas mixtas: `200px 1fr 100px`
- `minmax(200px, 1fr)` - tratado como 1fr para conteo

#### Fix 9.3: position: absolute con top/left/right/bottom (línea ~2665)
```typescript
// NUEVO: Absolute positioning dentro de auto-layout
if (node.styles?.position === 'absolute' && parentFrame) {
  frame.layoutPositioning = 'ABSOLUTE';
  // Aplica top/left como x/y
  // Configura constraints según top/bottom/left/right
}
```
