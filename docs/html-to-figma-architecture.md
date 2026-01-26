# HTML to Figma Converter - Architecture Documentation

## Overview

This document outlines the architecture for a deterministic HTML/CSS to Figma converter. The goal is to take beautiful HTML+CSS and render it as native Figma objects using Figma's Plugin API.

### Design Philosophy

- **Deterministic conversion**: No AI/LLM interpretation during conversion - pure code-based mapping
- **Primitives first**: Use Figma primitives (frames, rectangles, text) instead of components
- **Iterative approach**: Start with basic support, expand over time

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    HTML + CSS Input                      │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              LAYER 1: Parser (Python)                    │
│  - BeautifulSoup/lxml for HTML                          │
│  - cssutils/tinycss2 for CSS                            │
│  - Computed styles (CSS cascade)                        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│         LAYER 2: Intermediate Representation (IR)        │
│  - Platform-agnostic Python model (dataclasses)         │
│  - FigmaNode, FigmaFrame, FigmaText, FigmaRectangle...  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│         LAYER 3: Figma JSON Generator (Python)          │
│  - Serializes IR to Figma Plugin API compatible JSON    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              LAYER 4: MCP Server (Python)                │
│  - Exposes endpoints for the plugin                     │
│  - Receives HTML, returns Figma JSON                    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│           LAYER 5: Figma Plugin (TypeScript)            │
│  - Receives JSON from MCP                               │
│  - Executes figma.createFrame(), etc.                   │
└─────────────────────────────────────────────────────────┘
```

---

## CSS to Figma Property Mapping

### A. Layout

The `FrameNode` in Figma is equivalent to a `<div>` in HTML. It supports Auto Layout which maps to CSS Flexbox.

| CSS Property | Figma Property | Values |
|--------------|----------------|--------|
| `display: flex` | `layoutMode` | `'HORIZONTAL'` or `'VERTICAL'` |
| `flex-direction: row` | `layoutMode` | `'HORIZONTAL'` |
| `flex-direction: column` | `layoutMode` | `'VERTICAL'` |
| `display: grid` | `layoutMode` | `'GRID'` |
| `display: block` | `layoutMode` | `'NONE'` |
| `flex-wrap: nowrap` | `layoutWrap` | `'NO_WRAP'` |
| `flex-wrap: wrap` | `layoutWrap` | `'WRAP'` |
| `justify-content: flex-start` | `primaryAxisAlignItems` | `'MIN'` |
| `justify-content: center` | `primaryAxisAlignItems` | `'CENTER'` |
| `justify-content: flex-end` | `primaryAxisAlignItems` | `'MAX'` |
| `justify-content: space-between` | `primaryAxisAlignItems` | `'SPACE_BETWEEN'` |
| `align-items: flex-start` | `counterAxisAlignItems` | `'MIN'` |
| `align-items: center` | `counterAxisAlignItems` | `'CENTER'` |
| `align-items: flex-end` | `counterAxisAlignItems` | `'MAX'` |
| `align-items: stretch` | `counterAxisAlignItems` | `'STRETCH'` |
| `align-items: baseline` | `counterAxisAlignItems` | `'BASELINE'` |
| `align-self` | `layoutAlign` | `'MIN'`, `'CENTER'`, `'MAX'`, `'STRETCH'` |
| `flex-grow` | `layoutGrow` | `0` (fixed) or `1` (stretch) |
| `position: absolute` | `layoutPositioning` | `'ABSOLUTE'` |
| `position: relative` | `layoutPositioning` | `'AUTO'` |

### B. Spacing

| CSS Property | Figma Property | Notes |
|--------------|----------------|-------|
| `padding-left` | `paddingLeft` | Number in pixels |
| `padding-right` | `paddingRight` | Number in pixels |
| `padding-top` | `paddingTop` | Number in pixels |
| `padding-bottom` | `paddingBottom` | Number in pixels |
| `gap` | `itemSpacing` | Distance between children |
| `row-gap` | `counterAxisSpacing` | When `layoutWrap: 'WRAP'` |
| `column-gap` | `itemSpacing` | Primary axis spacing |
| `margin` | **Not supported** | Simulate with wrapper frames |

> **Note**: Figma does not have a native margin property. Margins must be simulated by:
> 1. Using a wrapper frame with padding
> 2. Adjusting `itemSpacing` on the parent
> 3. Using absolute positioning with offsets

### C. Dimensions

| CSS Property | Figma Property | Notes |
|--------------|----------------|-------|
| `width` | `width` | Use `resize()` method to set |
| `height` | `height` | Use `resize()` method to set |
| `min-width` | `minWidth` | Only on auto-layout frames |
| `max-width` | `maxWidth` | Only on auto-layout frames |
| `min-height` | `minHeight` | Only on auto-layout frames |
| `max-height` | `maxHeight` | Only on auto-layout frames |
| `box-sizing: border-box` | `strokesIncludedInLayout` | `true` |
| `box-sizing: content-box` | `strokesIncludedInLayout` | `false` |
| `overflow: hidden` | `clipsContent` | `true` |
| `overflow: visible` | `clipsContent` | `false` |

### D. Colors and Fills

| CSS Property | Figma Property | Type |
|--------------|----------------|------|
| `background-color` | `fills` | `[{ type: 'SOLID', color: {r, g, b} }]` |
| `background: linear-gradient()` | `fills` | `[{ type: 'GRADIENT_LINEAR', ... }]` |
| `background: radial-gradient()` | `fills` | `[{ type: 'GRADIENT_RADIAL', ... }]` |
| `background-image: url()` | `fills` | `[{ type: 'IMAGE', imageHash: ... }]` |
| `opacity` | `opacity` | Number 0-1 |

#### Color Format

Figma uses RGB values from 0-1, not 0-255:

```python
# CSS: rgb(255, 128, 0) or #ff8000
# Figma:
{
    "r": 1.0,      # 255/255
    "g": 0.502,    # 128/255
    "b": 0.0       # 0/255
}
```

### E. Borders and Corners

| CSS Property | Figma Property | Notes |
|--------------|----------------|-------|
| `border-radius` | `cornerRadius` | Uniform radius |
| `border-top-left-radius` | `topLeftRadius` | Individual corner |
| `border-top-right-radius` | `topRightRadius` | Individual corner |
| `border-bottom-left-radius` | `bottomLeftRadius` | Individual corner |
| `border-bottom-right-radius` | `bottomRightRadius` | Individual corner |
| `border-width` | `strokeWeight` | Number in pixels |
| `border-color` | `strokes` | `[{ type: 'SOLID', color }]` |
| `border-style` | `dashPattern` | `[]` for solid, `[5, 5]` for dashed |

### F. Typography

Typography properties apply to `TextNode`:

| CSS Property | Figma Property | Notes |
|--------------|----------------|-------|
| `font-family` | `fontName.family` | e.g., `"Inter"` |
| `font-weight` | `fontName.style` | e.g., `"Bold"`, `"Regular"` |
| `font-size` | `fontSize` | Number in pixels |
| `line-height` | `lineHeight` | `{ value: number, unit: 'PIXELS' }` |
| `letter-spacing` | `letterSpacing` | `{ value: number, unit: 'PIXELS' }` |
| `text-align: left` | `textAlignHorizontal` | `'LEFT'` |
| `text-align: center` | `textAlignHorizontal` | `'CENTER'` |
| `text-align: right` | `textAlignHorizontal` | `'RIGHT'` |
| `text-align: justify` | `textAlignHorizontal` | `'JUSTIFIED'` |
| `vertical-align: top` | `textAlignVertical` | `'TOP'` |
| `vertical-align: middle` | `textAlignVertical` | `'CENTER'` |
| `vertical-align: bottom` | `textAlignVertical` | `'BOTTOM'` |
| `color` | `fills` | Same as background fills |
| `text-decoration: underline` | `textDecoration` | `'UNDERLINE'` |
| `text-decoration: line-through` | `textDecoration` | `'STRIKETHROUGH'` |

---

## Figma Node Types Reference

Based on [Figma Plugin API Documentation](https://developers.figma.com/docs/plugins/api/api-reference/).

### Primary Nodes for HTML Conversion

| Figma Node | HTML Equivalent | Use Case |
|------------|-----------------|----------|
| `FrameNode` | `<div>` | Containers, layout |
| `TextNode` | `<p>`, `<span>`, `<h1>`-`<h6>` | Text content |
| `RectangleNode` | `<div>` with background | Decorative elements, image containers |
| `EllipseNode` | `<div>` with `border-radius: 50%` | Circles, avatars |
| `LineNode` | `<hr>` | Horizontal/vertical lines |
| `VectorNode` | `<svg>` | SVG paths, icons |

### Node Creation Methods

```javascript
// In Figma Plugin (TypeScript)
const frame = figma.createFrame();
const text = figma.createText();
const rect = figma.createRectangle();
const ellipse = figma.createEllipse();
const line = figma.createLine();
const vector = figma.createVector();
```

---

## Python Intermediate Representation (IR)

### Data Types

```python
from dataclasses import dataclass, field
from typing import List, Optional, Literal, Union
from enum import Enum

