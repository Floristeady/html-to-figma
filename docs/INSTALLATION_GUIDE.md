# HTML to Figma - Installation Guide

## Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
cd html-to-figma
npm install
npm run build
```

### Step 2: Install the Figma Plugin

1. Open Figma Desktop
2. Go to **Menu > Plugins > Development > Import plugin from manifest...**
3. Select the `manifest.json` file from this project folder
4. Done! The plugin is now available in Figma

### Step 3: Start the Servers

Open a terminal in the project folder and run:

```bash
node start-servers.js
```

Keep this terminal open. You should see:
```
🚀 Starting Figma HTML-to-Design Plugin Servers...
📡 [SSE] Server running on http://localhost:3003
🔧 [MCP] MCP Server started
```

> **Tip:** You can also start servers individually:
> - `node start-servers.js sse` - Only SSE server
> - `node start-servers.js mcp` - Only MCP server

### Step 4: Configure your AI Client

Choose one:

---

## Cursor Configuration

1. Open Cursor
2. Go to **Settings** (Cmd+, or Ctrl+,)
3. Search for "MCP" or go to **Features > MCP Servers**
4. Click **Edit in settings.json**
5. Add this configuration:

```json
{
  "mcpServers": {
    "html-to-figma": {
      "command": "node",
      "args": ["/FULL/PATH/TO/html-to-figma/mcp-server.js"]
    }
  }
}
```

> **Important:** Replace `/FULL/PATH/TO/` with the actual path to this project folder.
>
> Example macOS: `/Users/yourname/Sites/html-to-figma/mcp-server.js`
>
> Example Windows: `C:\\Users\\yourname\\Projects\\html-to-figma\\mcp-server.js`

6. Restart Cursor

---

## Claude Code Configuration

Claude Code automatically detects MCP servers. You have two options:

### Option A: Project-specific (recommended)

Create a `.mcp.json` file in your project root:

```json
{
  "mcpServers": {
    "html-to-figma": {
      "command": "node",
      "args": ["/FULL/PATH/TO/html-to-figma/mcp-server.js"]
    }
  }
}
```

### Option B: Global configuration

Add to your Claude Code settings (`~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "html-to-figma": {
      "command": "node",
      "args": ["/FULL/PATH/TO/html-to-figma/mcp-server.js"]
    }
  }
}
```

> **Important:** Replace `/FULL/PATH/TO/` with the actual path to this project folder.

---

## Step 5: Verify the Connection

1. **In Figma:**
   - Open the HTML to Figma plugin
   - Go to the **MCP Bridge** tab
   - Enable the **MCP Bridge** switch
   - You should see: `SSE Connected` (green indicator)

2. **In Cursor or Claude Code:**
   - Type: "Convert this HTML to Figma: `<div style="background: blue; padding: 20px;">Hello</div>`"
   - The element should appear in your Figma canvas

---

## Troubleshooting

### Servers not starting

```bash
# Check if port 3003 is in use
lsof -i :3003

# Kill existing processes
pkill -f "sse-server\|mcp-server"

# Restart
node start-servers.js
```

### SSE Server not connecting

- Make sure servers are running (`node start-servers.js`)
- Check the terminal for errors
- Verify port 3003 is not in use

### MCP tool not available in Cursor/Claude

- Restart your AI client after adding the configuration
- Verify the path to `mcp-server.js` is correct and absolute
- Check that Node.js is installed and available in PATH

### Plugin not receiving HTML

- Make sure the MCP Bridge switch is ON in the plugin
- Check the browser console for errors (Right-click plugin > Inspect)
- Verify both servers are running

---

## Architecture Overview

```
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Cursor/Claude   │      │    MCP Server    │      │   SSE Server     │
│                  │      │                  │      │   (port 3003)    │
│ "Convert HTML"   │─────▶│ Receives command │─────▶│ Broadcasts to    │
│                  │ stdio│                  │ HTTP │ Figma plugin     │
└──────────────────┘      └──────────────────┘      └──────────────────┘
                          (mcp-server.js)           (sse-server.js)
                                                           │
                                                           │ SSE
                                                           ▼
                                                    ┌──────────────┐
                                                    │ Figma Plugin │
                                                    │              │
                                                    │ Creates      │
                                                    │ design nodes │
                                                    └──────────────┘
```

---

**Last updated:** January 2026
