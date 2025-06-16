# MCP Protocol Migration Plan

## Overview

**Current Status**: Using HTTP server (`mcp-http-server.js`) with pseudo-MCP communication
**Target**: Implement true MCP protocol using `mcp-bridge.js` for Cursor integration

## Why MCP Protocol is Better

### Current HTTP System Issues:
- ❌ Non-standard communication
- ❌ Requires manual server startup  
- ❌ No integration with Cursor MCP settings
- ❌ HTTP polling overhead
- ❌ Not compatible with MCP ecosystem

### MCP Protocol Benefits:
- ✅ **Standard Protocol**: Follows MCP specification
- ✅ **Cursor Integration**: Native support in Cursor IDE
- ✅ **Better Performance**: Stdio-based communication
- ✅ **Tool Discovery**: Automatic tool registration
- ✅ **Ecosystem**: Compatible with MCP clients
- ✅ **Future-proof**: Standard protocol evolution

## Current Architecture Analysis

### Working HTTP System:
```
External Tools → HTTP POST :3001 → mcp-http-server.js → mcp-shared-data.json → Plugin
Cursor (manual) → ai-to-figma.js → HTTP POST :3001 → ...
```

### Target MCP System:
```
Cursor → MCP Protocol → mcp-bridge.js → mcp-shared-data.json → Plugin
External Tools → (need adaptation)
```

## Migration Strategy

### Phase 1: MCP Configuration & Testing

#### 1.1 Cursor MCP Setup ✅
- [x] Copy `cursor-mcp-config.json` to `~/.cursor/mcp_servers.json`
- [x] Verify MCP bridge dependencies installed
- [x] Test MCP bridge startup

#### 1.2 Test MCP Bridge Communication
- [ ] Start MCP bridge: `node mcp-bridge.js`
- [ ] Test in Cursor: `@figma-html-bridge` tool availability
- [ ] Verify file communication works
- [ ] Test HTML import function

### Phase 2: Plugin Adaptation (if needed)

#### 2.1 Plugin MCP Monitoring
Current plugin already handles:
- ✅ File polling for `mcp-shared-data.json`
- ✅ Processing `mcp-request` format
- ✅ Function: `mcp_html_to_design_import-html`

**No changes needed** - plugin is already MCP-compatible!

#### 2.2 Response Handling Enhancement
- [ ] Implement two-way communication
- [ ] Plugin writes responses back to shared file
- [ ] MCP bridge reads and returns responses

### Phase 3: External Tools Migration

#### 3.1 Replace HTTP Scripts
Current scripts that need adaptation:
- `ai-to-figma.js` → Convert to MCP client or keep as HTTP
- `send-to-figma.js` → Convert to MCP client or keep as HTTP

#### 3.2 Dual Support Option
Maintain both systems temporarily:
- **MCP Bridge**: For Cursor integration
- **HTTP Server**: For external scripts (legacy)

### Phase 4: Embedded MCP Server

#### 4.1 Embed MCP Bridge in Plugin
Move MCP bridge logic into Figma plugin:
- Stdio transport within plugin environment
- Self-contained MCP server
- Automatic startup with plugin

#### 4.2 Enhanced Features
- Real-time status updates
- Better error handling
- Plugin lifecycle management

## Technical Implementation

### MCP Bridge Current Status

**File**: `mcp-bridge.js`
- ✅ MCP SDK integration
- ✅ Tool definitions (`mcp_html_to_design_import-html`)
- ✅ File-based communication
- ✅ Error handling

**Available Tools**:
1. `mcp_html_to_design_import-html` - Import HTML to Figma
2. `mcp_html_to_design_import-url` - Import from URL
3. `mcp_figma_get_status` - Get plugin status

### Plugin Compatibility

**Current plugin code is already MCP-ready**:
- ✅ Reads `mcp-shared-data.json`
- ✅ Processes `mcp-request` format
- ✅ Handles correct function names
- ✅ File-based communication works

### Configuration Files

#### Cursor MCP Config:
```json
{
  "mcpServers": {
    "figma-html-bridge": {
      "command": "node",
      "args": ["mcp-bridge.js"],
      "cwd": "/Users/florosenfeld/Sites/figma-plugins/html-to-figma",
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

## Migration Steps

### Step 1: Test Current MCP Bridge ⏳

```bash
# 1. Start MCP bridge
node mcp-bridge.js

# 2. Test in Cursor
# - Restart Cursor
# - Check if @figma-html-bridge appears
# - Test HTML import
```

### Step 2: Enhance MCP Bridge Response System

**Current Issue**: MCP bridge doesn't wait for plugin response
**Solution**: Implement response polling

```javascript
// Enhanced callFigmaPlugin method
async callFigmaPlugin(functionName, args) {
  // 1. Write request to file
  // 2. Wait for plugin to process
  // 3. Read response from file
  // 4. Return structured response
}
```

### Step 3: Maintain HTTP Compatibility (Optional)

Keep `mcp-http-server.js` running alongside MCP for external tools:

```bash
# Both systems running
node mcp-bridge.js &          # MCP for Cursor
node mcp-http-server.js &     # HTTP for external tools
```

### Step 4: Embedded MCP Implementation

Move MCP bridge into plugin as embedded server:
- Plugin starts MCP server on load
- Stdio communication within Figma environment
- No external server processes needed

## Testing Strategy

### Test Cases:
- [ ] Cursor MCP integration works
- [ ] HTML import via Cursor
- [ ] Complex HTML with CSS renders correctly
- [ ] Badge rendering works
- [ ] Plugin monitoring functions
- [ ] External HTTP tools still work (if maintaining)
- [ ] Error handling for MCP failures

### Success Criteria:
- ✅ Cursor recognizes MCP server
- ✅ Can send HTML from Cursor to Figma
- ✅ Same quality rendering as HTTP system
- ✅ Better user experience than HTTP system

## Benefits After Migration

### For Users:
- **Native Cursor Integration**: Use `@figma-html-bridge` commands
- **Automatic Discovery**: Tools appear in Cursor automatically
- **Better UX**: No manual server startup (after embedding)
- **Standard Workflow**: Follows MCP conventions

### For Development:
- **Future-proof**: Standard protocol
- **Extensible**: Easy to add new tools
- **Maintainable**: Clear separation of concerns
- **Ecosystem**: Compatible with other MCP tools

## Current Status

- ✅ **MCP Dependencies**: Installed (`@modelcontextprotocol/sdk`)
- ✅ **MCP Bridge**: Implemented and ready
- ✅ **Cursor Config**: Added to `~/.cursor/mcp_servers.json`
- ⏳ **Testing**: Need to verify Cursor integration
- ⏳ **Enhancement**: Two-way communication
- ⏳ **Embedding**: Move to plugin (Phase 4)

## Next Actions

1. **Test MCP Bridge**: Verify Cursor sees the MCP server
2. **Test HTML Import**: Send HTML via Cursor MCP
3. **Enhance Response**: Implement proper response handling
4. **Plan Embedding**: Design embedded MCP architecture
5. **Migrate Gradually**: Maintain HTTP during transition 