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
import { SERVER_CONFIG, getSSEStreamURL, getHealthURL } from './config/server-config.js';

// ES module equivalent of __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('[SSE-SERVER] Starting dedicated SSE server for Figma plugin...');
console.log('[SSE-SERVER] Working directory:', __dirname);

class FigmaSSEServer {
  constructor() {
    // Map of sessionId -> connection (for multi-user routing)
    this.sseConnections = new Map();
    this.httpServer = null;
    this.sharedDataPath = path.join(__dirname, SERVER_CONFIG.SHARED_DATA_FILE);
    this.lastProcessedRequestId = null;

    console.log(`[SSE-SERVER] Environment: ${SERVER_CONFIG.NODE_ENV}`);
    console.log(`[SSE-SERVER] API Key configured: ${SERVER_CONFIG.API_KEY ? 'Yes' : 'No'}`);

    // Watch for file changes
    this.setupFileWatcher();
    this.setupSSEServer();
  }

  // Verify API key for protected endpoints
  verifyApiKey(req) {
    // In development, allow requests without API key
    if (SERVER_CONFIG.NODE_ENV === 'development' && SERVER_CONFIG.API_KEY === 'dev-key') {
      return true;
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const providedKey = authHeader.substring(7); // Remove 'Bearer ' prefix
    return providedKey === SERVER_CONFIG.API_KEY;
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
      if (parsedUrl.pathname === SERVER_CONFIG.ENDPOINTS.SSE_STREAM) {
        this.handleSSEConnection(req, res);
        return;
      }

      // MCP Trigger endpoint (for MCP server notifications)
      if (parsedUrl.pathname === SERVER_CONFIG.ENDPOINTS.MCP_TRIGGER && req.method === 'POST') {
        this.handleMCPTrigger(req, res);
        return;
      }

      // Status endpoint
      if (parsedUrl.pathname === SERVER_CONFIG.ENDPOINTS.HEALTH) {
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': SERVER_CONFIG.ALLOWED_ORIGINS
        });
        res.end(JSON.stringify({
          status: 'running',
          environment: SERVER_CONFIG.NODE_ENV,
          activeConnections: this.sseConnections.size,
          activeSessions: this.getActiveSessions(),
          sseEndpoint: getSSEStreamURL(),
          version: '3.0.0-multiuser',
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // Test broadcast endpoint
      if (parsedUrl.pathname === SERVER_CONFIG.ENDPOINTS.TEST_BROADCAST) {
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
    this.httpServer.listen(SERVER_CONFIG.PORT, () => {
      console.log(`[SSE-SERVER] Server listening on port ${SERVER_CONFIG.PORT}`);
      console.log(`[SSE-SERVER] SSE endpoint: ${getSSEStreamURL()}`);
      console.log(`[SSE-SERVER] Status endpoint: ${getHealthURL()}`);
    });
  }

  handleSSEConnection(req, res) {
    // Extract sessionId from query params
    const parsedUrl = url.parse(req.url, true);
    const sessionId = parsedUrl.query.sessionId;

    if (!sessionId) {
      console.log('[SSE-SERVER] Connection rejected: No sessionId provided');
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'sessionId query parameter is required' }));
      return;
    }

    console.log(`[SSE-SERVER] New SSE connection for session: ${sessionId}`);

    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': SERVER_CONFIG.ALLOWED_ORIGINS,
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Store connection with sessionId
    this.sseConnections.set(sessionId, res);

    // Send initial connection confirmation
    this.sendSSEMessage(res, {
      type: 'connection-established',
      message: 'SSE connection established',
      sessionId: sessionId,
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
    }, SERVER_CONFIG.TIMEOUTS.HEARTBEAT);

    // Handle connection close
    req.on('close', () => {
      console.log(`[SSE-SERVER] SSE connection closed for session: ${sessionId}`);
      clearInterval(heartbeat);
      this.sseConnections.delete(sessionId);
    });
  }

  handleMCPTrigger(req, res) {
    // Verify API key for production
    if (!this.verifyApiKey(req)) {
      console.log('[SSE-SERVER] MCP trigger rejected: Invalid API key');
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid or missing API key' }));
      return;
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const sessionId = data.sessionId;

        console.log(`[SSE-SERVER] MCP trigger received for session: ${sessionId}, requestId: ${data.requestId}`);

        if (!sessionId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'sessionId is required in request body' }));
          return;
        }

        // Send to specific session instead of broadcast
        const success = this.sendToSession(sessionId, data);

        if (success) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, sessionId: sessionId }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Session not found or not connected',
            sessionId: sessionId,
            activeConnections: this.sseConnections.size
          }));
        }
      } catch (error) {
        console.error('[SSE-SERVER] Error handling MCP trigger:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  }

  // Send message to specific session
  sendToSession(sessionId, data) {
    const connection = this.sseConnections.get(sessionId);

    if (!connection) {
      console.log(`[SSE-SERVER] Session not found: ${sessionId}`);
      console.log(`[SSE-SERVER] Active sessions: ${Array.from(this.sseConnections.keys()).join(', ')}`);
      return false;
    }

    console.log(`[SSE-SERVER] Sending to session: ${sessionId}`);
    return this.sendSSEMessage(connection, data);
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
    for (const [sessionId, connection] of this.sseConnections) {
      if (this.sendSSEMessage(connection, data)) {
        successCount++;
      }
    }

    console.log(`[SSE-SERVER] Broadcast successful to ${successCount}/${this.sseConnections.size} connections`);
    return successCount > 0;
  }

  // Get list of active session IDs
  getActiveSessions() {
    return Array.from(this.sseConnections.keys());
  }

  async start() {
    console.log('[SSE-SERVER] SSE server started successfully');
  }

  shutdown() {
    console.log('[SSE-SERVER] Shutting down SSE server...');

    // Close all SSE connections
    for (const [sessionId, connection] of this.sseConnections) {
      try {
        console.log(`[SSE-SERVER] Closing connection for session: ${sessionId}`);
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