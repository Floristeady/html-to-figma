# Embedded Server Implementation Plan

## Project Overview

The **html-to-figma** plugin currently requires users to manually start an external MCP server (`node mcp-http-server.js`) before using the plugin. This creates friction for team adoption and distribution.

**Goal:** Implement an embedded HTTP server within the Figma plugin to eliminate manual setup steps while maintaining all current functionality.

## Current Architecture

### Working System (Verified ✅)
- **External MCP Server**: `mcp-http-server.js` running on port 3001
- **Plugin Communication**: File-based via `mcp-shared-data.json`
- **Two Input Methods**:
  1. **Manual Paste**: Direct HTML input in plugin UI
  2. **MCP Integration**: HTTP API for Cursor IDE and external tools
- **Plugin Features**: Complete HTML→Figma conversion with CSS support, badges, inheritance, layouts

### Current Workflow
```
User → Manually starts: node mcp-http-server.js
     → Opens Figma plugin 
     → Activates "Start MCP Monitoring"
     → Sends HTML via Cursor/tools → localhost:3001 → Plugin processes
```

## Target Architecture (Embedded Server)

### Desired Workflow
```
User → Opens Figma plugin
     → Plugin auto-starts embedded server on port 3001
     → Sends HTML via Cursor/tools → localhost:3001 → Plugin processes
     → No manual server startup needed
```

## Implementation Strategy

### Phase 1: Embedded Server Integration

#### 1.1 Move HTTP Server Logic to Plugin
- **Source**: Extract server logic from `mcp-http-server.js`
- **Target**: Integrate into `src/code.ts` main thread
- **Key Components**:
  - HTTP server creation (Node.js `http` module)
  - CORS handling for cross-origin requests
  - POST `/mcp-data` endpoint (receive HTML)
  - GET `/mcp-data` endpoint (plugin polling)
  - DELETE `/mcp-data` endpoint (cleanup)
  - GET `/health` endpoint (status check)

#### 1.2 Server Lifecycle Management
- **Start Server**: When "Start MCP Monitoring" is activated
- **Stop Server**: When monitoring is deactivated or plugin closes
- **Port Management**: Handle port 3001 conflicts gracefully
- **Error Handling**: Fallback behavior if server can't start

#### 1.3 Maintain File-Based Communication
- **Keep**: `mcp-shared-data.json` communication pattern
- **Reason**: Figma plugins run in sandboxed environment
- **Flow**: HTTP → Write file → Plugin reads file → Process HTML

### Phase 2: Enhanced User Experience

#### 2.1 Smart Server Management
- **Auto-start**: Server starts automatically when plugin loads
- **Port Detection**: Check if port 3001 is available
- **Status Indicators**: Visual feedback for server status
- **Graceful Degradation**: Plugin works without server for manual paste

#### 2.2 Better Error Handling
- **Port Conflicts**: Detect and suggest alternatives
- **Network Issues**: Clear error messages
- **Fallback Mode**: Manual paste always works

## Technical Implementation Details

### File Structure Changes
```
src/
├── code.ts (main plugin logic + embedded server)
├── ui.html (plugin interface)
└── ui.ts (UI logic)

Current External Files (to be integrated):
├── mcp-http-server.js → Move logic to code.ts
├── ai-to-figma.js (keep as external tool)
└── send-to-figma.js (keep as external tool)
```

### Code Integration Points

#### 1. Server Module in Plugin
```typescript
// Add to src/code.ts
class EmbeddedMCPServer {
  private server: any = null;
  private port: number = 3001;
  
  start() { /* HTTP server logic */ }
  stop() { /* Cleanup logic */ }
  isRunning() { /* Status check */ }
}
```

#### 2. Modified MCP Monitoring
```typescript
// Current: Polls external server
// New: Embedded server writes to file directly
function startMCPMonitoring() {
  // 1. Start embedded server
  // 2. Start file polling (unchanged)
}
```

### Compatibility Preservation

#### External Tools Continue Working
- ✅ `ai-to-figma.js` → Posts to localhost:3001 (now embedded)
- ✅ `send-to-figma.js` → Posts to localhost:3001 (now embedded)  
- ✅ Cursor MCP integration → Posts to localhost:3001 (now embedded)
- ✅ Manual paste → Direct plugin usage (unchanged)

#### API Compatibility
- ✅ Same endpoints: `/mcp-data`, `/health`
- ✅ Same request/response format
- ✅ Same CORS headers
- ✅ Same error handling

## Benefits

### For Users
- **Zero Setup**: No manual server startup required
- **Instant Use**: Plugin works immediately after installation
- **Team Friendly**: Easy to share with colleagues
- **Reliable**: No forgotten server startups

### For Developers  
- **Cleaner Architecture**: Single plugin file
- **Better Distribution**: Self-contained solution
- **Easier Debugging**: All logic in one place
- **Future Ready**: Foundation for advanced features

## Migration Strategy

### Development Approach
1. **New Branch**: Create `feature/embedded-server`
2. **Incremental**: Build embedded server alongside existing
3. **Testing**: Verify all current functionality works
4. **Switch**: Replace external server with embedded
5. **Cleanup**: Remove external server files

### Testing Checklist
- [ ] Manual HTML paste works
- [ ] Cursor MCP integration works  
- [ ] External scripts (`ai-to-figma.js`) work
- [ ] Complex HTML with CSS renders correctly
- [ ] Badges and inheritance work
- [ ] Plugin handles server start/stop gracefully
- [ ] Port conflicts handled properly

## Current Status

- ✅ **System Verified**: All functionality working with external server
- ✅ **Badge Rendering**: Fixed and tested with complex examples
- ✅ **MCP Integration**: Cursor communication working perfectly
- ✅ **Code Base**: Clean, compiled, and up-to-date

**Ready to proceed with embedded server implementation.**

## Next Steps

1. Create feature branch: `git checkout -b feature/embedded-server`
2. Extract server logic from `mcp-http-server.js`
3. Integrate HTTP server into `src/code.ts`
4. Test embedded server functionality
5. Update UI to show embedded server status
6. Verify all external tools still work
7. Document new simplified usage instructions

---

*This plan maintains 100% backward compatibility while eliminating setup friction for new users.* 