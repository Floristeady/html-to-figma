# HTML-to-Figma Plugin

A Figma plugin that converts HTML to visual design elements with complete CSS support and MCP integration for Cursor IDE.

## ✨ Features

- 🎨 **Complete HTML-to-Figma conversion** with full CSS styling support
- 🚀 **Real-time MCP integration** with Cursor IDE via Server-Sent Events
- 🎯 **Advanced CSS support**: flexbox, grid, gradients, shadows, transforms
- 🔄 **Auto-layout generation** with proper Figma constraints
- 📱 **Responsive design** with proper sizing and spacing
- 🛡️ **Production-ready** with comprehensive error handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Figma Desktop App
- Cursor IDE (for MCP integration)

### Installation & Setup

1. **Clone and install:**
```bash
git clone https://github.com/yourusername/html-to-figma.git
cd html-to-figma
npm install
npm run build
```

2. **Start the servers:**
```bash
node start-servers.js
```

3. **Install Figma plugin:**
   - Open Figma Desktop
   - Go to Plugins → Development → Import plugin from manifest
   - Select `manifest.json` from this project
   - Plugin should show 🟢 Connected

4. **Setup Cursor MCP (Optional):**
   Add to Cursor settings and restart:
```json
{
  "mcp.servers": {
    "figma-html-bridge": {
      "command": "node",
      "args": ["mcp-server.js"],
      "cwd": "/path/to/your/html-to-figma"
    }
  }
}
```

## 📋 Usage

### Method 1: Cursor MCP Integration (Recommended)
```javascript
// In Cursor, use the MCP tool:
import_html({
  html: "<div style='background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:40px;border-radius:20px;text-align:center'>Hello Figma!</div>",
  name: "My Design"
})
```

### Method 2: Direct HTTP API
```bash
curl -X POST http://localhost:3003/mcp-trigger -H "Content-Type: application/json" -d '{
  "type": "mcp-request",
  "function": "mcp_html_to_design_import-html", 
  "arguments": {
    "html": "<div style=\"color:blue\">Hello World</div>",
    "name": "Test Design"
  }
}'
```

### Method 3: Plugin UI
- Open the plugin in Figma
- Paste HTML in the textarea
- Click "Paste HTML" button

## 🏗️ Architecture

```
Cursor IDE → MCP Server (stdio) → SSE Server (port 3003) → Figma Plugin
```

- **MCP Server** (`mcp-server.js`): Handles commands from Cursor via stdio
- **SSE Server** (`sse-server.js`): Broadcasts to Figma plugin via Server-Sent Events  
- **Figma Plugin** (`code.js`): Receives HTML and creates visual design elements

## 📁 Project Structure

```
html-to-figma/
├── src/code.ts              # Main plugin TypeScript source
├── code.js                  # Compiled plugin code
├── ui.js                    # Plugin UI
├── manifest.json            # Plugin configuration
├── mcp-server.js           # MCP stdio server for Cursor
├── sse-server.js           # SSE server for plugin communication
├── start-servers.js        # Utility to start both servers
├── examples/               # Test HTML files
├── context/                # Project documentation
└── package.json           # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Auto-compile on file changes
- `node start-servers.js` - Start both MCP and SSE servers
- `node test-mcp-status.js` - Test server connectivity

## 🛠️ Development

```bash
# Watch for changes during development
npm run watch

# Test the plugin with examples
curl -X POST http://localhost:3003/mcp-trigger -H "Content-Type: application/json" -d @examples/mcp-form-test.html
```

## 🔧 Troubleshooting

### Plugin shows 🔴 Not Connected
```bash
# Check if servers are running
ps aux | grep "sse-server\|mcp-server"

# Restart servers
pkill -f "sse-server\|mcp-server"
node start-servers.js
```

### No visual elements appear in Figma
- Ensure plugin is loaded and shows 🟢 Connected
- Check browser console in Figma for error messages
- Verify HTML structure is valid

### MCP integration not working in Cursor
- Restart Cursor after adding MCP configuration
- Check that `mcp-server.js` path in settings is correct
- Verify servers are running with `node start-servers.js`

## 📚 Documentation

- [Project Status](./context/PROJECT_STATUS.md) - Current features and completion status
- [Development Guide](./context/DEVELOPMENT.md) - Detailed development setup
- [AI Model Instructions](./context/AI_MODEL_INSTRUCTIONS.md) - Instructions for AI assistants
- [Executive Summary](./context/EXECUTIVE_SUMMARY.md) - High-level project overview

## 🤖 AI Model Usage

This plugin is designed to work seamlessly with AI models through MCP integration:

1. **Start the servers**: `node start-servers.js`
2. **Load the plugin** in Figma and ensure 🟢 Connected status
3. **Use MCP commands** in Cursor or direct HTTP API calls
4. **HTML gets converted** to visual Figma elements automatically

### Example AI Usage:
```javascript
// Convert a card component to Figma
import_html({
  html: `<div style="background:white;padding:24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
    <h2 style="margin:0 0 16px 0;color:#333">Product Card</h2>
    <p style="color:#666;line-height:1.5">Beautiful card component with shadow and rounded corners.</p>
    <button style="background:#007bff;color:white;border:none;padding:12px 24px;border-radius:8px">Buy Now</button>
  </div>`,
  name: "Product Card Component"
})
```

## 📝 License

MIT License - see LICENSE file for details.

---

**Status**: ✅ Fully functional with 100% MCP integration  
**Last Updated**: June 18, 2025 