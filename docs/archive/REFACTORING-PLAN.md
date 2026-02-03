# Incremental Refactoring Plan - HTML to Figma - DONE

## Executive Summary

This document describes the plan to refactor the `html-to-figma` project from a monolithic architecture (everything in `code.ts`) to a modular architecture with clear separation of concerns.

### Motivation

1. **Maintainability**: The `code.ts` file has ~4600 lines, difficult to navigate and modify
2. **Testability**: Without separate modules, isolated unit tests are not possible
3. **Debugging**: When there's a bug, it's hard to identify which part of the code is responsible
4. **Collaboration**: Multiple developers cannot easily work in parallel

### Goal

Separate the code into logical modules while maintaining 100% compatibility with Figma.

---

## Current Situation Analysis

### Current Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    src/code.ts                          │
│                    (~4600 lines)                        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  CSS Parser (extractCSS, calculateSpecificity)  │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  HTML Parser (simpleParseHTML, nodeToStruct)    │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  Converter (applyStylesToFrame, applyStylesToText)│  │
│  ├─────────────────────────────────────────────────┤   │
│  │  Renderer (createFigmaNodesFromStructure)       │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  UI Handler (figma.ui.onmessage)                │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
                    code.js (compiled by tsc)
                         │
                         ▼
                  Figma Plugin Runtime
```

### Figma Technical Limitation

**Figma plugins only accept ONE JavaScript file** for the main code.

```json
// manifest.json
{
  "main": "code.js"  // ← Only ONE file allowed
}
```

### Current Build Configuration

```json
// package.json
{
  "scripts": {
    "build": "tsc"  // Direct TypeScript compiler
  }
}
```

**Problem**: `tsc` without a bundler compiles each `.ts` to a separate `.js`. If we split `code.ts` into modules, we'd have multiple JS files that Figma cannot load.

### Solution: Add a Bundler

A bundler (esbuild, webpack, etc.) takes multiple source files and combines them into ONE output file.

```
BEFORE (no bundler):
src/code.ts  →  tsc  →  code.js

AFTER (with esbuild):
src/
├── index.ts
├── parser/css.ts       →  esbuild  →  code.js (all combined)
├── parser/html.ts
└── converter/layout.ts
```

---

## Figma Compatibility

### Is there a risk the plugin will stop working?

**NO.** Figma only needs:

1. `manifest.json` with `"main": "code.js"`
2. The `code.js` file exists and is valid JavaScript

Figma **does not care about**:
- How `code.js` was generated (tsc, esbuild, webpack, by hand)
- How many source files were used
- What build tools are used

### Compatibility Verification

| Aspect | Before | After | Compatible? |
|--------|--------|-------|-------------|
| manifest.json | `"main": "code.js"` | `"main": "code.js"` | ✅ Yes |
| Output file | `code.js` | `code.js` | ✅ Yes |
| Figma API | Same | Same | ✅ Yes |
| Functionality | Identical | Identical | ✅ Yes |

---

## Bundling Tool: esbuild

### Why esbuild?

| Feature | esbuild | webpack | Decision |
|---------|---------|---------|----------|
| Speed | ~100x faster | Slow | esbuild ✓ |
| TypeScript Config | Native (0 config) | Requires ts-loader | esbuild ✓ |
| Complexity | Minimal | High | esbuild ✓ |
| Recommended by Figma | Yes | Yes | Tie |
| Maturity | High | Very high | webpack ✓ |

**Conclusion**: esbuild is the best choice for this project due to simplicity and speed.

### Installation

```bash
npm install --save-dev esbuild
```

### Minimal Configuration

```json
// package.json
{
  "scripts": {
    "build": "esbuild src/index.ts --bundle --outfile=code.js --target=es2017",
    "build:watch": "esbuild src/index.ts --bundle --outfile=code.js --target=es2017 --watch",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## Target Architecture

### Layer Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      src/index.ts                       │
│                    (Entry Point)                        │
│              UI setup + message handlers                │
└─────────────────────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  src/types/     │ │  src/parser/    │ │  src/utils/     │
│                 │ │                 │ │                 │
│  figma-ir.ts    │ │  css-parser.ts  │ │  css-units.ts   │
│  css.ts         │ │  html-parser.ts │ │  colors.ts      │
│  elements.ts    │ │  selectors.ts   │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   src/converter/                        │
│                                                         │
│  styles-to-figma.ts  │  layout.ts  │  text.ts          │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   src/renderer/                         │
│                                                         │
│  figma-nodes.ts  │  apply-styles.ts                    │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
                    code.js (bundled)
                         │
                         ▼
                  Figma Plugin Runtime
```

### Directory Structure

```
html-to-figma/
├── manifest.json              # No changes
├── package.json               # New scripts with esbuild
├── tsconfig.json              # Adjusted for esbuild
├── code.js                    # Bundled output (generated)
├── ui.html                    # No changes (if exists)
│
├── src/
│   ├── index.ts               # Main entry point
│   │
│   ├── types/                 # Type definitions
│   │   ├── index.ts           # Re-exports
│   │   ├── figma-ir.ts        # Intermediate Representation
│   │   ├── css.ts             # CSS types
│   │   └── parsed-element.ts  # Parsed structure
│   │
│   ├── parser/                # HTML and CSS parsing
│   │   ├── index.ts           # Re-exports
│   │   ├── css-parser.ts      # extractCSS, parseRules
│   │   ├── css-cascade.ts     # Specificity, cascade
│   │   ├── html-parser.ts     # parseHTML, nodeToStruct
│   │   └── selector-matcher.ts # selectorMatches
│   │
│   ├── converter/             # CSS → Figma props
│   │   ├── index.ts           # Re-exports
│   │   ├── styles-to-figma.ts # Main conversion
│   │   ├── layout.ts          # Flex, grid, positioning
│   │   ├── colors.ts          # Colors, gradients
│   │   └── typography.ts      # Fonts, text styles
│   │
│   ├── renderer/              # Create Figma nodes
│   │   ├── index.ts           # Re-exports
│   │   ├── figma-nodes.ts     # createFrame, createText
│   │   └── apply-styles.ts    # applyStylesToFrame, etc
│   │
│   └── utils/                 # Shared utilities
│       ├── index.ts           # Re-exports
│       ├── css-units.ts       # px, rem, em, vh parsing
│       ├── color-utils.ts     # hex, rgb, hsl parsing
│       └── constants.ts       # Default values
│
├── docs/
│   ├── html-to-figma-architecture.md
│   └── refactoring-plan.md    # This document
│
└── tests/                     # Unit tests
    ├── parser/
    │   ├── css-parser.test.ts
    │   └── html-parser.test.ts
    ├── converter/
    │   └── styles-to-figma.test.ts
    └── utils/
        └── css-units.test.ts
```

---

## Implementation Phases

### Phase 0: Infrastructure Setup

**Goal**: Configure esbuild without changing existing code.

**Changes**:

1. Install esbuild:
   ```bash
   npm install --save-dev esbuild
   ```

2. Update `package.json`:
   ```json
   {
     "scripts": {
       "build": "esbuild src/code.ts --bundle --outfile=code.js --target=es2017",
       "build:watch": "esbuild src/code.ts --bundle --outfile=code.js --target=es2017 --watch",
       "build:old": "tsc",
       "typecheck": "tsc --noEmit"
     }
   }
   ```

3. Update `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "target": "ES2017",
       "lib": ["ES2017", "DOM"],
       "module": "ESNext",
       "moduleResolution": "bundler",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "noEmit": true,
       "typeRoots": ["./node_modules/@types", "./node_modules/@figma"]
     },
     "include": ["src/**/*"]
   }
   ```

**Verification**:
- [ ] `npm run build` generates `code.js`
- [ ] Plugin works identically in Figma
- [ ] `npm run typecheck` reports type errors

**Risk**: Low. No code modifications, only build tools.

---

### Phase 1: Extract Types (IR)

**Goal**: Create explicit type definitions for the Intermediate Representation.

**Files to create**:

#### `src/types/figma-ir.ts`

```typescript
// ============================================
// Figma Intermediate Representation (IR)
// ============================================
// These interfaces define the intermediate data structure
// between parsed HTML and Figma nodes.

