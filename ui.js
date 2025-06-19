"use strict";

// Global variables
var currentHTML = '';
var currentMCPName = '';

// SSE (Server-Sent Events) variables
var eventSource = null;
var sseConnected = false;
var sseReconnectAttempts = 0;
var maxReconnectAttempts = 5;
var sseReconnectDelay = 3000; // 3 seconds

// ===============================================
// SSE FUNCTIONALITY
// ===============================================

function startSSEConnection() {
    console.log('[SSE] Starting SSE connection...');
    
    if (eventSource) {
        eventSource.close();
    }
    
    try {
        eventSource = new EventSource('http://localhost:3003/mcp-stream');
        
        eventSource.onopen = function(event) {
            console.log('[SSE] Connection opened');
            sseConnected = true;
            sseReconnectAttempts = 0;
            updateSSEStatus('🟢 SSE Connected', 'success');
            // Also update MCP status to indicate SSE is ready for MCP
            updateMCPStatus('🟢 Ready for MCP Tools', 'success');
        };
        
        eventSource.onmessage = function(event) {
            console.log('[SSE] Message received:', event.data);
            
            try {
                const data = JSON.parse(event.data);
                processSSEMessage(data);
            } catch (error) {
                console.error('[SSE] Error parsing message:', error);
            }
        };
        
        eventSource.onerror = function(event) {
            console.error('[SSE] Connection error:', event);
            sseConnected = false;
            
            if (eventSource.readyState === EventSource.CLOSED) {
                updateSSEStatus('🔴 SSE Disconnected', 'error');
                attemptSSEReconnection();
            } else {
                updateSSEStatus('🟡 SSE Connection Issues', 'warning');
            }
        };
        
    } catch (error) {
        console.error('[SSE] Failed to create EventSource:', error);
        updateSSEStatus('❌ SSE Failed to Start', 'error');
    }
}

function stopSSEConnection() {
    console.log('[SSE] Stopping SSE connection...');
    
    if (eventSource) {
        eventSource.close();
        eventSource = null;
    }
    
    sseConnected = false;
    sseReconnectAttempts = 0;
    updateSSEStatus('⚪ SSE Stopped', 'info');
}

function attemptSSEReconnection() {
    if (sseReconnectAttempts >= maxReconnectAttempts) {
        console.log('[SSE] Max reconnection attempts reached');
        updateSSEStatus('❌ SSE Connection Failed', 'error');
        return;
    }
    
    sseReconnectAttempts++;
    updateSSEStatus(`🔄 Reconnecting... (${sseReconnectAttempts}/${maxReconnectAttempts})`, 'warning');
    
    setTimeout(() => {
        console.log(`[SSE] Reconnection attempt ${sseReconnectAttempts}`);
        startSSEConnection();
    }, sseReconnectDelay);
}

function processSSEMessage(data) {
    console.log('[SSE] Processing message:', data);
    
    switch (data.type) {
        case 'connection-established':
            console.log('[SSE] Connection established confirmed');
            updateSSEStatus('✅ SSE Ready for MCP', 'success');
            updateMCPStatus('✅ MCP Bridge Connected', 'success');
            break;
            
        case 'mcp-request':
            console.log('[SSE] MCP request received:', data);
            handleMCPRequest(data);
            break;
            
        case 'test-message':
            console.log('[SSE] Test message received:', data.message);
            updateSSEStatus(`📡 Test: ${data.message}`, 'info');
            break;
            
        case 'heartbeat':
            console.log('[SSE] Heartbeat received');
            // Heartbeat messages keep the connection alive, no action needed
            break;
            
        default:
            console.log('[SSE] Unknown message type:', data.type);
    }
}

