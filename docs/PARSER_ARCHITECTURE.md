# Parser Architecture - HTML to Figma

**File:** `src/code.ts`
**Main function:** `simpleParseHTML()` (lines 1067-1481)
**Last updated:** 2026-01-23

---

## 1. Overview

The parser converts HTML with embedded CSS into a data structure that Figma can render. Despite its historical name (`simpleParseHTML`), it's a complete system that includes:

- CSS extraction from `<style>` tags
- CSS selector matching with specificity
- CSS variable resolution
- DOM to hierarchical structure conversion

```
┌─────────────────────────────────────────────────────────────┐
│                    HTML + CSS Input                         │
│  <style>.card { background: #fff; }</style>                │
│  <div class="card">Hello</div>                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      extractCSS()                           │
│  1. Extract content from all <style> tags                  │
│  2. Remove CSS comments                                     │
│  3. Extract CSS variables (:root)                          │
│  4. Remove @media, @keyframes (not supported)              │
│  5. Parse selectors and declarations                        │
│  6. Resolve var(--name) to values                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DOMParser.parseFromString()              │
│  Converts HTML string to native browser DOM tree           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      nodeToStruct()                         │
│  For each DOM element:                                      │
│  1. getElementStyles() - combine CSS + inline styles       │
│  2. extractPseudoContent() - ::before/::after              │
│  3. Process children recursively                           │
│  4. Return structure object                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Output Structure                         │
│  [{                                                         │
│    type: 'element',                                        │
│    tagName: 'div',                                         │
│    text: 'Hello',                                          │
│    styles: { background: '#fff', ... },                    │
│    children: [...],                                        │
│    mixedContent: [...],                                    │
│    attributes: { ... }                                     │
│  }]                                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Main Components

### 2.1 extractCSS(htmlStr) - Line 914

Extracts and processes all CSS from HTML.

```javascript
extractCSS(htmlStr) → { selector: { prop: value, ... }, ... }
```

**Internal functions:**
| Function | Purpose |
|----------|---------|
| `removeAtRuleBlocks()` | Removes @media, @keyframes, @supports |
| `resolveVariables()` | Replaces `var(--name)` with values |

**Process:**
1. Find all `<style>...</style>` tags
2. Remove comments `/* ... */`
3. Extract variables from `:root { --var: value; }`
4. Remove `@media`, `@keyframes` blocks (not supported)
5. Split by `}` to get individual rules
6. For each rule, extract selector and declarations
7. Resolve CSS variables in values

**Returns:**
```javascript
{
  '.card': { background: '#fff', padding: '20px' },
  '.card h1': { color: '#333' },
  'h1': { 'font-size': '24px' }
}
```

---

### 2.2 parseInlineStyles(styleStr) - Line 839

Parses the `style=""` attribute of an element.

```javascript
parseInlineStyles("color: red; font-size: 14px")
→ { color: 'red', 'font-size': '14px' }
```

---

### 2.3 Selector Matching

#### getAllMatchingSelectors(element) - Line 1131

Finds ALL CSS selectors that apply to an element.

```javascript
getAllMatchingSelectors(<div class="card primary">)
→ [
    { selector: 'div', specificity: 1, styles: {...} },
    { selector: '.card', specificity: 10, styles: {...} },
    { selector: '.primary', specificity: 10, styles: {...} }
  ]
```

**Sorting:** By specificity (lowest to highest), so more specific ones override.

#### selectorMatches(selector, element, ...) - Line 1179

Checks if a CSS selector matches an element.

**Supported selectors:**
| Type | Example | Implementation |
|------|---------|----------------|
| Universal | `*` | Always true |
| Element | `div`, `h1` | Compare tagName |
| Class | `.card` | Search in classList |
| ID | `#main` | Compare id |
| Combined classes | `.card.primary` | All must exist |
| Descendant | `.parent .child` | Search in ancestors |
| Direct child | `.parent > .child` | Immediate parent only |
| Adjacent sibling | `.a + .b` | Partial (as descendant) |

#### calculateSpecificity(selector) - Line 1335

Calculates basic CSS specificity.

```
#id     = 100 points
.class  = 10 points
element = 1 point

".card h1"     → 10 + 1 = 11
"#main .card"  → 100 + 10 = 110
```

---

### 2.4 getElementStyles(element) - Line 1370

Combines all styles that apply to an element.

```javascript
getElementStyles(element) → {
  // CSS from classes (ordered by specificity)
  background: '#fff',
  color: '#333',
  // Inline styles (highest priority)
  padding: '10px'
}
```

**Application order:**
1. CSS selectors sorted by specificity (lowest to highest)
2. Inline styles (`style=""`) - always win

---

### 2.5 nodeToStruct(node) - Line 1390

Converts a DOM node into the final data structure.

**For each element:**
1. Get combined styles (`getElementStyles`)
2. Extract pseudo-element content (`::before`, `::after`)
3. Process child nodes:
   - Text → add to `text` and `mixedContent`
   - Element → recurse, add to `children` and `mixedContent`
