#!/usr/bin/env node

console.error('=== DEBUG MCP SERVER ===');
console.error('Process args:', process.argv);
console.error('Working directory:', process.cwd());
console.error('Node version:', process.version);
console.error('Environment:', process.env.NODE_ENV);

// Intentar cargar las dependencias MCP
try {
  const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
  console.error('✓ MCP SDK loaded successfully');
} catch (error) {
  console.error('✗ Error loading MCP SDK:', error.message);
  process.exit(1);
}

// Simular herramientas simples
const server = require('./mcp-bridge.js');
console.error('✓ MCP Bridge loaded successfully');
console.error('=== MCP SERVER READY ==='); 