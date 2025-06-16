# Instructions for AI Models: HTML-to-Figma Bridge

This document provides detailed instructions for AI models to correctly use the HTML-to-Figma Bridge plugin. These instructions are designed to be clear and direct, allowing any AI model to effectively send HTML to Figma.

## System Overview

This project is a Figma plugin that converts HTML code into Figma designs with full CSS support. It includes MCP (Model Context Protocol) integration for Cursor IDE, allowing AI models to send HTML directly to Figma.

The system architecture consists of:

1. **Figma Plugin**: Processes HTML and creates Figma nodes
2. **MCP HTTP Server**: Acts as a bridge between external clients and the plugin
3. **MCP Bridge**: Integrates with Cursor IDE through the MCP protocol
4. **Utility Scripts**: Facilitate sending HTML to Figma

## Prerequisites

For an AI model to send HTML to Figma, the following requirements must be met:

1. The Figma desktop application must be running
2. The HTML-Figma Bridge plugin must be loaded in Figma
3. The MCP HTTP server must be running: `node mcp-http-server.js`
4. "Start MCP Monitoring" must be activated in the plugin interface

## Methods for Sending HTML to Figma

### 1. Using the HTTP API

This is the most direct and recommended method for AI models. The model should generate a command that sends a POST request to the MCP server:

```javascript
fetch('http://localhost:3001/mcp-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    html: '<div style="background-color: blue; width: 200px; height: 200px;"><p style="color: white;">Hello Figma!</p></div>',
    name: 'AI Generated Design'
  })
});
```

To execute this from the command line, the model can suggest:

```bash
curl -X POST http://localhost:3001/mcp-data \
  -H "Content-Type: application/json" \
  -d '{"html":"<div style=\"background-color: blue; width: 200px; height: 200px;\"><p style=\"color: white;\">Hello Figma!</p></div>", "name":"AI Generated Design"}'
```

### 2. Using the send-to-figma.js Script

The model can suggest modifying the `send-to-figma.js` script to point to a specific HTML file:

```javascript
// Modify this line in send-to-figma.js
const HTML_FILE = path.join(__dirname, 'path/to/your/file.html');
```

And then run:

```bash
node send-to-figma.js
```

### 3. Using the MCP Integration with Cursor

When using Cursor IDE with MCP support, the model should:

1. Ensure that the `cursor-mcp-config.json` file is correctly configured
2. Use the `mcp_html_to_design_import-html` function with HTML content
3. The plugin will automatically process the request when monitoring is active

## Recommended Workflow for AI Models

1. **Verify system status**:
   ```bash
   curl http://localhost:3001/health
   ```

2. **Generate HTML**: Create HTML code based on user requirements

3. **Send HTML to Figma**: Use one of the methods described above

4. **Inform the user**: Indicate that the HTML has been sent and they should check Figma

## Example Commands for Different Scenarios

### Example 1: Send a simple design

```bash
curl -X POST http://localhost:3001/mcp-data \
  -H "Content-Type: application/json" \
  -d '{"html":"<div style=\"display: flex; padding: 20px; background-color: #f5f5f5;\"><div style=\"background-color: #2D9CDB; color: white; padding: 16px; border-radius: 8px;\">Button</div></div>", "name":"Simple Button"}'
```

### Example 2: Send a form

```bash
curl -X POST http://localhost:3001/mcp-data \
  -H "Content-Type: application/json" \
  -d '{"html":"<form style=\"padding: 24px; font-family: Arial; max-width: 400px;\"><h2 style=\"margin-bottom: 16px;\">Contact Form</h2><div style=\"margin-bottom: 16px;\"><label style=\"display: block; margin-bottom: 8px;\">Name</label><input style=\"width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;\" type=\"text\"></div><div style=\"margin-bottom: 16px;\"><label style=\"display: block; margin-bottom: 8px;\">Email</label><input style=\"width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;\" type=\"email\"></div><button style=\"background-color: #6FCF97; color: white; border: none; padding: 10px 16px; border-radius: 4px; cursor: pointer;\">Submit</button></form>", "name":"Contact Form"}'
```

### Example 3: Send a product card

```bash
curl -X POST http://localhost:3001/mcp-data \
  -H "Content-Type: application/json" \
  -d '{"html":"<div style=\"font-family: Arial; max-width: 300px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);\"><div style=\"height: 200px; background-color: #E0E0E0; display: flex; align-items: center; justify-content: center;\"><span style=\"color: #888;\">Product Image</span></div><div style=\"padding: 16px;\"><h3 style=\"margin-top: 0; margin-bottom: 8px;\">Product Title</h3><p style=\"color: #666; margin-bottom: 16px;\">Product description goes here. This is a sample product card.</p><div style=\"display: flex; justify-content: space-between; align-items: center;\"><span style=\"font-weight: bold;\">$49.99</span><button style=\"background-color: #9B51E0; color: white; border: none; padding: 8px 16px; border-radius: 4px;\">Add to Cart</button></div></div></div>", "name":"Product Card"}'
```

## Troubleshooting

If the plugin doesn't respond, the model should suggest that the user check:

1. That "Start MCP Monitoring" is active in the plugin interface
2. That the MCP HTTP server is running on port 3001
3. That the HTML content is valid and properly formatted
4. Look for errors in the browser console in Figma's developer tools

## Useful Commands for Verification

```bash
# Check if the MCP server is running
curl http://localhost:3001/health

# Check current MCP data
curl http://localhost:3001/mcp-data

# Clear processed MCP data
curl -X DELETE http://localhost:3001/mcp-data
```

---

These instructions should allow any AI model to correctly use the HTML-to-Figma Bridge plugin to effectively send HTML to Figma. 