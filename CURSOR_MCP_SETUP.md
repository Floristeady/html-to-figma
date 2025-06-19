# Cursor MCP Setup for HTML-to-Figma Plugin

## Quick Setup

1. **Start the MCP Bridge Server**
   ```bash
   cd /Users/florosenfeld/Sites/figma-plugins/html-to-figma
   node mcp-bridge.js
   ```

2. **Configure Cursor Settings**
   
   Open Cursor settings (Cmd+,) and search for "mcp" or go to:
   `Code > Settings > Extensions > MCP`

   Add this configuration to your MCP settings:

   ```json
   {
     "figma-html-bridge": {
       "command": "node",
       "args": ["mcp-bridge.js"],
       "cwd": "/Users/florosenfeld/Sites/figma-plugins/html-to-figma"
     }
   }
   ```

3. **Enable MCP Bridge in Figma Plugin**
   - Open Figma
   - Load the HTML-to-Figma plugin
   - Go to "MCP Bridge" tab
   - Turn ON the "Enable MCP Bridge" switch
   - Verify both indicators show green: 🟢 SSE Connected, 🟢 MCP Ready

## Testing the Connection

1. **In Cursor**, try using this MCP tool:
   ```
   Use the mcp_html_to_design_import-html tool to send this HTML to Figma:
   
   <div style="padding: 20px; background: #f0f0f0; border-radius: 8px;">
     <h1 style="color: #333; margin-bottom: 10px;">Test from Cursor</h1>
     <p style="color: #666;">This HTML was sent from Cursor via MCP!</p>
   </div>
   ```

2. **In Figma Plugin**:
   - You should see the status indicators update
   - The HTML should appear and be ready to convert
   - Click "Convert to Figma" to create the design

## Troubleshooting

### Port Conflicts
If you see "Port 3001 is already in use":
```bash
# Kill any processes using port 3001
lsof -ti:3001 | xargs kill -9

# Then restart the bridge
node mcp-bridge.js
```

### Connection Issues
1. Make sure the bridge server is running and shows:
   ```
   [SSE] Server running on http://localhost:3001
   ```

2. Check the plugin shows:
   - 🟢 SSE Connected
   - 🟢 MCP Ready for Tools

3. Test the connection with:
   ```bash
   curl http://localhost:3001/mcp-status
   ```

### Cursor MCP Not Working
1. Restart Cursor after adding MCP configuration
2. Check Cursor's MCP settings are saved correctly
3. Try the MCP tool command above

## Architecture

```
Cursor MCP Tool → mcp-bridge.js → SSE Stream (port 3001) → Figma Plugin UI → HTML Conversion → Figma Nodes
```

This setup provides:
- **Real-time communication** via Server-Sent Events
- **Sub-100ms latency** (vs 2000ms polling)
- **Reliable message delivery**
- **Connection status monitoring**
- **Automatic reconnection** 