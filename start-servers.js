#!/usr/bin/env node

/**
 * Server Management Script for Figma HTML-to-Design Plugin
 * Manages both SSE server and MCP server independently
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Starting Figma HTML-to-Design Plugin Servers...');
console.log('📁 Working directory:', __dirname);

let sseServer = null;
let mcpServer = null;

// Server configurations
const servers = {
  sse: {
    name: 'SSE Server',
    script: 'sse-server.js',
    port: 3003,
    emoji: '📡'
  },
  mcp: {
    name: 'MCP Server',
    script: 'mcp-server.js',
    port: 'stdio',
    emoji: '🔧'
  }
};

function startSSEServer() {
  console.log(`${servers.sse.emoji} Starting ${servers.sse.name}...`);
  
  sseServer = spawn('node', [servers.sse.script], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  sseServer.stdout.on('data', (data) => {
    console.log(`${servers.sse.emoji} [SSE]`, data.toString().trim());
  });

  sseServer.stderr.on('data', (data) => {
    console.error(`${servers.sse.emoji} [SSE ERROR]`, data.toString().trim());
  });

  sseServer.on('close', (code) => {
    console.log(`${servers.sse.emoji} ${servers.sse.name} exited with code ${code}`);
    sseServer = null;
  });

  sseServer.on('error', (error) => {
    console.error(`${servers.sse.emoji} ${servers.sse.name} error:`, error);
  });
}

function startMCPServer() {
  console.log(`${servers.mcp.emoji} Starting ${servers.mcp.name}...`);
  console.log(`${servers.mcp.emoji} Note: MCP Server runs in stdio mode for Cursor integration`);
  
  mcpServer = spawn('node', [servers.mcp.script], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  mcpServer.stdout.on('data', (data) => {
    console.log(`${servers.mcp.emoji} [MCP]`, data.toString().trim());
  });

  mcpServer.stderr.on('data', (data) => {
    console.log(`${servers.mcp.emoji} [MCP]`, data.toString().trim());
  });

  mcpServer.on('close', (code) => {
    console.log(`${servers.mcp.emoji} ${servers.mcp.name} exited with code ${code}`);
    mcpServer = null;
  });

  mcpServer.on('error', (error) => {
    console.error(`${servers.mcp.emoji} ${servers.mcp.name} error:`, error);
  });
}

function stopServers() {
  console.log('\n🛑 Stopping all servers...');
  
  if (sseServer) {
    console.log(`${servers.sse.emoji} Stopping ${servers.sse.name}...`);
    sseServer.kill('SIGTERM');
  }
  
  if (mcpServer) {
    console.log(`${servers.mcp.emoji} Stopping ${servers.mcp.name}...`);
    mcpServer.kill('SIGTERM');
  }
  
  setTimeout(() => {
    process.exit(0);
  }, 2000);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⚡ Received interrupt signal...');
  stopServers();
});

process.on('SIGTERM', () => {
  console.log('\n⚡ Received termination signal...');
  stopServers();
});

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'both';

switch (command) {
  case 'sse':
    console.log('🎯 Starting SSE Server only...');
    startSSEServer();
    break;
    
  case 'mcp':
    console.log('🎯 Starting MCP Server only...');
    startMCPServer();
    break;
    
  case 'both':
    console.log('🎯 Starting both servers...');
    startSSEServer();
    
    // Wait a moment before starting MCP server
    setTimeout(() => {
      startMCPServer();
    }, 1000);
    break;
    
  case 'status':
    console.log('📊 Checking server status...');
    // TODO: Add status checking logic
    process.exit(0);
    break;
    
  case 'help':
    console.log(`
🔧 Figma HTML-to-Design Plugin Server Manager

Usage: node start-servers.js [command]

Commands:
  both    Start both SSE and MCP servers (default)
  sse     Start SSE server only
  mcp     Start MCP server only
  status  Check server status
  help    Show this help message

Examples:
  node start-servers.js        # Start both servers
  node start-servers.js sse    # Start SSE server only
  node start-servers.js mcp    # Start MCP server only

Servers:
  📡 SSE Server  - Port 3003 - For Figma plugin communication
  🔧 MCP Server  - stdio mode - For Cursor MCP integration
    `);
    process.exit(0);
    break;
    
  default:
    console.error(`❌ Unknown command: ${command}`);
    console.log('Use "node start-servers.js help" for usage information');
    process.exit(1);
    break;
}

console.log('\n✅ Server manager started');
console.log('Press Ctrl+C to stop all servers');
console.log('─'.repeat(50)); 