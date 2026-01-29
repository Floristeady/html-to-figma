# HTML-to-Figma Plugin

Convert HTML/CSS directly into Figma designs using AI assistants (Claude Code, Cursor, Claude Desktop).

## Features

- **AI-powered conversion**: Send HTML from Claude Code, Cursor, or Claude Desktop directly to Figma
- **95+ CSS properties**: Flexbox, Grid, gradients, shadows, transforms, positioning
- **Team-ready**: Multi-user support with session isolation
- **Production server**: No local setup required for team members

## Quick Start (5 minutes)

### 1. Install the Figma Plugin

1. Download: `manifest.json`, `code.js`, `ui.html`
2. Figma → **Plugins → Development → Import plugin from manifest**
3. Select `manifest.json`

### 2. Get Your Session ID

1. Open the plugin in Figma
2. Enable **"Enable MCP"** toggle
3. Copy your Session ID (e.g., `user_abc12345`)

### 3. Configure Your AI Client

Add to `~/.claude/mcp.json` (Claude Code) or equivalent:

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

### 4. Test It

In Claude Code, say:
> "Send this HTML to Figma: `<div style='background:blue; padding:40px;'><h1 style='color:white;'>Hello!</h1></div>`"

---

## Architecture

```
┌─────────────────┐      ┌──────────────────────────────┐
│  Claude Code    │      │     Render Server            │
│  Cursor         │─────▶│  html-to-figma.onrender.com  │
│  Claude Desktop │ HTTP │                              │
└─────────────────┘      └──────────────┬───────────────┘
                                        │ SSE
                                        ▼
                         ┌──────────────────────────────┐
                         │       Figma Plugin           │
                         │    (your Session ID)         │
                         └──────────────────────────────┘
```

## Supported CSS

| Category | Properties |
|----------|------------|
| **Layout** | `display: flex/grid`, `flex-direction`, `justify-content`, `align-items`, `gap` |
| **Grid** | `grid-template-columns`, `grid-template-areas`, `grid-column`, `grid-row` |
| **Spacing** | `padding`, `margin`, `width`, `height`, `min-width`, `max-width` |
| **Colors** | `background`, `color`, `linear-gradient()`, `rgba()` |
| **Borders** | `border`, `border-radius`, `box-shadow` |
| **Typography** | `font-size`, `font-weight`, `line-height`, `text-align`, `letter-spacing` |
| **Effects** | `opacity`, `transform`, `filter`, `backdrop-filter` |
| **Position** | `position: absolute/relative/fixed`, `top`, `left`, `z-index` |

## Documentation

- **[Installation Guide](./docs/INSTALLATION_GUIDE.md)** - Detailed setup for all AI clients
- [AI Examples](./docs/AI_EXAMPLES.md) - Advanced examples and best practices
- [Code Analysis](./docs/CODE_ANALYSIS.md) - Technical CSS support details

## Local Development

For contributors or local testing:

```bash
git clone https://github.com/Floristeady/html-to-figma.git
cd html-to-figma
git checkout dev           # Use dev branch for local
npm install
npm run build
node sse-server.js         # Start local server
```

Update `.mcp.json` to use `http://localhost:3003`.

## License

MIT

---

**Server**: https://html-to-figma.onrender.com
**Last Updated**: January 2026