# === Color ===
@dataclass
class Color:
    r: float  # 0-1
    g: float  # 0-1
    b: float  # 0-1
    a: float = 1.0

# === Paint Types ===
@dataclass
class SolidPaint:
    type: Literal["SOLID"] = "SOLID"
    color: Color = None
    opacity: float = 1.0

@dataclass
class GradientStop:
    position: float  # 0-1
    color: Color = None

@dataclass
class GradientPaint:
    type: Literal["GRADIENT_LINEAR", "GRADIENT_RADIAL"] = "GRADIENT_LINEAR"
    gradient_stops: List[GradientStop] = field(default_factory=list)
    opacity: float = 1.0

@dataclass
class ImagePaint:
    type: Literal["IMAGE"] = "IMAGE"
    image_hash: str = ""
    scale_mode: Literal["FILL", "FIT", "CROP", "TILE"] = "FILL"
    opacity: float = 1.0

Paint = Union[SolidPaint, GradientPaint, ImagePaint]

# === Layout Types ===
LayoutMode = Literal["NONE", "HORIZONTAL", "VERTICAL", "GRID"]
LayoutWrap = Literal["NO_WRAP", "WRAP"]
PrimaryAxisAlign = Literal["MIN", "CENTER", "MAX", "SPACE_BETWEEN"]
CounterAxisAlign = Literal["MIN", "CENTER", "MAX", "STRETCH", "BASELINE"]
LayoutAlign = Literal["MIN", "CENTER", "MAX", "STRETCH", "INHERIT"]
SizingMode = Literal["FIXED", "AUTO"]
```

### Node Classes

```python
# === Base Node ===
@dataclass
class FigmaNode:
    name: str = "Node"
    x: float = 0
    y: float = 0
    width: float = 100
    height: float = 100
    opacity: float = 1.0
    visible: bool = True

