# Plan de Fixes HTML-to-Figma

**Fecha:** 2026-01-21
**Estado:** COMPLETADO

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