// FORCE CACHE REFRESH - VERSION 3.0
function handleMCPRequest(data) {
    console.log('[SSE] *** CACHE BUSTER - VERSION 3.0 LOADED ***');
    if (data.function === 'mcp_html_to_design_import-html') {
        const htmlContent = data.arguments.html;
        const designName = data.arguments.name || 'SSE Import';
        
        console.log('[SSE] Processing HTML import:', designName);
        console.log('[SSE] *** USING DIRECT PARSING VERSION 2.0 ***');
        updateSSEStatus(`🎨 Processing: ${designName}`, 'info');
        
        // DIRECT PROCESSING: Parse HTML and send structure directly
        try {
            console.log('[SSE] Calling simpleParseHTML directly...');
            var structure = simpleParseHTML(htmlContent);
            console.log('[SSE] HTML parsed, structure length:', structure?.length || 0);
            
            // Send html-structure directly to main handler (skip parse-mcp-html)
            parent.postMessage({
                pluginMessage: {
                    type: 'html-structure',
                    structure: structure,
                    name: designName,
                    fromMCP: true,
                    mcpSource: 'sse',
                    requestId: data.requestId,
                    timestamp: data.timestamp
                }
            }, '*');
            
            console.log('[SSE] Sent html-structure directly to main handler');
            updateSSEStatus(`✅ Converted: ${designName}`, 'success');
            
        } catch (error) {
            console.error('[SSE] Error parsing HTML:', error);
            updateSSEStatus(`❌ Error: ${error.message}`, 'error');
        }
        
    } else {
        console.log('[SSE] Unknown MCP function:', data.function);
        updateSSEStatus(`❓ Unknown function: ${data.function}`, 'warning');
    }
}

function updateSSEStatus(message, type) {
    console.log(`[SSE Status] ${message}`);
    
    // Update ONLY the SSE indicator and text - avoid duplication
    const sseIndicator = document.getElementById('sse-indicator');
    const sseStatusText = document.getElementById('sse-status-text');
    
    if (sseStatusText) {
        sseStatusText.textContent = message;
    }
    
    if (sseIndicator) {
        switch(type) {
            case 'success':
                sseIndicator.textContent = '🟢';
                break;
            case 'warning':
                sseIndicator.textContent = '🟡';
                break;
            case 'error':
                sseIndicator.textContent = '🔴';
                break;
            default:
                sseIndicator.textContent = '🔴';
        }
    }
    
    // Update connection status container
    const connectionStatus = document.getElementById('connection-status');
    if (connectionStatus) {
        connectionStatus.className = 'connection-status ' + type;
    }
}

// Global function to handle all status updates (prevent conflicts)
window.updateSSEStatusGlobal = updateSSEStatus;

// ===============================================
// EXISTING MESSAGE HANDLER (Enhanced for SSE)
// ===============================================

// Message handler for plugin communication
window.onmessage = (event) => {
    const { type, html, name, mcpSource } = event.data.pluginMessage;
    
    if (type === 'parse-html') {
        try {
            displayHTML(html);
            currentHTML = html;
            document.querySelector('.convert-btn').disabled = false;
        } catch (error) {
            console.error('Error displaying HTML:', error);
            alert('Error parsing HTML: ' + error.message);
        }
    } 
    
    else if (type === 'parse-mcp-html') {
        console.log('[UI] Received parse-mcp-html - forwarding to backend');
        // Forward the message to backend immediately
        parent.postMessage({
            pluginMessage: {
                type: 'parse-mcp-html',
                html: html,
                name: name,
                fromMCP: true,
                mcpSource: mcpSource
            }
        }, '*');
    }
    
    else if (type === 'hello') {
        alert(event.data.pluginMessage.message);
    }
    
    // Handle SSE control messages
    else if (type === 'start-sse') {
        console.log('[UI] Received start-sse message');
        startSSEConnection();
    }
    
    else if (type === 'stop-sse') {
        console.log('[UI] Received stop-sse message');
        stopSSEConnection();
    }
    
    // Handle SSE connection control from the plugin
    else if (type === 'start-sse-connection') {
        console.log('[UI] Received start-sse-connection message');
        startSSEConnection();
    }
    
    else if (type === 'stop-sse-connection') {
        console.log('[UI] Received stop-sse-connection message');
        stopSSEConnection();
    }
};

// ===============================================
// EXISTING HELPER FUNCTIONS (Enhanced)
// ===============================================

// Helper functions for MCP status messages
function showMCPSuccess(message) {
    updateMCPStatus(message, 'success');
}