# === Frame Node ===
@dataclass
class FigmaFrame(FigmaNode):
    node_type: str = "FRAME"

    # Layout Mode
    layout_mode: LayoutMode = "NONE"
    layout_wrap: LayoutWrap = "NO_WRAP"

    # Alignment
    primary_axis_align_items: PrimaryAxisAlign = "MIN"
    counter_axis_align_items: CounterAxisAlign = "MIN"

    # Sizing
    primary_axis_sizing_mode: SizingMode = "AUTO"
    counter_axis_sizing_mode: SizingMode = "AUTO"

    # Spacing (padding)
    padding_left: float = 0
    padding_right: float = 0
    padding_top: float = 0
    padding_bottom: float = 0

    # Spacing (gap)
    item_spacing: float = 0
    counter_axis_spacing: float = 0

    # Dimensions
    min_width: Optional[float] = None
    max_width: Optional[float] = None
    min_height: Optional[float] = None
    max_height: Optional[float] = None

    # Visual
    fills: List[Paint] = field(default_factory=list)
    strokes: List[Paint] = field(default_factory=list)
    stroke_weight: float = 0

    # Corners
    corner_radius: float = 0
    top_left_radius: float = 0
    top_right_radius: float = 0
    bottom_left_radius: float = 0
    bottom_right_radius: float = 0

    # Behavior
    clips_content: bool = True
    strokes_included_in_layout: bool = True

    # Children
    children: List["FigmaNode"] = field(default_factory=list)

