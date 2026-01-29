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
import https from 'https';
import http from 'http';
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
            description: 'Import HTML content and convert it to Figma design elements. Automatically resolves external CSS files and inlines them.',
            inputSchema: {
              type: 'object',
              properties: {
                html: {
                  type: 'string',
                  description: 'HTML content to convert to Figma design (required if htmlPath not provided)'
                },
                htmlPath: {
                  type: 'string',
                  description: 'Path to HTML file. If provided, CSS files referenced with <link> tags will be automatically resolved and inlined'
                },
                name: {
                  type: 'string',
                  description: 'Name for the imported design (optional)',
                  default: 'MCP HTML Import'
                }
              }
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
    let { html, htmlPath, name = 'MCP HTML Import' } = args;
    let baseDir = null;
    let cssResolved = 0;

    console.error(`[MCP-SERVER] Processing HTML import: ${name}`);

    try {
      // If htmlPath is provided, read the HTML file
      if (htmlPath) {
        if (!fs.existsSync(htmlPath)) {
          throw new Error(`HTML file not found: ${htmlPath}`);
        }
        html = fs.readFileSync(htmlPath, 'utf-8');
        baseDir = path.dirname(htmlPath);
        console.error(`[MCP-SERVER] Read HTML from: ${htmlPath}`);
      }

      // Validate HTML
      if (!html || typeof html !== 'string') {
        throw new Error('Invalid HTML content provided. Use either "html" or "htmlPath" parameter.');
      }

      console.error(`[MCP-SERVER] HTML length: ${html.length} characters`);

      // Resolve external CSS if baseDir is available (from htmlPath)
      if (baseDir) {
        const result = this.resolveExternalCSS(html, baseDir);
        html = result.html;
        cssResolved = result.cssCount;
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

      // Notify SSE server via HTTP request (BLOCKING - must wait for completion)
      try {
        const notifyResult = await this.notifySSEServer(mcpData);
        console.error(`[MCP-SERVER] SSE notification completed with status: ${notifyResult}`);
      } catch (err) {
        console.error('[MCP-SERVER] Failed to notify SSE server:', err.message);
      }

      console.error(`[MCP-SERVER] HTML import processed successfully`);

      let resultMessage = `HTML import "${name}" processed successfully.\n` +
            `- Content length: ${html.length} characters\n`;

      if (cssResolved > 0) {
        resultMessage += `- CSS files resolved and inlined: ${cssResolved}\n`;
      }

      resultMessage += `- SSE server notification sent\n` +
            `- Request ID: ${mcpData.requestId}`;

      return {
        content: [
          {
            type: 'text',
            text: resultMessage
          }
        ]
      };

    } catch (error) {
      console.error('[MCP-SERVER] Error in HTML import:', error);
      throw error;
    }
  }

  /**
   * Resolves external CSS files and inlines them into the HTML
   * @param {string} html - The HTML content
   * @param {string} baseDir - The base directory for resolving relative paths
   * @returns {object} - { html: processedHtml, cssCount: numberOfCSSFilesResolved }
   */
  resolveExternalCSS(html, baseDir) {
    // Regex to find <link rel="stylesheet" href="...">
    const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*>|<link[^>]+href=["']([^"']+)["'][^>]+rel=["']stylesheet["'][^>]*>/gi;

    let cssCount = 0;
    const processedHtml = html.replace(linkRegex, (match, href1, href2) => {
      const href = href1 || href2;

      // Skip external URLs (http://, https://, //)
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
        console.error(`[MCP-SERVER] Skipping external CSS URL: ${href}`);
        return match; // Keep the original link tag
      }

      // Resolve the CSS file path
      const cssPath = path.resolve(baseDir, href);

      // Check if file exists
      if (!fs.existsSync(cssPath)) {
        console.error(`[MCP-SERVER] CSS file not found: ${cssPath}`);
        return match; // Keep the original link tag
      }

      try {
        // Read the CSS file
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        console.error(`[MCP-SERVER] Resolved CSS: ${href} (${cssContent.length} chars)`);
        cssCount++;

        // Return inline style tag
        return `<style>\n/* Inlined from: ${href} */\n${cssContent}\n</style>`;
      } catch (error) {
        console.error(`[MCP-SERVER] Error reading CSS file ${cssPath}:`, error.message);
        return match; // Keep the original link tag on error
      }
    });

    if (cssCount > 0) {
      console.error(`[MCP-SERVER] Total CSS files inlined: ${cssCount}`);
    } else {
      console.error(`[MCP-SERVER] No external CSS files found to inline`);
    }

    return { html: processedHtml, cssCount };
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
      const httpModule = isHttps ? https : http;

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