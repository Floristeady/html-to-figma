# HTML to Figma - Installation Guide

## Quick Start

Convert HTML from Claude Code, Cursor, or Claude Desktop directly into Figma designs.

**Steps:** Install Plugin → Get Session ID → Configure AI Client → Test → Use

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
2. Click the **"MCP Config"** button
3. You'll see your **Session ID** displayed (e.g., `user_abc12345`)
4. Click **"Copy Session ID"** - you'll need it in the next step

---

## Step 3: Configure Your AI Client

### Option A: Let Claude Configure It (Recommended)

Copy this prompt and paste it to Claude Code, Cursor, or Claude Desktop. Replace `YOUR_SESSION_ID` with the ID you copied in Step 2:

```
Add the MCP server "figma-html-bridge" to my global config file ~/.claude.json

Use this exact JSON configuration:

{
  "mcpServers": {
    "figma-html-bridge": {
      "command": "npx",
      "args": ["-y", "github:Floristeady/html-to-figma"],
      "env": {
        "FIGMA_SERVER_URL": "https://html-to-figma.onrender.com",
        "API_KEY": "figma-team-2026",
        "FIGMA_SESSION_ID": "YOUR_SESSION_ID"
      }
    }
  }
}

If the file already exists, merge this mcpServers config with existing content.
If it doesn't exist, create it.

IMPORTANT: Use "npx" as command, NOT "node". This downloads the MCP server automatically.
```

After Claude configures it, type `/exit` and reopen Claude Code to apply changes.

---

### Option B: Manual Configuration

<details>
<summary>Claude Code - Add to ~/.claude.json</summary>

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

Then restart Claude Code (`/exit` and reopen).

</details>

<details>
<summary>Cursor - Add to ~/.cursor/mcp.json</summary>

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

</details>

<details>
<summary>Claude Desktop - Add to config file</summary>

Config file location:
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

</details>

---

## Step 4: Test the Connection

1. Make sure the Figma plugin shows **"SSE Connected"** (green indicator)
2. In your AI client, say:

```
Send this HTML to Figma:

<div style="background: #4F46E5; padding: 40px; border-radius: 12px;">
  <h1 style="color: white; margin: 0;">Hello from Claude!</h1>
  <p style="color: rgba(255,255,255,0.8); margin-top: 8px;">MCP is working!</p>
</div>
```

3. The design should appear in your Figma canvas

---

## Step 5: Using the Tool

Once configured, tell Claude to use **figma-html-bridge** to send HTML to Figma:

**Generate and send:**
```
Create a pricing card with 3 tiers and send it to Figma with figma-html-bridge
```

**Send HTML directly:**
```
Send this HTML to Figma using figma-html-bridge:
<div style="padding: 20px; background: #4F46E5; color: white;">Hello World</div>
```

**Read file and send:**
```
Read index.html and send to Figma with figma-html-bridge
```

**From a React/Vue component (optional):**
```
Read src/components/Button.tsx, generate the HTML, and send to Figma with figma-html-bridge
```

> **Important:** Always mention **"figma-html-bridge"** so Claude uses the correct tool.

> **Tip:** Make sure the Figma plugin is open and shows "SSE Connected" before sending designs.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "FIGMA_SESSION_ID not configured" | Add your Session ID to the MCP config |
| "Session not found" | Make sure Figma plugin shows "SSE Connected" |
| MCP tool not appearing | Restart your AI client after adding the config |
| Plugin shows "Disconnected" | Wait ~30s for server cold start, it will auto-reconnect |

---

## How It Works

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

**Last updated:** January 30, 2026