# === Text Node ===
@dataclass
class FigmaText(FigmaNode):
    node_type: str = "TEXT"

    # Content
    characters: str = ""

    # Font
    font_family: str = "Inter"
    font_style: str = "Regular"
    font_size: float = 16

    # Spacing
    line_height: Optional[float] = None  # None = auto
    letter_spacing: float = 0
    paragraph_spacing: float = 0

    # Alignment
    text_align_horizontal: Literal["LEFT", "CENTER", "RIGHT", "JUSTIFIED"] = "LEFT"
    text_align_vertical: Literal["TOP", "CENTER", "BOTTOM"] = "TOP"

    # Decoration
    text_decoration: Literal["NONE", "UNDERLINE", "STRIKETHROUGH"] = "NONE"

    # Visual
    fills: List[Paint] = field(default_factory=list)

# === Rectangle Node ===
@dataclass
class FigmaRectangle(FigmaNode):
    node_type: str = "RECTANGLE"

    # Visual
    fills: List[Paint] = field(default_factory=list)
    strokes: List[Paint] = field(default_factory=list)
    stroke_weight: float = 0

    # Corners
    corner_radius: float = 0
    top_left_radius: float = 0
    top_right_radius: float = 0
    bottom_left_radius: float = 0
    bottom_right_radius: float = 0

# === Ellipse Node ===
@dataclass
class FigmaEllipse(FigmaNode):
    node_type: str = "ELLIPSE"
    fills: List[Paint] = field(default_factory=list)
    strokes: List[Paint] = field(default_factory=list)
    stroke_weight: float = 0

# === Line Node ===
@dataclass
class FigmaLine(FigmaNode):
    node_type: str = "LINE"
    strokes: List[Paint] = field(default_factory=list)
    stroke_weight: float = 1
```

---

## CSS to Figma Conversion Functions

### Color Parsing

```python
import re

def parse_css_color(color_str: str) -> Color:
    """Parse CSS color string to Figma Color"""
    color_str = color_str.strip().lower()

    # Hex colors
    if color_str.startswith('#'):
        hex_color = color_str[1:]
        if len(hex_color) == 3:
            hex_color = ''.join([c*2 for c in hex_color])
        if len(hex_color) == 6:
            r = int(hex_color[0:2], 16) / 255
            g = int(hex_color[2:4], 16) / 255
            b = int(hex_color[4:6], 16) / 255
            return Color(r=r, g=g, b=b)
        if len(hex_color) == 8:
            r = int(hex_color[0:2], 16) / 255
            g = int(hex_color[2:4], 16) / 255
            b = int(hex_color[4:6], 16) / 255
            a = int(hex_color[6:8], 16) / 255
            return Color(r=r, g=g, b=b, a=a)

    # RGB/RGBA
    rgb_match = re.match(r'rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)', color_str)
    if rgb_match:
        r = int(rgb_match.group(1)) / 255
        g = int(rgb_match.group(2)) / 255
        b = int(rgb_match.group(3)) / 255
        a = float(rgb_match.group(4)) if rgb_match.group(4) else 1.0
        return Color(r=r, g=g, b=b, a=a)

    # Named colors (subset)
    named_colors = {
        'white': Color(1, 1, 1),
        'black': Color(0, 0, 0),
        'red': Color(1, 0, 0),
        'green': Color(0, 0.502, 0),
        'blue': Color(0, 0, 1),
        'transparent': Color(0, 0, 0, 0),
    }
    return named_colors.get(color_str, Color(0, 0, 0))
