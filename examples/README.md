# Examples - HTML Test Files

This folder contains example HTML files to test different aspects of the HTML-to-Figma plugin.

## 📁 Example Files

### 🎨 **complex-css-test.html** (6.1KB)
- **Purpose**: Test complex CSS with gradients, shadows, flexbox and advanced layouts
- **Features**: Dashboard with sidebar, cards, forms, tables
- **Ideal for**: Testing complex conversions and advanced layouts

### 🏷️ **mcp-badges-test.html** (3.1KB)
- **Purpose**: Test badge elements and labels with different styles
- **Features**: Badges of varied colors, sizes and shapes
- **Ideal for**: Testing small and decorative elements

### 📝 **mcp-form-test.html** (2.5KB)
- **Purpose**: Test forms with different input types
- **Features**: Inputs, selects, textareas, labels, visual validation
- **Ideal for**: Testing form elements and interaction

### 🏗️ **mcp-grid-test.html** (2.7KB)
- **Purpose**: Test CSS grid layouts
- **Features**: Responsive grids, different column sizes
- **Ideal for**: Testing grid layouts and element distribution

### 📊 **mcp-table-test.html** (1.6KB)
- **Purpose**: Test tables with styles and structure
- **Features**: Tables with headers, borders, zebra striping
- **Ideal for**: Testing tabular elements and structured data

## 🚀 How to Use the Examples

### Method 1: From Cursor (MCP)
```bash
# Use the MCP tool with any example
@figma-html-bridge mcp_html_to_design_import-html examples/complex-css-test.html
```

### Method 2: From Terminal
```bash
# Send a specific example
node -e "
const fs = require('fs');
const html = fs.readFileSync('examples/mcp-form-test.html', 'utf8');
console.log('Sending form example...');
// Here would go the logic to send to Figma
"
```

### Method 3: Copy and Paste
1. Open any example file
2. Copy the HTML content
3. Paste it in the Figma plugin
4. Press "Convert to Figma"

## 🎯 Recommended Use Cases

- **Debugging**: Use `mcp-table-test.html` for quick tests
- **Complex Layouts**: Use `complex-css-test.html` to test the CSS engine
- **Specific Elements**: Use `mcp-badges-test.html` for small elements
- **Forms**: Use `mcp-form-test.html` for inputs and controls
- **Grids**: Use `mcp-grid-test.html` for grid layouts

## 📝 Notes

- All files use inline CSS or `<style>` tags
- Examples are optimized for Figma conversion
- Each file is independent and can be used separately
- Files are designed to test different aspects of the conversion engine 