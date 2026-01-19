# Team Deployment Plan - HTML to Figma

**Date**: January 19, 2026
**Status**: Planning
**Scope**: Simplify installation for internal team + Full CSS support

## Objective

Enable the internal team to use the **HTML-to-Figma** plugin with MCP integration (Cursor, Claude Desktop, Claude Code) in a simple way, with one-time installation and minimal technical knowledge required.

---

## Current Situation

### What works:
- Figma plugin is operational
- HTML to Figma conversion with inline styles
- MCP integration with Cursor
- Local SSE server (localhost:3003)

### Current limitations:
- Requires manually running local servers
- Only processes **inline** styles (not external CSS or `<style>` blocks)
- Complex technical configuration
- Only works with localhost

---

## Proposed Architecture

```
┌─────────────────────────────────────────────────────────┐
│              TEAM'S CENTRALIZED SERVER                  │
│         (internal machine or cloud service)             │
│                                                         │
│   ┌─────────────┐          ┌─────────────────────┐     │
│   │ MCP Server  │◄────────►│ SSE Server          │     │
│   │ (WebSocket) │          │ (real-time events   │     │
│   └─────────────┘          │  to plugins)        │     │
│                            └─────────────────────┘     │
└─────────────────────────────────────────────────────────┘
          ▲                            ▲
          │                            │
    ┌─────┴─────┐                ┌─────┴─────┐
    │           │                │           │
┌───┴───┐   ┌───┴───┐        ┌───┴───┐   ┌───┴───┐
│ Juan  │   │ Maria │        │ Juan  │   │ Maria │
│Cursor │   │Claude │        │Figma  │   │Figma  │
│       │   │Desktop│        │Plugin │   │Plugin │
└───────┘   └───────┘        └───────┘   └───────┘
```

### Usage flow:
1. User writes in Cursor/Claude: "Convert this HTML to Figma"
2. MCP Server receives the command
3. SSE Server notifies the user's Figma plugin
4. Plugin generates the design on the canvas

---

## Work Plan

### PHASE 1: Internal CSS Support
**Priority**: High
**Effort**: Medium

#### Objective
Allow the plugin to process HTML with internal `<style>` blocks, not just inline styles.

#### Tasks

- [ ] **1.1** Create `<style>` block parser
  - Extract CSS from `<style>` tags in HTML
  - Parse CSS rules (selectors, properties)
  - Handle selectors: classes (`.class`), IDs (`#id`), elements (`div`, `h1`)

- [ ] **1.2** Apply CSS styles to elements
  - Map CSS selectors to HTML elements
  - Resolve basic specificity (inline > ID > class > element)
  - Combine inherited styles with own styles

- [ ] **1.3** Support external CSS (optional)
  - Additional input in UI to paste external CSS
  - Or resolve `<link href="styles.css">` if file is available

- [ ] **1.4** Testing
  - Test with HTML + internal `<style>`
  - Test with complex selectors
  - Verify that inline styles still work

#### Supported input example:
```html
<style>
  .card { background: #fff; padding: 20px; border-radius: 8px; }
  .title { color: #333; font-size: 24px; }
</style>
<div class="card">
  <h1 class="title">Hello</h1>
</div>
```

---

### PHASE 2: Centralized Server
**Priority**: High
**Effort**: Medium

#### Objective
Replace localhost with a server accessible to the entire team.

#### Tasks

- [ ] **2.1** Modify SSE Server for configurable URL
  - Add environment variable `SERVER_URL`
  - Support HTTPS for secure connections
  - Add basic authentication (team API key)

- [ ] **2.2** Modify Plugin to connect to remote server
  - Change hardcoded URL to configurable
  - Add field in UI for server URL
  - Save configuration in plugin storage

- [ ] **2.3** Modify MCP Server for remote server
  - Connect to central server instead of writing local file
  - Use HTTP/WebSocket for communication

- [ ] **2.4** Server deployment options
  - **Option A**: Script for internal machine (Docker or direct Node)
  - **Option B**: Configuration for Railway/Render/Fly.io
  - Document both options

- [ ] **2.5** Testing
  - Test connection from multiple clients
  - Verify that each user receives only their messages
  - Test automatic reconnection

---

### PHASE 3: Simplify Installation
**Priority**: High
**Effort**: Low

#### Objective
Installation in less than 5 minutes for users with minimal technical knowledge.

#### Tasks

- [ ] **3.1** Create ready-to-import plugin package
  - `.fig` file or manual import instructions
  - Plugin pre-configured with team server URL

