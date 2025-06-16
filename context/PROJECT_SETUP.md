# HTML-Figma Bridge Plugin - Technical Documentation

## Overview
Figma plugin that converts HTML to Figma nodes with complete support for external CSS and **advanced CSS properties**. This document provides detailed technical information for developers.

## 🚀 Quick Start

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd space-to-figma-002

# Install dependencies
npm install

# Build the plugin
npm run build
```

### Running the Plugin
1. **In Figma:**
   - Open Figma desktop app
   - Go to Plugins > Development > Import plugin from manifest
   - Select the `manifest.json` file from this project

2. **Start MCP Server:**
```bash
# Start the MCP HTTP server
node mcp-http-server.js
```

3. **Configure Cursor:**
   - Add the following to `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "figma-html-bridge": {
      "command": "node",
      "args": ["mcp-http-server.js"],
      "cwd": "/path/to/space-to-figma-002"
    }
  }
}
```

4. **Using the Plugin:**
   - In Figma, right-click and select Plugins > HTML-Figma Bridge
   - Click "Start MCP Monitoring" in the plugin UI
   - Use Cursor to send HTML content via MCP

### Development
```bash
# Watch for changes
npm run watch

# Build for production
npm run build
```

## ✨ Technical Features

### 📦 Organization and Containers

**Main Container:**
- **Auto-grouping**: All imported HTML is automatically grouped into a main container frame
- **Vertical auto-layout**: Elements are organized vertically with automatic 20px spacing
- **No overlaps**: Elements are positioned correctly one below the other
- **Positioning**: Container automatically centers in current viewport
- **Auto-selection**: Container is selected and zoomed to view immediately
- **Perfect organization**: All HTML elements are organized without position conflicts

**Smart Layout:**
- **Native auto-layout**: Uses Figma's auto-layout system for automatic organization
- **Horizontal/vertical detection**: Automatically detects when to use horizontal vs vertical layout
- **CSS Flexbox**: Complete support for `display: flex`, `flex-direction`, `justify-content`, `align-items`
- **Inline buttons**: Buttons are organized horizontally when appropriate
- **Smart spacing**: Real CSS padding applied to each element
- **Adaptive sizes**: Containers automatically adjust to content
- **Visual hierarchy**: Respects HTML structure with correctly nested containers

### 🎯 Supported HTML Elements

**Basic:**
- `<div>`, `<section>`, `<article>`, `<main>` → Frames with vertical auto-layout
- `<p>`, `<h1>`-`<h6>`, `<span>`, `<a>`, `<label>` → Text nodes
- `<button>` → Frames with auto-layout and centered text
- `<img>` → Frames with text placeholder
- `<ul>`, `<ol>`, `<li>` → Lists with automatic bullets

**Advanced:**
- `<form>` → Form containers with optimized spacing
- `<input>`, `<textarea>`, `<select>` → Interactive form fields
- `<table>`, `<tr>`, `<td>`, `<th>`, `<thead>`, `<tbody>` → Complete tables
- `<nav>`, `<header>`, `<footer>` → Semantic elements
- `<option>` → Select options

### 🎨 Supported CSS

**External CSS:**
- **`<style>` tags** in document `<head>`
- **CSS Classes**: `.my-class { color: red; }`
- **CSS IDs**: `#my-id { background: blue; }`
- **Tag selectors**: `p { font-size: 16px; }`
- **CSS Priority**: inline > ID > class > tag

**Basic CSS Properties:**
- `background-color` → Background colors (all CSS formats)
- `color` → Text color (all CSS formats)
- `width`, `height` → Dimensions
- `padding` → Internal spacing
- `border-radius` → Rounded corners

**🎨 Supported Color Formats:**
- **Keywords**: `white`, `black`, `red`, `green`, `blue`, `yellow`, `orange`, `purple`, `pink`, `gray`, etc.
- **Hexadecimal**: `#ffffff`, `#000000`, `#ff0000`
- **Short hex**: `#fff`, `#000`, `#f00`
- **RGB**: `rgb(255, 0, 0)`, `rgb(100, 150, 200)`
- **RGBA**: `rgba(255, 0, 0, 0.5)` (with transparency)
- **Transparent**: `transparent`

**🚀 Advanced CSS Properties:**

