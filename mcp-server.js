#!/usr/bin/env node

/**
 * MCP Server for Cursor Integration - Dedicated MCP Tool Server
 * This runs separately from the SSE server to avoid conflicts
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SERVER_CONFIG } from './config/server-config.js';

// ES module equivalent of __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Environment configuration
const MCP_CONFIG = {
  // Session ID from environment (required for multi-user routing)
  SESSION_ID: process.env.FIGMA_SESSION_ID || null,
  // Server URL (for production deployment)
  SERVER_URL: process.env.FIGMA_SERVER_URL || `http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}`,
  // API key for authentication
  API_KEY: process.env.API_KEY || SERVER_CONFIG.API_KEY || 'dev-key'
};

console.error('[MCP-SERVER] Starting dedicated MCP server for Cursor...');
console.error(`[MCP-SERVER] Session ID: ${MCP_CONFIG.SESSION_ID || 'NOT SET'}`);
console.error(`[MCP-SERVER] Server URL: ${MCP_CONFIG.SERVER_URL}`);

class FigmaMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'figma-html-bridge',
        version: '3.0.0-multiuser',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Shared data file for communication with SSE server
    this.sharedDataPath = path.join(__dirname, SERVER_CONFIG.SHARED_DATA_FILE);
    this.setupToolHandlers();

    // Warn if session ID is not configured
    if (!MCP_CONFIG.SESSION_ID) {
      console.error('[MCP-SERVER] ⚠️  WARNING: FIGMA_SESSION_ID not set. Get it from Figma plugin > MCP Config');
    }
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      console.error('[MCP-SERVER] Tools requested');
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
                  default: 'MCP HTML Import'
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
      console.error(`[MCP-SERVER] Tool called: ${name}`);

      try {
        switch (name) {
          case 'mcp_html_to_design_import-html':
            return await this.handleHtmlImport(args);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        console.error(`[MCP-SERVER] Error executing tool ${name}:`, error);
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
    
    console.error(`[MCP-SERVER] Processing HTML import: ${name}`);
    console.error(`[MCP-SERVER] HTML length: ${html.length} characters`);

    try {
      // Validate HTML
      if (!html || typeof html !== 'string') {
        throw new Error('Invalid HTML content provided');
      }

      // Validate session ID
      if (!MCP_CONFIG.SESSION_ID) {
        throw new Error('FIGMA_SESSION_ID not configured. Get it from Figma plugin > MCP Config button');
      }

      // Prepare data for communication with SSE server
      const mcpData = {
        type: 'mcp-request',
        function: 'mcp_html_to_design_import-html',
        arguments: {
          html: html,
          name: name
        },
        sessionId: MCP_CONFIG.SESSION_ID,  // For multi-user routing
        requestId: `mcp-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'mcp-server-dedicated'
      };

      // Write to shared file for SSE server to pick up
      this.writeToSharedFile(mcpData);

      // Notify SSE server via HTTP request (non-blocking)
      this.notifySSEServer(mcpData).catch(err => {
        console.error('[MCP-SERVER] Failed to notify SSE server:', err.message);
      });

      console.error(`[MCP-SERVER] HTML import processed successfully`);

      return {
        content: [
          {
            type: 'text',
            text: `HTML import "${name}" processed successfully.\n` +
                  `- Content length: ${html.length} characters\n` +
                  `- Data written to shared file\n` +
                  `- SSE server notification sent\n` +
                  `- Request ID: ${mcpData.requestId}`
          }
        ]
      };

    } catch (error) {
      console.error('[MCP-SERVER] Error in HTML import:', error);
      throw error;
    }
  }

  writeToSharedFile(data) {
    try {
      fs.writeFileSync(this.sharedDataPath, JSON.stringify(data, null, 2));
      console.error('[MCP-SERVER] Data written to shared file');
    } catch (error) {
      console.error('[MCP-SERVER] Error writing shared file:', error);
    }
  }

  async notifySSEServer(data) {
    try {
      // Parse server URL to determine http vs https
      const serverUrl = new URL(MCP_CONFIG.SERVER_URL);
      const isHttps = serverUrl.protocol === 'https:';
      const httpModule = isHttps ? await import('https') : await import('http');

      const postData = JSON.stringify(data);
      const options = {
        hostname: serverUrl.hostname,
        port: serverUrl.port || (isHttps ? 443 : 80),
        path: SERVER_CONFIG.ENDPOINTS.MCP_TRIGGER,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'Authorization': `Bearer ${MCP_CONFIG.API_KEY}`  // API key auth
        }
      };

      console.error(`[MCP-SERVER] Sending to: ${serverUrl.hostname}:${options.port}${options.path}`);

      return new Promise((resolve, reject) => {
        const req = httpModule.request(options, (res) => {
          let responseData = '';
          res.on('data', chunk => responseData += chunk);
          res.on('end', () => {
            console.error(`[MCP-SERVER] SSE notification response: ${res.statusCode}`);
            if (res.statusCode !== 200) {
              console.error(`[MCP-SERVER] Response body: ${responseData}`);
            }
            resolve(res.statusCode);
          });
        });

        req.on('error', (err) => {
          // Non-blocking - SSE server might not be running
          console.error('[MCP-SERVER] SSE notification failed (non-critical):', err.message);
          resolve(null);
        });

        req.write(postData);
        req.end();
      });
    } catch (error) {
      console.error('[MCP-SERVER] Error in SSE notification:', error);
    }
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('[MCP-SERVER] MCP server connected and ready for Cursor');
  }
}

// Start the dedicated MCP server
const mcpServer = new FigmaMCPServer();
mcpServer.start().catch(error => {
  console.error('[MCP-SERVER] Failed to start:', error);
  process.exit(1);
}); 