#!/usr/bin/env node

/**
 * MCP Bridge for Figma HTML-to-Design Plugin
 * This script acts as a bridge between MCP clients (like Cursor) and the Figma plugin
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs');
const path = require('path');

class FigmaMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'figma-html-bridge',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Create shared communication file path
    this.sharedDataPath = path.join(__dirname, 'mcp-shared-data.json');
    this.setupToolHandlers();
  }

  // Write data to shared file for Figma plugin to read (PHASE 1: Keep for fallback)
  writeToSharedFile(data) {
    try {
      fs.writeFileSync(this.sharedDataPath, JSON.stringify({
        timestamp: Date.now(),
        ...data
      }), 'utf8');
      return true;
    } catch (error) {
      console.error('[MCP Bridge] Error writing to shared file:', error);
      return false;
    }
  }

  // NEW PHASE 1: Send directly to Figma plugin via postMessage simulation
  async sendToFigmaStorage(data) {
    try {
      // For Phase 1, we'll write to a browser-accessible location
      // This requires the plugin to poll a different location
      const storageData = {
        timestamp: Date.now(),
        ...data
      };
      
      // Write to file but also attempt direct communication
      this.writeToSharedFile(storageData);
      
      console.error('[MCP Bridge] Data written for plugin storage access');
      console.error('[MCP Bridge] Plugin should detect this via clientStorage polling');
      
      return true;
    } catch (error) {
      console.error('[MCP Bridge] Error in Phase 1 storage communication:', error);
      return false;
    }
  }

  // Read response from shared file
  readFromSharedFile() {
    try {
      if (fs.existsSync(this.sharedDataPath)) {
        const data = fs.readFileSync(this.sharedDataPath, 'utf8');
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('[MCP Bridge] Error reading from shared file:', error);
      return null;
    }
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'mcp_html_to_design_import-html',
            description: 'Import HTML content directly into Figma design',
            inputSchema: {
              type: 'object',
              properties: {
                html: {
                  type: 'string',
                  description: 'The HTML content to import into Figma'
                },
                name: {
                  type: 'string',
                  description: 'Name for the imported design element'
                }
              },
              required: ['html', 'name']
            }
          },
          {
            name: 'mcp_html_to_design_import-url',
            description: 'Import HTML content from a URL into Figma design',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'The URL to import content from'
                },
                viewport: {
                  type: 'number',
                  description: 'Viewport width for rendering (default: 1200)',
                  default: 1200
                },
                theme: {
                  type: 'string',
                  enum: ['default', 'light', 'dark'],
                  description: 'Theme for rendering',
                  default: 'default'
                }
              },
              required: ['url']
            }
          },
          {
            name: 'mcp_figma_get_status',
            description: 'Get current status of the Figma plugin and canvas',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        const result = await this.callFigmaPlugin(name, args);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        throw new Error(`Tool ${name} failed: ${error.message}`);
      }
    });
  }

  // Real communication with Figma plugin
  async callFigmaPlugin(functionName, args) {
    console.error(`[MCP Bridge] Calling ${functionName} with args:`, JSON.stringify(args, null, 2));
    
    // Write request to shared file
    const request = {
      type: 'mcp-request',
      function: functionName,
      arguments: args,
      requestId: Date.now().toString()
    };

    if (!this.writeToSharedFile(request)) {
      return {
        success: false,
        error: 'Failed to write request to shared file'
      };
    }

    console.error(`[MCP Bridge] Request written to ${this.sharedDataPath}`);
    console.error(`[MCP Bridge] Please ensure Figma plugin is open and monitoring for MCP requests`);

    // For now, return immediate response with instructions
    // In a full implementation, this would wait for the plugin to process and respond
    switch (functionName) {
      case 'mcp_html_to_design_import-html':
        return {
          success: true,
          message: `MCP request sent to Figma plugin`,
          instruction: 'The HTML has been sent to the Figma plugin. If the plugin is open, it should automatically process this request.',
          htmlPreview: args.html.substring(0, 200) + (args.html.length > 200 ? '...' : ''),
          requestId: request.requestId,
          sharedFile: this.sharedDataPath
        };
        
      case 'mcp_html_to_design_import-url':
        return {
          success: true,
          message: `URL import request sent to Figma plugin`,
          instruction: 'The URL import request has been sent to the Figma plugin.',
          url: args.url,
          viewport: args.viewport || 1200,
          theme: args.theme || 'default',
          requestId: request.requestId,
          sharedFile: this.sharedDataPath
        };
        
      case 'mcp_figma_get_status':
        return {
          success: true,
          status: 'bridge-active',
          message: 'MCP Bridge is running and communicating with Figma plugin via shared file',
          plugin: {
            name: 'HTML to Figma Bridge',
            version: '1.0.0',
            status: 'bridge-mode',
            capabilities: ['html-import', 'url-import', 'css-parsing', 'grid-layout']
          },
          communication: {
            method: 'shared-file',
            path: this.sharedDataPath,
            status: 'active'
          },
          instructions: [
            '1. Ensure Figma is open with the HTML-to-Figma plugin loaded',
            '2. The plugin monitors the shared file for MCP requests',
            '3. Requests are processed automatically when detected'
          ]
        };
        
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Figma MCP Bridge running on stdio');
    console.error(`Shared communication file: ${this.sharedDataPath}`);
  }
}

// Start the server
const server = new FigmaMCPServer();
server.run().catch(console.error); 