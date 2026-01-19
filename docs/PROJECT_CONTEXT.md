# HTML-to-Figma Bridge Plugin - Project Context

## 🎯 **Project Overview**
A Figma plugin that converts HTML content (with CSS styling) into native Figma nodes using Model Control Protocol (MCP). The goal is to enable seamless translation from web markup to editable Figma designs.

## 🏗️ **Technical Architecture**

### Core Files
- `manifest.json` - Figma plugin configuration
- `package.json` - Dependencies and build scripts  
- `tsconfig.json` - TypeScript compilation settings
- `src/code.ts` - Main plugin logic (compiles to `code.js`) - **UPDATED 06/24/2025**

### Build Process
- **Direct TypeScript compilation** to `code.js` in root with **optimized logging**
- **UI-based HTML parsing** using native `DOMParser` in plugin UI
- **JSON structure transfer** from UI to main plugin thread with **enhanced debugging**

## ✅ **Implemented Features**

### HTML Elements Support
- **Containers**: `<div>`, `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`, `<main>`
- **Forms**: `<form>`, `<input>`, `<textarea>`, `<select>`, `<option>`
- **Tables**: `<table>`, `<tr>`, `<td>`, `<th>`, `<thead>`, `<tbody>`
- **Lists**: `<ul>`, `<ol>`, `<li>`
- **Text**: `<p>`, `<h1>`-`<h6>`, `<span>`, `<a>`, `<label>`
- **Media**: `<img>` (placeholder), `<button>`

### CSS Properties Support

**🎨 Colors & Backgrounds:**
- `background-color`, `color` (hex, rgb, rgba, keywords)
- **Linear gradients**: `linear-gradient()` (partially supported)
- **Full transparency**: rgba() with alpha channel

**📐 Dimensions & Spacing:**
- `width`, `height`, `min-height`, `min-width` with **optimized calculations**
- `padding` (shorthand and individual: `padding-top`, `padding-right`, etc.)
- `margin` (shorthand and individual: `margin-top`, `margin-right`, etc.)
- `gap` for flexbox spacing

**🎯 Advanced Layout:**
- **Complete flexbox**: `display: flex`, `flex-direction`, `justify-content`, `align-items`
- **Basic CSS Grid**: `display: grid`, `grid-template-columns`
- **Figma auto-layout**: Direct CSS flexbox mapping
- **PERFECT text-align inheritance**: `text-align: center` propagates flawlessly to children

**🖼️ Borders & Effects:**
- `border`, `border-radius` (including circles with 50%)
- `box-shadow` with offset, blur, spread, and color
- `opacity` and transparency
- `transform` (rotation and scaling)

**✏️ Advanced Typography:**
- `font-size`, `font-weight` (with Inter Bold/Light fonts)
- `line-height` (px, %, unitless)
- `letter-spacing`, `text-decoration`
- `text-transform`, `text-align` with **perfect inheritance**

### Advanced Features
- **ENHANCED CSS Inheritance**: Parent styles cascade perfectly to children (color, fonts, text-align)
- **External CSS**: `<style>` tags in `<head>` are fully parsed
- **CSS Selectors**: Support for classes (`.class`), IDs (`#id`), tag selectors
- **CSS Priority**: Inline > ID > class > tag
- **Nested selectors**: `.parent .child` and `.parent h2`
- **Auto-layout Integration**: CSS flexbox maps to Figma auto-layout
- **Responsive Heights**: Elements auto-size based on content

## 🔧 **Latest Critical Fixes & Improvements (June 24, 2025)**

### Text Alignment Revolution
- **✅ Perfect CSS Inheritance**: `text-align: center` now inherits flawlessly from parent to child
- **✅ Enhanced getElementStyles()**: Improved CSS parsing with parent style traversal
- **✅ Span Element Fixes**: Spans correctly inherit centering from parent containers
- **✅ Text Alignment Debugging**: Detailed logging for alignment inheritance process

### Width & Sizing Optimization
- **✅ Optimized Text Calculations**: 
  - `char_width`: 12 → 8 pixels (more accurate)
  - `min_width_factor`: 1.5 → 1.2 (less padding)
  - Width range: 200-800px → 100-600px (better proportions)
- **✅ Content-Based Sizing**: Text fields size based on actual content length
- **✅ Heading Protection**: h1-h6 elements use `textAutoResize = 'WIDTH_AND_HEIGHT'` to prevent truncation

### Code Quality & Production Readiness
- **✅ Debug Log Management**: 
  - `debugLog()` function for conditional logging
  - Only logs when advanced settings enabled
  - Clean production code with minimal console output
- **✅ Enhanced Error Handling**: Better try-catch coverage in critical Figma API operations
- **✅ TypeScript Optimization**: Improved compilation process and build efficiency

### Layout System Enhancements
- **Direct CSS-to-Figma mapping**: `display: flex` = `HORIZONTAL`, `flex-direction: column` = `VERTICAL`
- **Smart layout detection**: Automatic container type recognition
- **Fixed horizontal layouts**: Sidebar-content structures work perfectly
- **Enhanced grid support**: Better `display: grid` handling with automatic columns

### Height & Spacing Improvements  
- **Increased minimum heights**: 50px → 80px for main containers
- **Enhanced padding**: 20px → 30px default padding where appropriate
- **Better button sizing**: 40px → 50px height, 12px → 20px padding
- **Improved table rows**: 45px → 55px height
- **Typography scaling**: Larger heading sizes, better line-height

## 🎨 **Color & Visual System**