```

### Unit Parsing

```python
def parse_css_value(value: str) -> float:
    """Parse CSS value with units to pixels"""
    if isinstance(value, (int, float)):
        return float(value)

    value = str(value).strip().lower()

    if value.endswith('px'):
        return float(value[:-2])
    if value.endswith('pt'):
        return float(value[:-2]) * 1.333  # pt to px
    if value.endswith('em'):
        return float(value[:-2]) * 16  # assuming 16px base
    if value.endswith('rem'):
        return float(value[:-3]) * 16
    if value == '0' or value == 'auto' or value == 'none':
        return 0

    try:
        return float(value)
    except ValueError:
        return 0
```

### Layout Conversion

```python
def css_to_figma_frame(styles: dict) -> FigmaFrame:
    """Convert computed CSS styles to FigmaFrame"""
    frame = FigmaFrame()

    # Display / Layout Mode
    display = styles.get('display', 'block')
    flex_direction = styles.get('flex-direction', 'row')

    if display == 'flex':
        frame.layout_mode = 'HORIZONTAL' if flex_direction == 'row' else 'VERTICAL'
    elif display == 'grid':
        frame.layout_mode = 'GRID'
    else:
        frame.layout_mode = 'NONE'

    # Flex Wrap
    flex_wrap = styles.get('flex-wrap', 'nowrap')
    frame.layout_wrap = 'WRAP' if flex_wrap == 'wrap' else 'NO_WRAP'

    # Justify Content -> primaryAxisAlignItems
    justify_map = {
        'flex-start': 'MIN',
        'start': 'MIN',
        'center': 'CENTER',
        'flex-end': 'MAX',
        'end': 'MAX',
        'space-between': 'SPACE_BETWEEN',
    }
    justify = styles.get('justify-content', 'flex-start')
    frame.primary_axis_align_items = justify_map.get(justify, 'MIN')

    # Align Items -> counterAxisAlignItems
    align_map = {
        'flex-start': 'MIN',
        'start': 'MIN',
        'center': 'CENTER',
        'flex-end': 'MAX',
        'end': 'MAX',
        'stretch': 'STRETCH',
        'baseline': 'BASELINE',
    }
    align = styles.get('align-items', 'stretch')
    frame.counter_axis_align_items = align_map.get(align, 'STRETCH')

    # Padding
    frame.padding_top = parse_css_value(styles.get('padding-top', 0))
    frame.padding_right = parse_css_value(styles.get('padding-right', 0))
    frame.padding_bottom = parse_css_value(styles.get('padding-bottom', 0))
    frame.padding_left = parse_css_value(styles.get('padding-left', 0))

    # Gap
    gap = styles.get('gap', styles.get('row-gap', 0))
    frame.item_spacing = parse_css_value(gap)

    # Dimensions
    width = styles.get('width')
    height = styles.get('height')
    if width and width != 'auto':
        frame.width = parse_css_value(width)
    if height and height != 'auto':
        frame.height = parse_css_value(height)

    # Min/Max dimensions
    min_width = styles.get('min-width')
    max_width = styles.get('max-width')
    min_height = styles.get('min-height')
    max_height = styles.get('max-height')

    if min_width and min_width != 'none':
        frame.min_width = parse_css_value(min_width)
    if max_width and max_width != 'none':
        frame.max_width = parse_css_value(max_width)
    if min_height and min_height != 'none':
        frame.min_height = parse_css_value(min_height)
    if max_height and max_height != 'none':
        frame.max_height = parse_css_value(max_height)

    # Background
    bg_color = styles.get('background-color')
    if bg_color and bg_color != 'transparent':
        color = parse_css_color(bg_color)
        frame.fills = [SolidPaint(color=color)]

    # Border Radius
    border_radius = styles.get('border-radius', 0)
    frame.corner_radius = parse_css_value(border_radius)

    # Border
    border_width = styles.get('border-width', 0)
    border_color = styles.get('border-color')
    if border_width and border_color:
        frame.stroke_weight = parse_css_value(border_width)
        frame.strokes = [SolidPaint(color=parse_css_color(border_color))]

    # Overflow
    overflow = styles.get('overflow', 'visible')
    frame.clips_content = overflow == 'hidden'

    return frame