// --- Layout Types ---
export type LayoutMode = 'NONE' | 'HORIZONTAL' | 'VERTICAL';
export type LayoutWrap = 'NO_WRAP' | 'WRAP';
export type PrimaryAxisAlign = 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
export type CounterAxisAlign = 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'BASELINE';
export type LayoutAlign = 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'INHERIT';
export type SizingMode = 'FIXED' | 'HUG' | 'FILL';
export type LayoutPositioning = 'AUTO' | 'ABSOLUTE';

// --- Paint Types ---
export interface FigmaColor {
  r: number;  // 0-1
  g: number;  // 0-1
  b: number;  // 0-1
  a?: number; // 0-1, default 1
}

export interface SolidPaint {
  type: 'SOLID';
  color: FigmaColor;
  opacity?: number;
}

export interface GradientStop {
  position: number; // 0-1
  color: FigmaColor;
}

export interface GradientPaint {
  type: 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL';
  gradientStops: GradientStop[];
  gradientTransform?: Transform;
  opacity?: number;
}

export interface ImagePaint {
  type: 'IMAGE';
  imageHash: string;
  scaleMode: 'FILL' | 'FIT' | 'CROP' | 'TILE';
  opacity?: number;
}

export type Paint = SolidPaint | GradientPaint | ImagePaint;

// --- Node Types ---
export interface FigmaNodeBase {
  name: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  opacity?: number;
  visible?: boolean;
  layoutPositioning?: LayoutPositioning;
}

export interface FigmaFrameIR extends FigmaNodeBase {
  nodeType: 'FRAME';

  // Layout
  layoutMode: LayoutMode;
  layoutWrap?: LayoutWrap;
  primaryAxisAlignItems?: PrimaryAxisAlign;
  counterAxisAlignItems?: CounterAxisAlign;
  primaryAxisSizingMode?: SizingMode;
  counterAxisSizingMode?: SizingMode;

  // Spacing
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  itemSpacing?: number;
  counterAxisSpacing?: number;

  // Constraints
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;

  // Visual
  fills?: Paint[];
  strokes?: Paint[];
  strokeWeight?: number;
  cornerRadius?: number;
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomLeftRadius?: number;
  bottomRightRadius?: number;

  // Behavior
  clipsContent?: boolean;

  // Children
  children?: FigmaNodeIR[];
}

export interface FigmaTextIR extends FigmaNodeBase {
  nodeType: 'TEXT';
  characters: string;

  // Typography
  fontFamily?: string;
  fontStyle?: string;
  fontSize?: number;
  fontWeight?: number;
  lineHeight?: number | { value: number; unit: 'PIXELS' | 'PERCENT' | 'AUTO' };
  letterSpacing?: number;

  // Alignment
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';

  // Decoration
  textDecoration?: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';

  // Visual
  fills?: Paint[];
}

