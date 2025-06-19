#!/usr/bin/env node

/**
 * SSE Server for Figma Plugin - Dedicated Server-Sent Events Server
 * This runs separately from the MCP server to avoid conflicts
 */

import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const SSE_PORT = 3003;

console.log('[SSE-SERVER] Starting dedicated SSE server for Figma plugin...');
console.log('[SSE-SERVER] Working directory:', __dirname);

class FigmaSSEServer {
  constructor() {
    this.sseConnections = new Set();
    this.httpServer = null;
    this.sharedDataPath = path.join(__dirname, 'mcp-shared-data.json');
    this.lastProcessedRequestId = null;
    
    // Watch for file changes
    this.setupFileWatcher();
    this.setupSSEServer();
  }

  setupFileWatcher() {
    // Watch the shared data file for changes from MCP server
    try {
      fs.watchFile(this.sharedDataPath, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
          console.log('[SSE-SERVER] Shared file changed, processing...');
          this.processSharedFile();
        }
      });
      console.log('[SSE-SERVER] File watcher setup for:', this.sharedDataPath);
    } catch (error) {
      console.log('[SSE-SERVER] File watcher setup failed:', error.message);
    }
  }

  processSharedFile() {
    try {
      if (!fs.existsSync(this.sharedDataPath)) {
        return;
      }

      const data = JSON.parse(fs.readFileSync(this.sharedDataPath, 'utf8'));
      
      // Avoid processing the same request twice
      if (data.requestId === this.lastProcessedRequestId) {
        return;
      }

      console.log('[SSE-SERVER] Processing shared data:', data.requestId);
      this.lastProcessedRequestId = data.requestId;
      
      // Broadcast to all SSE connections
      this.broadcastToSSEClients(data);
      
    } catch (error) {
      console.error('[SSE-SERVER] Error processing shared file:', error);
    }
  }

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

      // MCP Trigger endpoint (for MCP server notifications)
      if (parsedUrl.pathname === '/mcp-trigger' && req.method === 'POST') {
        this.handleMCPTrigger(req, res);
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
          version: '2.1.0-dedicated',
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // Test broadcast endpoint
      if (parsedUrl.pathname === '/test-broadcast') {
        const testMessage = {
          type: 'test-message',
          message: 'SSE server test broadcast',
          timestamp: new Date().toISOString()
        };
        const success = this.broadcastToSSEClients(testMessage);
        
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          success: success,
          activeConnections: this.sseConnections.size,
          message: testMessage
        }));
        return;
      }

      // 404 for other paths
      res.writeHead(404, { 'Access-Control-Allow-Origin': '*' });
      res.end('Not Found');
    });

    // Start the server
    this.httpServer.listen(SSE_PORT, () => {
      console.log(`[SSE-SERVER] Server listening on port ${SSE_PORT}`);
      console.log(`[SSE-SERVER] SSE endpoint: http://localhost:${SSE_PORT}/mcp-stream`);
      console.log(`[SSE-SERVER] Status endpoint: http://localhost:${SSE_PORT}/mcp-status`);
    });
  }

  handleSSEConnection(req, res) {
    console.log('[SSE-SERVER] New SSE connection');

    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Add to active connections
    this.sseConnections.add(res);

    // Send initial connection confirmation
    this.sendSSEMessage(res, {
      type: 'connection-established',
      message: 'SSE connection established',
      activeConnections: this.sseConnections.size,
      timestamp: new Date().toISOString()
    });

    // Keep connection alive with periodic heartbeat
    const heartbeat = setInterval(() => {
      if (!res.destroyed) {
        this.sendSSEMessage(res, {
          type: 'heartbeat',
          timestamp: new Date().toISOString()
        });
      }
    }, 30000); // Every 30 seconds

    // Handle connection close
    req.on('close', () => {
      console.log('[SSE-SERVER] SSE connection closed');
      clearInterval(heartbeat);
      this.sseConnections.delete(res);
    });
  }

  handleMCPTrigger(req, res) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('[SSE-SERVER] MCP trigger received:', data.requestId);
        
        // Broadcast the MCP data to SSE clients
        this.broadcastToSSEClients(data);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, broadcasted: this.sseConnections.size }));
      } catch (error) {
        console.error('[SSE-SERVER] Error handling MCP trigger:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  }

  sendSSEMessage(res, data) {
    if (res.destroyed) return false;
    
    try {
      const message = `data: ${JSON.stringify(data)}\n\n`;
      res.write(message);
      return true;
    } catch (error) {
      console.error('[SSE-SERVER] Error sending SSE message:', error);
      return false;
    }
  }

  broadcastToSSEClients(data) {
    if (this.sseConnections.size === 0) {
      console.log('[SSE-SERVER] No active SSE connections to broadcast to');
      return false;
    }

    console.log(`[SSE-SERVER] Broadcasting to ${this.sseConnections.size} connections`);
    
    let successCount = 0;
    for (const connection of this.sseConnections) {
      if (this.sendSSEMessage(connection, data)) {
        successCount++;
      }
    }

    console.log(`[SSE-SERVER] Broadcast successful to ${successCount}/${this.sseConnections.size} connections`);
    return successCount > 0;
  }

  async start() {
    console.log('[SSE-SERVER] SSE server started successfully');
  }

  shutdown() {
    console.log('[SSE-SERVER] Shutting down SSE server...');
    
    // Close all SSE connections
    for (const connection of this.sseConnections) {
      try {
        connection.end();
      } catch (error) {
        console.error('[SSE-SERVER] Error closing SSE connection:', error);
      }
    }
    
    // Close HTTP server
    if (this.httpServer) {
      this.httpServer.close();
    }
    
    // Stop file watcher
    if (fs.existsSync(this.sharedDataPath)) {
      fs.unwatchFile(this.sharedDataPath);
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('[SSE-SERVER] Received SIGINT, shutting down gracefully...');
  if (sseServer) {
    sseServer.shutdown();
  }
  process.exit(0);
});

// Start the dedicated SSE server
const sseServer = new FigmaSSEServer();
sseServer.start().catch(error => {
  console.error('[SSE-SERVER] Failed to start:', error);
  process.exit(1);
}); 