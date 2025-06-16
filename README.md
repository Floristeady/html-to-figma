# html-to-figma Plugin

A Figma plugin that converts HTML to Figma nodes with complete CSS support and MCP integration with Cursor.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Figma Desktop App
- Cursor IDE

### Installation
```bash
# Clone the repository
git clone [repository-url]
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

2. **Start MCP Server:**
```bash
# Start the MCP HTTP server
node mcp-http-server.js
```

3. **Using the Plugin:**
   - In Figma, right-click and select Plugins > html-to-figma
   - Click "Start MCP Monitoring" in the plugin UI
   - Use Cursor to send HTML content via MCP

## 📚 Documentation

All project documentation is available in the `context/` folder:

- [Project Status](./context/PROJECT_STATUS.md) - Current project status and features
- [Project Setup](./context/PROJECT_SETUP.md) - Detailed setup and development guide
- [MCP Setup](./context/MCP_SETUP.md) - MCP configuration and integration guide

## ✨ Key Features

- ✅ Complete HTML to Figma conversion with full CSS support
- ✅ Advanced CSS properties (flexbox, grid, shadows, etc.)
- ✅ Real-time MCP integration with Cursor
- ✅ Automatic layout and styling
- ✅ Production-ready with error handling

## 📁 Project Structure

```
html-to-figma/
├── context/              # Project documentation
├── src/                 # Source code
├── examples/            # Test examples
├── manifest.json        # Plugin configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## 🛠️ Development

```bash
# Watch for changes
npm run watch

# Build for production
npm run build
```

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
This project is a Figma plugin that converts HTML to Figma designs with full CSS styling support. It includes MCP (Model Context Protocol) integration for Cursor IDE, allowing AI models to send HTML directly to Figma.

### How to Use with AI Models

1. **Setup Requirements:**
   - Figma desktop app must be running
   - The html-to-figma plugin must be loaded in Figma
   - The MCP HTTP server must be running: `node mcp-http-server.js`
   - "Start MCP Monitoring" must be activated in the plugin UI

2. **Sending HTML to Figma:**
   There are two ways to send HTML to Figma:

   a) **Using the HTTP API:**
   ```javascript
   // Send a POST request to the MCP server
   fetch('http://localhost:3001/mcp-data', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       html: '<your-html-content>',
       name: 'Design Name'
     })
   });
   ```

   b) **Using the send-to-figma.js script:**
   ```bash
   # Edit the HTML_FILE variable in send-to-figma.js to point to your HTML file
   # Then run:
   node send-to-figma.js
   ```

3. **MCP Integration with Cursor:**
   When using Cursor IDE with MCP support:
   - The `cursor-mcp-config.json` file configures the MCP bridge
   - Use the `mcp_html_to_design_import-html` function with HTML content
   - The plugin will automatically process the request when monitoring is active

### Example Command for AI Models
```bash
# Start the MCP HTTP server in a terminal
node mcp-http-server.js

# In another terminal, send HTML to Figma (after editing the HTML file path)
node send-to-figma.js
```

### Troubleshooting
- If the plugin doesn't respond, ensure "Start MCP Monitoring" is active in the plugin UI
- Check that the MCP HTTP server is running on port 3001
- Verify the HTML content is valid and properly formatted
- Look for errors in the browser console in Figma's developer tools

---

*Last updated: June 13, 2025* 