```

---

## V1 Scope and Limitations

### Supported Features (V1)

| Category | Supported |
|----------|-----------|
| **Layout** | Flexbox (row, column), basic positioning |
| **Spacing** | Padding, gap |
| **Colors** | Solid colors (hex, rgb, rgba, named) |
| **Borders** | Solid borders, uniform border-radius |
| **Typography** | System fonts, basic text styling |
| **Images** | PNG, JPG via URL or base64 |
| **Units** | `px` only |

### Not Supported (V1)

| Category | Not Supported |
|----------|---------------|
| **Layout** | CSS Grid (complex), `position: sticky` |
| **Spacing** | Margin (simulated only), negative values |
| **Colors** | Complex gradients, `currentColor` |
| **Borders** | Different borders per side, dashed (limited) |
| **Typography** | Custom fonts, text shadows |
| **Images** | SVG (complex), video, canvas |
| **Units** | `em`, `rem`, `%`, `vh`, `vw`, `calc()` |
| **Other** | Animations, transforms, filters, pseudo-elements |

---

## SVG and Icon Handling

### Options for SVG Conversion

1. **Rasterize to Image**
   - Convert SVG to PNG at 2x or 3x resolution
   - Use as `fills: [{ type: 'IMAGE' }]` on a rectangle
   - Pros: Simple, works with any SVG
   - Cons: Not scalable, larger file size

2. **Convert to Vector Path**
   - Parse SVG path data
   - Use `figma.createVector()` with path data
   - Pros: Scalable, editable in Figma
   - Cons: Complex SVGs may not convert well

3. **Font Icons (Font Awesome, etc.)**
   - Render the icon glyph to SVG/PNG
   - Or map icon names to pre-uploaded Figma components
   - Pros: Consistent with web
   - Cons: Requires icon library mapping

### Recommended Approach (V1)

For V1, use rasterization:

```python
def svg_to_image_fill(svg_content: str, width: int, height: int) -> ImagePaint:
    """Convert SVG to rasterized image for Figma"""
    # Use cairosvg or svglib to render to PNG
    # Upload to Figma and get image hash
    # Return ImagePaint with the hash
    pass
```

---

## MCP Server Specification

### Endpoints

```
POST /convert
  Body: { html: string, css: string }
  Response: { figma_json: FigmaNode }

POST /convert-url
  Body: { url: string }
  Response: { figma_json: FigmaNode }

GET /health
  Response: { status: "ok" }
```

### Example Request

```json
{
  "html": "<div class=\"card\"><h1>Hello</h1><p>World</p></div>",
  "css": ".card { display: flex; flex-direction: column; padding: 16px; background: #fff; border-radius: 8px; }"
}
```

### Example Response

```json
{
  "figma_json": {
    "node_type": "FRAME",
    "name": "card",
    "layout_mode": "VERTICAL",
    "padding_top": 16,
    "padding_right": 16,
    "padding_bottom": 16,
    "padding_left": 16,
    "corner_radius": 8,
    "fills": [{ "type": "SOLID", "color": { "r": 1, "g": 1, "b": 1 } }],
    "children": [
      {
        "node_type": "TEXT",
        "name": "h1",
        "characters": "Hello",
        "font_size": 32,
        "font_style": "Bold"
      },
      {
        "node_type": "TEXT",
        "name": "p",
        "characters": "World",
        "font_size": 16
      }
    ]
  }
}
```

---

## Figma Plugin Structure

```
figma-plugin/
├── manifest.json
├── code.ts          # Main plugin code
├── ui.html          # Plugin UI
└── package.json
```

### manifest.json

```json
{
  "name": "HTML to Figma",
  "id": "html-to-figma-converter",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "editorType": ["figma"]
}
```

### code.ts (simplified)

```typescript
figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-from-json') {
    const node = await createNodeFromJSON(msg.data);
    figma.currentPage.appendChild(node);
    figma.viewport.scrollAndZoomIntoView([node]);
  }
};

