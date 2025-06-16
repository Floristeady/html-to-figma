# html-to-figma Plugin

A Figma plugin that converts HTML to Figma nodes with complete CSS support and MCP integration with Cursor.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Figma Desktop App
- Cursor IDE (optional for MCP integration)

### Installation
```bash
# Clone the repository
git clone https://github.com/Floristeady/html-to-figma.git
cd html-to-figma

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

2. **Start HTTP Server:**
```bash
# Start the HTTP server (for external tool integration)
node mcp-http-server.js
```

3. **Using the Plugin:**
   - In Figma, right-click and select Plugins > html-to-figma
   - Click "Start MCP Monitoring" in the plugin UI
   - Send HTML using scripts or Cursor integration

## 🎯 Two Ways to Send HTML to Figma

### Method 1: Direct HTTP API (Recommended)
```bash
# Send HTML directly via command line
node ai-to-figma.js "<div style='color:blue'>Hello World</div>" "My Design"

# Or use with file content
node ai-to-figma.js "$(cat examples/complex-css-test.html)" "Complex Design"
```

### Method 2: Cursor MCP Integration (Advanced)
- Configure Cursor with MCP settings
- Use `@figma-html-bridge` commands in Cursor
- Requires proper MCP bridge setup

## 📋 Available Commands

### **Main Scripts:**
- `node ai-to-figma.js "<html>" "Design Name"` - Send HTML directly to Figma
- `node mcp-http-server.js` - Start HTTP server for external integration
- `node convert-html-for-figma.js file.html` - Pre-process HTML for better Figma compatibility

### **Development:**
- `npm run build` - Compile TypeScript
- `npm run watch` - Auto-compile on changes

### **Testing:**
```bash
# Test server health
curl http://localhost:3001/health

# Check for pending data
curl http://localhost:3001/mcp-data

# Clear processed data
curl -X DELETE http://localhost:3001/mcp-data
```

## 🔧 Plugin Features

### **UI Buttons:**
1. **"Convert to Figma"** - Direct HTML input via textarea
2. **"Test HTTP Server"** - Verify localhost:3001 connectivity
3. **"Start MCP Monitoring"** - Enable real-time external HTML processing
4. **"Process HTML via MCP"** - Manual trigger for pending requests

## ✨ Key Features

- ✅ Complete HTML to Figma conversion with full CSS support
- ✅ Advanced CSS properties (flexbox, grid, shadows, gradients)
- ✅ Real-time HTTP API integration
- ✅ Cursor MCP integration (beta)
- ✅ Automatic layout and styling with Figma auto-layout
- ✅ Production-ready with comprehensive error handling
- ✅ CSS preprocessing for better Figma compatibility

## 🏗️ System Architecture

### **HTTP System (Primary - Fully Working):**
```
External Tools → HTTP POST :3001 → mcp-http-server.js → mcp-shared-data.json → Plugin
```

### **MCP Bridge System (Secondary - Beta):**
```
Cursor → MCP Protocol → mcp-bridge.js → mcp-shared-data.json → Plugin
```

## 📁 Project Structure

```
html-to-figma/
├── context/              # Project documentation
│   ├── PROJECT_STATUS.md   # Current status and features
│   ├── MCP_SETUP.md        # MCP configuration guide
│   ├── MCP_MIGRATION_PLAN.md # Future MCP improvements
│   └── EMBEDDED_SERVER_PLAN.md # Server embedding strategy
├── src/
│   └── code.ts           # Main plugin source (TypeScript)
├── examples/             # Test HTML files
├── ai-to-figma.js       # Main script for sending HTML
├── convert-html-for-figma.js # HTML preprocessor
├── mcp-http-server.js   # HTTP server for external integration
├── mcp-bridge.js        # MCP bridge for Cursor (beta)
├── manifest.json        # Plugin configuration
└── package.json         # Dependencies and scripts
```

## 🛠️ Development

```bash
# Watch for changes during development
npm run watch

# Build for production
npm run build

# Test with examples
node ai-to-figma.js "$(cat examples/complex-css-test.html)" "Test Design"
```

## 📚 Documentation

All project documentation is available in the `context/` folder:

- [Project Status](./context/PROJECT_STATUS.md) - Current project status and features
- [Project Setup](./context/PROJECT_SETUP.md) - Detailed setup and development guide
- [MCP Setup](./context/MCP_SETUP.md) - MCP configuration and integration guide
- [MCP Migration Plan](./context/MCP_MIGRATION_PLAN.md) - Future MCP improvements
- [Embedded Server Plan](./context/EMBEDDED_SERVER_PLAN.md) - Server embedding strategy

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤖 Instructions for AI Models

### Understanding the Project
This project is a Figma plugin that converts HTML to Figma designs with full CSS styling support. It includes HTTP API integration and experimental MCP (Model Context Protocol) support for Cursor IDE.

### How to Use with AI Models

1. **Setup Requirements:**
   - Figma desktop app must be running
   - The html-to-figma plugin must be loaded in Figma
   - The HTTP server must be running: `node mcp-http-server.js`
   - "Start MCP Monitoring" must be activated in the plugin UI

2. **Sending HTML to Figma (Recommended Method):**
   ```bash
   # Use the ai-to-figma.js script
   node ai-to-figma.js "<div style='padding:20px; background:#f0f0f0;'><h2>Hello World</h2></div>" "My Design"
   ```

3. **HTTP API Integration:**
   ```javascript
   // Send a POST request to the HTTP server
   fetch('http://localhost:3001/mcp-data', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       html: '<your-html-content>',
       name: 'Design Name'
     })
   });
   ```

4. **Cursor MCP Integration (Beta):**
   - Configure Cursor with MCP settings in `~/.cursor/mcp.json`
   - Use `@figma-html-bridge` commands (if available)
   - Requires MCP bridge setup with `node mcp-bridge.js`

### Example Usage
```bash
# 1. Start HTTP server
node mcp-http-server.js

# 2. In Figma, load plugin and activate "Start MCP Monitoring"

# 3. Send HTML
node ai-to-figma.js "<form style='padding:24px; font-family:Arial; max-width:400px;'><h2>Contact Form</h2><input style='width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;' type='text' placeholder='Name'><button style='background:#6FCF97; color:white; border:none; padding:10px 16px; border-radius:4px;'>Submit</button></form>" "Contact Form"
```

### Troubleshooting
- If the plugin doesn't respond, ensure "Start MCP Monitoring" is active
- Use "Test HTTP Server" button in plugin to verify connectivity
- Check that the HTTP server is running on port 3001
- Verify the HTML content is valid and properly formatted
- Look for errors in the browser console in Figma's developer tools

### Useful Commands for Verification
```bash
# Check if the HTTP server is running
curl http://localhost:3001/health

# Check current data
curl http://localhost:3001/mcp-data

# Clear processed data
curl -X DELETE http://localhost:3001/mcp-data
```

---

*Last updated: June 16, 2025* 