export interface FigmaRectangleIR extends FigmaNodeBase {
  nodeType: 'RECTANGLE';
  fills?: Paint[];
  strokes?: Paint[];
  strokeWeight?: number;
  cornerRadius?: number;
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomLeftRadius?: number;
  bottomRightRadius?: number;
}

export interface FigmaEllipseIR extends FigmaNodeBase {
  nodeType: 'ELLIPSE';
  fills?: Paint[];
  strokes?: Paint[];
  strokeWeight?: number;
}

export type FigmaNodeIR =
  | FigmaFrameIR
  | FigmaTextIR
  | FigmaRectangleIR
  | FigmaEllipseIR;
```

#### `src/types/css.ts`

```typescript
// ============================================
// CSS Types
// ============================================

export interface CSSVariables {
  [variableName: string]: string;
}

export interface CSSProperties {
  [property: string]: string;
}

export interface CSSRule {
  selector: string;
  properties: CSSProperties;
  specificity?: number;
}

export interface CSSRules {
  [selector: string]: CSSProperties;
}

export interface ComputedStyles {
  // Layout
  display?: string;
  flexDirection?: string;
  flexWrap?: string;
  justifyContent?: string;
  alignItems?: string;
  alignSelf?: string;
  flexGrow?: string;
  flexShrink?: string;
  gap?: string;
  rowGap?: string;
  columnGap?: string;

  // Positioning
  position?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: string;

  // Dimensions
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;

  // Spacing
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;

  // Visual
  backgroundColor?: string;
  background?: string;
  color?: string;
  opacity?: string;

  // Borders
  border?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;

  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  textDecoration?: string;
  whiteSpace?: string;
  textOverflow?: string;

  // Other
  overflow?: string;
  visibility?: string;

  // Allow any other CSS property
  [property: string]: string | undefined;
}
```

#### `src/types/parsed-element.ts`

```typescript
// ============================================
// Parsed HTML Element Types
// ============================================

import { ComputedStyles } from './css';

export interface PseudoContent {
  before?: string;
  after?: string;
}

export interface MixedContentItem {
  type: 'text' | 'element';
  content?: string;      // For text nodes
  element?: ParsedElement; // For element nodes
}

export interface ParsedElement {
  type: 'element' | 'text';
  tagName?: string;
  text?: string;
  styles: ComputedStyles;
  children: ParsedElement[];
  mixedContent?: MixedContentItem[];
  pseudoContent?: PseudoContent;
  attributes?: { [key: string]: string };
}
```

#### `src/types/index.ts`

```typescript
// Re-export all types
export * from './figma-ir';
export * from './css';
export * from './parsed-element';
```

**Verification**:
- [ ] Types compile without errors
- [ ] Can be imported from `code.ts`
- [ ] Plugin still works

**Risk**: Very low. Only new files are added.

---

### Phase 2: Extract CSS Parser

**Goal**: Move all CSS parsing logic to separate modules.

**Functions to extract from `code.ts`**:
- `extractCSS()`
- `calculateSpecificity()`
- `getAllMatchingSelectors()`
- `parseCSSValue()`
- `parseColor()` / `parseColorValue()`
- CSS variables handling

**Files to create**:

#### `src/parser/css-parser.ts`

```typescript
import { CSSRules, CSSVariables, CSSProperties } from '../types';

/**
 * Extracts CSS rules from an HTML string containing <style> tags
 */
export function extractCSS(htmlStr: string): {
  rules: CSSRules;
  variables: CSSVariables;
} {
  // Move implementation from code.ts
}

/**
 * Parses a CSS declaration block
 * Example: "color: red; font-size: 16px;" → { color: 'red', fontSize: '16px' }
 */
export function parseDeclarations(declarationBlock: string): CSSProperties {
  // Move implementation
}

/**
 * Resolves CSS variables (var(--name))
 */
export function resolveVariables(
  value: string,
  variables: CSSVariables
): string {
  // Move implementation
}
```

#### `src/parser/css-cascade.ts`

```typescript
import { CSSRules, CSSProperties } from '../types';

/**
 * Calculates the specificity of a CSS selector
 * Returns a number where higher = more specific
 *
 * Rules:
 * - ID (#id): +100
 * - Class (.class): +10
 * - Element (div): +1
 */
export function calculateSpecificity(selector: string): number {
  // Move implementation from code.ts
}

/**
 * Finds all selectors that apply to an element
 * and sorts them by specificity
 */
export function getMatchingRules(
  element: Element,
  rules: CSSRules
): Array<{ selector: string; properties: CSSProperties; specificity: number }> {
  // Move implementation from getAllMatchingSelectors
}

/**
 * Combines styles applying cascade correctly
 * (lower specificity first, inline styles last)
 */
export function cascadeStyles(
  matchingRules: Array<{ properties: CSSProperties; specificity: number }>,
  inlineStyles?: CSSProperties
): CSSProperties {
  // Move implementation
}
```

#### `src/parser/selector-matcher.ts`

```typescript
/**
 * Checks if a CSS selector matches a DOM element
 */
export function selectorMatches(
  selector: string,
  element: Element,
  parentElement?: Element | null,
  previousSibling?: Element | null
): boolean {
  // Move implementation from code.ts
}

/**
 * Parses a selector into its components
 * Example: "div.card > h1" → [{ type: 'element', value: 'div' }, { type: 'class', value: 'card' }, ...]
 */
