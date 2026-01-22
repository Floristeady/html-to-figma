# Analisis Completo del Codigo HTML-to-Figma

**Fecha:** 2026-01-21
**Archivo Principal:** `src/code.ts`

---

## RESUMEN EJECUTIVO

El codigo tiene **problemas fundamentales de arquitectura** que impiden una conversion correcta de HTML a Figma. Los principales son:

1. **Layout Mode por defecto siempre VERTICAL** - ignora como fluyen los elementos en HTML
2. **Todos los divs fuerzan FILL width** - incorrecto para elementos inline
3. **CSS parsing incompleto** - muchos selectores no funcionan
4. **Herencia de estilos limitada** - solo 4 propiedades se heredan
5. **display: inline/inline-block no existen** - todo es block

---

## 1. PROBLEMAS DE PARSING CSS

### 1.1 Orden de Especificidad CSS Incorrecto
**Ubicacion:** `getElementStyles()` lineas 952-1007

```javascript
// PROBLEMA: Aplica element selectors DESPUES de class selectors
// Segun CSS, class selectors tienen MAYOR especificidad que element selectors

// Orden actual (INCORRECTO):
1. .class selectors
2. element selectors (th, td, body)  // <-- Esto sobreescribe .class!
3. nested selectors
4. inline styles

// Orden correcto deberia ser:
1. element selectors (menor especificidad)
2. .class selectors
3. nested selectors
4. inline styles (mayor especificidad)
```

### 1.2 Selector Universal (*) No Se Aplica
**Ubicacion:** `extractCSS()` linea 932-934

El selector `*` se extrae pero nunca se aplica en `getElementStyles()`.

```javascript
// Se extrae:
else if (selector === '*') {
  cssRules[selector] = Object.assign({}, cssRules[selector] || {}, parsedDeclarations);
}

// PERO nunca se usa en getElementStyles()!
```

### 1.3 Selectores Anidados Limitados
**Ubicacion:** lineas 979-997

Solo soporta:
- `.parent .child` (primera clase de cada uno)

NO soporta:
- `.parent.modifier .child`
- `.grandparent .parent .child`
- `.parent > .child` (child directo)
- `.parent + .sibling` (sibling adyacente)
- `.parent ~ .sibling` (sibling general)
- `:hover`, `:focus`, `:first-child`, etc.

---

## 2. PROBLEMAS DE LAYOUT MODE

### 2.1 Default VERTICAL Para Todo
**Ubicacion:** linea 2204

```typescript
let layoutMode: 'HORIZONTAL' | 'VERTICAL' = 'VERTICAL';
```

**PROBLEMA:** En HTML/CSS, el flujo default depende del tipo de elemento:
- `display: block` -> apilan verticalmente
- `display: inline` -> fluyen horizontalmente
- `display: inline-block` -> fluyen horizontalmente
- Sin display -> depende del elemento (span=inline, div=block)

**SOLUCION CORRECTA:**
```typescript
let layoutMode: 'HORIZONTAL' | 'VERTICAL';
const display = node.styles?.display;

if (display === 'flex') {
  layoutMode = node.styles?.['flex-direction'] === 'column' ? 'VERTICAL' : 'HORIZONTAL';
} else if (display === 'inline-flex') {
  layoutMode = node.styles?.['flex-direction'] === 'column' ? 'VERTICAL' : 'HORIZONTAL';
} else if (display === 'grid') {
  layoutMode = 'VERTICAL'; // Grid rows son verticales
} else if (display === 'inline' || display === 'inline-block') {
  layoutMode = 'HORIZONTAL';
} else {
  // Block elements apilan hijos verticalmente
  layoutMode = 'VERTICAL';
}
```

### 2.2 display: inline/inline-block No Implementado
**Ubicacion:** lineas 2205-2211

Solo se maneja:
- `display: flex`
- `display: grid`

NO se maneja:
- `display: inline`
- `display: inline-block`
- `display: inline-flex`
- `display: none` (deberia omitir el elemento)

### 2.3 flex-wrap No Implementado
**Ubicacion:** NO EXISTE

Si CSS tiene `flex-wrap: wrap`, los items deberian pasar a nueva linea cuando no caben. Esto requeriria crear multiples filas en Figma.

### 2.4 Grid Limitado
**Ubicacion:** `parseGridColumns()` linea 2121

Solo soporta:
- `repeat(N, 1fr)`
- Lista de `1fr 1fr 1fr`

NO soporta:
- `200px 1fr 100px` (columnas mixtas)
- `minmax(200px, 1fr)`
- `auto-fill`, `auto-fit`
- `grid-template-rows`
- Areas con nombre

---

## 3. PROBLEMAS DE SIZING

