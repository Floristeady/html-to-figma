#!/usr/bin/env node

/**
 * Generate MCP configuration with correct paths
 * Run: node scripts/generate-mcp-config.js
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const mcpServerPath = path.join(projectRoot, 'mcp-server.js');

const config = {
  mcpServers: {
    "html-to-figma": {
      command: "node",
      args: [mcpServerPath]
    }
  }
};

console.log('\n========================================');
console.log('  MCP Configuration for HTML to Figma');
console.log('========================================\n');

console.log('Copy this configuration to your MCP client:\n');
console.log('--- FOR CURSOR (settings.json) ---\n');
console.log(JSON.stringify(config, null, 2));

console.log('\n--- FOR CLAUDE CODE (.mcp.json) ---\n');
console.log(JSON.stringify(config, null, 2));

console.log('\n========================================');
console.log('  Installation Steps');
console.log('========================================\n');

console.log('1. Copy the JSON above');
console.log('2. For Cursor: Add to Settings > MCP Servers');
console.log('3. For Claude Code: Create .mcp.json in your project root');
console.log('4. Restart your AI client');
console.log('5. Run: npm run sse-server');
console.log('6. Open the plugin in Figma and enable MCP Bridge\n');