export function parseSelector(selector: string): SelectorPart[] {
  // New function for better testability
}
```

#### `src/parser/index.ts`

```typescript
export * from './css-parser';
export * from './css-cascade';
export * from './selector-matcher';
```

**Verification**:
- [ ] Unit tests for `calculateSpecificity()`
- [ ] Unit tests for `selectorMatches()`
- [ ] `code.ts` imports from `./parser` and works the same

**Risk**: Medium. Moving existing code, possible import errors.

---

### Phase 3: Extract HTML Parser

**Goal**: Move HTML parsing logic to separate modules.

**Functions to extract**:
- `simpleParseHTML()`
- `nodeToStruct()`
- `getElementStyles()`
- `extractPseudoContent()`

**Files to create**:

#### `src/parser/html-parser.ts`

```typescript
import { ParsedElement, CSSRules } from '../types';
import { getMatchingRules, cascadeStyles } from './css-cascade';

/**
 * Parses an HTML string and returns element structure with computed styles
 */
export function parseHTML(
  htmlStr: string,
  cssRules: CSSRules
): ParsedElement[] {
  // Move implementation from simpleParseHTML
}

/**
 * Converts a DOM node to data structure
 */
export function nodeToStruct(
  node: Node,
  cssRules: CSSRules,
  parentStyles?: CSSProperties
): ParsedElement | null {
  // Move implementation
}

/**
 * Gets computed styles for an element
 * (CSS cascade + inline styles + inheritance)
 */
export function getElementStyles(
  element: Element,
  cssRules: CSSRules,
  parentStyles?: CSSProperties
): CSSProperties {
  // Move implementation
}

/**
 * Extracts pseudo-element content ::before and ::after
 */
export function extractPseudoContent(
  element: Element,
  cssRules: CSSRules
): { before?: string; after?: string } {
  // Move implementation
}
```

**Verification**:
- [ ] Unit tests for `parseHTML()` with simple HTML
- [ ] Tests for style inheritance
- [ ] Plugin works identically

---

### Phase 4: Extract Converter (CSS → Figma)

**Goal**: Separate logic that converts CSS properties to Figma properties.

**Functions to extract**:
- display/flex → layoutMode mapping
- justify-content → primaryAxisAlignItems mapping
- align-items → counterAxisAlignItems mapping
- Color conversion
- Unit conversion (px, rem, em, %)

**Files to create**:

#### `src/converter/layout.ts`

```typescript
import { LayoutMode, PrimaryAxisAlign, CounterAxisAlign } from '../types';

/**
 * Determines Figma layoutMode based on CSS display and flex-direction
 */
export function mapLayoutMode(
  display: string | undefined,
  flexDirection: string | undefined
): LayoutMode {
  if (display === 'flex' || display === 'inline-flex') {
    return flexDirection === 'column' ? 'VERTICAL' : 'HORIZONTAL';
  }
  if (display === 'grid' || display === 'inline-grid') {
    return 'VERTICAL'; // Grid is emulated with vertical layout
  }
  if (display === 'inline' || display === 'inline-block') {
    return 'HORIZONTAL';
  }
  // block, etc.
  return 'VERTICAL';
}

/**
 * Maps justify-content to primaryAxisAlignItems
 */
export function mapPrimaryAxisAlign(
  justifyContent: string | undefined
): PrimaryAxisAlign {
  const map: Record<string, PrimaryAxisAlign> = {
    'flex-start': 'MIN',
    'start': 'MIN',
    'center': 'CENTER',
    'flex-end': 'MAX',
    'end': 'MAX',
    'space-between': 'SPACE_BETWEEN',
  };
  return map[justifyContent || ''] || 'MIN';
}

/**
 * Maps align-items to counterAxisAlignItems
 */
export function mapCounterAxisAlign(
  alignItems: string | undefined
): CounterAxisAlign {
  const map: Record<string, CounterAxisAlign> = {
    'flex-start': 'MIN',
    'start': 'MIN',
    'center': 'CENTER',
    'flex-end': 'MAX',
    'end': 'MAX',
    'stretch': 'STRETCH',
    'baseline': 'BASELINE',
  };
  return map[alignItems || ''] || 'MIN';
}
```

#### `src/converter/colors.ts`

```typescript
import { FigmaColor, Paint, SolidPaint, GradientPaint } from '../types';

/**
 * Parses a CSS color to Figma format (r, g, b in 0-1)
 */
export function parseColor(colorStr: string): FigmaColor | null {
  // Move implementation from parseColorValue
}

/**
 * Parses a CSS background (can be color, gradient, or image)
 */
export function parseBackground(backgroundStr: string): Paint[] {
  // Move implementation
}

/**
 * Parses linear-gradient() to Figma GradientPaint
 */
export function parseLinearGradient(gradientStr: string): GradientPaint | null {
  // Move implementation
}

/**
 * Converts hex to normalized RGB (0-1)
 */
export function hexToRgb(hex: string): FigmaColor | null {
  // Move implementation
}
```

#### `src/converter/typography.ts`

```typescript
import { FigmaTextIR } from '../types';

/**
 * Maps CSS font-weight to Figma style
 */
export function mapFontWeight(
  weight: string | undefined
): string {
  const weightMap: Record<string, string> = {
    '100': 'Thin',
    '200': 'ExtraLight',
    '300': 'Light',
    '400': 'Regular',
    '500': 'Medium',
    '600': 'SemiBold',
    '700': 'Bold',
    '800': 'ExtraBold',
    '900': 'Black',
    'normal': 'Regular',
    'bold': 'Bold',
  };
  return weightMap[weight || '400'] || 'Regular';
}

/**
 * Converts CSS line-height to Figma format
 */
export function mapLineHeight(
  lineHeight: string | undefined,
  fontSize: number
): { value: number; unit: 'PIXELS' | 'PERCENT' } | undefined {
  // Move implementation
}

/**
 * Maps text-align to Figma textAlignHorizontal
 */