### Color Parser (`hexToRgb` / `hexToRgba`)
- **Hex**: `#ffffff`, `#fff`, `#f0f0f0`
- **RGB/RGBA**: `rgb(255,0,0)`, `rgba(255,0,0,0.5)`
- **Keywords**: `white`, `black`, `red`, `blue`, `green`, `yellow`, `orange`, `purple`, `pink`, `gray`
- **Transparency**: Full alpha channel support

### Border System (`extractBorderColor`)
- Extracts color from CSS `border` property
- Format: `border: 1px solid #ddd`
- Fallback to light gray if no color found
- Support for circular `border-radius` (50%)

### Transform System (`parseTransform`)
- **Rotation**: `rotate(45deg)` → `frame.rotation`
- **Scaling**: `scale(1.2)` → proportional resizing
- **Combined transforms**: Multiple transforms in one declaration

### Box Shadow System (`parseBoxShadow`)
- **Offset**: x, y positioning
- **Blur**: blur radius
- **Spread**: shadow expansion
- **Color**: with RGBA support
- **Figma Effects API mapping**

## 🚨 **Resolved Issues & Current Status**

### Recently Fixed (June 2025)
- ✅ **Text centering inheritance**: Spans inherit `text-align: center` from parent containers
- ✅ **Excessive text field widths**: Text elements now size appropriately to content
- ✅ **Heading truncation**: h1-h6 elements auto-resize to prevent cutting
- ✅ **Production logging**: Clean code with conditional debug logs
- ✅ **CSS parsing gaps**: Enhanced parent-child style inheritance

### Minor Issues Remaining
- **Complex gradients**: Some complex gradients may fail
- **Advanced positioning**: Absolute/relative positioning not fully supported
- **Font loading**: Only Inter font family available
- **Image handling**: Placeholder only, no actual image loading

### Figma API Constraints
- **Individual borders**: Figma doesn't support border-top/right/bottom/left separately
- **Transform translate**: Not directly implemented in Figma
- **Complex animations**: No support for CSS animations
- **Grid gaps**: Limitations in complex grid spacing

## 📋 **Test Files & Examples**

### Current Test Suite
- `dashboard-stats-test.html` - Complex dashboard layout with perfect centering
- `test-text-centering-fix.html` - Text alignment test cases
- `mcp-form-test.html` - Form elements with optimized sizing
- `mcp-grid-test.html` - CSS Grid layout testing
- Various other test files for specific CSS features

### Test Results Status (Updated June 24, 2025)
- ✅ **Text centering works perfectly**: All span elements inherit center alignment
- ✅ **Optimized text widths**: No more excessively wide text fields
- ✅ **Heading auto-sizing**: h1-h6 elements prevent truncation
- ✅ **Horizontal/Vertical layouts work**: Sidebar-content structure correct
- ✅ **Styling applied**: Colors, padding, text formatting
- ✅ **CSS inheritance working**: Text-align, colors propagate perfectly
- ✅ **Box-shadow rendering**: Shadows applied correctly
- ✅ **Flexbox mapping**: CSS flexbox → Figma auto-layout

## 🎯 **Next Priority Actions**

### Short-term (Enhancement)  
1. **CSS Variables support** - `var(--color-primary)`
2. **Better font handling** - Multiple font families
3. **Image loading** - Real image import from URLs
4. **Advanced CSS Grid** - Beyond basic flexbox
5. **Position absolute/relative** - Advanced positioning

### Long-term (Future)
1. **CSS animations** - Figma Smart Animate compatibility
2. **Responsive breakpoints** - Multiple device sizes
3. **Component extraction** - Automatic Figma component creation
4. **Advanced selectors** - Pseudo-classes, combinators
5. **CSS Custom Properties** - Complete CSS variables

## 💡 **Key Learning & Best Practices**

### Figma API Constraints
- `minHeight` only works on auto-layout nodes
- Set `layoutMode` BEFORE sizing properties
- `primaryAxisSizingMode: 'AUTO'` lets content determine size
- Text nodes need `textAutoResize: 'WIDTH_AND_HEIGHT'` in auto-layout for headings

### CSS-to-Figma Mapping
- CSS `display: flex` → Figma `layoutMode: 'HORIZONTAL'`
- CSS `flex-direction: column` → Figma `layoutMode: 'VERTICAL'`  
- CSS `gap` → Figma `itemSpacing`
- CSS `justify-content: center` → Figma `primaryAxisAlignItems: 'CENTER'`
- CSS `text-align: center` → **Perfect propagation to child nodes**

### Error Prevention & Code Quality
- ✅ **Always wrap** Figma API calls in try-catch
- ✅ **Validate CSS values** before applying
- ✅ **Set layout properties** in correct order
- ✅ **Use conditional logging**: debugLog() for development, minimal for production
- ✅ **Test with edge cases**: Complex layouts and inheritance scenarios

## 🎯 **Success Metrics**
- ✅ **Basic HTML structure** correctly translated
- ✅ **Flexbox layouts** working horizontally and vertically  
- ✅ **Perfect text alignment**: center inheritance works flawlessly
- ✅ **Optimized text sizing**: Appropriate widths based on content
- ✅ **Color system** complete with RGBA support
- ✅ **Box shadows** rendering correctly
- ✅ **Border radius** including circular borders
- ✅ **Transform effects** basic rotation and scaling
- ✅ **CSS selectors** classes, nested, and element selectors
- ✅ **Production-ready code** with clean, optimized logging

**Current Status**: All core functionality operational with recent critical improvements. Perfect text alignment and optimized sizing. Production-ready code quality.

---

**Last Updated**: Text alignment fixes, width optimization, and debug log cleanup - June 24, 2025
**Production Status**: ✅ Ready for use with enhanced reliability
**Performance**: ✅ Optimized with perfect text handling 