### 3.1 Todos Los Divs Fuerzan FILL Width
**Ubicacion:** linea 2286

```typescript
const needsFullWidth = true; // SIEMPRE true!
```

**PROBLEMA:** Esto es incorrecto. En CSS:
- Elementos `block` llenan el ancho del padre (correcto)
- Elementos `inline-block` solo ocupan lo necesario (INCORRECTO con este codigo)
- Elementos con `width` explicito usan ese ancho (parcialmente correcto)

**SOLUCION:**
```typescript
const isBlockLevel = !display || display === 'block' || display === 'flex' || display === 'grid';
const needsFullWidth = isBlockLevel && !node.styles?.width;
```

### 3.2 Porcentajes de Width No Funcionan
**Ubicacion:** lineas 1747-1766

Solo `width: 100%` tiene logica especial. Otros porcentajes como `50%`, `33%` se ignoran o fallan.

```typescript
if (styles.width) {
  let targetWidth = parseSize(styles.width); // parseSize devuelve null para "50%"

  // Solo maneja 100%
  if (targetWidth && targetWidth > 0) {
    frame.resize(targetWidth, frame.height);
  } else if (styles.width === '100%') {
    // Logica especial solo para 100%
  }
}
```

### 3.3 max-width No Limita Realmente
**Ubicacion:** lineas 2274-2279

Se menciona `max-width` pero no se aplica como limite real:

```typescript
if (node.styles?.['max-width'] && !node.styles?.height) {
  frame.layoutSizingVertical = 'HUG'; // Solo afecta el alto, NO el ancho!
}
```

### 3.4 min-width/min-height Parcialmente Implementados
**Ubicacion:** lineas 2241-2242

```typescript
frame.minHeight = 20; // Hardcoded!
frame.minWidth = 20;  // Ignora CSS min-width/min-height
```

---

## 4. PROBLEMAS DE TEXTO

### 4.1 Width de Texto Arbitrario
**Ubicacion:** lineas 2430-2434

```typescript
const maxWidth = Math.min(frame.width - frame.paddingLeft - frame.paddingRight, 800);
const textWidth = Math.max(maxWidth > 0 ? maxWidth : 400, 200);
textNode.resize(textWidth, textNode.height);
```

Valores magicos: 800, 400, 200. No se basan en CSS real.

### 4.2 Contenido Mixto (texto + elementos) Mal Manejado
**Ubicacion:** `nodeToStruct()` lineas 1016-1029

Si el HTML es:
```html
<div>Texto inicial <span>destacado</span> texto final</div>
```

El parser separa `text` de `children`, perdiendo el orden.

### 4.3 white-space No Implementado
- `white-space: nowrap` - texto no deberia hacer wrap
- `white-space: pre` - preservar espacios y saltos
- `white-space: pre-wrap` - preservar pero permitir wrap

### 4.4 text-overflow No Implementado
- `text-overflow: ellipsis` - deberia truncar con "..."

---

## 5. PROBLEMAS DE HERENCIA

### 5.1 Solo 4 Propiedades Se Heredan
**Ubicacion:** lineas 2403-2406

```typescript
const inheritableStyles = {
  color: node.styles?.color || inheritedStyles?.color,
  'font-family': node.styles?.['font-family'] || inheritedStyles?.['font-family'],
  'font-size': node.styles?.['font-size'] || inheritedStyles?.['font-size'],
  'line-height': node.styles?.['line-height'] || inheritedStyles?.['line-height'],
};
```

**FALTAN propiedades heredables de CSS:**
- `font-weight`
- `font-style`
- `text-align`
- `letter-spacing`
- `word-spacing`
- `text-transform`
- `text-indent`
- `list-style`
- `visibility`
- `cursor`
- `quotes`

### 5.2 Orden de Herencia Incorrecto
El merge de estilos ocurre ANTES de calcular los estilos heredables:

```typescript
// Linea 2196
const nodeStyles = { ...inheritedStyles, ...node.styles };
node.styles = nodeStyles;

// Luego en linea 2398
const inheritableStyles = {
  color: node.styles?.color || inheritedStyles?.color,  // Ya se mezclaron!
  ...
};
```

---

## 6. PROBLEMAS DE ALINEACION

### 6.1 justify-content Incompleto
**Ubicacion:** lineas 1903-1921

Soporta:
- `center` -> CENTER
- `flex-end` -> MAX
- `space-between` -> SPACE_BETWEEN
- `space-around` (mapeado incorrecto a SPACE_BETWEEN)

NO soporta:
- `space-evenly`
- `start` / `end`
- `flex-start` (deberia ser MIN)