export function mapTextAlign(
  textAlign: string | undefined
): 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED' {
  const map = {
    'left': 'LEFT',
    'center': 'CENTER',
    'right': 'RIGHT',
    'justify': 'JUSTIFIED',
  } as const;
  return map[textAlign as keyof typeof map] || 'LEFT';
}
```

#### `src/converter/styles-to-figma.ts`

```typescript
import { ComputedStyles, FigmaFrameIR, FigmaTextIR } from '../types';
import { mapLayoutMode, mapPrimaryAxisAlign, mapCounterAxisAlign } from './layout';
import { parseColor, parseBackground } from './colors';
import { mapFontWeight, mapLineHeight, mapTextAlign } from './typography';
import { parseCSSValue } from '../utils/css-units';

/**
 * Converts computed CSS styles to FigmaFrame properties
 */
export function stylesToFigmaFrame(
  styles: ComputedStyles
): Partial<FigmaFrameIR> {
  return {
    layoutMode: mapLayoutMode(styles.display, styles.flexDirection),
    primaryAxisAlignItems: mapPrimaryAxisAlign(styles.justifyContent),
    counterAxisAlignItems: mapCounterAxisAlign(styles.alignItems),
    paddingTop: parseCSSValue(styles.paddingTop),
    paddingRight: parseCSSValue(styles.paddingRight),
    paddingBottom: parseCSSValue(styles.paddingBottom),
    paddingLeft: parseCSSValue(styles.paddingLeft),
    itemSpacing: parseCSSValue(styles.gap),
    fills: styles.backgroundColor ? parseBackground(styles.backgroundColor) : undefined,
    cornerRadius: parseCSSValue(styles.borderRadius),
    // ... more properties
  };
}

/**
 * Converts CSS styles to FigmaText properties
 */