**Layout and Positioning:**
- `margin` → External spacing (shorthand and individual)
- `margin-top`, `margin-right`, `margin-bottom`, `margin-left`
- `display: flex` → Flexbox layout
- `flex-direction` → Flex direction (row/column)
- `justify-content` → Main alignment (center, space-between, etc.)
- `align-items` → Cross alignment (center, flex-start, flex-end)

**Advanced Borders:**
- `border` → General border
- `border-top`, `border-right`, `border-bottom`, `border-left` → Individual borders
- `border-width`, `border-color`, `border-style` → Specific properties

**Visual Effects:**
- `box-shadow` → Shadows with offset, blur and color
- `opacity` → Transparency (0.0 - 1.0)
- `transform` → Transformations (rotate, scale, translate)

**Advanced Typography:**
- `font-size` → Font size
- `font-weight` → Font weight (with Inter Bold/Light fonts)
- `line-height` → Line height (px, %, unitless)
- `letter-spacing` → Character spacing
- `text-decoration` → Underline, strikethrough
- `text-transform` → Uppercase, lowercase, capitalize
- `text-align` → Alignment (left, center, right, justify)

## 📁 Project Structure

```
space-to-figma-002/
├── src/
│   ├── code.ts              # Main plugin with MCP integration
│   └── ui.html              # Plugin UI with DOMParser
├── mcp-http-server.js       # HTTP server (port 3001)
├── mcp-shared-data.json     # Real-time communication file
├── examples/
│   ├── match-details-no-vars.html  # Complex test case
│   └── simple-test.html     # Basic test case
├── context/
│   ├── PROJECT_STATUS.md    # Complete project documentation
│   └── MCP_SETUP.md         # MCP configuration guide
└── package.json
```

## 🔧 Technical Configuration

### Advanced CSS Parser
- **Flexbox mapping** → Figma auto-layout
- **Transform parsing** → Rotation and scaling
- **Box shadow** → Figma Effects API
- **Margin handling** → Plugin data for spacing
- **Font loading** → Dynamic Inter Bold/Light

### Figma Limitations
- **Individual borders**: Figma doesn't support border-top/right/bottom/left separately
- **Transform translate**: Not directly implemented
- **Scale**: Requires special approach
- **Margin**: Saved as plugin data for layout calculations

### Figma Auto-layout
- **Containers**: Vertical/horizontal auto-layout
- **Spacing**: Automatic `itemSpacing` and `padding`
- **Sizes**: Smart calculation based on content
- **Flexbox**: Direct mapping justify-content → primaryAxisAlignItems

## 🧪 Testing Examples

### Simple Test:
```html
<div style="padding: 20px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4);">
  <h2 style="color: white; text-align: center;">Welcome</h2>
  <button style="background: #fff; padding: 10px 20px; border-radius: 5px;">
    Click Me
  </button>
</div>
```

### Complex Grid Layout:
```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 20px;">
  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
    <h3>Card 1</h3>
    <p>Content here</p>
  </div>
  <div style="background: #e9ecef; padding: 15px; border-radius: 8px;">
    <h3>Card 2</h3>
    <p>More content</p>
  </div>
</div>
```

## 🔄 Future Improvements

1. **CSS Grid** support
2. **Position absolute/relative**
3. **Real background images**
4. **CSS animations** (keyframes)
5. **CSS variables** (custom properties)
6. **More transform functions**
7. **Gradient backgrounds**

## 📊 Performance & Limits

### Optimal Performance:
- **HTML size**: Up to 500KB recommended
- **Processing time**: 2-3 seconds for complex layouts
- **Polling frequency**: 2 seconds (configurable)
- **Concurrent requests**: Handles multiple simultaneous requests

### Memory Usage:
- **Plugin**: ~10-20MB
- **Server**: ~5-10MB
- **Shared file**: <1MB typically

## 🚀 Production Deployment

### For Development:
```bash
# Start server
node mcp-http-server.js

# Keep running in background
nohup node mcp-http-server.js &
```

### For CI/CD Integration:
```bash
# Health check
curl -f http://localhost:3001/status || exit 1

# Automated HTML conversion
curl -X POST http://localhost:3001/mcp-data \
  -H "Content-Type: application/json" \
  -d @your-html-file.json
```

---

*Last updated: June 13, 2025*