### 6.2 align-items Confuso
La implementacion mezcla conceptos de VERTICAL y HORIZONTAL de forma inconsistente.

### 6.3 align-self No Existe
No hay forma de alinear un hijo individualmente diferente al resto.

---

## 7. PROBLEMAS DE ELEMENTOS ESPECIFICOS

### 7.1 Form Siempre Gris
**Ubicacion:** lineas 2473-2483

```typescript
const form = figma.createFrame();
form.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }]; // Hardcoded!
form.paddingLeft = 20;  // Hardcoded!
```

### 7.2 Button Siempre Azul
**Ubicacion:** linea 2752

```typescript
frame.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.5, b: 1 } }]; // Hardcoded azul
```

### 7.3 Table Cells Fijas
**Ubicacion:** linea 2682

```typescript
cell.resize(85, 50); // Ancho fijo 85px!
```

---

## 8. PROBLEMAS DE POSICIONAMIENTO

### 8.1 position: absolute/relative Ignorados
**Ubicacion:** lineas 2186-2191

```typescript
if (node.styles?.position === 'sticky' || node.styles?.position === 'fixed') {
  node.styles.position = 'relative'; // Se normaliza, perdiendo la intencion
}
```

Elementos con `position: absolute` deberian poder superponerse y posicionarse con `top`, `left`, etc.

### 8.2 z-index Ignorado
No hay ordenamiento de capas basado en z-index.

### 8.3 top/right/bottom/left Sin Efecto
Estas propiedades se ignoran completamente.

---

## 9. CSS NO IMPLEMENTADO

| Propiedad | Estado |
|-----------|--------|
| `overflow` | No implementado |
| `visibility: hidden` | No implementado |
| `display: none` | No implementado |
| `@media queries` | No implementado |
| `CSS variables (--var)` | No implementado |
| `calc()` | No implementado |
| `transition/animation` | N/A para Figma |
| `transform: scale/translate` | Parcial (solo rotate) |
| `filter` | No implementado |
| `backdrop-filter` | No implementado |
| `clip-path` | No implementado |

---

## 10. RECOMENDACIONES DE ARQUITECTURA

### Redisenar el Parser de CSS

El parser actual es muy basico. Considerar:
1. Usar una libreria como `css-tree` o `postcss` para parsing robusto
2. Implementar cascada de especificidad correctamente
3. Soportar media queries (al menos detectarlas)

### Redisenar Deteccion de Layout

```typescript
function determineLayoutMode(node: any, parentLayout: string): LayoutConfig {
  const display = node.styles?.display || getDefaultDisplay(node.tagName);

  switch (display) {
    case 'flex':
    case 'inline-flex':
      return {
        mode: node.styles?.['flex-direction'] === 'column' ? 'VERTICAL' : 'HORIZONTAL',
        wrap: node.styles?.['flex-wrap'] === 'wrap',
        gap: parseSize(node.styles?.gap) ?? 0
      };
    case 'grid':
      return parseGridLayout(node.styles);
    case 'inline':
    case 'inline-block':
      return { mode: 'HORIZONTAL', wrap: true, gap: 0 };
    case 'none':
      return { skip: true };
    default: // block
      return { mode: 'VERTICAL', wrap: false, gap: 0 };
  }
}
```

### Implementar Sizing Correcto

```typescript
function determineSizing(node: any, parentFrame: FrameNode): SizingConfig {
  const width = node.styles?.width;
  const display = node.styles?.display;

  // Elementos inline no llenan
  if (display === 'inline' || display === 'inline-block') {
    return { horizontal: 'HUG', vertical: 'HUG' };
  }

  // Width explicito
  if (width) {
    if (width === '100%') return { horizontal: 'FILL', vertical: 'HUG' };
    if (width.endsWith('%')) {
      // Calcular porcentaje del padre
      const percent = parseFloat(width) / 100;
      return { horizontal: 'FIXED', width: parentFrame.width * percent, vertical: 'HUG' };
    }
    return { horizontal: 'FIXED', width: parseSize(width), vertical: 'HUG' };
  }

  // Block sin width = fill
  return { horizontal: 'FILL', vertical: 'HUG' };
}
```

---

## PRIORIDAD DE FIXES

### CRITICOS (Causan layouts rotos)
1. Fix display inline/inline-block
2. Fix needsFullWidth logica
3. Fix orden de especificidad CSS

### ALTOS (Afectan apariencia)
4. Implementar herencia completa
5. Fix width porcentajes
6. Remover estilos hardcoded

### MEDIOS (Mejoras)
7. Implementar flex-wrap
8. Mejorar grid support
9. Implementar position absolute

### BAJOS (Nice to have)
10. CSS variables
11. calc()
12. Media queries