function showMCPError(message) {
    updateMCPStatus(message, 'error');
}

function updateMCPStatus(message, type) {
    // Update ONLY MCP status elements - no duplication
    const statusEl = document.getElementById('mcp-status-text');
    if (statusEl) {
        statusEl.textContent = message;
    }
    
    // Update MCP indicator with single icon
    const indicator = document.getElementById('mcp-indicator');
    if (indicator) {
        switch(type) {
            case 'success':
                indicator.textContent = '🟢';
                break;
            case 'warning':
            case 'connecting':
                indicator.textContent = '🟡';
                break;
            case 'error':
                indicator.textContent = '🔴';
                break;
            default:
                indicator.textContent = '⚪';
        }
    }
}

// Global function to handle all MCP status updates (prevent conflicts)
window.updateMCPStatusGlobal = updateMCPStatus;

// HTML display function
function displayHTML(html) {
    // This would be the function to preview HTML in the UI
    // For now, just store it
    currentHTML = html;
    console.log('HTML loaded for conversion:', html.substring(0, 100) + '...');
}

// ===============================================
// AUTO-START SSE ON LOAD
// ===============================================

// Initialize status indicators when UI loads (but don't auto-connect)
document.addEventListener('DOMContentLoaded', function() {
    console.log('[SSE] UI loaded, initializing status indicators...');
    
    // Initialize status indicators in disconnected state
    updateSSEStatus('🔴 SSE Disconnected', 'error');
    updateMCPStatus('⚪ MCP Bridge Inactive', 'error');
    
    // Don't auto-start - wait for user to enable the switch
    console.log('[SSE] Waiting for user to enable MCP Bridge switch...');
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    stopSSEConnection();
});

// ===============================================
// NEW UI ELEMENTS HANDLERS
// ===============================================

// Helper functions for the new connection status elements
function updateConnectionStatus(status) {
    const statusContainer = document.getElementById('connection-status');
    if (statusContainer) {
        statusContainer.className = 'connection-status ' + status;
    }
}

function updateMCPStatusIndicator(text, status) {
    const indicator = document.getElementById('mcp-indicator');
    const statusText = document.getElementById('mcp-status-text');
    
    if (statusText) {
        statusText.textContent = text;
    }
    
    if (indicator) {
        switch(status) {
            case 'connected':
            case 'success':
                indicator.textContent = '✅';
                break;
            case 'connecting':
            case 'warning':
                indicator.textContent = '🔄';
                break;
            case 'error':
                indicator.textContent = '🔴';
                break;
            default:
                indicator.textContent = '⚪';
        }
    }
}

function updateConnectionDetails(text) {
    const details = document.getElementById('connection-details');
    if (details) {
        details.textContent = text;
    }
}

// Enhanced message handler for new UI elements
function handleUIMessages(event) {
    const { type } = event.data.pluginMessage;
    
    switch(type) {
        case 'sse-connected':
            updateSSEStatus('🟢 SSE Connected', 'success');
            updateConnectionStatus('connected');
            updateConnectionDetails('Ready for MCP requests');
            break;
            
        case 'sse-disconnected':
            updateSSEStatus('🔴 SSE Disconnected', 'error');
            updateConnectionStatus('error');
            updateConnectionDetails('Connection lost');
            break;
            
        case 'mcp-ready':
            updateMCPStatusIndicator('✅ MCP Ready', 'success');
            updateConnectionDetails('MCP tools available');
            break;
            
        case 'test-broadcast':
            updateConnectionDetails('Test broadcast sent...');
            // This could trigger a test via the SSE bridge
            break;
            
        case 'test-broadcast-complete':
            updateConnectionDetails('✅ Test broadcast completed');
            break;
    }
}

// Add the new message handler to existing window.onmessage
const originalOnMessage = window.onmessage;
window.onmessage = (event) => {
    // Call original handler first
    if (originalOnMessage) {
        originalOnMessage(event);
    }
    
    // Handle new UI messages
    handleUIMessages(event);
};
/* Cache buster Wed Jun 18 19:31:35 CST 2025 */