async function createNodeFromJSON(data: any): Promise<SceneNode> {
  if (data.node_type === 'FRAME') {
    const frame = figma.createFrame();
    frame.name = data.name || 'Frame';
    frame.resize(data.width || 100, data.height || 100);

    // Layout
    if (data.layout_mode !== 'NONE') {
      frame.layoutMode = data.layout_mode;
      frame.primaryAxisAlignItems = data.primary_axis_align_items || 'MIN';
      frame.counterAxisAlignItems = data.counter_axis_align_items || 'MIN';
      frame.itemSpacing = data.item_spacing || 0;
      frame.paddingLeft = data.padding_left || 0;
      frame.paddingRight = data.padding_right || 0;
      frame.paddingTop = data.padding_top || 0;
      frame.paddingBottom = data.padding_bottom || 0;
    }

    // Fills
    if (data.fills && data.fills.length > 0) {
      frame.fills = data.fills;
    }

    // Corner radius
    if (data.corner_radius) {
      frame.cornerRadius = data.corner_radius;
    }

    // Children
    if (data.children) {
      for (const child of data.children) {
        const childNode = await createNodeFromJSON(child);
        frame.appendChild(childNode);
      }
    }

    return frame;
  }

  if (data.node_type === 'TEXT') {
    const text = figma.createText();
    await figma.loadFontAsync({ family: data.font_family || 'Inter', style: data.font_style || 'Regular' });
    text.characters = data.characters || '';
    text.fontSize = data.font_size || 16;
    if (data.fills) text.fills = data.fills;
    return text;
  }

  // Default to rectangle
  const rect = figma.createRectangle();
  rect.resize(data.width || 100, data.height || 100);
  if (data.fills) rect.fills = data.fills;
  return rect;
}
```

---

## Project Structure

```
html-to-figma/
├── README.md
├── docs/
│   └── html-to-figma-architecture.md  (this file)
├── python/
│   ├── requirements.txt
│   ├── src/
│   │   ├── __init__.py
│   │   ├── parser/
│   │   │   ├── __init__.py
│   │   │   ├── html_parser.py
│   │   │   └── css_parser.py
│   │   ├── ir/
│   │   │   ├── __init__.py
│   │   │   ├── nodes.py
│   │   │   └── types.py
│   │   ├── converter/
│   │   │   ├── __init__.py
│   │   │   ├── css_to_figma.py
│   │   │   └── html_to_ir.py
│   │   ├── serializer/
│   │   │   ├── __init__.py
│   │   │   └── json_serializer.py
│   │   └── mcp/
│   │       ├── __init__.py
│   │       └── server.py
│   └── tests/
│       └── ...
└── figma-plugin/
    ├── manifest.json
    ├── package.json
    ├── tsconfig.json
    ├── src/
    │   ├── code.ts
    │   └── ui.html
    └── dist/
        └── ...
```

---

## Next Steps

1. **Phase 1**: Set up Python project structure and IR classes
2. **Phase 2**: Implement HTML/CSS parser
3. **Phase 3**: Implement CSS-to-Figma conversion functions
4. **Phase 4**: Create MCP server
5. **Phase 5**: Build Figma plugin
6. **Phase 6**: Integration testing with real HTML/CSS examples
7. **Phase 7**: Iterate and expand supported features

---

## References

- [Figma Plugin API Documentation](https://developers.figma.com/docs/plugins/api/api-reference/)
- [Figma Plugin API - FrameNode](https://developers.figma.com/docs/plugins/api/FrameNode/)
- [Figma Plugin API - TextNode](https://developers.figma.com/docs/plugins/api/TextNode/)
- [Figma Plugin API - Global Objects](https://developers.figma.com/docs/plugins/api/global-objects/)
- [CSS Flexbox Specification](https://www.w3.org/TR/css-flexbox-1/)
