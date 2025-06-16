#!/usr/bin/env node

/**
 * MCP HTTP Server for Figma Plugin Communication
 * 
 * This server acts as a bridge between external clients (like Cursor IDE) and the Figma plugin.
 * It provides HTTP endpoints to send HTML data to Figma and retrieve status information.
 * 
 * ARCHITECTURE OVERVIEW:
 * 1. External clients send HTML via POST to /mcp-data
 * 2. Server writes the request to mcp-shared-data.json file
 * 3. Figma plugin polls GET /mcp-data to read new requests
 * 4. Plugin processes HTML and creates Figma nodes
 * 
 * ENDPOINTS:
 * 
 * GET /mcp-data
 * - Purpose: Read pending MCP requests from shared file
 * - Used by: Figma plugin (polling every 2 seconds)
 * - Returns: JSON with timestamp, function, arguments, requestId
 * - File dependency: mcp-shared-data.json must exist
 * 
 * POST /mcp-data  
 * - Purpose: Receive HTML data from external clients
 * - Used by: Cursor IDE, CLI tools, external applications
 * - Expects: JSON with { html: string, name?: string }
 * - Action: Writes formatted MCP request to mcp-shared-data.json
 * - Critical: MUST write to file for Figma plugin to detect changes
 * 
 * GET /health
 * - Purpose: Server status and file existence check
 * - Returns: { status: "ok", mcpFile: "exists"|"missing", timestamp }
 * 
 * DATA FLOW:
 * 1. Client POST → Server receives HTML data
 * 2. Server formats as MCP request with timestamp
 * 3. Server writes to mcp-shared-data.json (CRITICAL STEP)
 * 4. Figma plugin GET polling detects new timestamp
 * 5. Plugin reads request and processes HTML
 * 6. Plugin creates Figma nodes from HTML structure
 * 
 * IMPORTANT NOTES:
 * - The shared file (mcp-shared-data.json) is the ONLY communication method
 * - Figma plugin cannot directly receive HTTP requests
 * - POST endpoint MUST write to file, not just return data
 * - Timestamp is used by plugin to detect new requests
 * - All requests use 'mcp_html_to_design_import-html' function
 * 
 * DO NOT MODIFY:
 * - File writing logic in POST endpoint
 * - JSON structure format for MCP requests  
 * - Timestamp-based change detection system
 * - GET endpoint file reading mechanism
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const MCP_FILE = path.join(__dirname, 'mcp-shared-data.json');

const server = http.createServer((req, res) => {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // GET /mcp-data - Read requests for Figma plugin
  if (req.url === '/mcp-data' && req.method === 'GET') {
    try {
      if (fs.existsSync(MCP_FILE)) {
        const data = fs.readFileSync(MCP_FILE, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      } else {
        // Return 200 with empty object instead of 404 to avoid plugin errors
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'no-data' }));
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to read MCP data' }));
    }
  } 
  // POST /mcp-data - Receive HTML from external clients
  else if (req.url === '/mcp-data' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        
        // CRITICAL: Write data to shared file for Figma plugin to read
        // This is the ONLY way the plugin can receive the data
        const mcpRequest = {
          timestamp: Date.now(), // Used by plugin to detect new requests
          type: 'mcp-request',
          function: 'mcp_html_to_design_import-html', // Expected by plugin
          arguments: {
            html: data.html,
            name: data.name || 'MCP Import'
          },
          requestId: Date.now().toString()
        };
        
        // Write to file - DO NOT REMOVE OR MODIFY THIS
        fs.writeFileSync(MCP_FILE, JSON.stringify(mcpRequest), 'utf8');
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'Data received and written to file', data: mcpRequest }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } 
  // DELETE /mcp-data - Clear processed requests
  else if (req.url === '/mcp-data' && req.method === 'DELETE') {
    try {
      if (fs.existsSync(MCP_FILE)) {
        fs.unlinkSync(MCP_FILE);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'MCP data cleared' }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to clear MCP data' }));
    }
  }
  // GET /health - Server status check
  else if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      mcpFile: fs.existsSync(MCP_FILE) ? 'exists' : 'missing',
      timestamp: Date.now()
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`MCP HTTP Server running on http://localhost:${PORT}`);
  console.log(`MCP data available at: http://localhost:${PORT}/mcp-data`);
  console.log(`Health check at: http://localhost:${PORT}/health`);
});

process.on('SIGINT', () => {
  console.log('\nShutting down MCP HTTP Server...');
  server.close(() => {
    process.exit(0);
  });
}); 