- [ ] **3.2** Create ready-to-copy MCP configuration
  - JSON for Cursor
  - JSON for Claude Desktop
  - Instructions for Claude Code

- [ ] **3.3** Visual installation guide
  - Document with step-by-step screenshots
  - Short video (optional)
  - FAQ for common issues

- [ ] **3.4** Verification script
  - Simple command to verify everything works
  - Shows connection status

#### Guide structure:
```
INSTALLATION (5 minutes)

STEP 1: Figma
- Open Figma
- Go to Plugins > Import plugin from manifest
- Select shared file
- Done

STEP 2: Cursor/Claude (choose one)

For Cursor:
- Open Settings > MCP
- Paste this configuration: [JSON]
- Restart Cursor

For Claude Desktop:
- Open ~/Library/Application Support/Claude/claude_desktop_config.json
- Paste this configuration: [JSON]
- Restart Claude

STEP 3: Verify
- In Figma: Open plugin, should say "Connected"
- In Cursor/Claude: Write "test figma connection"
```

---

### PHASE 4: Multi-Client MCP Compatibility
**Priority**: Medium
**Effort**: Low

#### Objective
Ensure functionality with all MCP clients.

#### Tasks

- [ ] **4.1** Test with Cursor
  - Verify MCP configuration
  - Test import commands
  - Document any particularities

- [ ] **4.2** Test with Claude Desktop
  - Verify MCP configuration
  - Test import commands
  - Document any particularities

- [ ] **4.3** Test with Claude Code (CLI)
  - Verify MCP configuration
  - Test import commands
  - Document any particularities

- [ ] **4.4** Create specific configurations
  - Config file for each client
  - Specific instructions if there are differences

---

### PHASE 5: Plugin UX Improvements
**Priority**: Medium
**Effort**: Low

#### Objective
Simplify the interface for users with minimal technical knowledge.

#### Tasks

- [ ] **5.1** Simplify plugin UI
  - Hide technical options (logs, debug)
  - Show only: connection status + paste HTML area
  - Add clear "Ready to receive" indicator

- [ ] **5.2** Improve visual feedback
  - Animation when HTML is received
  - Clear success/error message
  - History of recent conversions

- [ ] **5.3** Add separate CSS input
  - Field to paste external CSS
  - Option to load CSS file

---

## Example Configurations

### Cursor MCP Config
```json
{
  "html-to-figma": {
    "command": "npx",
    "args": ["-y", "html-to-figma-mcp"],
    "env": {
      "FIGMA_SERVER_URL": "https://figma-server.your-team.com",
      "API_KEY": "your-team-api-key"
    }
  }
}
```

### Claude Desktop Config
```json
{
  "mcpServers": {
    "html-to-figma": {
      "command": "npx",
      "args": ["-y", "html-to-figma-mcp"],
      "env": {
        "FIGMA_SERVER_URL": "https://figma-server.your-team.com",
        "API_KEY": "your-team-api-key"
      }
    }
  }
}
```

### Plugin URL (configure once)
```
Server URL: https://figma-server.your-team.com/mcp-stream
API Key: your-team-api-key
```

---

## Suggested Timeline

| Phase | Description | Estimated duration |
|-------|-------------|-------------------|
| 1 | Internal CSS Support | 2-3 sessions |
| 2 | Centralized Server | 2-3 sessions |
| 3 | Simplify Installation | 1 session |
| 4 | Multi-Client Compatibility | 1 session |
| 5 | UX Improvements | 1-2 sessions |

**Total estimated**: 7-10 work sessions

---

## Pending Decisions

### Server
- [ ] **Server location**: Internal machine or cloud service?
- [ ] **Domain**: Use team subdomain or external service?
- [ ] **Authentication**: Shared API key or per user?

### Plugin
- [ ] **Distribution**: Publish on Figma Community or internal only?
- [ ] **Updates**: How to notify the team of new versions?

---

## Success Metrics

- [ ] Complete installation in less than 10 minutes
- [ ] Works with Cursor, Claude Desktop, and Claude Code
- [ ] Correctly processes HTML with internal CSS
- [ ] Stable connection without manual intervention
- [ ] Clear documentation that doesn't require technical support

---

## Next Steps

1. **Approve** this work plan
2. **Decide** server location (internal vs cloud)
3. **Start** with Phase 1 (CSS Support)
4. **Iterate** based on team feedback

---

**Last updated**: January 19, 2026
