#!/usr/bin/env node

/**
 * MCP Bridge for Figma HTML-to-Design Plugin - SSE Version
 * Clean implementation with Server-Sent Events for real-time communication
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const SSE_PORT = 3003;

console.log('[MCP-SSE] Starting MCP Bridge with SSE support...');
console.log('[MCP-SSE] Working directory:', __dirname);

class FigmaMCPBridge {
  constructor() {
    // MCP Server setup
    this.server = new Server(
      {
        name: 'figma-html-bridge',
        version: '2.0.0-sse',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // SSE connections management
    this.sseConnections = new Set();
    this.httpServer = null;

    // Fallback file system (for backward compatibility)
    this.sharedDataPath = path.join(__dirname, 'mcp-shared-data.json');

    this.setupToolHandlers();
    this.setupSSEServer();
  }

  // ===============================================
  // MCP TOOL HANDLERS
  // ===============================================

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'mcp_html_to_design_import-html',
            description: 'Import HTML content and convert it to Figma design elements',
            inputSchema: {
              type: 'object',
              properties: {
                html: {
                  type: 'string',
                  description: 'HTML content to convert to Figma design'
                },
                name: {
                  type: 'string',
                  description: 'Name for the imported design (optional)',
                  default: 'HTML Import'
                }
              },
              required: ['html']
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'mcp_html_to_design_import-html':
            return await this.handleHtmlImport(args);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        console.error(`[MCP] Error executing tool ${name}:`, error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async handleHtmlImport(args) {
    const { html, name = 'MCP HTML Import' } = args;
    
    console.log(`[MCP] Processing HTML import: ${name}`);
    console.log(`[MCP] HTML length: ${html.length} characters`);

    try {
      // Validate HTML
      if (!html || typeof html !== 'string') {
        throw new Error('Invalid HTML content provided');
      }

      // Prepare data for SSE broadcast
      const mcpData = {
        type: 'mcp-request',
        function: 'mcp_html_to_design_import-html',
        arguments: {
          html: html,
          name: name
        },
        requestId: `mcp-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'mcp-bridge'
      };

      // Broadcast to SSE clients
      const broadcastSuccess = this.broadcastToSSEClients(mcpData);
      
      // Also write to shared file for backward compatibility
      this.writeToSharedFile(mcpData);

      console.log(`[MCP] HTML import processed successfully`);
      console.log(`[MCP] SSE broadcast: ${broadcastSuccess ? 'Success' : 'No active connections'}`);

      return {
        content: [
          {
            type: 'text',
            text: `HTML import "${name}" processed successfully.\n` +
                  `- Content length: ${html.length} characters\n` +
                  `- SSE broadcast: ${broadcastSuccess ? 'Sent to active connections' : 'No active connections'}\n` +
                  `- Fallback file: Updated\n` +
                  `- Request ID: ${mcpData.requestId}`
          }
        ]
      };

    } catch (error) {
      console.error('[MCP] Error in HTML import:', error);
      throw error;
    }
  }

  // ===============================================
  // SSE SERVER SETUP
  // ===============================================

  setupSSEServer() {
    this.httpServer = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);

      // Handle CORS preflight
      if (req.method === 'OPTIONS') {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        });
        res.end();
        return;
      }

      // SSE Endpoint
      if (parsedUrl.pathname === '/mcp-stream') {
        this.handleSSEConnection(req, res);
        return;
      }

      // Status endpoint
      if (parsedUrl.pathname === '/mcp-status') {
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          status: 'running',
          activeConnections: this.sseConnections.size,
          sseEndpoint: `http://localhost:${SSE_PORT}/mcp-stream`,
          version: '2.0.0-sse',
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // Test endpoint for manual testing
      if (parsedUrl.pathname === '/test-broadcast') {
        const testData = {
          type: 'test-message',
          message: 'Test broadcast from MCP Bridge',
          timestamp: new Date().toISOString()
        };
        
        const success = this.broadcastToSSEClients(testData);
        
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          success: success,
          activeConnections: this.sseConnections.size,
          message: success ? 'Test broadcast sent' : 'No active connections'
        }));
        return;
      }

      // 404 for other endpoints
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    });

    // Start HTTP server
    this.httpServer.listen(SSE_PORT, () => {
      console.log(`[SSE] Server running on http://localhost:${SSE_PORT}`);
      console.log(`[SSE] Stream endpoint: /mcp-stream`);
      console.log(`[SSE] Status endpoint: /mcp-status`);
      console.log(`[SSE] Test endpoint: /test-broadcast`);
    });

    // Handle server errors
    this.httpServer.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`[SSE] Port ${SSE_PORT} is already in use`);
        console.error(`[SSE] Please close other applications using this port`);
        process.exit(1);
      } else {
        console.error(`[SSE] Server error:`, error);
      }
    });
  }

  handleSSEConnection(req, res) {
    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Add connection to active connections
    this.sseConnections.add(res);
    console.log(`[SSE] New connection established. Active: ${this.sseConnections.size}`);

    // Send initial connection confirmation
    res.write(`data: ${JSON.stringify({
      type: 'connection-established',
      message: 'SSE connection established',
      timestamp: new Date().toISOString(),
      activeConnections: this.sseConnections.size
    })}\n\n`);

    // Setup heartbeat to keep connection alive
    const heartbeatInterval = setInterval(() => {
      try {
        res.write(`: heartbeat ${Date.now()}\n\n`);
      } catch (error) {
        // Connection closed, cleanup will be handled by 'close' event
        clearInterval(heartbeatInterval);
      }
    }, 30000); // Every 30 seconds

    // Handle connection close
    req.on('close', () => {
      clearInterval(heartbeatInterval);
      this.sseConnections.delete(res);
      console.log(`[SSE] Connection closed. Active: ${this.sseConnections.size}`);
    });

    req.on('error', (error) => {
      console.error('[SSE] Connection error:', error);
      clearInterval(heartbeatInterval);
      this.sseConnections.delete(res);
    });
  }

  // ===============================================
  // SSE BROADCASTING
  // ===============================================

  broadcastToSSEClients(data) {
    if (this.sseConnections.size === 0) {
      console.log('[SSE] No active connections to broadcast to');
      return false;
    }

    const eventData = `data: ${JSON.stringify(data)}\n\n`;
    let successCount = 0;
    let failureCount = 0;

    this.sseConnections.forEach(client => {
      try {
        client.write(eventData);
        successCount++;
      } catch (error) {
        console.error('[SSE] Failed to send to client:', error);
        this.sseConnections.delete(client);
        failureCount++;
      }
    });

    console.log(`[SSE] Broadcast complete: ${successCount} success, ${failureCount} failed`);
    return successCount > 0;
  }

  // ===============================================
  // FALLBACK FILE SYSTEM (Backward Compatibility)
  // ===============================================

  writeToSharedFile(data) {
    try {
      fs.writeFileSync(this.sharedDataPath, JSON.stringify(data, null, 2));
      console.log('[File] Shared data file updated for backward compatibility');
    } catch (error) {
      console.error('[File] Error writing shared data file:', error);
    }
  }

  // ===============================================
  // SERVER LIFECYCLE
  // ===============================================

  async start() {
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      console.log('[MCP] Server started successfully');
      console.log('[MCP] Ready to handle tool requests');
      } catch (error) {
      console.error('[MCP] Failed to start server:', error);
      process.exit(1);
    }
  }

  shutdown() {
    console.log('[MCP-SSE] Shutting down...');
    
    // Close all SSE connections
    this.sseConnections.forEach(client => {
      try {
        client.end();
      } catch (error) {
        // Ignore errors when closing connections
      }
    });
    this.sseConnections.clear();

    // Close HTTP server
    if (this.httpServer) {
      this.httpServer.close();
    }

    // Close MCP server
    if (this.server) {
      // MCP server doesn't have a direct close method, but the transport will handle cleanup
    }

    console.log('[MCP-SSE] Shutdown complete');
  }
}

// ===============================================
// MAIN EXECUTION
// ===============================================

// Create and start the bridge
const bridge = new FigmaMCPBridge();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[MCP-SSE] Received SIGINT, shutting down gracefully...');
  bridge.shutdown();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[MCP-SSE] Received SIGTERM, shutting down gracefully...');
  bridge.shutdown();
  process.exit(0);
});

// Start the bridge
bridge.start().catch(error => {
  console.error('[MCP-SSE] Fatal error:', error);
  process.exit(1);
});

console.log('[MCP-SSE] Bridge initialization complete'); 