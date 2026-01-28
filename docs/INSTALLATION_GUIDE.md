# HTML to Figma - Installation Guide

## Quick Start (5 minutes)

This guide helps you set up the HTML-to-Figma plugin to convert HTML from Claude Code, Cursor, or Claude Desktop directly into Figma designs.

---

## Step 1: Install the Figma Plugin

1. Open Figma Desktop
2. Go to **Menu > Plugins > Development > Import plugin from manifest...**
3. Select the `manifest.json` file from this project folder
4. Done! The plugin is now available in Figma

---

## Step 2: Start the SSE Server

Open a terminal in the project folder and run:

```bash
node sse-server.js
```

Keep this terminal open. You should see:
```
[SSE-SERVER] Starting dedicated SSE server for Figma plugin...
[SSE-SERVER] Environment: development
[SSE-SERVER] Server listening on port 3003
```

---

## Step 3: Get Your Session ID

1. Open the HTML to Figma plugin in Figma
2. Go to the **MCP Bridge** tab
3. Enable the **MCP Bridge** switch
4. Click **"MCP Config"** button
5. Copy your unique Session ID (e.g., `user_abc12345`)

---

## Step 4: Configure Your AI Client

### Claude Code (CLI) - RECOMMENDED

Run this command in your terminal:

```bash
claude mcp add figma-html-bridge -s local \
  -e FIGMA_SERVER_URL=http://localhost:3003 \
  -e FIGMA_SESSION_ID=YOUR_SESSION_ID \
  -e API_KEY=dev-key \
  -- node /FULL/PATH/TO/html-to-figma/mcp-server.js
```

**Replace:**
- `YOUR_SESSION_ID` with your session ID from the plugin
- `/FULL/PATH/TO/html-to-figma` with the actual path to the project

**Then restart Claude Code** (`/exit` and reopen).

**To verify it worked:**
```bash
claude mcp get figma-html-bridge
```

Should show:
```
figma-html-bridge:
  Status: ✓ Connected
  Environment:
    FIGMA_SERVER_URL=http://localhost:3003
    FIGMA_SESSION_ID=user_xxxxx
    API_KEY=dev-key
```

---

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "html-to-figma": {
      "command": "npx",
      "args": ["-y", "github:Floristeady/html-to-figma"],
      "env": {
        "FIGMA_SERVER_URL": "http://localhost:3003",
        "FIGMA_SESSION_ID": "YOUR_SESSION_ID",
        "API_KEY": "dev-key"
      }
    }
  }
}
```

**Then restart Cursor.**

---

### Claude Desktop

Add to your config file:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "html-to-figma": {
      "command": "npx",
      "args": ["-y", "github:Floristeady/html-to-figma"],
      "env": {
        "FIGMA_SERVER_URL": "http://localhost:3003",
        "FIGMA_SESSION_ID": "YOUR_SESSION_ID",
        "API_KEY": "dev-key"
      }
    }
  }
}
```

**Then restart Claude Desktop.**

---

## Step 5: Test the Connection

1. Make sure the Figma plugin shows **"SSE Connected"** (green indicator)
2. In your AI client, ask:
   > "Send this HTML to Figma: `<div style='background:blue;width:100px;height:100px'></div>`"
3. A blue square should appear in your Figma canvas

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FIGMA_SERVER_URL` | URL of the SSE server | `http://localhost:3003` |
| `FIGMA_SESSION_ID` | Your unique session ID from the plugin | Required |
| `API_KEY` | Authentication key | `dev-key` |

---

## Troubleshooting

### "FIGMA_SESSION_ID not configured"
- You didn't include the Session ID in your MCP config
- Copy your Session ID from the plugin's "MCP Config" panel
- For Claude Code, make sure you used the `-e FIGMA_SESSION_ID=xxx` flag

### "Session not found"
- The Figma plugin is not connected
- Make sure the plugin shows "SSE Connected"
- Check that the Session ID matches exactly (case-sensitive)

### MCP tool not appearing
- Restart your AI client after configuration
- For Claude Code: run `claude mcp list` to verify it's installed

### Connection keeps disconnecting
- Keep the SSE server running (`node sse-server.js`)
- If it disconnects, the plugin will auto-reconnect

### "Cannot find module" error
- Make sure Node.js is installed
- Make sure you're using the correct path to mcp-server.js

---

## Architecture

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ Claude Code   │     │  MCP Server   │     │  SSE Server   │
│ / Cursor      │────▶│               │────▶│  (port 3003)  │
│               │stdio│ Sends HTML +  │HTTP │               │
│               │     │ Session ID    │     │ Routes to     │
└───────────────┘     └───────────────┘     │ correct user  │
                                            └───────┬───────┘
                                                    │ SSE
                                                    ▼
                                            ┌───────────────┐
                                            │ Figma Plugin  │
                                            │ (your session)│
                                            │               │
                                            │ Creates       │
                                            │ design nodes  │
                                            └───────────────┘
```

Each user has their own Session ID, so multiple people can use the system simultaneously without receiving each other's HTML.

---

## For Production (Remote Server)

When the team server is deployed on Render:

1. Change `FIGMA_SERVER_URL` to: `https://html-to-figma-XXXX.onrender.com`
2. Change `API_KEY` to the team's shared key
3. The Session ID remains your personal one from the plugin

---

**Last updated:** January 28, 2026