4. Return structure object

---

### 2.6 extractPseudoContent(element, cssRules) - Line 1075

Extracts content from `::before` and `::after`.

```css
.icon::before { content: "→"; }
```

```javascript
extractPseudoContent(<span class="icon">, cssRules)
→ { before: '→', after: '' }
```

**Limitation:** Only supports simple text content defined in `SUPPORTED_CONTENT`.

---

## 3. Output Data Structure

```typescript
interface ParsedElement {
  type: 'element';
  tagName: string;           // 'div', 'h1', 'span', etc.
  text: string;              // Direct text (legacy)
  styles: {                  // Combined CSS styles
    [property: string]: string;
  };
  attributes: {              // Relevant HTML attributes
    value?: string;
    placeholder?: string;
    alt?: string;
    rows?: string;
  };
  children: ParsedElement[]; // Child elements
  mixedContent?: MixedItem[];// Order of text + elements
  pseudoContent: {           // ::before/::after content
    before: string;
    after: string;
  };
}

interface MixedItem {
  type: 'text' | 'element';
  text?: string;             // If type === 'text'
  node?: ParsedElement;      // If type === 'element'
}
```

**Output example:**
```javascript
[{
  type: 'element',
  tagName: 'div',
  text: 'Hello World',
  styles: {
    'background': '#ffffff',
    'padding': '20px',
    'border-radius': '8px'
  },
  attributes: {},
  children: [{
    type: 'element',
    tagName: 'h1',
    text: 'Title',
    styles: { 'color': '#333', 'font-size': '24px' },
    children: [],
    attributes: {},
    mixedContent: null,
    pseudoContent: { before: '', after: '' }
  }],
  mixedContent: [
    { type: 'element', node: {...} },
    { type: 'text', text: 'Hello World' }
  ],
  pseudoContent: { before: '', after: '' }
}]
```

---

## 4. Helper Functions

### Selector Validation

| Function | Purpose |
|----------|---------|
| `isUnsupportedSelector()` | Filters `:hover`, `:focus`, `@rules` |
| `isValidCSSSelector()` | Validates basic selector format |
| `parseComplexSelector()` | Splits comma-separated selectors |

### Advanced Matching

| Function | Purpose |
|----------|---------|
| `matchesNestedSelector()` | Handles `.parent .child`, `>`, `+`, `~` |
| `parseSelector()` | Tokenizes selector into parts |
| `matchesCombinedClasses()` | Verifies `.class1.class2` |

### CSS Filtering

| Function | Purpose |
|----------|---------|
| `filterUnsupportedCSS()` | Removes unsupported properties |

---

## 5. Known Limitations

### Unsupported CSS
- `@media` queries (ignored)
- `@keyframes` animations (ignored)
- `:hover`, `:focus`, `:nth-child` (pseudo-classes)
- Complex `calc()` (only basic supported)
- `transform` (partial - only rotate)

### Limited Selectors
- Siblings (`+`, `~`) - work as descendants
- Attributes (`[data-x]`) - not supported
- `:not()`, `:is()` - not supported

### Pseudo-elements
- Only `::before` and `::after`
- Only simple text content
- `content: attr()` not supported

---

## 6. Complete Flow

```
1. User pastes HTML in plugin
                    │
                    ▼
2. simpleParseHTML(html) executes
   │
   ├─► extractCSS(html)
   │   └─► Returns: { '.card': {...}, 'h1': {...} }
   │
   ├─► DOMParser.parseFromString(html)
   │   └─► Returns: DOM tree
   │
   └─► nodeToStruct(body)
       │
       ├─► getElementStyles(element)
       │   ├─► getAllMatchingSelectors(element)
       │   │   └─► selectorMatches() for each CSS rule
       │   └─► Object.assign() in specificity order
       │
       ├─► extractPseudoContent(element)
       │
       └─► Recursion for each child
                    │
                    ▼
3. Returns: [{ type, tagName, styles, children, ... }]
                    │
                    ▼
4. createFigmaNode() uses this structure
   to create frames, text, etc. in Figma
```

---

## 7. Maintenance Notes

### Adding a new CSS selector
1. Modify `selectorMatches()` to recognize it
2. If complex, add case in `matchesNestedSelector()`
3. Update `isValidCSSSelector()` if needed

### Adding a new CSS property
1. Ensure it's NOT in `filterUnsupportedCSS()`
2. The property will be parsed automatically
3. Actual handling is in `createFigmaNode()` (not in parser)

### Adding a new pseudo-element
1. Modify `extractPseudoContent()`
2. Add supported content to `SUPPORTED_CONTENT`

---

## 8. History

- **Original name:** `simpleParseHTML` - because it started simple
- **Evolution:** Grew to support full CSS, nested selectors, specificity
- **Current state:** ~415 lines, complete parsing system

**Proposed rename:** `parseHTMLWithCSS()` or `htmlToStructure()` to better reflect its current function.