export function stylesToFigmaText(
  styles: ComputedStyles
): Partial<FigmaTextIR> {
  const fontSize = parseCSSValue(styles.fontSize) || 16;
  return {
    fontFamily: styles.fontFamily?.split(',')[0]?.trim().replace(/['"]/g, '') || 'Inter',
    fontStyle: mapFontWeight(styles.fontWeight),
    fontSize,
    lineHeight: mapLineHeight(styles.lineHeight, fontSize),
    textAlignHorizontal: mapTextAlign(styles.textAlign),
    fills: styles.color ? parseBackground(styles.color) : undefined,
    // ... more properties
  };
}
```

#### `src/converter/index.ts`

```typescript
export * from './styles-to-figma';
export * from './layout';
export * from './colors';
export * from './typography';
```

**Verification**:
- [ ] Unit tests for each mapping function
- [ ] Tests for complete CSS → IR conversion
- [ ] Plugin works identically

---

### Phase 5: Extract Renderer (Figma Nodes)

**Goal**: Separate Figma node creation.

**Functions to extract**:
- `createFigmaNodesFromStructure()`
- `applyStylesToFrame()`
- `applyStylesToText()`

**Files to create**:

#### `src/renderer/figma-nodes.ts`

```typescript
import { FigmaNodeIR, FigmaFrameIR, FigmaTextIR } from '../types';
import { applyFrameStyles, applyTextStyles } from './apply-styles';

/**
 * Creates a Figma node from IR
 */
export async function createFigmaNode(
  ir: FigmaNodeIR,
  parent?: FrameNode
): Promise<SceneNode> {
  switch (ir.nodeType) {
    case 'FRAME':
      return createFrame(ir, parent);
    case 'TEXT':
      return createText(ir, parent);
    case 'RECTANGLE':
      return createRectangle(ir, parent);
    case 'ELLIPSE':
      return createEllipse(ir, parent);
    default:
      throw new Error(`Unknown node type: ${(ir as any).nodeType}`);
  }
}

async function createFrame(
  ir: FigmaFrameIR,
  parent?: FrameNode
): Promise<FrameNode> {
  const frame = figma.createFrame();
  frame.name = ir.name || 'Frame';

  applyFrameStyles(frame, ir);

  // Create children recursively
  if (ir.children) {
    for (const child of ir.children) {
      await createFigmaNode(child, frame);
    }
  }

  if (parent) {
    parent.appendChild(frame);
  }

  return frame;
}

async function createText(
  ir: FigmaTextIR,
  parent?: FrameNode
): Promise<TextNode> {
  const text = figma.createText();
  text.name = ir.name || 'Text';

  await applyTextStyles(text, ir);

  if (parent) {
    parent.appendChild(text);
  }

  return text;
}
```

#### `src/renderer/apply-styles.ts`

```typescript
import { FigmaFrameIR, FigmaTextIR } from '../types';

/**
 * Applies IR styles to a Figma FrameNode
 */
export function applyFrameStyles(
  frame: FrameNode,
  ir: FigmaFrameIR
): void {
  // Dimensions
  if (ir.width && ir.height) {
    frame.resize(ir.width, ir.height);
  }

  // Layout
  if (ir.layoutMode && ir.layoutMode !== 'NONE') {
    frame.layoutMode = ir.layoutMode;
    frame.primaryAxisAlignItems = ir.primaryAxisAlignItems || 'MIN';
    frame.counterAxisAlignItems = ir.counterAxisAlignItems || 'MIN';
    frame.itemSpacing = ir.itemSpacing || 0;
    frame.paddingTop = ir.paddingTop || 0;
    frame.paddingRight = ir.paddingRight || 0;
    frame.paddingBottom = ir.paddingBottom || 0;
    frame.paddingLeft = ir.paddingLeft || 0;
  }

  // Fills
  if (ir.fills && ir.fills.length > 0) {
    frame.fills = ir.fills as Paint[];
  }

  // Corner radius
  if (ir.cornerRadius) {
    frame.cornerRadius = ir.cornerRadius;
  }

  // ... more properties
}

/**
 * Applies IR styles to a Figma TextNode
 */
export async function applyTextStyles(
  text: TextNode,
  ir: FigmaTextIR
): Promise<void> {
  // Load font
  const fontFamily = ir.fontFamily || 'Inter';
  const fontStyle = ir.fontStyle || 'Regular';

  await figma.loadFontAsync({ family: fontFamily, style: fontStyle });

  text.fontName = { family: fontFamily, style: fontStyle };
  text.characters = ir.characters || '';
  text.fontSize = ir.fontSize || 16;

  if (ir.fills) {
    text.fills = ir.fills as Paint[];
  }

  // ... more properties
}
```

#### `src/renderer/index.ts`

```typescript
export * from './figma-nodes';
export * from './apply-styles';
```

---

### Phase 6: Clean Entry Point

**Goal**: Simplify `src/index.ts` to only handle UI and orchestration.

#### `src/index.ts` (final)

```typescript
// ============================================
// HTML to Figma - Entry Point
// ============================================

import { extractCSS } from './parser/css-parser';
import { parseHTML } from './parser/html-parser';
import { createFigmaNode } from './renderer/figma-nodes';
import { detectDesignWidth } from './utils/design-detection';

// Show UI
figma.showUI(__html__, { width: 450, height: 550 });

// Message handler
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'convert-html':
        await handleConvertHTML(msg.html);
        break;

      case 'cancel':
        figma.closePlugin();
        break;

      default:
        console.warn('Unknown message type:', msg.type);
    }
  } catch (error) {
    figma.ui.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

async function handleConvertHTML(htmlStr: string): Promise<void> {
  // 1. Extract CSS
  const { rules: cssRules, variables } = extractCSS(htmlStr);

  // 2. Detect design width
  const designWidth = detectDesignWidth(htmlStr, cssRules);

  // 3. Parse HTML to structure
  const elements = parseHTML(htmlStr, cssRules);

  // 4. Create container frame
  const container = figma.createFrame();
  container.name = 'HTML Import';
  container.resize(designWidth, 100); // Height will adjust
  container.layoutMode = 'VERTICAL';
  container.primaryAxisSizingMode = 'AUTO';

  // 5. Create Figma nodes
  for (const element of elements) {
    await createFigmaNode(element, container);
  }

  // 6. Add to page and focus
  figma.currentPage.appendChild(container);
  figma.viewport.scrollAndZoomIntoView([container]);

  // 7. Notify success
  figma.ui.postMessage({ type: 'success' });
}
```

---

## Shared Utilities

### `src/utils/css-units.ts`

```typescript
/**
 * Parses a CSS value with units to pixels
 */
export function parseCSSValue(
  value: string | undefined,
  options?: {
    baseFontSize?: number;    // For em/rem, default 16
    parentFontSize?: number;  // For em
    viewportWidth?: number;   // For vw
    viewportHeight?: number;  // For vh
  }
): number {
  if (!value || value === 'auto' || value === 'none') {
    return 0;
  }

  const baseFontSize = options?.baseFontSize ?? 16;
  const str = String(value).trim().toLowerCase();

  // Number without unit
  if (/^-?\d+(\.\d+)?$/.test(str)) {
    return parseFloat(str);
  }

  // px
  if (str.endsWith('px')) {
    return parseFloat(str);
  }

  // rem
  if (str.endsWith('rem')) {
    return parseFloat(str) * baseFontSize;
  }

  // em
  if (str.endsWith('em')) {
    const parentSize = options?.parentFontSize ?? baseFontSize;
    return parseFloat(str) * parentSize;
  }

  // pt
  if (str.endsWith('pt')) {
    return parseFloat(str) * 1.333;
  }

  // % (requires context, returns 0 by default)
  if (str.endsWith('%')) {
    return 0; // Needs parent context
  }

  // vw/vh (requires viewport)
  if (str.endsWith('vw')) {
    const vw = options?.viewportWidth ?? 1440;
    return (parseFloat(str) / 100) * vw;
  }

  if (str.endsWith('vh')) {
    const vh = options?.viewportHeight ?? 900;
    return (parseFloat(str) / 100) * vh;
  }

  // Fallback
  return parseFloat(str) || 0;
}
```

### `src/utils/constants.ts`

```typescript
export const DEFAULT_FONT_SIZE = 16;
export const DEFAULT_DESIGN_WIDTH = 1440;
export const DEFAULT_FONT_FAMILY = 'Inter';

export const INHERITABLE_PROPERTIES = [
  'color',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'line-height',
  'letter-spacing',
  'text-align',
  'text-transform',
  'white-space',
  'visibility',
] as const;

export const BLOCK_ELEMENTS = [
  'div', 'section', 'article', 'nav', 'header', 'footer',
  'main', 'aside', 'figure', 'figcaption', 'blockquote',
  'address', 'details', 'summary', 'form', 'fieldset',
] as const;

export const INLINE_ELEMENTS = [
  'span', 'a', 'strong', 'em', 'b', 'i', 'code', 'small',
  'sub', 'sup', 'mark', 'abbr', 'cite', 'q',
] as const;
```

---

## Testing Strategy

### Recommended Tools

```bash
npm install --save-dev vitest @vitest/ui
```

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // For DOM APIs
  },
});
```

### Test Examples

#### `tests/parser/css-cascade.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { calculateSpecificity } from '../../src/parser/css-cascade';

describe('calculateSpecificity', () => {
  it('should return 1 for element selectors', () => {
    expect(calculateSpecificity('div')).toBe(1);
    expect(calculateSpecificity('p')).toBe(1);
  });

  it('should return 10 for class selectors', () => {
    expect(calculateSpecificity('.card')).toBe(10);
  });

  it('should return 100 for ID selectors', () => {
    expect(calculateSpecificity('#header')).toBe(100);
  });

  it('should sum specificity for combined selectors', () => {
    expect(calculateSpecificity('div.card')).toBe(11);
    expect(calculateSpecificity('#header .nav a')).toBe(112);
  });
});
```

#### `tests/converter/colors.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { parseColor } from '../../src/converter/colors';

describe('parseColor', () => {
  it('should parse hex colors', () => {
    expect(parseColor('#ff0000')).toEqual({ r: 1, g: 0, b: 0, a: 1 });
    expect(parseColor('#fff')).toEqual({ r: 1, g: 1, b: 1, a: 1 });
  });

  it('should parse rgb colors', () => {
    expect(parseColor('rgb(255, 0, 0)')).toEqual({ r: 1, g: 0, b: 0, a: 1 });
  });

  it('should parse rgba colors', () => {
    expect(parseColor('rgba(255, 0, 0, 0.5)')).toEqual({ r: 1, g: 0, b: 0, a: 0.5 });
  });
});
```

---

## Migration Checklist

### Phase 0: Setup
- [ ] Install esbuild
- [ ] Update package.json with new scripts
- [ ] Update tsconfig.json
- [ ] Verify `npm run build` generates code.js
- [ ] Verify plugin works in Figma

### Phase 1: Types
- [ ] Create src/types/figma-ir.ts
- [ ] Create src/types/css.ts
- [ ] Create src/types/parsed-element.ts
- [ ] Create src/types/index.ts
- [ ] Verify compilation without errors

### Phase 2: CSS Parser
- [ ] Create src/parser/css-parser.ts
- [ ] Create src/parser/css-cascade.ts
- [ ] Create src/parser/selector-matcher.ts
- [ ] Move code from code.ts
- [ ] Write unit tests
- [ ] Verify plugin works

### Phase 3: HTML Parser
- [ ] Create src/parser/html-parser.ts
- [ ] Move code from code.ts
- [ ] Write unit tests
- [ ] Verify plugin works

### Phase 4: Converter
- [ ] Create src/converter/layout.ts
- [ ] Create src/converter/colors.ts
- [ ] Create src/converter/typography.ts
- [ ] Create src/converter/styles-to-figma.ts
- [ ] Move code from code.ts
- [ ] Write unit tests
- [ ] Verify plugin works

### Phase 5: Renderer
- [ ] Create src/renderer/figma-nodes.ts
- [ ] Create src/renderer/apply-styles.ts
- [ ] Move code from code.ts
- [ ] Verify plugin works

### Phase 6: Cleanup
- [ ] Simplify src/index.ts
- [ ] Remove duplicate code
- [ ] Update documentation
- [ ] Final review

---

## Risks and Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| esbuild generates incompatible code | Low | High | Test with minimal code first |
| Circular import errors | Medium | Medium | Design unidirectional dependencies |
| Loss of functionality | Medium | High | Tests before each phase |
| Performance degradation | Low | Low | Benchmark before/after |

---

## Known Issues to Fix During Refactoring

These are existing bugs that should be addressed during the refactoring process:

### Critical

| Issue | Description | Affected Module | Priority |
|-------|-------------|-----------------|----------|
| ~~**Container width defaults to 100px**~~ | ~~When HTML is sent via MCP/SSE, the root container frame is created with 100px width and HUG content mode, causing content to be clipped~~ | ~~`src/code.ts`~~ | ✅ **FIXED** (commit 8b6c969) |
| ~~**REM units not properly converted**~~ | ~~`font-size: 3.5rem` renders too small, base font size calculation is incorrect~~ | ~~`src/utils/css-units.ts`, `src/ui.html`~~ | ✅ **FIXED** - Now detects root font-size from `html` or `:root` CSS rules and updates rem base dynamically |
| ~~**Viewport units (vh/vw) not working**~~ | ~~`height: 100vh` doesn't apply correctly~~ | ~~`src/utils/css-units.ts`, `src/code.ts`~~ | ✅ **FIXED** - VW now uses detected design width, VH uses 900px default (reasonable desktop height) |

### High

| Issue | Description | Affected Module | Priority |
|-------|-------------|-----------------|----------|
| ~~**Fixed 1440px design width**~~ | ~~All designs render at 1440px regardless of content or meta tags~~ | ~~`src/ui.html`, `src/code.ts`~~ | ✅ **FIXED** (commit 5032cec) - Wide layouts (8+ column grids) now use 1920px |
| ~~**position: fixed**~~ | ~~Elements with `position: fixed` don't position correctly~~ | ~~`src/code.ts`~~ | ✅ **FIXED** (commit 5032cec) - Converts to relative, propagates `_shouldFillWidth` to children |
| ~~**Inline style priority**~~ | ~~Some inline styles don't override CSS rules properly~~ | ~~`src/ui.html`~~ | ✅ **FIXED** (commit d3a34fb) - Proper CSS cascade with `!important` support |

### Low Priority

| Issue | Description | Affected Module | Priority |
|-------|-------------|-----------------|----------|
| ~~**Grid decimal fractions**~~ | ~~`1.3fr 2.7fr` doesn't respect exact proportions~~ | ~~`src/utils/grid.ts`~~ | ✅ FIXED |
| ~~**Complex calc() expressions**~~ | ~~`calc()` with mixed units fails~~ | ~~`src/utils/css-units.ts`~~ | ✅ FIXED |
| ~~**transform: scale/translate**~~ | ~~Only rotate is implemented~~ | ~~`src/utils/effects.ts`~~ | ✅ FIXED |
| ~~**filter/backdrop-filter**~~ | ~~blur, drop-shadow, background blur~~ | ~~`src/utils/effects.ts`~~ | ✅ FIXED |
| ~~**clip-path**~~ | ~~CSS clip-path not supported~~ | ~~`src/utils/effects.ts`~~ | ✅ FIXED |
| ~~**Text centering in flex containers**~~ | ~~Text doesn't respect `justify-content: center` in flex containers~~ | ~~`src/code.ts`~~ | ✅ FIXED |

### Investigation Needed

- [x] Root cause of 100px default width - FIXED in message handler
- [x] Check if design width detection is being called for MCP requests - YES, working
- [x] Verify sizing mode (HUG vs FILL vs FIXED) logic for root container - FIXED
- [x] REM units not converted correctly - FIXED: Added root font-size detection from CSS, property name normalization, and font shorthand parsing
- [x] Viewport units (vh/vw) - FIXED: VW uses detected design width, parseSize correctly handles vh/vw units
- [x] Inline style priority - FIXED: Proper CSS cascade with !important support (commit d3a34fb)
- [x] Grid decimal fractions - FIXED: Added `parseGridColumnWidths()` for proportional fr/px calculations
- [x] Complex calc() - FIXED: Support mixed units, multiplication/division
- [x] transform: scale/translate - FIXED: Full transform support (rotate, scale, scaleX/Y, translate, translateX/Y)
- [x] filter/backdrop-filter - FIXED: blur(), drop-shadow(), backdrop-filter: blur()
- [x] Text centering in flex containers - FIXED: Added centering logic to legacy text path with `textAlignHorizontal = 'CENTER'` and `layoutSizingHorizontal = 'FILL'`
- [x] clip-path - FIXED: Added `parseClipPath()` in effects.ts supporting inset/circle/ellipse/polygon detection, applies `clipsContent = true`
- [x] CSS inheritance order - FIXED: Added 5 more inheritable properties (text-decoration, white-space, text-indent, direction, visibility)

---

## Final Notes

### Why not migrate to the proposed Python architecture?

1. **81% already works** - No point in rewriting
2. **Remaining issues are Figma limitations**, not parser issues
3. **Higher operational complexity** (Python server + communication)
4. **Additional latency** from network calls

### Benefits of this refactoring

1. **More maintainable code** - Small, focused files
2. **Testable** - Unit tests per module
3. **Easier debugging** - Know where to look for problems
4. **Foundation for future improvements** - Clear structure for adding features
5. **No user-facing changes** - Plugin works exactly the same

---

*Document created: 2025-01-26*
*Last updated: 2026-01-29*

---

## Current Status (Session Notes)

### Completed
- ✅ **Phase 0**: esbuild configured and working (build in 14ms, 156kb output)
- ✅ **Width bug fixed**: MCP/SSE imports now detect inline width or fallback to 400px
- ✅ **REM units fixed**: Added `detectRootFontSize()` function in `src/ui.html` that extracts root font-size from `html` or `:root` CSS selectors, handles percentage values (62.5% = 10px), and updates `CSS_CONFIG.remBase` dynamically
- ✅ **Viewport units fixed**: VW now uses detected design width from meta tags/CSS, VH uses 900px default
- ✅ **CSS property normalization**: Property names in `parseInlineStyles()` are now normalized to lowercase for consistent matching
- ✅ **Font shorthand parsing**: The `font` shorthand property is now parsed to extract `font-size` value
- ✅ **CSS !important cascade**: Proper cascade order: CSS normal → inline normal → CSS !important → inline !important (commit d3a34fb)
- ✅ **Grid decimal fractions**: `parseGridColumnWidths()` calculates proportional widths for `1.3fr 2.7fr` patterns
- ✅ **Complex calc()**: Support for mixed units (`calc(100% - 20px)`), multiplication, division
- ✅ **transform complete**: rotate, scale, scaleX/Y, translate, translateX/Y all supported
- ✅ **filter**: blur() and drop-shadow() effects
- ✅ **backdrop-filter**: blur() for frosted glass effects
- ✅ **Text centering**: `justify-content: center` now properly centers text in flex containers
- ✅ **clip-path**: `parseClipPath()` supports inset/circle/ellipse/polygon, applies clipsContent=true
- ✅ **CSS inheritance complete**: 15 inheritable properties including text-decoration, white-space, text-indent, direction, visibility

### Next Steps (Resume Here)
1. **Phase 1**: Extract types/IR to `src/types/`
   - Create `figma-ir.ts`, `css.ts`, `parsed-element.ts`
   - Define explicit interfaces for intermediate representation

2. **All CSS issues resolved**:
   - ~~Grid decimal fractions~~ ✅ DONE
   - ~~Complex calc() expressions~~ ✅ DONE
   - ~~transform: scale/translate~~ ✅ DONE
   - ~~filter/backdrop-filter~~ ✅ DONE
   - ~~Text centering in flex containers~~ ✅ DONE
   - ~~clip-path~~ ✅ DONE
   - ~~CSS inheritance order~~ ✅ DONE

### Commands Reference
```bash
npm run build        # Build with esbuild
npm run build:watch  # Watch mode
npm run typecheck    # Type check only
node start-servers.js # Start MCP + SSE servers
```
