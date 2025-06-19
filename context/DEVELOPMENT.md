# Development Guide

**Last Updated**: June 18, 2025

## 🚀 Development Setup

### Prerequisites
- Node.js v14+ 
- Figma Desktop App
- Cursor IDE (for MCP testing)
- Basic TypeScript knowledge

### Quick Setup
```bash
# Clone and install
git clone <repository-url>
cd html-to-figma
npm install

# Start development servers
node start-servers.js

# In another terminal, watch for changes
npm run watch
```

## 🏗️ Project Architecture

### Core Components

1. **MCP Server** (`mcp-server.js`)
   - Handles stdio communication with Cursor IDE
   - Registers the `mcp_html_to_design_import-html` tool
   - Processes HTML from Cursor commands

2. **SSE Server** (`sse-server.js`) 
   - HTTP server broadcasting via Server-Sent Events
   - Runs on port 3003
   - Relays messages from MCP server to Figma plugin

3. **Figma Plugin**
   - **UI** (`ui.js`): Interface with SSE connection
   - **Main** (`src/code.ts` → `code.js`): Core logic and Figma API

### Message Flow
```
Cursor → MCP Server → SSE Server → Plugin UI → Plugin Main → Figma Canvas
```

## 📁 File Structure

```
html-to-figma/
├── src/
│   └── code.ts              # Main plugin TypeScript source
├── code.js                  # Compiled plugin (auto-generated)
├── ui.js                    # Plugin UI with SSE connection
├── mcp-server.js           # MCP stdio server
├── sse-server.js           # SSE broadcast server  
├── start-servers.js        # Start both servers
├── test-mcp-status.js      # Test server connectivity
├── manifest.json           # Plugin configuration
├── examples/               # Test HTML files
│   ├── mcp-form-test.html
│   ├── mcp-badges-test.html
│   └── complex-css-test.html
└── context/                # Documentation
```

## 🔧 Development Commands

### Building
```bash
# Compile TypeScript
npm run build

# Watch for changes (recommended for development)
npm run watch
```

### Server Management
```bash
# Start both servers
node start-servers.js

# Start individually
node mcp-server.js          # MCP server (stdio)
node sse-server.js          # SSE server (HTTP)

# Test connectivity
node test-mcp-status.js
```

### Testing
```bash
# Test with example files
curl -X POST http://localhost:3003/mcp-trigger \
  -H "Content-Type: application/json" \
  -d @examples/mcp-form-test.html

# Quick HTML test
curl -X POST http://localhost:3003/mcp-trigger \
  -H "Content-Type: application/json" \
  -d '{
    "type": "mcp-request",
    "function": "mcp_html_to_design_import-html",
    "arguments": {
      "html": "<div style=\"color:blue\">Test</div>",
      "name": "Development Test"
    }
  }'
```

## 🔍 Key Development Areas

### 1. HTML Parsing (`src/code.ts`)

Key function: `simpleParseHTML(htmlString)`
- Converts HTML string to structured data
- Handles CSS parsing and inheritance
- Returns array of element objects

```typescript
interface ElementStructure {
  tagName: string;
  textContent?: string;
  styles: Record<string, string>;
  children: ElementStructure[];
}
```

### 2. Figma Node Creation (`src/code.ts`)

Key function: `createFigmaNodesFromStructure(structure, parentFrame)`
- Creates Figma frames, text nodes, and components
- Applies CSS styles to Figma properties
- Handles layout (flexbox, grid, positioning)

### 3. CSS Style Application (`src/code.ts`)

Key function: `applyStyles(node, styles)`
- Maps CSS properties to Figma properties
- Handles colors, fonts, sizes, spacing
- Supports gradients, shadows, borders

### 4. MCP Request Handling (`src/code.ts`)

Key function: `handleSSEMCPRequest(data)`
- Processes incoming MCP requests
- Calls HTML parsing
- Triggers Figma node creation

## 🐛 Debugging

### Plugin Debugging
1. Open Figma
2. Right-click → Plugins → Development → Open Console
3. Look for logs starting with `[MAIN HANDLER]`, `[SSE]`, `[NODE CREATION]`

### Server Debugging
```bash
# Check server processes
ps aux | grep "mcp-server\|sse-server"

# View server logs
node start-servers.js  # Shows both server outputs

# Test SSE connection
curl http://localhost:3003/health
```

### Common Issues

**Plugin shows 🔴 Not Connected**
```bash
# Restart servers
pkill -f "sse-server\|mcp-server"
node start-servers.js
```

**TypeScript changes not reflected**
```bash
# Ensure compilation
npm run build

# Or use watch mode
npm run watch
```

**No visual elements in Figma**
- Check browser console for errors
- Verify HTML is valid
- Ensure plugin is loaded and connected

## 🔧 Development Workflow

### Adding New Features

1. **Modify TypeScript source** (`src/code.ts`)
2. **Compile** with `npm run build` or `npm run watch`
3. **Test** with example HTML files
4. **Debug** using plugin console logs
5. **Iterate** until feature works correctly

### CSS Property Support

To add new CSS property support:

1. **Update `applyStyles()` function** in `src/code.ts`
2. **Add property mapping** to Figma equivalent
3. **Test** with example HTML
4. **Handle edge cases** and fallbacks

Example:
```typescript
// In applyStyles function
case 'border-radius':
  if (node.type === 'FRAME') {
    node.cornerRadius = parseFloat(value) || 0;
  }
  break;
```

### Testing New HTML Structures

1. **Create test file** in `examples/` directory
2. **Send via curl** or MCP tool
3. **Verify output** in Figma
4. **Check logs** for any issues

## 📊 Performance Considerations

### Optimization Tips
- Use `npm run watch` during development
- Test with small HTML snippets first
- Monitor server memory usage
- Use browser dev tools for plugin debugging

### Memory Management
- Large HTML documents may require chunking
- Clean up Figma nodes if errors occur
- Monitor SSE connection count

## 🧪 Testing Strategy

### Unit Testing
- HTML parsing functions
- CSS property conversions
- Style inheritance logic

### Integration Testing  
- Full MCP → Figma pipeline
- Server communication
- Plugin UI interactions

### Manual Testing
- Various HTML structures
- Complex CSS properties
- Error conditions and edge cases

## 📝 Code Style

### TypeScript Guidelines
- Use strict types when possible
- Add JSDoc comments for functions
- Handle errors gracefully
- Use descriptive variable names

### Logging Standards
```typescript
console.log('[COMPONENT] Action: details');
// Examples:
console.log('[MCP] Processing HTML import:', name);
console.log('[SSE] Connection established');
console.log('[NODE CREATION] Created frame:', frameName);
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Plugin Distribution
1. Ensure `manifest.json` is configured
2. Include compiled `code.js` (not `src/code.ts`)
3. Test in clean Figma environment
4. Package plugin files for distribution

---

**Development Status**: ✅ Fully operational development environment  
**Next Steps**: Feature development and testing 