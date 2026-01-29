# HTML to Figma - Installation Guide

## Quick Start (5 minutes)

Convert HTML from Claude Code, Cursor, or Claude Desktop directly into Figma designs.

---

## Step 1: Install the Figma Plugin

1. Download the plugin files: `manifest.json`, `code.js`, `ui.html`
2. Open Figma Desktop
3. Go to **Menu → Plugins → Development → Import plugin from manifest...**
4. Select the `manifest.json` file
5. Done! The plugin is now available in Figma

---

## Step 2: Get Your Session ID

1. Open Figma and run the **HTML to Figma** plugin
2. Enable the **"Enable MCP"** toggle
3. You'll see your **Session ID** displayed (e.g., `user_abc12345`)
4. Click **"Copy"** to copy it - you'll need it in the next step

---

## Step 3: Configure Your AI Client

Choose your AI client and add the MCP configuration:

### Claude Code

Add to `~/.claude/mcp.json`:

```json
{
  "mcpServers": {
    "figma-html-bridge": {
      "command": "npx",
      "args": ["-y", "github:Floristeady/html-to-figma"],
      "env": {
        "FIGMA_SERVER_URL": "https://html-to-figma.onrender.com",
        "FIGMA_SESSION_ID": "YOUR_SESSION_ID",
        "API_KEY": "figma-team-2026"
      }
    }
  }
}
```

**Replace `YOUR_SESSION_ID`** with your Session ID from Step 2.

Then restart Claude Code (`/exit` and reopen).

---

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "figma-html-bridge": {
      "command": "npx",
      "args": ["-y", "github:Floristeady/html-to-figma"],
      "env": {
        "FIGMA_SERVER_URL": "https://html-to-figma.onrender.com",
        "FIGMA_SESSION_ID": "YOUR_SESSION_ID",
        "API_KEY": "figma-team-2026"
      }
    }
  }
}
```

Then restart Cursor.

---

### Claude Desktop

Add to your config file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "figma-html-bridge": {
      "command": "npx",
      "args": ["-y", "github:Floristeady/html-to-figma"],
      "env": {
        "FIGMA_SERVER_URL": "https://html-to-figma.onrender.com",
        "FIGMA_SESSION_ID": "YOUR_SESSION_ID",
        "API_KEY": "figma-team-2026"
      }
    }
  }
}
```

Then restart Claude Desktop.

---

## Step 4: Test the Connection

1. Make sure the Figma plugin shows **"SSE Connected"** (green indicator)
2. In your AI client, say:
   > "Send this HTML to Figma: `<div style='background:blue; padding:40px; border-radius:8px;'><h1 style='color:white;'>Hello!</h1></div>`"
3. The design should appear in your Figma canvas

---

## Configuration Reference

| Variable | Value | Description |
|----------|-------|-------------|
| `FIGMA_SERVER_URL` | `https://html-to-figma.onrender.com` | Production server |
| `FIGMA_SESSION_ID` | Your unique ID from plugin | Routes HTML to your Figma |
| `API_KEY` | `figma-team-2026` | Team authentication |

---

## Troubleshooting

### "FIGMA_SESSION_ID not configured"
- Add your Session ID to the MCP config
- Get it from the Figma plugin (enable MCP toggle to see it)

### "Session not found"
- The Figma plugin is not connected
- Make sure plugin shows "SSE Connected" (green)
- Verify Session ID matches exactly (case-sensitive)

### MCP tool not appearing
- Restart your AI client after adding the config
- Check the config file path is correct

### Plugin shows "Disconnected"
- Check your internet connection
- The server may be waking up (free tier has ~30s cold start)
- Wait a moment and it will auto-reconnect

---

## Architecture

```
┌─────────────────┐      ┌──────────────────────────────┐
│  Claude Code    │      │     Render Server            │
│  / Cursor       │─────▶│  html-to-figma.onrender.com  │
│                 │ HTTP │                              │
└─────────────────┘      └──────────────┬───────────────┘
                                        │ SSE
                                        ▼
                         ┌──────────────────────────────┐
                         │       Figma Plugin           │
                         │    (your Session ID)         │
                         │                              │
                         │    Creates design nodes      │
                         └──────────────────────────────┘
```

Each user has their own Session ID, so multiple team members can use the system simultaneously.

---

## For Local Development

If you need to run the server locally for development:

1. Clone the repo and checkout the `dev` branch
2. Run `node sse-server.js`
3. Change `FIGMA_SERVER_URL` to `http://localhost:3003`
4. Change `API_KEY` to `dev-key`

---

**Last updated:** January 29, 2026
