# Parser Architecture - HTML to Figma

**File:** `ui.html` (and `src/ui.html`)
**Main function:** `simpleParseHTML()` (line ~1486)
**Last updated:** 2026-02-03

---

## 1. Overview

The parser converts HTML with embedded CSS into a data structure that Figma can render.

**Key change (2026-01):** Parser moved from `code.ts` to `ui.html` for direct processing in the UI iframe.

```
┌─────────────────────────────────────────────────────────────┐
│                    HTML + CSS Input                         │
│  <style>.card { background: #fff; }</style>                │
│  <div class="card">Hello</div>                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              ui.html - simpleParseHTML()                    │
│  1. extractCSS() - parse <style> tags                      │
│  2. DOMParser - create DOM tree                            │
│  3. nodeToStruct() - convert to structure                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              code.js - createFigmaNodes()                   │
│  Receives parsed structure, creates Figma nodes            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow

### From Plugin UI (Paste HTML tab)
```
User pastes HTML → simpleParseHTML() → postMessage to code.js → createFigmaNodes()
```

### From MCP Server (Claude Code/Cursor)
```
Claude sends HTML → Render server → SSE to plugin → simpleParseHTML() → createFigmaNodes()
```

---

## 3. Main Components

### 3.1 extractCSS(htmlStr)

Extracts and processes all CSS from HTML.

**Process:**
1. Find all `<style>...</style>` tags
2. Remove comments `/* ... */`
3. Extract variables from `:root { --var: value; }`
4. Remove `@media`, `@keyframes` blocks (not supported)
5. Parse selectors and declarations
6. Resolve CSS variables in values

**Returns:**
```javascript
{
  '.card': { background: '#fff', padding: '20px' },
  '.card h1': { color: '#333' },
  'h1': { 'font-size': '24px' }
}
```

### 3.2 parseInlineStyles(styleStr)

Parses the `style=""` attribute of an element.

```javascript
parseInlineStyles("color: red; font-size: 14px")
→ { color: 'red', 'font-size': '14px' }
```

### 3.3 Selector Matching

| Function | Purpose |
|----------|---------|
| `getAllMatchingSelectors()` | Finds all CSS selectors that apply to element |
| `selectorMatches()` | Checks if selector matches element |
| `calculateSpecificity()` | Calculates CSS specificity score |

**Supported selectors:**
| Type | Example |
|------|---------|
| Universal | `*` |
| Element | `div`, `h1` |
| Class | `.card` |
| ID | `#main` |
| Combined | `.card.primary` |
| Descendant | `.parent .child` |
| Direct child | `.parent > .child` |

### 3.4 getElementStyles(element)

Combines all styles that apply to an element.

**Priority order:**
1. CSS selectors (sorted by specificity, lowest to highest)
2. Inline styles (`style=""`) - always win

### 3.5 nodeToStruct(node)

Converts DOM node into final data structure.

**For each element:**
1. Get combined styles
2. Extract pseudo-element content (`::before`, `::after`)
3. Process children recursively
4. Return structure object

---

## 4. Output Structure

```typescript
interface ParsedElement {
  type: 'element';
  tagName: string;
  text: string;
  styles: { [property: string]: string };
  attributes: {
    value?: string;
    placeholder?: string;
    alt?: string;
  };
  children: ParsedElement[];
  mixedContent?: MixedItem[];
  pseudoContent: {
    before: string;
    after: string;
  };
}
```

---

## 5. Known Limitations

### Unsupported CSS
- `@media` queries
- `@keyframes` animations
- `:hover`, `:focus`, `:nth-child`
- Complex `calc()`

### Limited Selectors
- Siblings (`+`, `~`) - work as descendants
- Attribute selectors (`[data-x]`)
- `:not()`, `:is()`

### Pseudo-elements
- Only `::before` and `::after`
- Only simple text content

---

## 6. File Locations

| Component | File | Function |
|-----------|------|----------|
| Parser | `ui.html` | `simpleParseHTML()` |
| CSS extraction | `ui.html` | `extractCSS()` |
| Figma node creation | `code.js` | `createFigmaNodes()` |
| MCP server | `mcp-server.js` | `handleHtmlImport()` |

---

## 7. History

- **2025:** Original parser in `code.ts`
- **2026-01:** Moved to `ui.html` for direct UI processing
- **2026-02:** MCP tool renamed to `figma_html_bridge_import`
