/**
 * Shared Server Configuration
 * Used by both MCP server and SSE server
 */

export const SERVER_CONFIG = {
  // Server settings
  PORT: parseInt(process.env.SSE_PORT || '3003'),
  HOST: process.env.SSE_HOST || 'localhost',
  
  // File paths
  SHARED_DATA_FILE: 'mcp-shared-data.json',
  
  // Endpoints
  ENDPOINTS: {
    SSE_STREAM: '/mcp-stream',
    MCP_TRIGGER: '/mcp-trigger',
    HEALTH: '/mcp-status',
    TEST_BROADCAST: '/test-broadcast'
  },
  
  // Timeouts and intervals
  TIMEOUTS: {
    HEARTBEAT: 30000,        // 30 seconds
    CONNECTION: 2000,        // 2 seconds  
    RETRY: 5000,            // 5 seconds
    SHUTDOWN: 2000          // 2 seconds
  },
  
  // Connection limits
  LIMITS: {
    MAX_RECONNECT_ATTEMPTS: 5,
    MAX_SSE_CONNECTIONS: 10
  }
};

// Helper functions for URL construction
export const getFullURL = (endpoint = '') => {
  return `http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}${endpoint}`;
};

export const getSSEStreamURL = () => {
  return getFullURL(SERVER_CONFIG.ENDPOINTS.SSE_STREAM);
};

export const getMCPTriggerURL = () => {
  return getFullURL(SERVER_CONFIG.ENDPOINTS.MCP_TRIGGER);
};

export const getHealthURL = () => {
  return getFullURL(SERVER_CONFIG.ENDPOINTS.HEALTH);
}; 