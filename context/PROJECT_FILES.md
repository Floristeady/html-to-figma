# 📁 Project Structure - HTML to Figma Plugin

## 🏗️ **Core Plugin Files (PRODUCTION)**
```
src/code.ts          → TypeScript source (edit this)
code.js              → Compiled JavaScript (auto-generated)
manifest.json        → Figma plugin configuration
ui.js               → Plugin UI entry point
main.js             → Plugin main entry point
```

## 🔗 **MCP Integration (PRODUCTION)**
```
mcp-bridge.js           → MCP server for Cursor integration
cursor-mcp-config.json  → Cursor MCP configuration
mcp-config.json         → Alternative MCP configuration
```

## 🧪 **Test Files (test-mcp/)**
```
test-mcp/
├── simple-test.js              → Simple browser console test
├── test-storage-injection.js   → Storage injection test
├── test-fallback-http.js       → HTTP fallback test  
├── test-phase1.html            → HTML test file
└── mcp-file-to-storage.js      → File-to-storage bridge
```

## 📚 **Documentation**
```
README.md                       → Main project documentation  
context/                        → All project docs and plans
├── PROJECT_FILES.md            → This file structure guide
├── PROJECT_STATUS.md           → Current project status
├── PHASE_1_COMPLETION_SUMMARY.md → Phase 1 technical summary
├── MCP_MIGRATION_PLAN.md       → Migration strategy
└── ...                         → Other context docs
examples/                       → HTML test examples
```

## 🔧 **Legacy/Optional Files**
```
mcp-http-server.js      → HTTP server (Phase 1 fallback)
ai-to-figma.js          → Alternative injection script
convert-html-for-figma.js → Standalone converter
test-html.json          → Test data
```

## 📦 **Build Files**
```
package.json            → Dependencies and scripts
tsconfig.json          → TypeScript configuration
node_modules/          → Dependencies
dist/                  → Build output
```

---

## 🚀 **Current Status: Phase 1 MCP Migration**

**WORKING:**
- ✅ MCP Bridge: `mcp-bridge.js` 
- ✅ Plugin Core: `src/code.ts` → `code.js`
- ✅ Storage System: `figma.clientStorage` integration
- ✅ Test Infrastructure: `test-mcp/` folder

**ACTIVE WORKFLOW:**
1. **Cursor** → MCP Bridge → `mcp-shared-data.json`
2. **Bridge Monitor** → `test-mcp/mcp-file-to-storage.js`
3. **Console Injection** → Plugin Storage → Figma Canvas

**NEXT:** Complete direct storage communication (eliminate file bridge) 