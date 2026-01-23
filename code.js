"use strict";
/// <reference types="@figma/plugin-typings" />
const html = `<html>
<head>
  <title>HTML to Figma</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #FFFFFF;
      color: #1A1A1A;
      padding: 16px;
      line-height: 1.4;
      min-height: auto;
      display: flex;
      flex-direction: column;
    }
    
    .header {
      text-align: left;
      margin-bottom: 12px;
    }
    
    .subtitle {
      font-size: 14px;
      color: #1A1A1A;
      opacity: 0.7;
    }
    
    /* Tab Styles */
    .tab-container {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .tab {
      flex: 1;
      padding: 10px 16px;
      background: #F8F8F8;
      border: 2px solid #E6E6E6;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #1A1A1A;
      opacity: 0.7;
      transition: all 0.2s ease;
      text-align: center;
    }
    
    .tab.active {
      background: #FFFFFF;
      border-color: #9747FF;
      opacity: 1;
    }
    
    .tab:hover {
      opacity: 0.9;
    }
    
    /* Tab Content */
    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }
    
    /* MCP Tab Styles */
    .mcp-description {
      font-size: 14px;
      color: #1A1A1A;
      opacity: 0.7;
      margin-bottom: 20px;
      text-align: left;
    }
    
    .switch-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      padding: 12px;
      background: #F8F8F8;
      border-radius: 6px;
    }
    
    .switch-label {
      font-size: 14px;
      font-weight: 500;
      color: #1A1A1A;
    }
    
    /* Toggle Switch */
    .switch {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 24px;
    }
    
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.3s;
      border-radius: 24px;
    }
    
    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
    
    input:checked + .slider {
      background-color: #9747FF;
    }
    
    input:checked + .slider:before {
      transform: translateX(24px);
    }
    
        /* Legacy Status Messages - Hidden to avoid conflicts */
    .status-messages {
      display: none !important;
    }
    
    /* Paste HTML Tab Styles */
    .input-container {
      margin-bottom: 12px;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    
    .textarea {
      width: 100%;
      flex: 1;
      min-height: 150px;
      padding: 12px;
      border: 1px solid #E6E6E6;
      border-radius: 6px;
      font-size: 12px;
      font-family: 'Monaco', 'Menlo', monospace;
      color: #1A1A1A;
      resize: none;
      outline: none;
      transition: border-color 0.2s ease;
      overflow-y: auto;
      margin-bottom: 4px;
    }
    
    .textarea:focus {
      border-color: #9747FF;
    }
    
    .textarea::placeholder {
      color: #1A1A1A;
      opacity: 0.4;
      font-size: 14px;
      font-weight: 500;
    }
    
    .button {
      width: 100%;
      height: 36px;
      background: #9747FF;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .button:hover {
      background: #8232FF;
    }
    
    .button:active {
      background: #7029E6;
    }

    .test-button {
      background: #6B7280;
      margin-top: auto;
      height: 32px;
      font-size: 13px;
    }

    .test-button:hover {
      background: #4B5563;
    }

    .description-text {
      font-size: 14px;
      color: #1A1A1A;
      opacity: 0.7;
      margin-bottom: 12px;
      text-align: left;
    }

    .description-text small {
      display: block;
      margin-top: 8px;
      color: #6c757d;
      font-size: 12px;
      line-height: 1.4;
      opacity: 0.8;
    }

    /* CONNECTION STATUS STYLES - Minimalist */
    .connection-status {
      margin: 12px 0;
      padding: 12px 0;
      border-top: 1px solid #E6E6E6;
      border-bottom: 1px solid #E6E6E6;
    }

    .status-row {
      display: flex;
      align-items: center;
      margin: 6px 0;
    }

    .status-icon {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 10px;
      background: #ccc;
      flex-shrink: 0;
    }

    .status-icon.connected {
      background: #22c55e;
    }

    .status-icon.error {
      background: #ef4444;
    }

    .status-icon.warning {
      background: #f59e0b;
    }

    .status-icon.inactive {
      background: #9ca3af;
    }

    .status-text {
      font-weight: 400;
      font-size: 13px;
      color: #666;
    }

    .info-row {
      margin-top: 8px;
    }

    .status-detail {
      font-size: 11px;
      color: #999;
    }

    /* ACTION BUTTONS */
    .action-buttons {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }

    .button.secondary {
      background: transparent;
      color: #888;
      font-size: 12px;
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      width: auto;
      height: auto;
    }

    .button.secondary:hover {
      border-color: #999;
      color: #666;
    }

    .button.tertiary {
      background: transparent;
      color: #6c757d;
      border: 1px solid #6c757d;
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      width: auto;
      height: auto;
    }

    .button.tertiary:hover {
      background: #6c757d;
      color: white;
    }

    /* ADVANCED PANEL STYLES */
    .advanced-panel {
      margin-top: 12px;
      padding: 12px;
      background: #ffffff;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .panel-header {
      font-weight: 600;
      font-size: 14px;
      color: #333;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #dee2e6;
    }

    .setting-group {
      margin-bottom: 15px;
    }

    .setting-label {
      display: block;
      font-weight: 500;
      font-size: 12px;
      color: #495057;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }



    .checkbox-row {
      display: flex;
      align-items: center;
      margin: 6px 0;
    }

    .checkbox-row input[type="checkbox"] {
      margin-right: 8px;
    }

    .checkbox-row label {
      font-size: 13px;
      color: #333;
      cursor: pointer;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin: 6px 0;
      font-size: 12px;
    }

    .info-row code {
      background: #f8f9fa;
      padding: 2px 4px;
      border-radius: 3px;
      font-size: 11px;
      color: #e83e8c;
    }

    /* Floating Minimize Button - Always in same position */
    .minimize-btn {
      position: fixed;
      top: 6px;
      right: 6px;
      width: 20px;
      height: 20px;
      border: none;
      background: #F0F0F0;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #666;
      transition: background 0.15s ease, color 0.15s ease;
      z-index: 1000;
    }

    .minimize-btn:hover {
      background: #E0E0E0;
      color: #1A1A1A;
    }

    /* Minimized state */
    .minimized-bar {
      display: none;
      padding: 8px 16px;
      padding-right: 40px;
      background: #FFFFFF;
      align-items: center;
      gap: 10px;
      height: 36px;
    }

    .minimized-bar .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #dc3545;
      flex-shrink: 0;
    }

    .minimized-bar .status-dot.connected {
      background: #28a745;
    }

    .minimized-bar .status-text {
      font-size: 12px;
      color: #666;
      white-space: nowrap;
    }

    body.minimized .minimized-bar {
      display: flex;
    }

    body.minimized .plugin-content {
      display: none;
    }

    body.minimized {
      padding: 0;
      height: auto;
      overflow: hidden;
    }

  </style>
</head>
<body>
  <!-- Floating Minimize Button (visible when expanded) -->
  <button class="minimize-btn" id="minimize-btn" title="Minimize">−</button>

  <!-- Minimized state bar (hidden by default) -->
  <div class="minimized-bar">
    <span class="status-dot" id="minimized-status-dot"></span>
    <span class="status-text" id="minimized-status-text">Disconnected</span>
  </div>

  <!-- Main Content -->
  <div class="plugin-content" id="plugin-content">
    <div class="header">
      <div class="subtitle">Convert HTML to Figma designs instantly</div>
    </div>

    <!-- Tabs -->
    <div class="tab-container">
    <button class="tab active" data-tab="mcp">MCP Bridge</button>
    <button class="tab" data-tab="paste">Paste HTML</button>
  </div>
  
  <!-- MCP Bridge Tab Content -->
  <div class="tab-content active" id="mcp-tab">
    <div class="description-text">
      Connect with AI tools via MCP to send HTML directly to Figma.
    </div>
    
    <!-- MAIN CONTROL -->
    <div class="switch-container">
      <span class="switch-label">Enable MCP Bridge</span>
      <label class="switch">
        <input type="checkbox" id="mcp-switch">
        <span class="slider"></span>
      </label>
    </div>
    
    <!-- CONNECTION STATUS -->
    <div class="connection-status" id="connection-status">
      <div class="status-row">
        <span class="status-icon inactive" id="sse-indicator"></span>
        <span class="status-text" id="sse-status-text">SSE Disconnected</span>
      </div>
      <div class="status-row">
        <span class="status-icon inactive" id="mcp-indicator"></span>
        <span class="status-text" id="mcp-status-text">MCP Inactive</span>
      </div>
      <div class="status-row info-row">
        <span class="status-detail" id="connection-details">Ready to connect</span>
      </div>
    </div>
    
    <!-- ACTIONS -->
    <div class="action-buttons">
      <button id="test-broadcast-btn" class="button secondary">Test Connection</button>
      <button id="advanced-btn" class="button secondary">Advanced</button>
    </div>
    
    <!-- ADVANCED SETTINGS PANEL (Hidden by default) -->
    <div class="advanced-panel" id="advanced-panel" style="display: none;">
      <div class="panel-header">Debug & Status</div>
      
      <div class="setting-group">
        <label class="setting-label">Debug Options</label>
        <div class="checkbox-row">
          <input type="checkbox" id="detailed-logs" checked>
          <label for="detailed-logs">Show detailed console logs</label>
        </div>
      </div>
      
      <div class="setting-group">
        <label class="setting-label">Connection Info</label>
        <div class="info-row">
          <span>Endpoint:</span>
          <code>localhost:3003/mcp-stream</code>
        </div>
        <div class="info-row">
          <span>Status:</span>
          <span id="detailed-status">Ready</span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Paste HTML Tab Content -->
  <div class="tab-content" id="paste-tab">
    <div class="description-text">Paste your HTML code and convert it to Figma elements</div>
    
    <div class="input-container">
      <textarea 
        id="html-input" 
        class="textarea" 
        placeholder="Paste your HTML here..."
      ></textarea>
    </div>
    
    <button id="send-btn" class="button">Convert to Figma</button>
  </div>

  </div><!-- End plugin-content -->

<script>
// Global variable to control detailed logging
var detailedLogsEnabled = true;

// Function for conditional debugging logs
function debugLog(...args) {
  if (detailedLogsEnabled) {
    console.log(...args);
  }
}

// Essential CSS properties that Figma doesn't support
var UNSUPPORTED_CSS_PROPERTIES = [
  'animation', 'animation-name', 'animation-duration', 'animation-timing-function',
  'animation-delay', 'animation-iteration-count', 'animation-direction',
  'animation-fill-mode', 'animation-play-state', 'transition', 'transition-property',
  'transition-duration', 'transition-timing-function', 'transition-delay', 'transform'
];

// Supported content for pseudo-elements
var SUPPORTED_CONTENT = {
  '"📚"': '📚', '"💬"': '💬', '"🏛️"': '🏛️', '"⚽"': '⚽', '"🏠"': '🏠', '"👥"': '👥',
  '"📈"': '📈', '"📖"': '📖', '"★"': '★', '"•"': '•', '"→"': '→', '"←"': '←',
  '"▼"': '▼', '"▲"': '▲', '"✓"': '✓', '"✗"': '✗', '"💡"': '💡', '"🎯"': '🎯',
  '"📅"': '📅', '"🕐"': '🕐', '"⏱️"': '⏱️', '"📊"': '📊', '"📝"': '📝',
  '"🏟️"': '🏟️', '"📍"': '📍', '"🏢"': '🏢', '""': ''
};

// Tab functionality
document.querySelectorAll('.tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    var targetTab = this.getAttribute('data-tab');
    
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab').forEach(function(t) {
      t.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(function(content) {
      content.classList.remove('active');
    });
    
    // Add active class to clicked tab and corresponding content
    this.classList.add('active');
    document.getElementById(targetTab + '-tab').classList.add('active');
  });
});

// MCP Switch functionality
var mcpMonitoring = false;
document.getElementById('mcp-switch').addEventListener('change', function() {
  mcpMonitoring = this.checked;
  
  if (mcpMonitoring) {
    updateConnectionStatus('connecting');
    updateSSEStatus('SSE Connecting...', 'connecting');
    updateMCPStatus('MCP Starting', 'connecting');
    updateConnectionDetails('Establishing connection...');
    
    // Start SSE connection
    parent.postMessage({
      pluginMessage: {
        type: 'start-sse'
      }
    }, '*');
    
    // Start MCP monitoring
    parent.postMessage({
      pluginMessage: {
        type: 'start-mcp-monitoring'
      }
    }, '*');
  } else {
    updateConnectionStatus('disconnected');
    updateSSEStatus('SSE Disconnected', 'disconnected');
    updateMCPStatus('MCP Inactive', 'disconnected');
    updateConnectionDetails('Ready to connect');
    
    // Stop SSE connection
    parent.postMessage({
      pluginMessage: {
        type: 'stop-sse'
      }
    }, '*');
    
    // Stop MCP monitoring
    parent.postMessage({
      pluginMessage: {
        type: 'stop-mcp-monitoring'
      }
    }, '*');
  }
});

// Advanced settings panel toggle
document.getElementById('advanced-btn').addEventListener('click', function() {
  var panel = document.getElementById('advanced-panel');
  if (panel.style.display === 'none') {
    panel.style.display = 'block';
    this.textContent = 'Hide Advanced';
  } else {
    panel.style.display = 'none';
    this.textContent = 'Advanced';
  }
});

// Detailed logs toggle
document.getElementById('detailed-logs').addEventListener('change', function() {
  detailedLogsEnabled = this.checked;
  var statusElement = document.getElementById('detailed-status');
  if (statusElement) {
    statusElement.textContent = this.checked ? 'Debug logs enabled' : 'Debug logs disabled';
  }
  updateConnectionDetails(this.checked ? 'Detailed logs enabled' : 'Detailed logs disabled');
});

// Test connection button
document.getElementById('test-broadcast-btn').addEventListener('click', function() {
  updateConnectionDetails('Testing connection...');
  
  // Send test request via SSE
  parent.postMessage({
    pluginMessage: {
      type: 'test-broadcast'
    }
  }, '*');
  
  setTimeout(function() {
    updateConnectionDetails('Connection test sent');
  }, 1000);
});

// Minimize/Expand functionality
var isMinimized = false;
var isConnected = false;

function updateMinimizedStatus() {
  var dot = document.getElementById('minimized-status-dot');
  var text = document.getElementById('minimized-status-text');
  if (dot && text) {
    if (isConnected) {
      dot.classList.add('connected');
      text.textContent = 'Connected';
    } else {
      dot.classList.remove('connected');
      text.textContent = 'Disconnected';
    }
  }
}

document.getElementById('minimize-btn').addEventListener('click', function() {
  isMinimized = !isMinimized;
  var btn = document.getElementById('minimize-btn');

  if (isMinimized) {
    document.body.classList.add('minimized');
    btn.textContent = '+';
    btn.title = 'Expand';
    updateMinimizedStatus();
    // Send message to resize plugin window
    parent.postMessage({
      pluginMessage: {
        type: 'resize-plugin',
        minimized: true
      }
    }, '*');
  } else {
    document.body.classList.remove('minimized');
    btn.textContent = '−';
    btn.title = 'Minimize';
    // Send message to restore plugin window
    parent.postMessage({
      pluginMessage: {
        type: 'resize-plugin',
        minimized: false
      }
    }, '*');
  }
});

// Helper functions for new UI elements
function updateConnectionStatus(status) {
  var statusContainer = document.getElementById('connection-status');
  statusContainer.className = 'connection-status ' + status;
}

function updateSSEStatus(text, status) {
  var indicator = document.getElementById('sse-indicator');
  var statusText = document.getElementById('sse-status-text');

  // Update global connection state
  isConnected = (status === 'connected');
  updateMinimizedStatus();

  if (statusText) {
    statusText.textContent = text;
  }

  if (indicator) {
    indicator.className = 'status-icon';
    switch(status) {
      case 'connected':
        indicator.classList.add('connected');
        break;
      case 'connecting':
        indicator.classList.add('warning');
        break;
      case 'error':
        indicator.classList.add('error');
        break;
      default:
        indicator.classList.add('inactive');
    }
  }
}

function updateMCPStatus(text, status) {
  var indicator = document.getElementById('mcp-indicator');
  var statusText = document.getElementById('mcp-status-text');

  if (statusText) {
    statusText.textContent = text;
  }

  if (indicator) {
    indicator.className = 'status-icon';
    switch(status) {
      case 'connected':
      case 'success':
        indicator.classList.add('connected');
        break;
      case 'connecting':
        indicator.classList.add('warning');
        break;
      case 'error':
        indicator.classList.add('error');
        break;
      default:
        indicator.classList.add('inactive');
    }
  }
}

function updateConnectionDetails(text) {
  var details = document.getElementById('connection-details');
  if (details) {
    details.textContent = text;
  }
}

// CSS filtering and parsing functions
function filterUnsupportedCSS(styles) {
  var filteredStyles = {};
  for (var prop in styles) {
    if (styles.hasOwnProperty(prop)) {
      if (prop === 'content') {
        var contentValue = styles[prop];
        if (SUPPORTED_CONTENT.hasOwnProperty(contentValue)) {
          filteredStyles[prop] = styles[prop];
        }
      } else if (UNSUPPORTED_CSS_PROPERTIES.indexOf(prop) === -1) {
        filteredStyles[prop] = styles[prop];
      }
    }
  }
  return filteredStyles;
}

function parseInlineStyles(styleStr) {
  var styles = {};
  if (!styleStr) return styles;
  var declarations = styleStr.split(';');
  for (var i = 0; i < declarations.length; i++) {
    var decl = declarations[i].trim();
    if (decl) {
      var colonIdx = decl.indexOf(':');
      if (colonIdx > 0) {
        var prop = decl.substring(0, colonIdx).trim();
        var val = decl.substring(colonIdx + 1).trim();
        styles[prop] = val;
      }
    }
  }
  return filterUnsupportedCSS(styles);
}

// Función para verificar si un selector CSS es problemático
function isUnsupportedSelector(selector) {
  // Omitir @keyframes, @media, etc.
  if (selector.charAt(0) === '@') {
    return true;
  }

  // Omitir pseudo-selectores problemáticos (excepto ::before/::after que ahora soportamos)
  if (selector.includes(':hover') ||
      selector.includes(':active') ||
      selector.includes(':focus') ||
      selector.includes(':nth-child') ||
      selector.includes(':first-child') ||
      selector.includes(':last-child')) {
    return true;
  }

  // Permitir ::before y ::after (ahora los soportamos parcialmente)
  return false;
}

// Función mejorada para manejar selectores CSS complejos
function parseComplexSelector(selector) {
  // Limpiar espacios extra (sin regex problemático)
  selector = selector.split(/[ ]+/).join(' ').trim();

  // Manejar múltiples selectores separados por coma
  if (selector.indexOf(',') !== -1) {
    return selector.split(',').map(function(s) { return s.trim(); });
  }

  return [selector];
}

// Función mejorada para validar selectores CSS
function isValidCSSSelector(selector) {
  // Validación simplificada sin regex complejos
  if (!selector || selector.length === 0) return false;

  // Selector de elemento simple (h1, div, span)
  if (/^[a-zA-Z][a-zA-Z0-9-]*$/.test(selector)) return true;

  // Selector de clase simple (.class)
  if (selector.charAt(0) === '.' && selector.indexOf(' ') === -1) return true;

  // Selector de ID (#id)
  if (selector.charAt(0) === '#') return true;

  // Selectores anidados (.parent .child, div .class, etc.)
  if (selector.indexOf(' ') !== -1) return true;

  // Pseudoelementos (::before, ::after)
  if (selector.indexOf('::') !== -1) return true;

  return false;
}

function extractCSS(htmlStr) {
  var cssRules = {};
  var cssVariables = {}; // FIXED: Store CSS variables
  var allCssText = '';

  // Soportar múltiples style tags
  var searchStr = htmlStr;
  var startTag = '<style';
  var endTag = '<' + '/style>';

  while (true) {
    var styleStart = searchStr.indexOf(startTag);
    if (styleStart === -1) break;

    var contentStart = searchStr.indexOf('>', styleStart);
    if (contentStart === -1) break;
    contentStart += 1;

    var styleEnd = searchStr.indexOf(endTag, contentStart);
    if (styleEnd === -1) break;

    allCssText += searchStr.substring(contentStart, styleEnd) + ' ';
    searchStr = searchStr.substring(styleEnd + endTag.length);
  }

  if (!allCssText) return cssRules;

  // Remove CSS comments (simple approach sin regex problemático)
  var cleanCss = '';
  var inComment = false;
  for (var ci = 0; ci < allCssText.length; ci++) {
    if (!inComment && allCssText[ci] === '/' && allCssText[ci+1] === '*') {
      inComment = true;
      ci++;
    } else if (inComment && allCssText[ci] === '*' && allCssText[ci+1] === '/') {
      inComment = false;
      ci++;
    } else if (!inComment) {
      cleanCss += allCssText[ci];
    }
  }
  allCssText = cleanCss;

  // FIXED: Extract CSS variables from :root
  var rootMatch = allCssText.match(/:root\s*\{([^}]+)\}/);
  if (rootMatch) {
    var rootDeclarations = rootMatch[1];
    var varPairs = rootDeclarations.split(';');
    for (var vi = 0; vi < varPairs.length; vi++) {
      var pair = varPairs[vi].trim();
      if (pair.indexOf('--') === 0) {
        var colonIdx = pair.indexOf(':');
        if (colonIdx > 0) {
          var varName = pair.substring(0, colonIdx).trim();
          var varValue = pair.substring(colonIdx + 1).trim();
          cssVariables[varName] = varValue;
        }
      }
    }
  }

  // FIXED: Function to resolve var() references
  function resolveVariables(value) {
    if (!value || typeof value !== 'string') return value;
    return value.replace(/var\(([^)]+)\)/g, function(match, varRef) {
      var parts = varRef.split(',');
      var varName = parts[0].trim();
      var fallback = parts[1] ? parts[1].trim() : null;
      return cssVariables[varName] || fallback || match;
    });
  }

  // FIXED: Remove @media, @keyframes, @supports blocks to prevent parsing issues
  // These have nested braces that confuse the simple split by '}'
  function removeAtRuleBlocks(css) {
    var result = '';
    var i = 0;
    while (i < css.length) {
      // Check for @ rules
      if (css[i] === '@' && (css.substring(i, i + 6) === '@media' ||
                             css.substring(i, i + 10) === '@keyframes' ||
                             css.substring(i, i + 9) === '@supports' ||
                             css.substring(i, i + 8) === '@charset' ||
                             css.substring(i, i + 7) === '@import')) {
        // Find the opening brace
        var braceStart = css.indexOf('{', i);
        if (braceStart === -1) {
          // No brace, skip to end of line
          var lineEnd = css.indexOf(';', i);
          i = lineEnd !== -1 ? lineEnd + 1 : css.length;
          continue;
        }
        // Count braces to find matching closing brace
        var braceCount = 1;
        var j = braceStart + 1;
        while (j < css.length && braceCount > 0) {
          if (css[j] === '{') braceCount++;
          else if (css[j] === '}') braceCount--;
          j++;
        }
        i = j; // Skip the entire @rule block
      } else {
        result += css[i];
        i++;
      }
    }
    return result;
  }

  allCssText = removeAtRuleBlocks(allCssText);

  var rules = allCssText.split('}');

  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i].trim();
    if (rule) {
      var braceIdx = rule.indexOf('{');
      if (braceIdx > 0) {
        var selector = rule.substring(0, braceIdx).trim();
        var declarations = rule.substring(braceIdx + 1).trim();

        if (selector && declarations && !isUnsupportedSelector(selector)) {
          // Procesar selectores múltiples (separados por coma)
          var selectors = parseComplexSelector(selector);

          for (var j = 0; j < selectors.length; j++) {
            var singleSelector = selectors[j];

            if (isValidCSSSelector(singleSelector)) {
              // FIXED: Resolve CSS variables before parsing
              var resolvedDeclarations = resolveVariables(declarations);
              // Almacenar la regla CSS procesada
              cssRules[singleSelector] = Object.assign({}, cssRules[singleSelector] || {}, parseInlineStyles(resolvedDeclarations));

              // También manejar variaciones del selector
              if (singleSelector.includes(' ')) {
                // Para selectores anidados, también guardar versión normalizada
                var normalizedSelector = singleSelector.replace(/\s+/g, ' ');
                if (normalizedSelector !== singleSelector) {
                  cssRules[normalizedSelector] = Object.assign({}, cssRules[normalizedSelector] || {}, parseInlineStyles(resolvedDeclarations));
                }
              }
            }
          }
        }
      }
    }
  }

  return cssRules;
}

// HTML parsing function - COMPLETE VERSION with CSS specificity support
function simpleParseHTML(htmlStr) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(htmlStr, 'text/html');
  var body = doc.body || doc.documentElement;

  var cssRules = extractCSS(htmlStr);

  // Función para extraer content de pseudoelementos
  function extractPseudoContent(element, cssRules) {
    var className = element.getAttribute('class');
    var tagName = element.tagName.toLowerCase();
    var beforeContent = '';
    var afterContent = '';

    if (className) {
      var classes = className.split(' ').filter(function(c) { return c.trim(); });

      // Buscar ::before content
      for (var i = 0; i < classes.length; i++) {
        var beforeSelector = '.' + classes[i] + '::before';
        if (cssRules[beforeSelector] && cssRules[beforeSelector].content) {
          var contentValue = cssRules[beforeSelector].content;
          if (SUPPORTED_CONTENT.hasOwnProperty(contentValue)) {
            beforeContent = SUPPORTED_CONTENT[contentValue];
            break;
          }
        }
      }

      // Buscar ::after content
      for (var i = 0; i < classes.length; i++) {
        var afterSelector = '.' + classes[i] + '::after';
        if (cssRules[afterSelector] && cssRules[afterSelector].content) {
          var contentValue = cssRules[afterSelector].content;
          if (SUPPORTED_CONTENT.hasOwnProperty(contentValue)) {
            afterContent = SUPPORTED_CONTENT[contentValue];
            break;
          }
        }
      }
    }

    // También buscar por elemento
    var beforeElementSelector = tagName + '::before';
    var afterElementSelector = tagName + '::after';

    if (cssRules[beforeElementSelector] && cssRules[beforeElementSelector].content && !beforeContent) {
      var contentValue = cssRules[beforeElementSelector].content;
      if (SUPPORTED_CONTENT.hasOwnProperty(contentValue)) {
        beforeContent = SUPPORTED_CONTENT[contentValue];
      }
    }

    if (cssRules[afterElementSelector] && cssRules[afterElementSelector].content && !afterContent) {
      var contentValue = cssRules[afterElementSelector].content;
      if (SUPPORTED_CONTENT.hasOwnProperty(contentValue)) {
        afterContent = SUPPORTED_CONTENT[contentValue];
      }
    }

    return { before: beforeContent, after: afterContent };
  }

  // Función mejorada para obtener todos los selectores que aplican a un elemento
  function getAllMatchingSelectors(element) {
    var matchingSelectors = [];
    var className = element.getAttribute('class');
    var tagName = element.tagName.toLowerCase();
    var elementId = element.getAttribute('id');

    // Construir jerarquía de ancestors
    var ancestors = [];
    var currentElement = element.parentElement;
    while (currentElement && currentElement.tagName !== 'BODY' && currentElement.tagName !== 'HTML') {
      var ancestorClasses = currentElement.getAttribute('class');
      var ancestorTag = currentElement.tagName.toLowerCase();
      var ancestorId = currentElement.getAttribute('id');

      ancestors.push({
        classes: ancestorClasses ? ancestorClasses.split(' ').filter(function(c) { return c.trim(); }) : [],
        tag: ancestorTag,
        id: ancestorId
      });
      currentElement = currentElement.parentElement;
    }

    // Verificar todos los selectores CSS disponibles
    for (var selector in cssRules) {
      if (cssRules.hasOwnProperty(selector)) {
        // Skip pseudo-element selectors for main style matching
        if (selector.includes('::before') || selector.includes('::after')) {
          continue;
        }
        if (selectorMatches(selector, element, className, tagName, elementId, ancestors)) {
          matchingSelectors.push({
            selector: selector,
            specificity: calculateSpecificity(selector),
            styles: cssRules[selector]
          });
        }
      }
    }

    // Ordenar por especificidad (menor a mayor)
    matchingSelectors.sort(function(a, b) {
      return a.specificity - b.specificity;
    });

    return matchingSelectors;
  }

  // Función para verificar si un selector CSS coincide con un elemento
  function selectorMatches(selector, element, className, tagName, elementId, ancestors) {
    // FIXED: Universal selector (*) matches all elements
    if (selector === '*') {
      return true;
    }

    // Selector de elemento simple
    if (selector === tagName) {
      return true;
    }

    // Selector de clase simple
    if (selector.charAt(0) === '.' && !selector.includes(' ') && className) {
      var selectorClass = selector.substring(1);
      // Handle combined classes like .class1.class2
      if (selectorClass.includes('.')) {
        return matchesCombinedClasses(selector, className);
      }
      var classes = className.split(' ').filter(function(c) { return c.trim(); });
      return classes.indexOf(selectorClass) !== -1;
    }

    // Selector de ID
    if (selector.charAt(0) === '#' && elementId) {
      return selector.substring(1) === elementId;
    }

    // Selectores anidados (descendant, child >, sibling +, ~)
    if (selector.includes(' ') || selector.includes('>') || selector.includes('+') || selector.includes('~')) {
      return matchesNestedSelector(selector, element, className, tagName, elementId, ancestors);
    }

    // Selectores múltiples con clases combinadas (.class1.class2)
    if (selector.includes('.') && !selector.includes(' ') && selector.indexOf('.') !== selector.lastIndexOf('.')) {
      return matchesCombinedClasses(selector, className);
    }

    return false;
  }

  // Función para manejar selectores anidados (descendant, child >, sibling +~)
  function matchesNestedSelector(selector, element, className, tagName, elementId, ancestors) {
    // Parse selector into tokens with combinators
    // Combinators: ' ' (descendant), '>' (child), '+' (adjacent sibling), '~' (general sibling)
    var tokens = parseSelector(selector);

    if (tokens.length === 0) return false;

    // Last token must match current element
    var lastToken = tokens[tokens.length - 1];
    if (!selectorMatches(lastToken.selector, element, className, tagName, elementId, [])) {
      return false;
    }

    // Process remaining tokens from right to left
    var ancestorIndex = 0;
    for (var i = tokens.length - 2; i >= 0; i--) {
      var token = tokens[i];
      var combinator = tokens[i + 1].combinator; // Combinator that connects to next token
      var found = false;

      if (combinator === '>') {
        // Child combinator: must match immediate parent
        if (ancestorIndex < ancestors.length) {
          var parent = ancestors[ancestorIndex];
          var parentClassNames = parent.classes.join(' ');
          if (selectorMatches(token.selector, null, parentClassNames, parent.tag, parent.id, [])) {
            found = true;
            ancestorIndex++;
          }
        }
      } else if (combinator === '+' || combinator === '~') {
        // Sibling selectors: not fully supported in this context (need sibling info)
        // For now, treat as descendant (partial support)
        while (ancestorIndex < ancestors.length) {
          var ancestor = ancestors[ancestorIndex];
          var ancestorClassNames = ancestor.classes.join(' ');
          if (selectorMatches(token.selector, null, ancestorClassNames, ancestor.tag, ancestor.id, [])) {
            found = true;
            ancestorIndex++;
            break;
          }
          ancestorIndex++;
        }
      } else {
        // Descendant combinator (space): can skip ancestors
        while (ancestorIndex < ancestors.length) {
          var ancestor = ancestors[ancestorIndex];
          var ancestorClassNames = ancestor.classes.join(' ');
          if (selectorMatches(token.selector, null, ancestorClassNames, ancestor.tag, ancestor.id, [])) {
            found = true;
            ancestorIndex++;
            break;
          }
          ancestorIndex++;
        }
      }

      if (!found) {
        return false;
      }
    }

    return true;
  }

  // Parse selector into tokens with combinators
  function parseSelector(selector) {
    var tokens = [];
    var current = '';
    var lastCombinator = ' ';

    for (var i = 0; i < selector.length; i++) {
      var char = selector[i];

      if (char === '>' || char === '+' || char === '~') {
        if (current.trim()) {
          tokens.push({ selector: current.trim(), combinator: lastCombinator });
        }
        lastCombinator = char;
        current = '';
      } else if (char === ' ') {
        // Check if this is a space combinator or just whitespace around other combinators
        if (current.trim() && i + 1 < selector.length) {
          var nextNonSpace = selector.substring(i + 1).trimStart()[0];
          if (nextNonSpace !== '>' && nextNonSpace !== '+' && nextNonSpace !== '~') {
            tokens.push({ selector: current.trim(), combinator: lastCombinator });
            lastCombinator = ' ';
            current = '';
          }
        }
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      tokens.push({ selector: current.trim(), combinator: lastCombinator });
    }

    return tokens;
  }

  // Función para manejar clases combinadas (.class1.class2)
  function matchesCombinedClasses(selector, className) {
    if (!className) return false;

    var requiredClasses = selector.split('.').filter(function(c) { return c.trim(); });
    var elementClasses = className.split(' ').filter(function(c) { return c.trim(); });

    return requiredClasses.every(function(reqClass) {
      return elementClasses.indexOf(reqClass) !== -1;
    });
  }

  // Calcular especificidad CSS básica
  function calculateSpecificity(selector) {
    var specificity = 0;

    // IDs = 100 (contar #)
    for (var si = 0; si < selector.length; si++) {
      if (selector[si] === '#') specificity += 100;
    }

    // Classes = 10 (contar .)
    for (var si = 0; si < selector.length; si++) {
      if (selector[si] === '.') specificity += 10;
    }

    // Elements = 1 (buscar palabras alfabéticas que no sigan a . o #)
    var inWord = false;
    var wordStart = 0;
    for (var si = 0; si <= selector.length; si++) {
      var ch = selector[si];
      var isAlpha = ch && ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') || ch === '-');
      if (isAlpha && !inWord) {
        inWord = true;
        wordStart = si;
      } else if (!isAlpha && inWord) {
        inWord = false;
        // Verificar si la palabra anterior no empieza con . o #
        var prevChar = wordStart > 0 ? selector[wordStart - 1] : '';
        if (prevChar !== '.' && prevChar !== '#') {
          specificity += 1;
        }
      }
    }

    return specificity;
  }

  function getElementStyles(element) {
    var styles = {};

    // Obtener todos los selectores que coinciden y aplicar en orden de especificidad
    var matchingSelectors = getAllMatchingSelectors(element);

    for (var i = 0; i < matchingSelectors.length; i++) {
      styles = Object.assign(styles, matchingSelectors[i].styles);
    }

    // Apply inline styles last (highest priority)
    var inlineStyle = element.getAttribute('style');
    if (inlineStyle) {
      var inlineStyles = parseInlineStyles(inlineStyle);
      styles = Object.assign(styles, inlineStyles);
    }

    return styles;
  }

  function nodeToStruct(node) {
    if (node.nodeType === 1) {
      var tag = node.tagName.toLowerCase();
      var styles = getElementStyles(node);
      var text = '';
      var children = [];
      var mixedContent = []; // NEW: Track order of text and elements

      // Extraer contenido de pseudoelementos
      var pseudoContent = extractPseudoContent(node, cssRules);

      // Add ::before content as first mixed content item
      if (pseudoContent.before) {
        mixedContent.push({ type: 'text', text: pseudoContent.before });
      }

      for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];
        if (child.nodeType === 3) {
          var textContent = child.textContent.trim();
          if (textContent) {
            text += textContent;
            // NEW: Add text to mixedContent array in order
            mixedContent.push({ type: 'text', text: textContent });
          }
        } else if (child.nodeType === 1) {
          var childStruct = nodeToStruct(child);
          if (childStruct) {
            children.push(childStruct);
            // NEW: Add element to mixedContent array in order
            mixedContent.push({ type: 'element', node: childStruct });
          }
        }
      }

      // Add ::after content as last mixed content item
      if (pseudoContent.after) {
        mixedContent.push({ type: 'text', text: pseudoContent.after });
      }

      // Legacy text property (for backward compatibility)
      if (pseudoContent.before) {
        text = pseudoContent.before + (text ? ' ' + text : '');
      }
      if (pseudoContent.after) {
        text = (text || '') + (text ? ' ' : '') + pseudoContent.after;
      }

      // Determine if this element has mixed content (text interleaved with elements)
      var hasMixedContent = false;
      var hasText = false;
      var hasElements = false;
      for (var j = 0; j < mixedContent.length; j++) {
        if (mixedContent[j].type === 'text') hasText = true;
        if (mixedContent[j].type === 'element') hasElements = true;
      }
      hasMixedContent = hasText && hasElements;

      return {
        type: 'element',
        tagName: tag,
        text: text.trim(),
        styles: styles,
        attributes: {
          value: node.getAttribute('value'),
          placeholder: node.getAttribute('placeholder'),
          alt: node.getAttribute('alt'),
          rows: node.getAttribute('rows')
        },
        children: children,
        mixedContent: hasMixedContent ? mixedContent : null, // Only include if truly mixed
        pseudoContent: pseudoContent // Guardar para referencia
      };
    }
    return null;
  }

  // Include body element with its styles (background, font-family, etc.)
  var bodyStruct = nodeToStruct(body);
  if (bodyStruct) {
    return [bodyStruct];
  }

  // Fallback: if body parsing fails, return children directly
  var result = [];
  for (var i = 0; i < body.childNodes.length; i++) {
    var child = nodeToStruct(body.childNodes[i]);
    if (child) result.push(child);
  }

  return result;
}

// Convert to Figma button functionality
document.getElementById('send-btn').onclick = function() {
  var htmlValue = document.getElementById('html-input').value;
  if (!htmlValue.trim()) {
    alert('Please paste some HTML code first.');
    return;
  }
  
  var structure = simpleParseHTML(htmlValue);
  parent.postMessage({
    pluginMessage: {
      type: 'html-structure',
      structure: structure
    }
  }, '*');
};

// Test Connection button functionality - REMOVED (now handled by addEventListener above)
// The test button is now 'test-broadcast-btn' and handled in the event listeners section

// Helper functions for new status system
function updateConnectionDetails(text) {
  var details = document.getElementById('connection-details');
  if (details) {
    details.textContent = text;
  }
}

function updateMCPStatus(text, status) {
  var indicator = document.getElementById('mcp-indicator');
  var statusText = document.getElementById('mcp-status-text');

  if (statusText) {
    statusText.textContent = text;
  }

  if (indicator) {
    indicator.className = 'status-icon';
    switch(status) {
      case 'success':
      case 'connected':
        indicator.classList.add('connected');
        break;
      case 'waiting':
      case 'info':
      case 'connecting':
        indicator.classList.add('warning');
        break;
      case 'error':
        indicator.classList.add('error');
        break;
      default:
        indicator.classList.add('inactive');
    }
  }
    }
    
// Status message function - DEPRECATED - now using direct status functions
function updateStatusMessage(message, type) {
  // Legacy function - redirected to new system
  updateConnectionDetails(message);
  if (message.includes('MCP') || message.includes('connection') || message.includes('test')) {
    updateMCPStatus(message, type);
  }
}

// Listen for messages from the plugin
window.addEventListener('message', function(event) {
  if (event.data.pluginMessage) {
    var msg = event.data.pluginMessage;
    
    if (msg.type === 'mcp-test-response') {
      updateStatusMessage(msg.message, 'info');
    } else if (msg.type === 'mcp-status-update') {
      updateStatusMessage(msg.message, msg.status || 'info');
    } else if (msg.type === 'parse-mcp-html') {
      updateStatusMessage('Processing: ' + msg.name, 'waiting');
      
      try {
        var structure = simpleParseHTML(msg.html);
        parent.postMessage({
          pluginMessage: {
            type: 'html-structure',
            structure: structure,
            name: msg.name,
            fromMCP: true
          }
        }, '*');
        
        updateStatusMessage('Converted: ' + msg.name, 'success');
      } catch (error) {
        updateStatusMessage('Error processing HTML', 'error');
      }
    } else if (msg.type === 'request-file-mcp-data') {
      // Handle file system reading for MCP data
      fetch('./mcp-shared-data.json')
        .then(response => response.ok ? response.json() : Promise.reject('Not found'))
        .then(data => {
          parent.postMessage({
            pluginMessage: {
              type: 'file-mcp-data-response',
              data: data
            }
          }, '*');
        })
        .catch(error => {
          parent.postMessage({
            pluginMessage: {
              type: 'file-mcp-data-response',
              data: null
            }
          }, '*');
        });
    } else if (msg.type === 'delete-file-mcp-data') {
      // Handle cleanup request
      fetch('./mcp-shared-data.json', { method: 'DELETE' })
        .then(() => console.log('MCP file cleanup completed'))
        .catch(() => console.log('MCP file cleanup attempted'));
    }
  }
});

// ===============================================
// SSE FUNCTIONALITY - Real Implementation
// ===============================================

var eventSource = null;
var sseConnected = false;
var sseReconnectAttempts = 0;
var maxReconnectAttempts = 5;
var sseReconnectDelay = 3000;

function startRealSSEConnection() {
          debugLog('[SSE] Starting real SSE connection...');
  
  if (eventSource) {
    eventSource.close();
  }
  
  try {
            eventSource = new EventSource('http://localhost:3003/mcp-stream');
    
    eventSource.onopen = function(event) {
      debugLog('[SSE] Connection opened successfully');
      sseConnected = true;
      sseReconnectAttempts = 0;
      updateSSEStatus('SSE Connected', 'connected');
      updateConnectionStatus('connected');
      updateConnectionDetails('Ready for MCP requests');
    };
    
    eventSource.onmessage = function(event) {
      debugLog('[SSE] Message received:', event.data);
      
      try {
        var data = JSON.parse(event.data);
        processSSEMessage(data);
      } catch (error) {
        console.error('[SSE] Error parsing message:', error);
      }
    };
    
    eventSource.onerror = function(event) {
      console.error('[SSE] Connection error:', event);
      sseConnected = false;
      
      if (eventSource.readyState === EventSource.CLOSED) {
        updateSSEStatus('SSE Disconnected', 'error');
        updateConnectionStatus('error');
        updateConnectionDetails('Connection lost');
        attemptSSEReconnection();
      } else {
        updateSSEStatus('SSE Connection Issues', 'warning');
        updateConnectionStatus('warning');
        updateConnectionDetails('Connection unstable');
      }
    };
    
  } catch (error) {
    console.error('[SSE] Failed to create EventSource:', error);
    updateSSEStatus('SSE Failed to Start', 'error');
    updateConnectionStatus('error');
    updateConnectionDetails('Failed to start SSE');
  }
}

function stopRealSSEConnection() {
  debugLog('[SSE] Stopping real SSE connection...');
  
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
  
  sseConnected = false;
  sseReconnectAttempts = 0;
  updateSSEStatus('SSE Disconnected', 'disconnected');
  updateConnectionStatus('disconnected');
  updateConnectionDetails('Ready to connect');
}

function attemptSSEReconnection() {
  if (sseReconnectAttempts >= maxReconnectAttempts) {
    debugLog('[SSE] Max reconnection attempts reached');
    updateSSEStatus('SSE Connection Failed', 'error');
    updateConnectionStatus('error');
    updateConnectionDetails('Max reconnection attempts reached');
    return;
  }
  
  sseReconnectAttempts++;
  updateSSEStatus('Reconnecting (' + sseReconnectAttempts + '/' + maxReconnectAttempts + ')', 'connecting');
  updateConnectionStatus('warning');
  updateConnectionDetails('Reconnecting...');
  
  setTimeout(function() {
    debugLog('[SSE] Reconnection attempt ' + sseReconnectAttempts);
    startRealSSEConnection();
  }, sseReconnectDelay);
}

function processSSEMessage(data) {
  debugLog('[SSE] Processing message:', data);
  
  switch (data.type) {
    case 'connection-established':
      debugLog('[SSE] Connection established confirmed');
      updateSSEStatus('SSE Ready', 'connected');
      updateMCPStatus('MCP Ready', 'connected');
      updateConnectionDetails('Ready for MCP requests');
      break;
      
    case 'mcp-request':
      debugLog('[SSE] MCP request received:', data);
      handleSSEMCPRequest(data);
      break;
      
    case 'test-message':
      debugLog('[SSE] Test message received:', data.message);
      updateConnectionDetails('Test: ' + data.message);
      break;
      
    case 'heartbeat':
      debugLog('[SSE] Heartbeat received');
      // Heartbeat messages keep the connection alive, no action needed
      break;
      
    default:
      debugLog('[SSE] Unknown message type:', data.type);
  }
}

function handleSSEMCPRequest(data) {
  if (data.function === 'mcp_html_to_design_import-html') {
    var htmlContent = data.arguments.html;
    var designName = data.arguments.name || 'SSE Import';
    
    debugLog('[SSE] Processing HTML import:', designName);
    debugLog('[SSE] *** USING DIRECT PARSING - TYPESCRIPT VERSION 4.0 ***');
    updateConnectionDetails('Processing: ' + designName);
    updateMCPStatus('Processing: ' + designName, 'connecting');
    
    // DIRECT PROCESSING: Parse HTML and send structure directly
    try {
      debugLog('[SSE] Calling simpleParseHTML directly...');
      var structure = simpleParseHTML(htmlContent);
      debugLog('[SSE] HTML parsed, structure length:', structure?.length || 0);
      
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
      
      debugLog('[SSE] Sent html-structure directly to main handler');
      updateMCPStatus('Converted: ' + designName, 'success');
      
    } catch (error) {
      console.error('[SSE] Error parsing HTML:', error);
      updateMCPStatus('Error: ' + error.message, 'error');
    }
    
  } else {
    debugLog('[SSE] Unknown MCP function:', data.function);
    updateConnectionDetails('Unknown function: ' + data.function);
  }
}

// Enhanced message handling for SSE
window.addEventListener('message', function(event) {
  if (event.data.pluginMessage) {
    var msg = event.data.pluginMessage;
    
    // Handle SSE control messages
    if (msg.type === 'start-sse-connection') {
      startRealSSEConnection();
    } else if (msg.type === 'stop-sse-connection') {
      stopRealSSEConnection();
    } else if (msg.type === 'sse-connected') {
      updateSSEStatus('SSE Connected', 'connected');
      updateMCPStatus('MCP Ready', 'connected');
    } else if (msg.type === 'sse-disconnected') {
      updateSSEStatus('SSE Disconnected', 'disconnected');
      updateMCPStatus('MCP Inactive', 'disconnected');
    } else if (msg.type === 'test-broadcast-complete') {
      updateConnectionDetails('Connection test completed');
    }
  }
});

</script>
</body>
</html>`;
figma.showUI(html, { width: 360, height: 380 });
function hexToRgb(color) {
    // Guard against null/undefined
    if (!color)
        return null;
    // First handle CSS color keywords
    const colorKeywords = {
        'white': { r: 1, g: 1, b: 1 },
        'black': { r: 0, g: 0, b: 0 },
        'red': { r: 1, g: 0, b: 0 },
        'green': { r: 0, g: 0.5, b: 0 },
        'blue': { r: 0, g: 0, b: 1 },
        'yellow': { r: 1, g: 1, b: 0 },
        'cyan': { r: 0, g: 1, b: 1 },
        'magenta': { r: 1, g: 0, b: 1 },
        'orange': { r: 1, g: 0.647, b: 0 },
        'purple': { r: 0.5, g: 0, b: 0.5 },
        'pink': { r: 1, g: 0.753, b: 0.796 },
        'brown': { r: 0.647, g: 0.165, b: 0.165 },
        'gray': { r: 0.5, g: 0.5, b: 0.5 },
        'grey': { r: 0.5, g: 0.5, b: 0.5 },
        'lightgray': { r: 0.827, g: 0.827, b: 0.827 },
        'lightgrey': { r: 0.827, g: 0.827, b: 0.827 },
        'darkgray': { r: 0.663, g: 0.663, b: 0.663 },
        'darkgrey': { r: 0.663, g: 0.663, b: 0.663 },
        'lightblue': { r: 0.678, g: 0.847, b: 1 },
        'lightgreen': { r: 0.565, g: 0.933, b: 0.565 },
        'lightcyan': { r: 0.878, g: 1, b: 1 },
        'lightyellow': { r: 1, g: 1, b: 0.878 },
        'lightpink': { r: 1, g: 0.714, b: 0.757 },
        'darkred': { r: 0.545, g: 0, b: 0 },
        'darkblue': { r: 0, g: 0, b: 0.545 },
        'darkgreen': { r: 0, g: 0.392, b: 0 },
        'transparent': { r: 0, g: 0, b: 0 }
    };
    const lowerColor = color.toLowerCase().trim();
    // Check for color keywords first
    if (colorKeywords[lowerColor]) {
        return colorKeywords[lowerColor];
    }
    // Handle rgb() format
    const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1]) / 255,
            g: parseInt(rgbMatch[2]) / 255,
            b: parseInt(rgbMatch[3]) / 255
        };
    }
    // Handle rgba() format
    const rgbaMatch = color.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/i);
    if (rgbaMatch) {
        return {
            r: parseInt(rgbaMatch[1]) / 255,
            g: parseInt(rgbaMatch[2]) / 255,
            b: parseInt(rgbaMatch[3]) / 255
        };
    }
    // Handle hexadecimal colors (original functionality)
    const hexResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (hexResult) {
        return {
            r: parseInt(hexResult[1], 16) / 255,
            g: parseInt(hexResult[2], 16) / 255,
            b: parseInt(hexResult[3], 16) / 255
        };
    }
    // Handle 3-digit hex colors
    const shortHexResult = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(color);
    if (shortHexResult) {
        return {
            r: parseInt(shortHexResult[1] + shortHexResult[1], 16) / 255,
            g: parseInt(shortHexResult[2] + shortHexResult[2], 16) / 255,
            b: parseInt(shortHexResult[3] + shortHexResult[3], 16) / 255
        };
    }
    return null;
}
function hexToRgba(color) {
    const rgb = hexToRgb(color);
    if (!rgb)
        return null;
    // Handle rgba() format with alpha
    const rgbaMatch = color.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/i);
    if (rgbaMatch) {
        return {
            r: parseInt(rgbaMatch[1]) / 255,
            g: parseInt(rgbaMatch[2]) / 255,
            b: parseInt(rgbaMatch[3]) / 255,
            a: parseFloat(rgbaMatch[4])
        };
    }
    // For transparent, return alpha 0
    if (color.toLowerCase().trim() === 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0 };
    }
    // Default alpha 1 for all other colors
    return Object.assign(Object.assign({}, rgb), { a: 1 });
}
function parseSize(value) {
    if (!value || value === 'auto' || value === 'inherit' || value === 'initial')
        return null;
    // FIXED: Handle calc() expressions
    if (value.includes('calc(')) {
        return parseCalc(value);
    }
    // Handle percentage values for border-radius specially
    if (value.includes('%')) {
        // For border-radius: 50%, we should return a special value
        if (value === '50%') {
            return 999; // Special marker for "make it circular"
        }
        return null; // Other percentages handled by special logic
    }
    const numericValue = parseFloat(value);
    return isNaN(numericValue) ? null : numericValue;
}
// FIXED: Parse calc() expressions - handles simple cases like calc(100px - 20px), calc(50% - 10px)
function parseCalc(value) {
    // Extract content inside calc()
    const match = value.match(/calc\(([^)]+)\)/);
    if (!match)
        return null;
    const expression = match[1].trim();
    // Handle simple addition/subtraction: "100px - 20px" or "50px + 10px"
    // Split by + or - while keeping the operator
    const parts = expression.split(/\s*([+-])\s*/);
    if (parts.length === 1) {
        // Single value inside calc
        return parseFloat(parts[0]) || null;
    }
    if (parts.length === 3) {
        // Simple binary operation: value operator value
        const left = parseFloat(parts[0]);
        const operator = parts[1];
        const right = parseFloat(parts[2]);
        if (isNaN(left) || isNaN(right)) {
            // One operand might be percentage - just return the px value if one exists
            if (parts[0].includes('px'))
                return parseFloat(parts[0]);
            if (parts[2].includes('px'))
                return parseFloat(parts[2]);
            return null;
        }
        if (operator === '+')
            return left + right;
        if (operator === '-')
            return left - right;
    }
    // For complex expressions, try to extract first numeric value
    const numMatch = expression.match(/(\d+(?:\.\d+)?)\s*px/);
    if (numMatch)
        return parseFloat(numMatch[1]);
    return null;
}
// FIXED: Parse percentage values and calculate based on parent size
function parsePercentage(value) {
    if (!value || !value.includes('%'))
        return null;
    const match = value.match(/^([0-9.]+)%$/);
    if (match) {
        return parseFloat(match[1]);
    }
    return null;
}
function calculatePercentageWidth(widthValue, parentFrame) {
    if (!parentFrame || !widthValue)
        return null;
    const percentage = parsePercentage(widthValue);
    if (percentage === null)
        return null;
    // Calculate available width (parent width minus padding)
    const availableWidth = parentFrame.width - (parentFrame.paddingLeft || 0) - (parentFrame.paddingRight || 0);
    return Math.round((percentage / 100) * availableWidth);
}
function parseMargin(marginValue) {
    const values = marginValue.split(' ').map(v => parseSize(v) || 0);
    if (values.length === 1) {
        return { top: values[0], right: values[0], bottom: values[0], left: values[0] };
    }
    else if (values.length === 2) {
        return { top: values[0], right: values[1], bottom: values[0], left: values[1] };
    }
    else if (values.length === 3) {
        return { top: values[0], right: values[1], bottom: values[2], left: values[1] };
    }
    else if (values.length === 4) {
        return { top: values[0], right: values[1], bottom: values[2], left: values[3] };
    }
    return { top: 0, right: 0, bottom: 0, left: 0 };
}
function parsePadding(paddingValue) {
    const values = paddingValue.split(' ').map(v => parseSize(v) || 0);
    if (values.length === 1) {
        return { top: values[0], right: values[0], bottom: values[0], left: values[0] };
    }
    else if (values.length === 2) {
        return { top: values[0], right: values[1], bottom: values[0], left: values[1] };
    }
    else if (values.length === 3) {
        return { top: values[0], right: values[1], bottom: values[2], left: values[1] };
    }
    else if (values.length === 4) {
        return { top: values[0], right: values[1], bottom: values[2], left: values[3] };
    }
    return { top: 0, right: 0, bottom: 0, left: 0 };
}
function parseBoxShadow(shadowValue) {
    // Parse box-shadow: offset-x offset-y blur-radius spread-radius color
    // Ejemplo: "0 2px 12px rgba(44,62,80,0.08)"
    const match = shadowValue.match(/(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)?\s*(-?\d+(?:\.\d+)?(?:px)?)?\s*(rgba?\([^)]+\)|#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3})?/);
    if (match) {
        const offsetX = parseSize(match[1]) || 0;
        const offsetY = parseSize(match[2]) || 0;
        const blurRadius = parseSize(match[3]) || 0;
        const colorStr = match[5];
        let color = { r: 0, g: 0, b: 0, a: 0.25 }; // Incluir alpha en color
        if (colorStr) {
            // Si es rgba, extraer opacidad
            const rgbaMatch = colorStr.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/);
            if (rgbaMatch) {
                color = {
                    r: parseInt(rgbaMatch[1]) / 255,
                    g: parseInt(rgbaMatch[2]) / 255,
                    b: parseInt(rgbaMatch[3]) / 255,
                    a: parseFloat(rgbaMatch[4])
                };
            }
            else {
                const rgb = hexToRgb(colorStr);
                if (rgb) {
                    color = Object.assign(Object.assign({}, rgb), { a: 0.25 }); // Default alpha for hex colors
                }
            }
        }
        // Formato correcto para Figma
        return {
            type: 'DROP_SHADOW',
            offset: { x: offsetX, y: offsetY },
            radius: blurRadius,
            color: color,
            blendMode: 'NORMAL',
            visible: true
        };
    }
    return null;
}
function parseTransform(transformValue) {
    const result = {};
    // Parse rotate
    const rotateMatch = transformValue.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/);
    if (rotateMatch) {
        result.rotation = parseFloat(rotateMatch[1]) * (Math.PI / 180); // Convert to radians
    }
    // Parse scale
    const scaleMatch = transformValue.match(/scale\((\d+(?:\.\d+)?)\)/);
    if (scaleMatch) {
        result.scaleX = result.scaleY = parseFloat(scaleMatch[1]);
    }
    const scaleXMatch = transformValue.match(/scaleX\((\d+(?:\.\d+)?)\)/);
    if (scaleXMatch) {
        result.scaleX = parseFloat(scaleXMatch[1]);
    }
    const scaleYMatch = transformValue.match(/scaleY\((\d+(?:\.\d+)?)\)/);
    if (scaleYMatch) {
        result.scaleY = parseFloat(scaleYMatch[1]);
    }
    // Parse translate
    const translateMatch = transformValue.match(/translate\((-?\d+(?:\.\d+)?px),\s*(-?\d+(?:\.\d+)?px)\)/);
    if (translateMatch) {
        result.translateX = parseSize(translateMatch[1]) || 0;
        result.translateY = parseSize(translateMatch[2]) || 0;
    }
    return result;
}
function extractBorderColor(borderValue) {
    // Busca un color en la propiedad border (hex, rgb, rgba, palabra clave)
    if (!borderValue)
        return null;
    // Hex
    const hex = borderValue.match(/#([a-fA-F0-9]{3,6})/);
    if (hex)
        return hex[0];
    // rgb/rgba
    const rgb = borderValue.match(/rgba?\([^\)]+\)/);
    if (rgb)
        return rgb[0];
    // Palabra clave (ej: 'red', 'blue', 'black', 'white', 'gray', 'grey', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown')
    const keyword = borderValue.match(/\b(white|black|red|blue|green|yellow|orange|purple|pink|brown|gray|grey)\b/i);
    if (keyword)
        return keyword[0];
    return null;
}
function extractGradientColor(bg) {
    if (!bg)
        return null;
    // linear-gradient(90deg, #2c3e50 60%, #2980b9 100%)
    const hex = bg.match(/#([a-fA-F0-9]{3,6})/);
    if (hex)
        return hex[0];
    const rgb = bg.match(/rgba?\([^\)]+\)/);
    if (rgb)
        return rgb[0];
    const keyword = bg.match(/\b(white|black|red|blue|green|yellow|orange|purple|pink|brown|gray|grey)\b/i);
    if (keyword)
        return keyword[0];
    return null;
}
// Simplified gradient parsing function with minimal logging
function parseLinearGradient(gradientStr) {
    try {
        if (!gradientStr || !gradientStr.includes('linear-gradient')) {
            return null;
        }
        const match = gradientStr.match(/linear-gradient\(([^)]+)\)/);
        if (!match) {
            return null;
        }
        const content = match[1];
        const parts = content.split(',').map(s => s.trim());
        if (parts.length < 2) {
            return null;
        }
        const stops = [];
        let position = 0;
        const increment = 1 / Math.max(1, parts.length - 2);
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i];
            const color = extractGradientColor(part);
            if (color) {
                const rgba = hexToRgba(color);
                if (rgba) {
                    stops.push({
                        position: position,
                        color: rgba
                    });
                    position += increment;
                }
            }
        }
        if (stops.length >= 2) {
            // Ensure last stop is at position 1
            if (stops.length > 0) {
                stops[stops.length - 1].position = 1;
            }
            return { gradientStops: stops };
        }
        return null;
    }
    catch (error) {
        return null;
    }
}
function applyStylesToFrame(frame, styles) {
    // FIXED: Handle visibility: hidden (element rendered but invisible)
    if (styles['visibility'] === 'hidden') {
        frame.opacity = 0;
    }
    // CRITICAL: First, check if this element should have NO background
    const hasExplicitBackground = styles['background'] || styles['background-color'];
    // Background: Improved gradient support
    if (styles['background'] && styles['background'].includes('linear-gradient')) {
        const gradient = parseLinearGradient(styles['background']);
        if (gradient && gradient.gradientStops && gradient.gradientStops.length >= 2) {
            frame.fills = [{
                    type: 'GRADIENT_LINEAR',
                    gradientTransform: [
                        [1, 0, 0],
                        [0, 1, 0]
                    ],
                    gradientStops: gradient.gradientStops
                }];
        }
    }
    else if ((styles['background-color'] && styles['background-color'] !== 'transparent') ||
        (styles['background'] && !styles['background'].includes('gradient') && styles['background'] !== 'transparent')) {
        // Handle both background-color and background (shorthand) properties
        const bgColorValue = styles['background-color'] || styles['background'];
        // Use hexToRgba to preserve alpha/opacity for semi-transparent backgrounds
        const bgColorWithAlpha = hexToRgba(bgColorValue);
        if (bgColorWithAlpha) {
            // Use RGBA format to preserve opacity
            frame.fills = [{
                    type: 'SOLID',
                    color: { r: bgColorWithAlpha.r, g: bgColorWithAlpha.g, b: bgColorWithAlpha.b },
                    opacity: bgColorWithAlpha.a
                }];
        }
    }
    else if (!hasExplicitBackground) {
        // FIXED: Explicitly set empty fills for elements without background CSS
        frame.fills = [];
    }
    // Width - Aplicar ancho según CSS
    if (styles.width) {
        let targetWidth = parseSize(styles.width);
        if (targetWidth && targetWidth > 0) {
            frame.resize(targetWidth, frame.height);
            frame.setPluginData('hasExplicitWidth', 'true');
        }
        else if (styles.width === '100%') {
            frame.setPluginData('hasExplicitWidth', 'true');
            // Para elementos de ancho completo, aplicar lógica especial
            if (frame.parent && frame.parent.type === 'FRAME') {
                const parentFrame = frame.parent;
                const availableWidth = Math.max(parentFrame.width - parentFrame.paddingLeft - parentFrame.paddingRight, 300);
                frame.resize(availableWidth, frame.height);
            }
            else {
                frame.resize(Math.max(frame.width, 300), frame.height);
            }
        }
    }
    // Height - SIMPLIFICADO y corregido
    if (styles.height) {
        const height = parseSize(styles.height);
        if (height && height > 0) {
            frame.resize(frame.width, height);
        }
    }
    // FLEX GROW: Movido a createFigmaNodesFromStructure donde tiene acceso a node y parentFrame
    // Border (mejorado para extraer color de 'border')
    const borderProperties = ['border', 'border-top', 'border-right', 'border-bottom', 'border-left'];
    for (let i = 0; i < borderProperties.length; i++) {
        const prop = borderProperties[i];
        if (styles[prop] || styles[prop + '-width'] || styles[prop + '-color'] || styles[prop + '-style']) {
            // Extraer color de la propiedad 'border' si existe
            let borderColor = null;
            if (styles[prop]) {
                borderColor = extractBorderColor(styles[prop]);
            }
            // Si no, usar border-color
            if (!borderColor && styles[prop + '-color']) {
                borderColor = styles[prop + '-color'];
            }
            // Si sigue sin color, usar gris claro por defecto
            if (!borderColor) {
                borderColor = '#dddddd';
            }
            const borderWidth = parseSize(styles[prop + '-width'] || styles[prop]) || 1;
            const colorObj = hexToRgb(borderColor) || { r: 0.87, g: 0.87, b: 0.87 };
            if (i === 0) { // General border
                frame.strokes = [{ type: 'SOLID', color: colorObj }];
                frame.strokeWeight = borderWidth;
            }
        }
    }
    // Border radius
    const borderRadius = parseSize(styles['border-radius']);
    if (borderRadius) {
        if (borderRadius === 999) {
            // Special case: 50% means make it circular (half of width/height)
            frame.cornerRadius = Math.min(frame.width, frame.height) / 2;
        }
        else {
            frame.cornerRadius = borderRadius;
        }
    }
    // Opacity
    if (styles.opacity) {
        const opacity = parseFloat(styles.opacity);
        if (opacity >= 0 && opacity <= 1) {
            frame.opacity = opacity;
        }
    }
    // Box shadow con parseBoxShadow
    if (styles['box-shadow'] && styles['box-shadow'] !== 'none') {
        const shadowEffect = parseBoxShadow(styles['box-shadow']);
        if (shadowEffect) {
            frame.effects = [shadowEffect];
        }
    }
    // Transform
    if (styles.transform) {
        const transform = parseTransform(styles.transform);
        if (transform.rotation !== undefined) {
            frame.rotation = transform.rotation;
        }
    }
    // Margin (solo para layout)
    if (styles.margin) {
        const margin = parseMargin(styles.margin);
        frame.setPluginData('margin', JSON.stringify(margin));
    }
    ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'].forEach(prop => {
        if (styles[prop]) {
            const value = parseSize(styles[prop]) || 0;
            let margin = { top: 0, right: 0, bottom: 0, left: 0 };
            try {
                margin = JSON.parse(frame.getPluginData('margin') || '{"top":0,"right":0,"bottom":0,"left":0}');
            }
            catch (e) { }
            const side = prop.split('-')[1];
            margin[side] = value;
            frame.setPluginData('margin', JSON.stringify(margin));
        }
    });
    // Padding - aplicar directamente al frame
    if (styles.padding) {
        const padding = parsePadding(styles.padding);
        frame.paddingTop = padding.top;
        frame.paddingRight = padding.right;
        frame.paddingBottom = padding.bottom;
        frame.paddingLeft = padding.left;
    }
    // Individual padding properties (override shorthand if present)
    ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'].forEach(prop => {
        if (styles[prop]) {
            const value = parseSize(styles[prop]) || 0;
            const side = prop.split('-')[1];
            if (side === 'top')
                frame.paddingTop = value;
            else if (side === 'right')
                frame.paddingRight = value;
            else if (side === 'bottom')
                frame.paddingBottom = value;
            else if (side === 'left')
                frame.paddingLeft = value;
        }
    });
    // Gap CSS - aplicar solo si es válido
    if (styles.gap) {
        const gapValue = parseSize(styles.gap);
        if (gapValue && gapValue > 0) {
            frame.itemSpacing = gapValue;
        }
    }
    // Flexbox alignment - FIXED
    if (styles['justify-content'] === 'center') {
        frame.primaryAxisAlignItems = 'CENTER';
    }
    else if (styles['justify-content'] === 'space-between') {
        frame.primaryAxisAlignItems = 'SPACE_BETWEEN';
        // SMART: Solo si frame actual es muy pequeño para space-between
        if (frame.layoutMode === 'HORIZONTAL' && !styles.width && frame.width < 200) {
            frame.minWidth = Math.max(frame.width * 1.5, 200); // Dinámico basado en contenido
        }
    }
    else if (styles['justify-content'] === 'space-around') {
        frame.primaryAxisAlignItems = 'SPACE_BETWEEN'; // Fallback
        // SMART: También para space-around
        if (frame.layoutMode === 'HORIZONTAL' && !styles.width && frame.width < 200) {
            frame.minWidth = Math.max(frame.width * 1.5, 200);
        }
    }
    else if (styles['justify-content'] === 'flex-start') {
        frame.primaryAxisAlignItems = 'MIN';
    }
    else if (styles['justify-content'] === 'flex-end') {
        frame.primaryAxisAlignItems = 'MAX';
    }
    else if (styles['justify-content'] === 'space-evenly') {
        // Figma doesn't have SPACE_EVENLY, use SPACE_BETWEEN as closest approximation
        frame.primaryAxisAlignItems = 'SPACE_BETWEEN';
    }
    if (styles['align-items'] === 'center') {
        frame.counterAxisAlignItems = 'CENTER';
    }
    else if (styles['align-items'] === 'flex-start' || styles['align-items'] === 'start') {
        frame.counterAxisAlignItems = 'MIN';
    }
    else if (styles['align-items'] === 'flex-end' || styles['align-items'] === 'end') {
        frame.counterAxisAlignItems = 'MAX';
    }
    else if (styles['align-items'] === 'baseline') {
        frame.counterAxisAlignItems = 'BASELINE';
    }
    // Overflow: hidden - clip content
    if (styles['overflow'] === 'hidden' || styles['overflow-x'] === 'hidden' || styles['overflow-y'] === 'hidden') {
        frame.clipsContent = true;
    }
    // TEXT-ALIGN: center support (for containers with text children)
    if (styles['text-align'] === 'center') {
        // For containers with text-align center, center all children
        if (frame.layoutMode === 'VERTICAL') {
            frame.primaryAxisAlignItems = 'CENTER';
            // Also center horizontally in vertical layout
            frame.counterAxisAlignItems = 'CENTER';
        }
        else if (frame.layoutMode === 'HORIZONTAL') {
            frame.counterAxisAlignItems = 'CENTER';
            // Also center vertically in horizontal layout  
            frame.primaryAxisAlignItems = 'CENTER';
        }
        // Mark this frame as having centered text for child inheritance
        frame.setPluginData('textAlign', 'center');
    }
    // MARGIN AUTO: center support (margin: 0 auto)
    if (styles['margin'] === '0 auto' || (styles['margin-left'] === 'auto' && styles['margin-right'] === 'auto')) {
        // This should center the element within its parent
        frame.setPluginData('centerHorizontally', 'true');
    }
}
function applyStylesToText(text, styles) {
    // Text color - SIEMPRE aplicar color (heredado o negro por defecto)
    let textColor = { r: 0, g: 0, b: 0 }; // Negro por defecto
    if (styles.color) {
        const color = hexToRgb(styles.color);
        if (color) {
            textColor = color;
            // Handle RGBA opacity
            const rgbaMatch = styles.color.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([0-9.]+)\s*\)/i);
            if (rgbaMatch) {
                const alpha = parseFloat(rgbaMatch[1]);
                if (alpha >= 0 && alpha <= 1) {
                    text.opacity = alpha;
                }
            }
        }
    }
    // SIEMPRE aplicar el color (nunca dejar undefined)
    text.fills = [{ type: 'SOLID', color: textColor }];
    // Font size
    const fontSize = parseSize(styles['font-size']);
    if (fontSize) {
        text.fontSize = fontSize;
    }
    // Line height ESTRATEGIA ROBUSTA
    if (styles['line-height']) {
        const value = styles['line-height'].trim();
        if (value.match(/^[0-9.]+px$/)) {
            // px: usar PIXELS
            const px = parseFloat(value);
            if (!isNaN(px))
                text.lineHeight = { value: px, unit: 'PIXELS' };
        }
        else if (value.match(/^[0-9.]+%$/)) {
            // %: usar PERCENT
            const percent = parseFloat(value);
            if (!isNaN(percent))
                text.lineHeight = { value: percent, unit: 'PERCENT' };
        }
        else if (!isNaN(Number(value))) {
            // Unitless (ej: 1.5): convertir a porcentaje (1.5 = 150%)
            const multiplier = parseFloat(value);
            if (!isNaN(multiplier) && multiplier > 0) {
                text.lineHeight = { value: multiplier * 100, unit: 'PERCENT' };
            }
        }
        // Otros valores (normal, inherit, etc): ignorar - Figma usa default
    }
    // Letter spacing
    if (styles['letter-spacing']) {
        const letterSpacing = parseSize(styles['letter-spacing']);
        if (letterSpacing) {
            text.letterSpacing = { value: letterSpacing, unit: 'PIXELS' };
        }
    }
    // Font weight - improved implementation
    if (styles['font-weight']) {
        const weight = styles['font-weight'];
        if (weight === 'bold' || weight === '700' || weight === '800' || weight === '900') {
            // Try to load bold font, fallback to size increase
            figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
                text.fontName = { family: "Inter", style: "Bold" };
            }).catch(() => {
                // Fallback: increase size
                const currentSize = typeof text.fontSize === 'number' ? text.fontSize : 16;
                text.fontSize = currentSize * 1.1;
            });
        }
        else if (weight === 'lighter' || weight === '300' || weight === '200' || weight === '100') {
            figma.loadFontAsync({ family: "Inter", style: "Light" }).then(() => {
                text.fontName = { family: "Inter", style: "Light" };
            }).catch(() => {
                // Fallback: decrease size slightly
                const currentSize = typeof text.fontSize === 'number' ? text.fontSize : 16;
                text.fontSize = currentSize * 0.9;
            });
        }
    }
    // Font style (italic)
    if (styles['font-style'] === 'italic') {
        figma.loadFontAsync({ family: "Inter", style: "Italic" }).then(() => {
            text.fontName = { family: "Inter", style: "Italic" };
        }).catch(() => {
            // Fallback: no italic available
        });
    }
    // Text decoration
    if (styles['text-decoration']) {
        const decoration = styles['text-decoration'];
        if (decoration.includes('underline')) {
            text.textDecoration = 'UNDERLINE';
        }
        else if (decoration.includes('line-through')) {
            text.textDecoration = 'STRIKETHROUGH';
        }
        else {
            text.textDecoration = 'NONE';
        }
    }
    // Text transform
    if (styles['text-transform']) {
        const transform = styles['text-transform'];
        let characters = text.characters;
        if (transform === 'uppercase') {
            text.characters = characters.toUpperCase();
        }
        else if (transform === 'lowercase') {
            text.characters = characters.toLowerCase();
        }
        else if (transform === 'capitalize') {
            text.characters = characters.replace(/\b\w/g, l => l.toUpperCase());
        }
    }
    // Text align
    if (styles['text-align']) {
        const align = styles['text-align'];
        if (align === 'center')
            text.textAlignHorizontal = 'CENTER';
        else if (align === 'right')
            text.textAlignHorizontal = 'RIGHT';
        else if (align === 'justify')
            text.textAlignHorizontal = 'JUSTIFIED';
        else
            text.textAlignHorizontal = 'LEFT';
    }
    // Opacity
    if (styles.opacity) {
        const opacity = parseFloat(styles.opacity);
        if (opacity >= 0 && opacity <= 1) {
            text.opacity = opacity;
        }
    }
    // FIXED: white-space support
    if (styles['white-space']) {
        const whiteSpace = styles['white-space'];
        if (whiteSpace === 'nowrap' || whiteSpace === 'pre') {
            // No wrapping - use WIDTH_AND_HEIGHT to prevent line breaks
            text.textAutoResize = 'WIDTH_AND_HEIGHT';
        }
        else if (whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line') {
            // Preserve some whitespace but allow wrapping
            text.textAutoResize = 'HEIGHT';
        }
        // 'normal' is the default behavior
    }
    // FIXED: text-overflow support (works with white-space: nowrap)
    if (styles['text-overflow'] === 'ellipsis') {
        // Figma supports truncation with ellipsis
        text.textTruncation = 'ENDING';
    }
}
// FIXED: Reorder children by z-index (higher z-index = later in children array = on top)
function reorderChildrenByZIndex(parentFrame) {
    try {
        const children = [...parentFrame.children];
        const childrenWithZIndex = [];
        for (const child of children) {
            if ('getPluginData' in child) {
                const zIndexStr = child.getPluginData('zIndex');
                const zIndex = zIndexStr ? parseInt(zIndexStr, 10) : 0;
                childrenWithZIndex.push({ node: child, zIndex: isNaN(zIndex) ? 0 : zIndex });
            }
        }
        // Sort by z-index (ascending - lower z-index first, higher z-index last = on top)
        childrenWithZIndex.sort((a, b) => a.zIndex - b.zIndex);
        // Reorder children in the parent
        for (const item of childrenWithZIndex) {
            parentFrame.appendChild(item.node);
        }
    }
    catch (error) {
        console.error('Error reordering by z-index:', error);
    }
}
async function calculateContentSize(children) {
    var _a, _b;
    let totalHeight = 0;
    let maxWidth = 0;
    for (const child of children) {
        if (child.type === 'element') {
            if (child.tagName === 'h1') {
                totalHeight += 50;
                maxWidth = Math.max(maxWidth, child.text.length * 20);
            }
            else if (child.tagName === 'h2') {
                totalHeight += 40;
                maxWidth = Math.max(maxWidth, child.text.length * 16);
            }
            else if (child.tagName === 'p' || child.tagName === 'span') {
                totalHeight += 30;
                maxWidth = Math.max(maxWidth, child.text.length * 10);
            }
            else if (child.tagName === 'button' || child.tagName === 'input') {
                totalHeight += 50;
                maxWidth = Math.max(maxWidth, Math.max(200, child.text.length * 12));
            }
            else if (child.tagName === 'ul' || child.tagName === 'ol') {
                totalHeight += child.children.length * 25 + 10;
                maxWidth = Math.max(maxWidth, 250);
            }
            else if (child.tagName === 'img') {
                const width = parseSize((_a = child.styles) === null || _a === void 0 ? void 0 : _a.width) || 200;
                const height = parseSize((_b = child.styles) === null || _b === void 0 ? void 0 : _b.height) || 150;
                totalHeight += height + 10;
                maxWidth = Math.max(maxWidth, width);
            }
            else if (child.tagName === 'table') {
                totalHeight += child.children.length * 40 + 20;
                maxWidth = Math.max(maxWidth, 400);
            }
            else if (child.tagName === 'form') {
                const formSize = await calculateContentSize(child.children);
                totalHeight += formSize.height + 20;
                maxWidth = Math.max(maxWidth, formSize.width);
            }
            else if (['div', 'section', 'article', 'nav', 'header', 'footer', 'main'].includes(child.tagName)) {
                const childSize = await calculateContentSize(child.children);
                totalHeight += childSize.height + 20;
                maxWidth = Math.max(maxWidth, childSize.width);
            }
        }
    }
    return { width: Math.max(maxWidth, 200), height: Math.max(totalHeight, 50) };
}
// Helper function to parse number of columns from grid-template-columns
function parseGridColumns(gridTemplate) {
    if (!gridTemplate)
        return 1;
    // FIXED: Support more grid-template-columns patterns
    // 1. repeat(N, ...) - any repeat with explicit count
    const repeatMatch = gridTemplate.match(/repeat\((\d+),/);
    if (repeatMatch) {
        return parseInt(repeatMatch[1], 10);
    }
    // 2. auto-fill / auto-fit - estimate based on common patterns
    if (gridTemplate.includes('auto-fill') || gridTemplate.includes('auto-fit')) {
        // Try to extract minmax min value to estimate columns
        const minmaxMatch = gridTemplate.match(/minmax\((\d+)px/);
        if (minmaxMatch) {
            const minWidth = parseInt(minmaxMatch[1], 10);
            // Estimate columns based on typical container width (1200px)
            return Math.max(1, Math.floor(1200 / (minWidth + 16))); // 16px gap estimate
        }
        return 3; // Default for auto-fill/auto-fit
    }
    // 3. Count column definitions (handles: "200px 1fr 100px", "1fr 1fr 1fr", etc.)
    // Split by space but handle minmax() as single unit
    const normalized = gridTemplate.replace(/minmax\([^)]+\)/g, '1fr'); // Treat minmax as 1fr
    const parts = normalized.split(/\s+/).filter(p => p.trim() && p !== '');
    if (parts.length > 0) {
        return parts.length;
    }
    return 1;
}
// Helper function to parse grid-template-areas
// Returns a map of area names to their grid positions { areaName: { rowStart, rowEnd, colStart, colEnd } }
function parseGridTemplateAreas(areasString) {
    if (!areasString)
        return null;
    // Parse the areas string: "header header header" "sidebar main main" "footer footer footer"
    // Each quoted string is a row, each word is a column
    const rowMatches = areasString.match(/"([^"]+)"/g);
    if (!rowMatches || rowMatches.length === 0)
        return null;
    const areaMap = {};
    for (let rowIndex = 0; rowIndex < rowMatches.length; rowIndex++) {
        const rowContent = rowMatches[rowIndex].replace(/"/g, '').trim();
        const columns = rowContent.split(/\s+/);
        for (let colIndex = 0; colIndex < columns.length; colIndex++) {
            const areaName = columns[colIndex];
            if (areaName === '.')
                continue; // Skip empty cells
            if (!areaMap[areaName]) {
                // First occurrence of this area
                areaMap[areaName] = {
                    rowStart: rowIndex,
                    rowEnd: rowIndex + 1,
                    colStart: colIndex,
                    colEnd: colIndex + 1
                };
            }
            else {
                // Extend the area
                areaMap[areaName].rowEnd = Math.max(areaMap[areaName].rowEnd, rowIndex + 1);
                areaMap[areaName].colEnd = Math.max(areaMap[areaName].colEnd, colIndex + 1);
                areaMap[areaName].rowStart = Math.min(areaMap[areaName].rowStart, rowIndex);
                areaMap[areaName].colStart = Math.min(areaMap[areaName].colStart, colIndex);
            }
        }
    }
    return Object.keys(areaMap).length > 0 ? areaMap : null;
}
// Get the number of rows from grid-template-areas
function getGridRowCount(areasString) {
    if (!areasString)
        return 1;
    const rowMatches = areasString.match(/"([^"]+)"/g);
    return rowMatches ? rowMatches.length : 1;
}
// Get the number of columns from grid-template-areas
function getGridColCount(areasString) {
    if (!areasString)
        return 1;
    const rowMatches = areasString.match(/"([^"]+)"/g);
    if (!rowMatches || rowMatches.length === 0)
        return 1;
    const firstRow = rowMatches[0].replace(/"/g, '').trim();
    return firstRow.split(/\s+/).length;
}
// Create grid layout using grid-template-areas
async function createGridLayoutWithAreas(children, parentFrame, areaMap, numRows, numCols, gap, inheritedStyles) {
    var _a;
    // Check if any area spans multiple rows (for height synchronization)
    const hasMultiRowSpans = Object.values(areaMap).some(bounds => (bounds.rowEnd - bounds.rowStart) > 1);
    // Create a 2D array to track which cells are occupied
    const grid = [];
    for (let r = 0; r < numRows; r++) {
        grid[r] = new Array(numCols).fill(null);
    }
    // Create row frames
    const rowFrames = [];
    for (let r = 0; r < numRows; r++) {
        const rowFrame = figma.createFrame();
        rowFrame.name = `Grid Row ${r + 1}`;
        rowFrame.fills = [];
        rowFrame.layoutMode = 'HORIZONTAL';
        rowFrame.primaryAxisSizingMode = 'AUTO';
        rowFrame.counterAxisSizingMode = 'AUTO';
        rowFrame.itemSpacing = gap;
        parentFrame.appendChild(rowFrame);
        if (parentFrame.layoutMode !== 'NONE') {
            try {
                rowFrame.layoutSizingHorizontal = 'FILL';
            }
            catch (error) { }
        }
        rowFrames.push(rowFrame);
    }
    // Map children to their grid areas
    const childrenByArea = {};
    for (const child of children) {
        const gridArea = (_a = child.styles) === null || _a === void 0 ? void 0 : _a['grid-area'];
        if (gridArea && areaMap[gridArea]) {
            childrenByArea[gridArea] = child;
        }
    }
    // Process each unique area and place children
    const processedAreas = new Set();
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            // Find which area this cell belongs to
            let cellArea = null;
            for (const [areaName, bounds] of Object.entries(areaMap)) {
                if (r >= bounds.rowStart && r < bounds.rowEnd && c >= bounds.colStart && c < bounds.colEnd) {
                    cellArea = areaName;
                    break;
                }
            }
            if (!cellArea) {
                // Empty cell - create placeholder
                const placeholder = figma.createFrame();
                placeholder.name = `Empty Cell ${r}-${c}`;
                placeholder.fills = [];
                placeholder.resize(10, 10);
                rowFrames[r].appendChild(placeholder);
                // Set layout properties AFTER appending to parent
                try {
                    placeholder.layoutGrow = 1;
                    placeholder.layoutSizingHorizontal = 'FILL';
                    placeholder.layoutSizingVertical = 'HUG';
                }
                catch (error) { }
                continue;
            }
            const bounds = areaMap[cellArea];
            const isFirstCellOfArea = (r === bounds.rowStart && c === bounds.colStart);
            if (isFirstCellOfArea && !processedAreas.has(cellArea)) {
                processedAreas.add(cellArea);
                // Create the child in this position
                const child = childrenByArea[cellArea];
                if (child) {
                    const colSpan = bounds.colEnd - bounds.colStart;
                    const rowSpan = bounds.rowEnd - bounds.rowStart;
                    // Create a wrapper frame if the element spans multiple rows
                    if (rowSpan > 1) {
                        // For multi-row spans, create wrapper in first row
                        const wrapper = figma.createFrame();
                        wrapper.name = `${cellArea} (spans ${rowSpan} rows, ${colSpan} cols)`;
                        wrapper.fills = [];
                        wrapper.layoutMode = 'VERTICAL';
                        wrapper.primaryAxisSizingMode = 'AUTO';
                        wrapper.counterAxisSizingMode = 'AUTO';
                        rowFrames[r].appendChild(wrapper);
                        // Set layout properties AFTER appending
                        try {
                            wrapper.layoutGrow = 1;
                            wrapper.layoutSizingHorizontal = 'FILL';
                        }
                        catch (error) { }
                        const gridInheritedStyles = Object.assign(Object.assign({}, inheritedStyles), { '_hasConstrainedWidth': true });
                        await createFigmaNodesFromStructure([child], wrapper, 0, 0, gridInheritedStyles);
                        // Add placeholders for remaining columns in first row
                        for (let cc = 1; cc < colSpan; cc++) {
                            const placeholder = figma.createFrame();
                            placeholder.name = `${cellArea} span ${cc}`;
                            placeholder.fills = [];
                            placeholder.resize(1, 1);
                            placeholder.visible = false;
                            rowFrames[r].appendChild(placeholder);
                            try {
                                placeholder.layoutGrow = 1;
                                placeholder.layoutSizingHorizontal = 'FILL';
                            }
                            catch (error) { }
                        }
                    }
                    else {
                        // Single row - simpler case
                        const wrapper = figma.createFrame();
                        wrapper.name = `${cellArea} (${colSpan} cols)`;
                        wrapper.fills = [];
                        wrapper.layoutMode = 'VERTICAL';
                        wrapper.primaryAxisSizingMode = 'AUTO';
                        wrapper.counterAxisSizingMode = 'AUTO';
                        rowFrames[r].appendChild(wrapper);
                        // Set layout properties AFTER appending
                        try {
                            wrapper.layoutGrow = 1;
                            wrapper.layoutSizingHorizontal = 'FILL';
                            // Fill vertical height when there are multi-row spans in the grid
                            if (hasMultiRowSpans) {
                                wrapper.layoutSizingVertical = 'FILL';
                            }
                        }
                        catch (error) { }
                        // Pass flag to children to also use FILL vertical
                        const gridInheritedStyles = Object.assign(Object.assign({}, inheritedStyles), { '_hasConstrainedWidth': true, '_shouldFillVertical': hasMultiRowSpans });
                        await createFigmaNodesFromStructure([child], wrapper, 0, 0, gridInheritedStyles);
                        // Add placeholders for remaining columns
                        for (let cc = 1; cc < colSpan; cc++) {
                            const placeholder = figma.createFrame();
                            placeholder.name = `${cellArea} span ${cc}`;
                            placeholder.fills = [];
                            placeholder.resize(1, 1);
                            placeholder.visible = false;
                            rowFrames[r].appendChild(placeholder);
                            try {
                                placeholder.layoutGrow = 1;
                                placeholder.layoutSizingHorizontal = 'FILL';
                            }
                            catch (error) { }
                        }
                    }
                }
                else {
                    // Area exists but no child matches - create placeholder
                    const placeholder = figma.createFrame();
                    placeholder.name = `${cellArea} (empty)`;
                    placeholder.fills = [];
                    placeholder.resize(10, 10);
                    rowFrames[r].appendChild(placeholder);
                    try {
                        placeholder.layoutGrow = 1;
                        placeholder.layoutSizingHorizontal = 'FILL';
                        placeholder.layoutSizingVertical = 'HUG';
                    }
                    catch (error) { }
                }
            }
            else if (!isFirstCellOfArea) {
                // This cell is part of a multi-cell area but not the first cell
                // For subsequent rows of multi-row areas, add invisible placeholders
                if (r > bounds.rowStart && c === bounds.colStart) {
                    // First column of a subsequent row in a multi-row span
                    // Add placeholders for each column the area spans
                    const colSpan = bounds.colEnd - bounds.colStart;
                    for (let cc = 0; cc < colSpan; cc++) {
                        const placeholder = figma.createFrame();
                        placeholder.name = `${cellArea} row-span placeholder ${cc}`;
                        placeholder.fills = [];
                        placeholder.resize(1, 1);
                        placeholder.visible = false;
                        rowFrames[r].appendChild(placeholder);
                        try {
                            placeholder.layoutGrow = 1;
                            placeholder.layoutSizingHorizontal = 'FILL';
                        }
                        catch (error) { }
                    }
                }
                // Skip other cells in the span
            }
        }
    }
}
// Grid layout genérico para N columnas
async function createGridLayout(children, parentFrame, columns, gap, inheritedStyles) {
    console.log('[GRID] createGridLayout called with', children.length, 'children,', columns, 'columns');
    if (!children || children.length === 0) {
        console.log('[GRID] No children to process!');
        return;
    }
    for (let i = 0; i < children.length; i += columns) {
        const rowFrame = figma.createFrame();
        rowFrame.name = `Grid Row (${columns} cols)`;
        rowFrame.fills = [];
        rowFrame.layoutMode = 'HORIZONTAL';
        rowFrame.primaryAxisSizingMode = 'AUTO';
        rowFrame.counterAxisSizingMode = 'AUTO';
        rowFrame.itemSpacing = gap;
        parentFrame.appendChild(rowFrame);
        if (parentFrame.layoutMode !== 'NONE') {
            try {
                rowFrame.layoutSizingHorizontal = 'FILL';
                rowFrame.setPluginData('hasExplicitWidth', 'true');
            }
            catch (error) {
                rowFrame.resize(Math.max(400, rowFrame.width), rowFrame.height);
            }
        }
        for (let j = 0; j < columns; j++) {
            if (children[i + j]) {
                // Grid items have constrained width (FILL layout)
                const gridInheritedStyles = Object.assign(Object.assign({}, inheritedStyles), { '_hasConstrainedWidth': true });
                await createFigmaNodesFromStructure([children[i + j]], rowFrame, 0, 0, gridInheritedStyles);
            }
        }
        // Hacer que los items llenen el espacio de la fila
        for (let k = 0; k < rowFrame.children.length; k++) {
            try {
                const child = rowFrame.children[k];
                child.layoutGrow = 1;
                child.layoutSizingHorizontal = 'FILL';
                child.setPluginData('hasExplicitWidth', 'true');
            }
            catch (error) { }
        }
    }
}
async function createFigmaNodesFromStructure(structure, parentFrame, startX = 0, startY = 0, inheritedStyles) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98, _99, _100, _101, _102, _103, _104, _105, _106, _107, _108, _109, _110, _111, _112, _113, _114, _115, _116, _117, _118, _119, _120, _121, _122, _123, _124, _125, _126, _127, _128, _129, _130, _131, _132, _133, _134, _135, _136, _137, _138, _139, _140, _141, _142, _143, _144, _145, _146, _147, _148, _149, _150, _151, _152, _153, _154;
    debugLog('[NODE CREATION] Starting createFigmaNodesFromStructure');
    debugLog('[NODE CREATION] Structure:', structure);
    debugLog('[NODE CREATION] ParentFrame:', (parentFrame === null || parentFrame === void 0 ? void 0 : parentFrame.name) || 'none');
    debugLog('[NODE CREATION] Structure length:', (structure === null || structure === void 0 ? void 0 : structure.length) || 0);
    for (const node of structure) {
        debugLog('[NODE CREATION] Processing node:', node.tagName, node.type);
        if (node.type === 'element') {
            // Skip script, style, and other non-visual elements
            if (['script', 'style', 'meta', 'link', 'title'].includes(node.tagName)) {
                continue;
            }
            // FIXED: Skip elements with display: none (don't render at all)
            if (((_a = node.styles) === null || _a === void 0 ? void 0 : _a.display) === 'none') {
                continue;
            }
            // Convert sticky/fixed positioning to normal (but still render)
            if (((_b = node.styles) === null || _b === void 0 ? void 0 : _b.position) === 'sticky' || ((_c = node.styles) === null || _c === void 0 ? void 0 : _c.position) === 'fixed') {
                // Don't skip - just normalize the positioning
                node.styles.position = 'relative';
            }
            // Merge inherited styles with node's own styles
            const nodeStyles = Object.assign(Object.assign({}, inheritedStyles), node.styles);
            node.styles = nodeStyles;
            if (['body', 'div', 'section', 'article', 'nav', 'header', 'footer', 'main', 'aside', 'blockquote', 'figure', 'figcaption', 'address', 'details', 'summary'].includes(node.tagName)) {
                const frame = figma.createFrame();
                frame.name = node.tagName.toUpperCase() + ' Frame';
                // LAYOUT MODE: Aplicar display CSS directamente PRIMERO
                let layoutMode = 'VERTICAL';
                if (((_d = node.styles) === null || _d === void 0 ? void 0 : _d.display) === 'flex' || ((_e = node.styles) === null || _e === void 0 ? void 0 : _e.display) === 'inline-flex') {
                    // Flex direction: row = HORIZONTAL, column = VERTICAL
                    layoutMode = ((_f = node.styles) === null || _f === void 0 ? void 0 : _f['flex-direction']) === 'column' ? 'VERTICAL' : 'HORIZONTAL';
                }
                else if (((_g = node.styles) === null || _g === void 0 ? void 0 : _g.display) === 'grid') {
                    // Keep vertical layout for grid - we'll handle 2x2 layout in child processing
                    layoutMode = 'VERTICAL';
                }
                else if (((_h = node.styles) === null || _h === void 0 ? void 0 : _h.display) === 'inline' || ((_j = node.styles) === null || _j === void 0 ? void 0 : _j.display) === 'inline-block') {
                    // Inline elements: children flow horizontally
                    layoutMode = 'HORIZONTAL';
                }
                // SIDEBAR PATTERN DETECTION: Si hay hijo con position:fixed/width + hijo con margin-left
                // Cambiar a HORIZONTAL para layout sidebar + contenido
                if (layoutMode === 'VERTICAL' && node.children && node.children.length >= 2) {
                    const hasSidebar = node.children.some((child) => {
                        var _a, _b;
                        const pos = (_a = child.styles) === null || _a === void 0 ? void 0 : _a.position;
                        const width = (_b = child.styles) === null || _b === void 0 ? void 0 : _b.width;
                        return (pos === 'fixed' || pos === 'absolute') && width && !width.includes('%');
                    });
                    const hasMainContent = node.children.some((child) => {
                        var _a;
                        const ml = (_a = child.styles) === null || _a === void 0 ? void 0 : _a['margin-left'];
                        return ml && parseSize(ml) && parseSize(ml) > 50;
                    });
                    if (hasSidebar && hasMainContent) {
                        layoutMode = 'HORIZONTAL';
                    }
                }
                frame.layoutMode = layoutMode;
                // FIXED: Support flex-wrap
                if (((_k = node.styles) === null || _k === void 0 ? void 0 : _k['flex-wrap']) === 'wrap' || ((_l = node.styles) === null || _l === void 0 ? void 0 : _l['flex-wrap']) === 'wrap-reverse') {
                    frame.layoutWrap = 'WRAP';
                }
                // Set basic properties - AUTO para que se ajuste al contenido
                frame.primaryAxisSizingMode = 'AUTO';
                frame.counterAxisSizingMode = 'AUTO';
                // CRITICAL: Ensure container can grow to fit content
                // Default to HUG - FILL will be set AFTER appendChild if needed
                frame.layoutSizingVertical = 'HUG';
                frame.layoutSizingHorizontal = 'HUG';
                // Dimensiones mínimas para evitar colapso pero respetando CSS
                frame.minHeight = 20;
                frame.minWidth = 20; // Much smaller minimum to not interfere with explicit CSS dimensions
                // Apply CSS styles BEFORE setting flex properties
                if (node.styles) {
                    applyStylesToFrame(frame, node.styles);
                }
                // Debug only detail-label and detail-value containers
                if (((_m = node.styles) === null || _m === void 0 ? void 0 : _m.className) === 'detail-label' || ((_o = node.styles) === null || _o === void 0 ? void 0 : _o.className) === 'detail-value') {
                }
                // INHERIT text-align from parent for DIV containers too
                if (parentFrame && parentFrame.getPluginData('textAlign') === 'center') {
                    // If parent container has text-align center and this container doesn't have its own text-align
                    if (!((_p = node.styles) === null || _p === void 0 ? void 0 : _p['text-align'])) {
                        // Apply centering to this container as well
                        if (frame.layoutMode === 'VERTICAL') {
                            frame.primaryAxisAlignItems = 'CENTER';
                            frame.counterAxisAlignItems = 'CENTER';
                        }
                        else if (frame.layoutMode === 'HORIZONTAL') {
                            frame.counterAxisAlignItems = 'CENTER';
                            frame.primaryAxisAlignItems = 'CENTER';
                        }
                        // Also mark this frame as having centered text for its children
                        frame.setPluginData('textAlign', 'center');
                        // Log only detail-related inheritance
                        if ((_r = (_q = node.styles) === null || _q === void 0 ? void 0 : _q.className) === null || _r === void 0 ? void 0 : _r.includes('detail')) {
                        }
                    }
                }
                // CRITICAL: After applying styles, ensure containers can still grow vertically
                // BUT preserve FILL if _shouldFillVertical is set (for grid rows with multi-row spans)
                if (((_s = node.styles) === null || _s === void 0 ? void 0 : _s['max-width']) && !((_t = node.styles) === null || _t === void 0 ? void 0 : _t.height) && !(inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['_shouldFillVertical'])) {
                    // For containers with max-width but no explicit height, allow vertical growth
                    frame.layoutSizingVertical = 'HUG';
                }
                // FIXED: Determine if element should fill width based on CSS display property
                // Block-level elements fill width, inline elements don't
                const display = ((_u = node.styles) === null || _u === void 0 ? void 0 : _u.display) || 'block'; // Default is block for div
                const isInlineElement = display === 'inline' || display === 'inline-block' || display === 'inline-flex';
                const needsFullWidth = !isInlineElement; // Only block-level elements fill parent width
                // Remove early height filling - will do it after appendChild
                // Only apply default background if the element doesn't have any background AND it's not inside a gradient container
                const hasBackground = frame.fills && frame.fills.length > 0;
                const isInsideGradientContainer = inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['parent-has-gradient'];
                // Remove hardcoded backgrounds - let CSS handle all styling
                if (!hasBackground && !isInsideGradientContainer) {
                    // Check if element has CSS background that should be applied
                    const cssBackgroundColor = ((_v = node.styles) === null || _v === void 0 ? void 0 : _v['background-color']) || ((_w = node.styles) === null || _w === void 0 ? void 0 : _w['background']);
                    if (cssBackgroundColor && cssBackgroundColor !== 'transparent') {
                        const bgColor = hexToRgb(cssBackgroundColor);
                        if (bgColor) {
                            frame.fills = [{ type: 'SOLID', color: bgColor }];
                        }
                    }
                    else {
                        // FIXED: Explicitly set no background for elements without CSS background
                        frame.fills = [];
                    }
                }
                // Padding ONLY from CSS - no hardcoded defaults
                // FIXED: Use ?? instead of || to respect padding: 0
                const basePadding = parseSize((_x = node.styles) === null || _x === void 0 ? void 0 : _x.padding);
                const cssTopPadding = (_0 = (_z = parseSize((_y = node.styles) === null || _y === void 0 ? void 0 : _y['padding-top'])) !== null && _z !== void 0 ? _z : basePadding) !== null && _0 !== void 0 ? _0 : 0;
                const cssRightPadding = (_3 = (_2 = parseSize((_1 = node.styles) === null || _1 === void 0 ? void 0 : _1['padding-right'])) !== null && _2 !== void 0 ? _2 : basePadding) !== null && _3 !== void 0 ? _3 : 0;
                const cssBottomPadding = (_6 = (_5 = parseSize((_4 = node.styles) === null || _4 === void 0 ? void 0 : _4['padding-bottom'])) !== null && _5 !== void 0 ? _5 : basePadding) !== null && _6 !== void 0 ? _6 : 0;
                const cssLeftPadding = (_9 = (_8 = parseSize((_7 = node.styles) === null || _7 === void 0 ? void 0 : _7['padding-left'])) !== null && _8 !== void 0 ? _8 : basePadding) !== null && _9 !== void 0 ? _9 : 0;
                frame.paddingTop = cssTopPadding;
                frame.paddingRight = cssRightPadding;
                frame.paddingBottom = cssBottomPadding;
                frame.paddingLeft = cssLeftPadding;
                // Set spacing: RESPETAR CSS gap (incluyendo gap: 0)
                let gap;
                if (((_10 = node.styles) === null || _10 === void 0 ? void 0 : _10.gap) !== undefined) {
                    gap = (_11 = parseSize(node.styles.gap)) !== null && _11 !== void 0 ? _11 : 0;
                }
                else {
                    gap = layoutMode === 'HORIZONTAL' ? 16 : 12;
                }
                frame.itemSpacing = gap;
                // Store gap for grid layout
                if (((_12 = node.styles) === null || _12 === void 0 ? void 0 : _12.display) === 'grid') {
                    frame.setPluginData('gridGap', gap.toString());
                }
                // Only set position if there's no parent (root elements)
                if (!parentFrame) {
                    frame.x = startX;
                    frame.y = startY;
                    figma.currentPage.appendChild(frame);
                }
                else {
                    parentFrame.appendChild(frame);
                    // CRITICAL: Set FILL vertical AFTER appendChild (requires auto-layout parent)
                    if ((inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['_shouldFillVertical']) && parentFrame.layoutMode !== 'NONE') {
                        try {
                            frame.layoutSizingVertical = 'FILL';
                        }
                        catch (e) {
                            // Silently ignore if parent doesn't support FILL
                        }
                    }
                }
                // FIXED: Handle position: absolute/relative with top/left/right/bottom
                if (((_13 = node.styles) === null || _13 === void 0 ? void 0 : _13.position) === 'absolute' && parentFrame) {
                    try {
                        // In Figma, use absolute positioning within auto-layout
                        frame.layoutPositioning = 'ABSOLUTE';
                        // Apply top/left/right/bottom as constraints
                        const top = parseSize((_14 = node.styles) === null || _14 === void 0 ? void 0 : _14.top);
                        const left = parseSize((_15 = node.styles) === null || _15 === void 0 ? void 0 : _15.left);
                        const right = parseSize((_16 = node.styles) === null || _16 === void 0 ? void 0 : _16.right);
                        const bottom = parseSize((_17 = node.styles) === null || _17 === void 0 ? void 0 : _17.bottom);
                        // Set position based on top/left
                        if (top !== null)
                            frame.y = top;
                        if (left !== null)
                            frame.x = left;
                        // Set constraints based on which values are defined
                        if (top !== null && bottom !== null) {
                            frame.constraints = { vertical: 'STRETCH', horizontal: ((_18 = frame.constraints) === null || _18 === void 0 ? void 0 : _18.horizontal) || 'MIN' };
                        }
                        else if (bottom !== null) {
                            frame.constraints = { vertical: 'MAX', horizontal: ((_19 = frame.constraints) === null || _19 === void 0 ? void 0 : _19.horizontal) || 'MIN' };
                        }
                        else if (top !== null) {
                            frame.constraints = { vertical: 'MIN', horizontal: ((_20 = frame.constraints) === null || _20 === void 0 ? void 0 : _20.horizontal) || 'MIN' };
                        }
                        if (left !== null && right !== null) {
                            frame.constraints = { vertical: ((_21 = frame.constraints) === null || _21 === void 0 ? void 0 : _21.vertical) || 'MIN', horizontal: 'STRETCH' };
                        }
                        else if (right !== null) {
                            frame.constraints = { vertical: ((_22 = frame.constraints) === null || _22 === void 0 ? void 0 : _22.vertical) || 'MIN', horizontal: 'MAX' };
                        }
                        else if (left !== null) {
                            frame.constraints = { vertical: ((_23 = frame.constraints) === null || _23 === void 0 ? void 0 : _23.vertical) || 'MIN', horizontal: 'MIN' };
                        }
                    }
                    catch (error) {
                        // Fallback: just position with x/y if absolute positioning fails
                        console.error('Absolute positioning error:', error);
                    }
                }
                // Apply sizing AFTER appendChild (proper timing)
                const widthValue = (_24 = node.styles) === null || _24 === void 0 ? void 0 : _24.width;
                const heightValue = (_25 = node.styles) === null || _25 === void 0 ? void 0 : _25.height;
                const hasExplicitPixelWidth = widthValue && parseSize(widthValue) !== null;
                const hasPercentageWidth = widthValue && parsePercentage(widthValue) !== null;
                const hasExplicitDimensions = hasExplicitPixelWidth || heightValue;
                // FIXED: Handle percentage widths
                if (hasPercentageWidth && parentFrame) {
                    const percentage = parsePercentage(widthValue);
                    // For 100% width in auto-layout parent, use FILL instead of fixed calculation
                    if (percentage === 100 && parentFrame.layoutMode !== 'NONE') {
                        try {
                            frame.layoutSizingHorizontal = 'FILL';
                        }
                        catch (e) {
                            // Fallback to calculated width
                            const calculatedWidth = calculatePercentageWidth(widthValue, parentFrame);
                            if (calculatedWidth && calculatedWidth > 0) {
                                frame.resize(calculatedWidth, frame.height);
                            }
                        }
                    }
                    else {
                        const calculatedWidth = calculatePercentageWidth(widthValue, parentFrame);
                        if (calculatedWidth && calculatedWidth > 0) {
                            frame.resize(calculatedWidth, frame.height);
                            frame.layoutSizingHorizontal = 'FIXED';
                        }
                    }
                }
                else if (!hasExplicitDimensions && needsFullWidth && parentFrame && parentFrame.layoutMode !== 'NONE') {
                    try {
                        // FIX: In HORIZONTAL parent (flex row), children should HUG by default unless they have flex-grow
                        // Only apply FILL in VERTICAL parent or if element has flex-grow/flex: 1
                        const hasFlex = ((_26 = node.styles) === null || _26 === void 0 ? void 0 : _26.flex) || ((_27 = node.styles) === null || _27 === void 0 ? void 0 : _27['flex-grow']);
                        const flexValue = (_28 = node.styles) === null || _28 === void 0 ? void 0 : _28.flex;
                        const flexGrowValue = (_29 = node.styles) === null || _29 === void 0 ? void 0 : _29['flex-grow'];
                        const shouldFillHorizontal = parentFrame.layoutMode === 'VERTICAL' ||
                            hasFlex === '1' || flexValue === '1' || flexGrowValue === '1' ||
                            ((_30 = node.styles) === null || _30 === void 0 ? void 0 : _30['margin-right']) === 'auto'; // margin-right: auto in flexbox
                        if (shouldFillHorizontal) {
                            frame.layoutSizingHorizontal = 'FILL';
                        }
                        else if (parentFrame.layoutMode === 'HORIZONTAL') {
                            // In horizontal flex, children should HUG to their content
                            frame.layoutSizingHorizontal = 'HUG';
                        }
                        else {
                            frame.layoutSizingHorizontal = 'FILL';
                        }
                        // Maintain vertical HUG for containers to grow with content
                        if (!((_31 = node.styles) === null || _31 === void 0 ? void 0 : _31.height)) {
                            frame.layoutSizingVertical = 'HUG';
                        }
                    }
                    catch (error) {
                        console.error('Layout error:', error);
                        frame.resize(Math.max(480, frame.width), frame.height);
                    }
                }
                else if (!hasExplicitDimensions && needsFullWidth) {
                    // Only resize if needed, don't force arbitrary widths
                    frame.resize(Math.max(frame.width, 300), frame.height);
                    // Allow vertical growth for containers
                    if (!((_32 = node.styles) === null || _32 === void 0 ? void 0 : _32.height)) {
                        frame.layoutSizingVertical = 'HUG';
                    }
                }
                else if (hasExplicitDimensions) {
                }
                // Handle flex child height separately for ALL elements (including those with explicit width like sidebar)
                if (parentFrame && parentFrame.layoutMode === 'HORIZONTAL' && !((_33 = node.styles) === null || _33 === void 0 ? void 0 : _33.height)) {
                    try {
                        frame.layoutSizingVertical = 'FILL';
                        // Debug height filling for sidebar
                        if (((_34 = node.styles) === null || _34 === void 0 ? void 0 : _34.className) === 'sidebar') {
                        }
                    }
                    catch (error) {
                        console.error('Height fill error for', ((_35 = node.styles) === null || _35 === void 0 ? void 0 : _35.className) || 'element', error);
                    }
                }
                // FIXED: Apply max-width, min-width, max-height, min-height from CSS
                const maxWidthValue = parseSize((_36 = node.styles) === null || _36 === void 0 ? void 0 : _36['max-width']);
                const minWidthValue = parseSize((_37 = node.styles) === null || _37 === void 0 ? void 0 : _37['min-width']);
                const maxHeightValue = parseSize((_38 = node.styles) === null || _38 === void 0 ? void 0 : _38['max-height']);
                const minHeightValue = parseSize((_39 = node.styles) === null || _39 === void 0 ? void 0 : _39['min-height']);
                if (maxWidthValue !== null && maxWidthValue > 0) {
                    try {
                        frame.maxWidth = maxWidthValue;
                    }
                    catch (error) {
                        // Fallback: if maxWidth property doesn't exist, resize if needed
                        if (frame.width > maxWidthValue) {
                            frame.resize(maxWidthValue, frame.height);
                        }
                    }
                }
                if (minWidthValue !== null && minWidthValue > 0) {
                    try {
                        frame.minWidth = minWidthValue;
                    }
                    catch (error) {
                        // Fallback: if minWidth property doesn't exist, resize if needed
                        if (frame.width < minWidthValue) {
                            frame.resize(minWidthValue, frame.height);
                        }
                    }
                }
                if (maxHeightValue !== null && maxHeightValue > 0) {
                    try {
                        frame.maxHeight = maxHeightValue;
                    }
                    catch (error) {
                        // Fallback: if maxHeight property doesn't exist, resize if needed
                        if (frame.height > maxHeightValue) {
                            frame.resize(frame.width, maxHeightValue);
                        }
                    }
                }
                if (minHeightValue !== null && minHeightValue > 0) {
                    try {
                        frame.minHeight = minHeightValue;
                    }
                    catch (error) {
                        // Fallback: if minHeight property doesn't exist, resize if needed
                        if (frame.height < minHeightValue) {
                            frame.resize(frame.width, minHeightValue);
                        }
                    }
                }
                // Apply centering for elements marked with margin: 0 auto
                if (frame.getPluginData('centerHorizontally') === 'true' && parentFrame) {
                    if (parentFrame.layoutMode === 'VERTICAL') {
                        parentFrame.primaryAxisAlignItems = 'CENTER';
                    }
                }
                // Pass styles that should be inherited by children
                // CRITICAL: Track if we're inside a width-constrained container
                const thisHasWidth = Boolean((_40 = node.styles) === null || _40 === void 0 ? void 0 : _40.width);
                const parentHadWidth = (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['_hasConstrainedWidth']) === true;
                // FIX: In HORIZONTAL flex containers, children should NOT inherit width constraint
                // because flex row children size to their content, not to parent width
                const isHorizontalFlex = frame.layoutMode === 'HORIZONTAL';
                const shouldPropagateWidthConstraint = isHorizontalFlex ? thisHasWidth : (thisHasWidth || parentHadWidth);
                const inheritableStyles = Object.assign(Object.assign({}, inheritedStyles), { 
                    // CRITICAL: Propagate width constraint - but not through horizontal flex containers
                    '_hasConstrainedWidth': shouldPropagateWidthConstraint, 
                    // CRITICAL: Propagate FILL vertical for grid rows with multi-row spans
                    '_shouldFillVertical': inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['_shouldFillVertical'], 
                    // TEXT PROPERTIES - CSS inherited properties
                    color: ((_41 = node.styles) === null || _41 === void 0 ? void 0 : _41.color) || (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles.color), 'font-family': ((_42 = node.styles) === null || _42 === void 0 ? void 0 : _42['font-family']) || (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['font-family']), 'font-size': ((_43 = node.styles) === null || _43 === void 0 ? void 0 : _43['font-size']) || (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['font-size']), 'font-weight': ((_44 = node.styles) === null || _44 === void 0 ? void 0 : _44['font-weight']) || (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['font-weight']), 'font-style': ((_45 = node.styles) === null || _45 === void 0 ? void 0 : _45['font-style']) || (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['font-style']), 'line-height': ((_46 = node.styles) === null || _46 === void 0 ? void 0 : _46['line-height']) || (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['line-height']), 'text-align': ((_47 = node.styles) === null || _47 === void 0 ? void 0 : _47['text-align']) || (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['text-align']), 'letter-spacing': ((_48 = node.styles) === null || _48 === void 0 ? void 0 : _48['letter-spacing']) || (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['letter-spacing']), 'word-spacing': ((_49 = node.styles) === null || _49 === void 0 ? void 0 : _49['word-spacing']) || (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['word-spacing']), 'text-transform': ((_50 = node.styles) === null || _50 === void 0 ? void 0 : _50['text-transform']) || (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['text-transform']), 
                    // FIXED: Don't inherit background/background-color - only pass info for gradient container detection
                    'parent-has-gradient': (((_51 = node.styles) === null || _51 === void 0 ? void 0 : _51['background']) && node.styles['background'].includes('linear-gradient')) ||
                        (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['parent-has-gradient']), 
                    // Pass parent class name to help with styling decisions
                    'parent-class': ((_52 = node.styles) === null || _52 === void 0 ? void 0 : _52.className) || (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['parent-class']) });
                // FIXED: Handle mixed content (text interleaved with elements) in correct order
                if (node.mixedContent && node.mixedContent.length > 0) {
                    // Process mixed content in order
                    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                    for (const item of node.mixedContent) {
                        if (item.type === 'text' && item.text && item.text.trim()) {
                            // Create inline text node
                            const textNode = figma.createText();
                            textNode.characters = item.text.trim();
                            textNode.name = 'Inline Text';
                            // Apply inherited styles and specific text styles
                            applyStylesToText(textNode, Object.assign(Object.assign({}, inheritableStyles), node.styles));
                            frame.appendChild(textNode);
                            // For mixed content, use HUG so text sits inline with elements
                            if (frame.layoutMode === 'HORIZONTAL') {
                                textNode.layoutSizingHorizontal = 'HUG';
                                textNode.textAutoResize = 'WIDTH_AND_HEIGHT';
                            }
                            else if (frame.layoutMode === 'VERTICAL') {
                                textNode.layoutSizingHorizontal = 'FILL';
                                textNode.textAutoResize = 'HEIGHT';
                            }
                            else {
                                textNode.textAutoResize = 'WIDTH_AND_HEIGHT';
                            }
                        }
                        else if (item.type === 'element' && item.node) {
                            // Process element child in order
                            await createFigmaNodesFromStructure([item.node], frame, 0, 0, inheritableStyles);
                        }
                    }
                }
                else {
                    // Legacy behavior: Create text node if there's direct text content
                    if (node.text && node.text.trim()) {
                        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                        const textNode = figma.createText();
                        textNode.characters = node.text.trim();
                        textNode.name = 'DIV Text';
                        // Apply inherited styles and specific text styles
                        applyStylesToText(textNode, Object.assign(Object.assign({}, inheritableStyles), node.styles));
                        frame.appendChild(textNode);
                        // FIXED: Use FILL for text in auto-layout containers instead of hardcoded width
                        // But if the parent is HORIZONTAL flex and this frame will HUG, text should expand naturally
                        const parentIsHorizontal = parentFrame && parentFrame.layoutMode === 'HORIZONTAL';
                        const frameHasNoExplicitWidth = !((_53 = node.styles) === null || _53 === void 0 ? void 0 : _53.width);
                        const frameWillHugHorizontal = parentIsHorizontal && frameHasNoExplicitWidth && !((_54 = node.styles) === null || _54 === void 0 ? void 0 : _54.flex) && !((_55 = node.styles) === null || _55 === void 0 ? void 0 : _55['flex-grow']);
                        if (frameWillHugHorizontal) {
                            // Parent is horizontal flex and this frame will HUG - text should size naturally
                            textNode.textAutoResize = 'WIDTH_AND_HEIGHT';
                        }
                        else if (frame.layoutMode === 'HORIZONTAL' || frame.layoutMode === 'VERTICAL') {
                            // Text should fill the container width and wrap
                            textNode.layoutSizingHorizontal = 'FILL';
                            textNode.textAutoResize = 'HEIGHT';
                        }
                        else {
                            // No auto-layout: let text size naturally
                            textNode.textAutoResize = 'WIDTH_AND_HEIGHT';
                        }
                    }
                    // Process children if they exist
                    if (node.children && node.children.length > 0) {
                        // Manejo de grid genérico
                        if (((_56 = node.styles) === null || _56 === void 0 ? void 0 : _56.display) === 'grid') {
                            console.log('[GRID] Grid detected! Children:', node.children.length);
                            const gridTemplateAreas = (_57 = node.styles) === null || _57 === void 0 ? void 0 : _57['grid-template-areas'];
                            const gridTemplateColumns = (_58 = node.styles) === null || _58 === void 0 ? void 0 : _58['grid-template-columns'];
                            console.log('[GRID] template-areas:', gridTemplateAreas);
                            console.log('[GRID] template-columns:', gridTemplateColumns);
                            const gap = parseSize((_59 = node.styles) === null || _59 === void 0 ? void 0 : _59.gap) || parseSize((parentFrame === null || parentFrame === void 0 ? void 0 : parentFrame.getPluginData('gridGap')) || '') || 12;
                            // Check if grid-template-areas is defined
                            const areaMap = parseGridTemplateAreas(gridTemplateAreas);
                            if (areaMap) {
                                // Use grid-template-areas layout
                                const numRows = getGridRowCount(gridTemplateAreas);
                                const numCols = getGridColCount(gridTemplateAreas);
                                await createGridLayoutWithAreas(node.children, frame, areaMap, numRows, numCols, gap, inheritableStyles);
                            }
                            else {
                                // Fallback to column-based grid layout
                                const columns = parseGridColumns(gridTemplateColumns);
                                const finalColumns = columns > 0 ? columns : 2;
                                await createGridLayout(node.children, frame, finalColumns, gap, inheritableStyles);
                            }
                        }
                        else {
                            await createFigmaNodesFromStructure(node.children, frame, 0, 0, inheritableStyles);
                        }
                        // FIXED: Reorder children by z-index after all children are created
                        reorderChildrenByZIndex(frame);
                    }
                }
                // FIXED: Store z-index for later reordering
                if ((_60 = node.styles) === null || _60 === void 0 ? void 0 : _60['z-index']) {
                    const zIndex = parseInt(node.styles['z-index'], 10);
                    if (!isNaN(zIndex)) {
                        frame.setPluginData('zIndex', zIndex.toString());
                    }
                }
                // Apply flex grow after appendChild for proper timing
                if ((((_61 = node.styles) === null || _61 === void 0 ? void 0 : _61.flex) === '1' || ((_62 = node.styles) === null || _62 === void 0 ? void 0 : _62['flex-grow']) === '1') && parentFrame) {
                    if (parentFrame.layoutMode === 'HORIZONTAL' || parentFrame.layoutMode === 'VERTICAL') {
                        try {
                            frame.layoutGrow = 1;
                            frame.layoutSizingHorizontal = 'FILL';
                            frame.layoutSizingVertical = 'HUG';
                        }
                        catch (error) {
                            console.error('Error applying flex grow:', error);
                            // Fallback: only apply layoutGrow
                            try {
                                frame.layoutGrow = 1;
                            }
                            catch (fallbackError) {
                                console.error('Fallback error:', fallbackError);
                            }
                        }
                    }
                }
                // FIXED: Apply align-self for individual item alignment within parent
                if (((_63 = node.styles) === null || _63 === void 0 ? void 0 : _63['align-self']) && parentFrame) {
                    try {
                        const alignSelf = node.styles['align-self'];
                        if (alignSelf === 'center') {
                            frame.layoutAlign = 'CENTER';
                        }
                        else if (alignSelf === 'flex-start' || alignSelf === 'start') {
                            frame.layoutAlign = 'MIN';
                        }
                        else if (alignSelf === 'flex-end' || alignSelf === 'end') {
                            frame.layoutAlign = 'MAX';
                        }
                        else if (alignSelf === 'stretch') {
                            frame.layoutAlign = 'STRETCH';
                        }
                    }
                    catch (error) {
                        console.error('Error applying align-self:', error);
                    }
                }
            }
            else if (node.tagName === 'form') {
                const form = figma.createFrame();
                form.name = 'FORM';
                form.fills = []; // FIXED: No hardcoded background - let CSS handle it
                form.layoutMode = 'VERTICAL';
                form.primaryAxisSizingMode = 'AUTO';
                form.counterAxisSizingMode = 'AUTO';
                // FIXED: Only apply default padding/spacing if no CSS values
                const basePadding = parseSize((_64 = node.styles) === null || _64 === void 0 ? void 0 : _64.padding);
                form.paddingLeft = (_67 = (_66 = parseSize((_65 = node.styles) === null || _65 === void 0 ? void 0 : _65['padding-left'])) !== null && _66 !== void 0 ? _66 : basePadding) !== null && _67 !== void 0 ? _67 : 0;
                form.paddingRight = (_70 = (_69 = parseSize((_68 = node.styles) === null || _68 === void 0 ? void 0 : _68['padding-right'])) !== null && _69 !== void 0 ? _69 : basePadding) !== null && _70 !== void 0 ? _70 : 0;
                form.paddingTop = (_73 = (_72 = parseSize((_71 = node.styles) === null || _71 === void 0 ? void 0 : _71['padding-top'])) !== null && _72 !== void 0 ? _72 : basePadding) !== null && _73 !== void 0 ? _73 : 0;
                form.paddingBottom = (_76 = (_75 = parseSize((_74 = node.styles) === null || _74 === void 0 ? void 0 : _74['padding-bottom'])) !== null && _75 !== void 0 ? _75 : basePadding) !== null && _76 !== void 0 ? _76 : 0;
                form.itemSpacing = (_78 = parseSize((_77 = node.styles) === null || _77 === void 0 ? void 0 : _77.gap)) !== null && _78 !== void 0 ? _78 : 0;
                if (node.styles) {
                    applyStylesToFrame(form, node.styles);
                }
                if (!parentFrame) {
                    form.x = startX;
                    form.y = startY;
                    figma.currentPage.appendChild(form);
                }
                else {
                    parentFrame.appendChild(form);
                }
                await createFigmaNodesFromStructure(node.children, form, 0, 0, inheritedStyles);
            }
            else if (['input', 'textarea', 'select'].includes(node.tagName)) {
                // Calcular alto y ancho
                let inputWidth = parseSize((_79 = node.styles) === null || _79 === void 0 ? void 0 : _79.width);
                const inputHeight = node.tagName === 'textarea' ?
                    (parseSize((_80 = node.attributes) === null || _80 === void 0 ? void 0 : _80.rows) || 3) * 20 + 20 :
                    parseSize((_81 = node.styles) === null || _81 === void 0 ? void 0 : _81.height) || 40;
                const input = figma.createFrame();
                // Fondo y borde: usar CSS si está, si no, fallback blanco/gris
                let bgColor = { r: 1, g: 1, b: 1 };
                if (((_82 = node.styles) === null || _82 === void 0 ? void 0 : _82['background']) && node.styles['background'] !== 'transparent') {
                    const bgParsed = hexToRgb(node.styles['background']);
                    if (bgParsed)
                        bgColor = bgParsed;
                }
                else if (((_83 = node.styles) === null || _83 === void 0 ? void 0 : _83['background-color']) && node.styles['background-color'] !== 'transparent') {
                    const bgParsed = hexToRgb(node.styles['background-color']);
                    if (bgParsed)
                        bgColor = bgParsed;
                }
                input.fills = [{ type: 'SOLID', color: bgColor }];
                let borderColor = { r: 0.8, g: 0.8, b: 0.8 };
                if (((_84 = node.styles) === null || _84 === void 0 ? void 0 : _84['border']) || ((_85 = node.styles) === null || _85 === void 0 ? void 0 : _85['border-color'])) {
                    const borderParsed = hexToRgb(node.styles['border-color'] || extractBorderColor(node.styles['border']));
                    if (borderParsed)
                        borderColor = borderParsed;
                }
                input.strokes = [{ type: 'SOLID', color: borderColor }];
                input.strokeWeight = parseSize((_86 = node.styles) === null || _86 === void 0 ? void 0 : _86['border-width']) || 1;
                input.cornerRadius = parseSize((_87 = node.styles) === null || _87 === void 0 ? void 0 : _87['border-radius']) || 4;
                input.name = node.tagName.toUpperCase();
                input.layoutMode = 'HORIZONTAL';
                // Solo centrar si el CSS lo especifica (no hardcodear centrado)
                if (((_88 = node.styles) === null || _88 === void 0 ? void 0 : _88['text-align']) === 'center') {
                    input.primaryAxisAlignItems = 'CENTER'; // Horizontal center
                    input.counterAxisAlignItems = 'CENTER'; // Vertical center
                }
                else {
                    input.primaryAxisAlignItems = 'MIN'; // Alineado a la izquierda horizontalmente (eje principal)
                    input.counterAxisAlignItems = 'CENTER'; // Centrado verticalmente (eje perpendicular)
                }
                input.paddingLeft = parseSize((_89 = node.styles) === null || _89 === void 0 ? void 0 : _89['padding-left']) || 12;
                input.paddingRight = parseSize((_90 = node.styles) === null || _90 === void 0 ? void 0 : _90['padding-right']) || 12;
                // Detectar si el parent es auto-layout
                const parentIsAutoLayout = parentFrame && parentFrame.type === 'FRAME' && parentFrame.layoutMode && parentFrame.layoutMode !== 'NONE';
                // Soporte width: 100% (FILL) si el CSS lo pide y el parent es auto-layout
                let useFill = false;
                if (((_91 = node.styles) === null || _91 === void 0 ? void 0 : _91.width) === '100%') {
                    if (parentIsAutoLayout) {
                        useFill = true;
                        // NO setear FILL aquí - lo haremos después de appendChild
                    }
                    else {
                        // Si no hay parent auto-layout, usar el ancho del parent o mínimo 300
                        inputWidth = parentFrame && 'width' in parentFrame ? Math.max(parentFrame.width, 300) : 300;
                    }
                }
                if (!useFill) {
                    input.resize(inputWidth || 300, inputHeight);
                }
                else {
                    input.resize(input.width, inputHeight); // Solo setea el alto
                }
                if (node.styles) {
                    applyStylesToFrame(input, node.styles);
                }
                // Add placeholder or value text
                await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                const inputText = figma.createText();
                const displayText = ((_92 = node.attributes) === null || _92 === void 0 ? void 0 : _92.value) || ((_93 = node.attributes) === null || _93 === void 0 ? void 0 : _93.placeholder) ||
                    (node.tagName === 'select' ? 'Select option ▼' : 'Input field');
                inputText.characters = displayText;
                // Color de texto: usar CSS si está, si no, gris claro para placeholder
                let textColor = { r: 0.2, g: 0.2, b: 0.2 };
                if ((_94 = node.styles) === null || _94 === void 0 ? void 0 : _94.color) {
                    const colorParsed = hexToRgb(node.styles.color);
                    if (colorParsed)
                        textColor = colorParsed;
                }
                else if (!((_95 = node.attributes) === null || _95 === void 0 ? void 0 : _95.value)) {
                    textColor = { r: 0.6, g: 0.6, b: 0.6 };
                }
                inputText.fills = [{ type: 'SOLID', color: textColor }];
                input.appendChild(inputText);
                if (!parentFrame) {
                    input.x = startX;
                    input.y = startY;
                    figma.currentPage.appendChild(input);
                }
                else {
                    parentFrame.appendChild(input);
                }
                // Si corresponde, setear FILL después de añadir al parent (para evitar error de Figma)
                if (useFill) {
                    try {
                        input.layoutSizingHorizontal = 'FILL';
                    }
                    catch (e) {
                        // Si falla, hacer resize manual
                        if (parentFrame && 'width' in parentFrame) {
                            input.resize(Math.max(parentFrame.width, 300), input.height);
                        }
                        else {
                            input.resize(300, input.height);
                        }
                    }
                }
            }
            else if (node.tagName === 'table') {
                const tableWidth = parseSize((_96 = node.styles) === null || _96 === void 0 ? void 0 : _96.width) || 500; // Increased default width
                let tableHeight = 60; // Base height for header
                // Calculate table height based on rows
                const bodyRows = node.children.filter((c) => c.tagName === 'tbody' || c.tagName === 'tr');
                const totalRows = bodyRows.reduce((count, section) => {
                    if (section.tagName === 'tbody') {
                        return count + section.children.filter((c) => c.tagName === 'tr').length;
                    }
                    return count + 1;
                }, 0);
                tableHeight += totalRows * 55; // 55px per row (aumentado de 45)
                const table = figma.createFrame();
                table.resize(tableWidth, tableHeight);
                table.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
                table.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
                table.strokeWeight = 1;
                table.name = 'TABLE';
                table.layoutMode = 'VERTICAL';
                table.primaryAxisSizingMode = 'AUTO';
                table.counterAxisSizingMode = 'AUTO';
                table.itemSpacing = 0;
                table.paddingTop = 10;
                table.paddingBottom = 10;
                if (node.styles) {
                    applyStylesToFrame(table, node.styles);
                }
                if (!parentFrame) {
                    table.x = startX;
                    table.y = startY;
                    figma.currentPage.appendChild(table);
                }
                else {
                    parentFrame.appendChild(table);
                }
                await createFigmaNodesFromStructure(node.children, table, 0, 0, inheritedStyles);
            }
            else if (['tr', 'thead', 'tbody'].includes(node.tagName)) {
                if (node.tagName === 'thead' || node.tagName === 'tbody') {
                    // Process container elements, create their children directly
                    await createFigmaNodesFromStructure(node.children, parentFrame, 0, 0, inheritedStyles);
                }
                else {
                    // This is a TR (table row)
                    const row = figma.createFrame();
                    row.resize(450, 55); // Aumentado de 45 a 55
                    // Check if this row contains th elements (header row)
                    const isHeaderRow = node.children.some((c) => c.tagName === 'th');
                    row.fills = isHeaderRow ?
                        [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.98 } }] :
                        [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
                    row.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
                    row.strokeWeight = 1;
                    row.name = 'TABLE ROW';
                    row.layoutMode = 'HORIZONTAL';
                    row.primaryAxisSizingMode = 'AUTO';
                    row.counterAxisSizingMode = 'AUTO';
                    row.paddingLeft = 8;
                    row.paddingRight = 8;
                    if (!parentFrame) {
                        row.x = startX;
                        row.y = startY;
                        figma.currentPage.appendChild(row);
                    }
                    else {
                        parentFrame.appendChild(row);
                    }
                    await createFigmaNodesFromStructure(node.children, row, 0, 0, inheritedStyles);
                }
            }
            else if (['td', 'th'].includes(node.tagName)) {
                const cell = figma.createFrame();
                // FIXED: Use CSS dimensions or auto-size
                const cellWidth = parseSize((_97 = node.styles) === null || _97 === void 0 ? void 0 : _97.width) || 100; // Reasonable default
                const cellHeight = parseSize((_98 = node.styles) === null || _98 === void 0 ? void 0 : _98.height) || 40;
                cell.resize(cellWidth, cellHeight);
                // FIXED: Use CSS background-color or transparent
                const bgColor = ((_99 = node.styles) === null || _99 === void 0 ? void 0 : _99['background-color']) || ((_100 = node.styles) === null || _100 === void 0 ? void 0 : _100.background);
                if (bgColor && bgColor !== 'transparent') {
                    const parsedBg = hexToRgb(bgColor);
                    cell.fills = parsedBg ? [{ type: 'SOLID', color: parsedBg }] : [];
                }
                else {
                    cell.fills = [];
                }
                // FIXED: Use CSS border or light default
                const borderColor = (_101 = node.styles) === null || _101 === void 0 ? void 0 : _101['border-color'];
                if (borderColor) {
                    const parsedBorder = hexToRgb(borderColor);
                    cell.strokes = parsedBorder ? [{ type: 'SOLID', color: parsedBorder }] : [];
                }
                else {
                    cell.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
                }
                cell.strokeWeight = (_103 = parseSize((_102 = node.styles) === null || _102 === void 0 ? void 0 : _102['border-width'])) !== null && _103 !== void 0 ? _103 : 0.5;
                cell.name = node.tagName.toUpperCase();
                cell.layoutMode = 'HORIZONTAL';
                cell.primaryAxisAlignItems = 'CENTER';
                cell.counterAxisAlignItems = 'CENTER';
                // FIXED: Use CSS padding
                const basePadding = parseSize((_104 = node.styles) === null || _104 === void 0 ? void 0 : _104.padding);
                cell.paddingLeft = (_107 = (_106 = parseSize((_105 = node.styles) === null || _105 === void 0 ? void 0 : _105['padding-left'])) !== null && _106 !== void 0 ? _106 : basePadding) !== null && _107 !== void 0 ? _107 : 8;
                cell.paddingRight = (_110 = (_109 = parseSize((_108 = node.styles) === null || _108 === void 0 ? void 0 : _108['padding-right'])) !== null && _109 !== void 0 ? _109 : basePadding) !== null && _110 !== void 0 ? _110 : 8;
                cell.paddingTop = (_113 = (_112 = parseSize((_111 = node.styles) === null || _111 === void 0 ? void 0 : _111['padding-top'])) !== null && _112 !== void 0 ? _112 : basePadding) !== null && _113 !== void 0 ? _113 : 4;
                cell.paddingBottom = (_116 = (_115 = parseSize((_114 = node.styles) === null || _114 === void 0 ? void 0 : _114['padding-bottom'])) !== null && _115 !== void 0 ? _115 : basePadding) !== null && _116 !== void 0 ? _116 : 4;
                await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                const cellText = figma.createText();
                // Get text content from node or its children
                let textContent = '';
                if (node.text && node.text.trim()) {
                    textContent = node.text.trim();
                }
                else if (node.children && node.children.length > 0) {
                    textContent = node.children.map((child) => {
                        if (child.type === 'text')
                            return child.text;
                        if (child.type === 'element' && child.tagName === 'button') {
                            return child.text || 'Button';
                        }
                        return child.text || '';
                    }).filter((text) => text.trim()).join(' ');
                }
                cellText.characters = textContent || '';
                // FIXED: Use CSS color or default to black, let CSS override
                const textColor = (_117 = node.styles) === null || _117 === void 0 ? void 0 : _117.color;
                if (textColor) {
                    const parsedColor = hexToRgb(textColor);
                    cellText.fills = parsedColor ? [{ type: 'SOLID', color: parsedColor }] : [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                }
                else {
                    cellText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                }
                // TH gets bold by default (browser behavior)
                if (node.tagName === 'th') {
                    figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
                        cellText.fontName = { family: "Inter", style: "Bold" };
                    }).catch(() => { });
                }
                cell.appendChild(cellText);
                // Apply additional text styles from CSS
                if (node.styles) {
                    applyStylesToText(cellText, node.styles);
                }
                // Check if parent has text-align center and inherit it
                if (parentFrame && parentFrame.getPluginData('textAlign') === 'center') {
                    // If parent container has text-align center, apply it to this text
                    if (!((_118 = node.styles) === null || _118 === void 0 ? void 0 : _118['text-align'])) {
                        cellText.textAlignHorizontal = 'CENTER';
                    }
                }
                // Special debug for detail elements
                if ((_120 = (_119 = node.styles) === null || _119 === void 0 ? void 0 : _119.className) === null || _120 === void 0 ? void 0 : _120.includes('detail')) {
                }
                if (!parentFrame) {
                    cell.x = startX;
                    cell.y = startY;
                    figma.currentPage.appendChild(cell);
                }
                else {
                    parentFrame.appendChild(cell);
                }
            }
            else if (node.tagName === 'button') {
                const buttonWidth = parseSize((_121 = node.styles) === null || _121 === void 0 ? void 0 : _121.width) || Math.max(120, (((_122 = node.text) === null || _122 === void 0 ? void 0 : _122.length) || 6) * 12);
                const buttonHeight = parseSize((_123 = node.styles) === null || _123 === void 0 ? void 0 : _123.height) || 44;
                const frame = figma.createFrame();
                frame.resize(buttonWidth, buttonHeight);
                // FIXED: Use CSS background-color or default to transparent (browser default)
                const bgColor = ((_124 = node.styles) === null || _124 === void 0 ? void 0 : _124['background-color']) || ((_125 = node.styles) === null || _125 === void 0 ? void 0 : _125.background);
                if (bgColor) {
                    const parsedColor = hexToRgb(bgColor);
                    if (parsedColor) {
                        frame.fills = [{ type: 'SOLID', color: parsedColor }];
                    }
                    else {
                        frame.fills = [];
                    }
                }
                else {
                    // Default button style - light gray like browser default
                    frame.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
                }
                // FIXED: Use CSS border-radius or default to small radius
                const borderRadius = (_127 = parseSize((_126 = node.styles) === null || _126 === void 0 ? void 0 : _126['border-radius'])) !== null && _127 !== void 0 ? _127 : 4;
                frame.cornerRadius = borderRadius;
                frame.name = 'Button';
                // Enable auto-layout for centering
                frame.layoutMode = 'HORIZONTAL';
                frame.primaryAxisAlignItems = 'CENTER';
                frame.counterAxisAlignItems = 'CENTER';
                // FIXED: Use CSS padding or sensible defaults
                const basePadding = parseSize((_128 = node.styles) === null || _128 === void 0 ? void 0 : _128.padding);
                frame.paddingLeft = (_131 = (_130 = parseSize((_129 = node.styles) === null || _129 === void 0 ? void 0 : _129['padding-left'])) !== null && _130 !== void 0 ? _130 : basePadding) !== null && _131 !== void 0 ? _131 : 16;
                frame.paddingRight = (_134 = (_133 = parseSize((_132 = node.styles) === null || _132 === void 0 ? void 0 : _132['padding-right'])) !== null && _133 !== void 0 ? _133 : basePadding) !== null && _134 !== void 0 ? _134 : 16;
                frame.paddingTop = (_137 = (_136 = parseSize((_135 = node.styles) === null || _135 === void 0 ? void 0 : _135['padding-top'])) !== null && _136 !== void 0 ? _136 : basePadding) !== null && _137 !== void 0 ? _137 : 8;
                frame.paddingBottom = (_140 = (_139 = parseSize((_138 = node.styles) === null || _138 === void 0 ? void 0 : _138['padding-bottom'])) !== null && _139 !== void 0 ? _139 : basePadding) !== null && _140 !== void 0 ? _140 : 8;
                // Apply styles (including new CSS properties)
                if (node.styles) {
                    applyStylesToFrame(frame, node.styles);
                }
                // Add button text
                await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                const buttonText = figma.createText();
                buttonText.characters = node.text || 'Button';
                // FIXED: Use CSS color or default to dark text (for light background default)
                const textColor = (_141 = node.styles) === null || _141 === void 0 ? void 0 : _141.color;
                if (textColor) {
                    const parsedTextColor = hexToRgb(textColor);
                    if (parsedTextColor) {
                        buttonText.fills = [{ type: 'SOLID', color: parsedTextColor }];
                    }
                    else {
                        buttonText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                    }
                }
                else {
                    buttonText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                }
                // Apply text styles if present
                if (node.styles) {
                    applyStylesToText(buttonText, node.styles);
                }
                frame.appendChild(buttonText);
                if (!parentFrame) {
                    frame.x = startX;
                    frame.y = startY;
                    figma.currentPage.appendChild(frame);
                }
                else {
                    parentFrame.appendChild(frame);
                }
            }
            else if (node.tagName === 'img') {
                const width = parseSize((_142 = node.styles) === null || _142 === void 0 ? void 0 : _142.width) || 200;
                const height = parseSize((_143 = node.styles) === null || _143 === void 0 ? void 0 : _143.height) || 150;
                const frame = figma.createFrame();
                frame.resize(width, height);
                frame.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
                frame.name = 'Image: ' + (((_144 = node.attributes) === null || _144 === void 0 ? void 0 : _144.alt) || 'Unnamed');
                // Center the placeholder text
                frame.layoutMode = 'HORIZONTAL';
                frame.primaryAxisAlignItems = 'CENTER';
                frame.counterAxisAlignItems = 'CENTER';
                // Add placeholder text
                await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                const placeholderText = figma.createText();
                placeholderText.characters = ((_145 = node.attributes) === null || _145 === void 0 ? void 0 : _145.alt) || 'Image';
                placeholderText.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
                frame.appendChild(placeholderText);
                if (!parentFrame) {
                    frame.x = startX;
                    frame.y = startY;
                    figma.currentPage.appendChild(frame);
                }
                else {
                    parentFrame.appendChild(frame);
                }
            }
            else if (['ul', 'ol'].includes(node.tagName)) {
                // Create list container with auto-layout
                const listFrame = figma.createFrame();
                listFrame.fills = [];
                listFrame.name = node.tagName.toUpperCase() + ' List';
                listFrame.layoutMode = 'VERTICAL';
                listFrame.primaryAxisSizingMode = 'AUTO';
                listFrame.counterAxisSizingMode = 'AUTO';
                // Better spacing for lists
                listFrame.itemSpacing = 6;
                listFrame.paddingLeft = 20; // Indent for bullets
                listFrame.paddingTop = 8;
                listFrame.paddingBottom = 8;
                // Apply list styles if present
                if (node.styles) {
                    applyStylesToFrame(listFrame, node.styles);
                }
                if (!parentFrame) {
                    listFrame.x = startX;
                    listFrame.y = startY;
                    figma.currentPage.appendChild(listFrame);
                }
                else {
                    parentFrame.appendChild(listFrame);
                }
                await createFigmaNodesFromStructure(node.children, listFrame, 0, 0, inheritedStyles);
            }
            else if (node.tagName === 'li') {
                await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                const text = figma.createText();
                const parentList = ((_146 = parentFrame === null || parentFrame === void 0 ? void 0 : parentFrame.name) === null || _146 === void 0 ? void 0 : _146.includes('OL')) ? 'OL' : 'UL';
                const bullet = parentList === 'OL' ? '1. ' : '• ';
                text.characters = bullet + (node.text || 'List item');
                text.name = 'List Item';
                // Apply styles (including new text properties)
                if (node.styles) {
                    applyStylesToText(text, node.styles);
                }
                // Check if parent has text-align center and inherit it
                if (parentFrame && parentFrame.getPluginData('textAlign') === 'center') {
                    // If parent container has text-align center, apply it to this text
                    if (!((_147 = node.styles) === null || _147 === void 0 ? void 0 : _147['text-align'])) {
                        text.textAlignHorizontal = 'CENTER';
                    }
                }
                // Special debug for detail elements
                if ((_149 = (_148 = node.styles) === null || _148 === void 0 ? void 0 : _148.className) === null || _149 === void 0 ? void 0 : _149.includes('detail')) {
                }
                if (!parentFrame) {
                    text.x = startX;
                    text.y = startY;
                    figma.currentPage.appendChild(text);
                }
                else {
                    parentFrame.appendChild(text);
                }
            }
            else if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a', 'label', 'strong', 'b', 'em', 'i', 'code', 'small', 'mark', 'del', 'ins', 'sub', 'sup', 'cite', 'q', 'abbr', 'time'].includes(node.tagName)) {
                // FIX: If text element has children but no direct text, process children instead
                const hasNoDirectText = !node.text || !node.text.trim();
                const hasChildren = node.children && node.children.length > 0;
                if (hasNoDirectText && hasChildren) {
                    // Process children instead of creating empty text
                    await createFigmaNodesFromStructure(node.children, parentFrame, startX, startY, inheritedStyles);
                    continue; // Skip the rest of this element's processing
                }
                // Special handling for span elements with backgrounds (like badges)
                const hasBackground = ((_150 = node.styles) === null || _150 === void 0 ? void 0 : _150['background']) || ((_151 = node.styles) === null || _151 === void 0 ? void 0 : _151['background-color']);
                const isSpanWithBackground = node.tagName === 'span' && hasBackground && hasBackground !== 'transparent';
                if (isSpanWithBackground) {
                    // Create span with background as FrameNode (like a badge)
                    const spanFrame = figma.createFrame();
                    spanFrame.name = 'BADGE Frame';
                    spanFrame.layoutMode = 'HORIZONTAL';
                    spanFrame.primaryAxisSizingMode = 'AUTO';
                    spanFrame.counterAxisSizingMode = 'AUTO';
                    spanFrame.primaryAxisAlignItems = 'CENTER';
                    spanFrame.counterAxisAlignItems = 'CENTER';
                    // Apply background and other frame styles
                    if (node.styles) {
                        applyStylesToFrame(spanFrame, node.styles);
                    }
                    // Create text inside the frame
                    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                    const text = figma.createText();
                    text.characters = node.text || 'Badge text';
                    text.name = 'BADGE Text';
                    // Apply text styles
                    if (node.styles) {
                        applyStylesToText(text, node.styles);
                    }
                    spanFrame.appendChild(text);
                    if (!parentFrame) {
                        spanFrame.x = startX;
                        spanFrame.y = startY;
                        figma.currentPage.appendChild(spanFrame);
                    }
                    else {
                        parentFrame.appendChild(spanFrame);
                    }
                }
                else {
                    // Regular text handling for other elements and spans without backgrounds
                    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                    const text = figma.createText();
                    text.characters = node.text || 'Empty text';
                    text.name = node.tagName.toUpperCase() + ' Text';
                    // Default sizes for headings con mejor legibilidad
                    if (node.tagName.startsWith('h')) {
                        const level = parseInt(node.tagName.charAt(1));
                        const headingSizes = { 1: 36, 2: 28, 3: 22, 4: 20, 5: 18, 6: 16 }; // Todas aumentadas
                        text.fontSize = headingSizes[level] || 16;
                        // NO aplicar lineHeight aquí - dejar que applyStylesToText lo maneje
                    }
                    else if (node.tagName === 'p') {
                        text.fontSize = 16; // Standard paragraph size
                        // NO aplicar lineHeight aquí - dejar que applyStylesToText lo maneje
                    }
                    // Links styling
                    if (node.tagName === 'a') {
                        text.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.5, b: 1 } }];
                    }
                    // Inline element styling - bold
                    if (node.tagName === 'strong' || node.tagName === 'b') {
                        try {
                            await figma.loadFontAsync({ family: "Inter", style: "Bold" });
                            text.fontName = { family: "Inter", style: "Bold" };
                        }
                        catch (e) {
                            // Fallback: keep regular font
                        }
                    }
                    // Inline element styling - italic
                    if (node.tagName === 'em' || node.tagName === 'i' || node.tagName === 'cite') {
                        try {
                            await figma.loadFontAsync({ family: "Inter", style: "Italic" });
                            text.fontName = { family: "Inter", style: "Italic" };
                        }
                        catch (e) {
                            // Fallback: keep regular font
                        }
                    }
                    // Inline element styling - code (monospace)
                    if (node.tagName === 'code') {
                        try {
                            await figma.loadFontAsync({ family: "Roboto Mono", style: "Regular" });
                            text.fontName = { family: "Roboto Mono", style: "Regular" };
                        }
                        catch (e) {
                            // Fallback: keep regular font
                        }
                    }
                    // Inline element styling - small
                    if (node.tagName === 'small') {
                        text.fontSize = Math.max(10, text.fontSize * 0.85);
                    }
                    // Inline element styling - strikethrough
                    if (node.tagName === 'del' || node.tagName === 's') {
                        text.textDecoration = 'STRIKETHROUGH';
                    }
                    // Inline element styling - underline
                    if (node.tagName === 'ins' || node.tagName === 'u') {
                        text.textDecoration = 'UNDERLINE';
                    }
                    // Apply styles first (including new text properties)
                    if (node.styles) {
                        applyStylesToText(text, node.styles);
                    }
                    // Check if parent has text-align center and inherit it
                    if (parentFrame && parentFrame.getPluginData('textAlign') === 'center') {
                        // If parent container has text-align center, apply it to this text
                        if (!((_152 = node.styles) === null || _152 === void 0 ? void 0 : _152['text-align'])) {
                            text.textAlignHorizontal = 'CENTER';
                        }
                    }
                    // Special debug for detail elements
                    if ((_154 = (_153 = node.styles) === null || _153 === void 0 ? void 0 : _153.className) === null || _154 === void 0 ? void 0 : _154.includes('detail')) {
                    }
                    // Better text positioning and width
                    if (!parentFrame) {
                        text.x = startX;
                        text.y = startY;
                        figma.currentPage.appendChild(text);
                    }
                    else {
                        parentFrame.appendChild(text);
                        const parentHasAutoLayout = parentFrame.layoutMode === 'HORIZONTAL' || parentFrame.layoutMode === 'VERTICAL';
                        const hasConstrainedWidth = (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['_hasConstrainedWidth']) === true;
                        if (parentHasAutoLayout) {
                            if (hasConstrainedWidth) {
                                // Inside width-constrained container → wrap
                                text.layoutSizingHorizontal = 'FILL';
                                text.textAutoResize = 'HEIGHT';
                            }
                            else {
                                // No width constraint → expand freely
                                text.textAutoResize = 'WIDTH_AND_HEIGHT';
                            }
                        }
                        else {
                            text.textAutoResize = 'WIDTH_AND_HEIGHT';
                        }
                    }
                }
            }
            else if (node.children && node.children.length > 0) {
                await createFigmaNodesFromStructure(node.children, parentFrame, 0, 0, inheritedStyles);
            }
        }
    }
}
// MCP Monitoring variables
let mcpMonitoringInterval = null;
let lastProcessedTimestamp = 0;
// NEW: SSE status tracking for intelligent fallback
let sseConnected = false;
let sseLastSuccessTimestamp = 0;
let sseHeartbeatTimeout = null;
// Debug logs control (cleaned up for production)
var detailedLogsEnabled = false; // Set to true only for debugging
function debugLog(...args) {
    if (detailedLogsEnabled) {
        console.log(...args);
    }
}
// RequestID deduplication to prevent duplicate processing
const processedRequestIDs = new Set();
const PROCESSED_IDS_MAX_SIZE = 1000; // Prevent memory leaks
function isRequestProcessed(requestId) {
    return processedRequestIDs.has(requestId);
}
function markRequestProcessed(requestId) {
    // Prevent memory leaks by limiting set size
    if (processedRequestIDs.size >= PROCESSED_IDS_MAX_SIZE) {
        const firstId = processedRequestIDs.values().next().value;
        if (firstId) {
            processedRequestIDs.delete(firstId);
        }
    }
    processedRequestIDs.add(requestId);
    console.log(`[DEDUP] Marked RequestID as processed: ${requestId}`);
}
// NEW: Use figma.clientStorage for MCP communication (replaces file system)
async function readMCPSharedData() {
    try {
        debugLog('[MCP] Reading MCP data from file system...');
        // Simple file-based reading via UI
        return new Promise((resolve) => {
            const handleFileResponse = (msg) => {
                if (msg.type === 'file-mcp-data-response') {
                    figma.ui.off('message', handleFileResponse);
                    if (msg.data) {
                        debugLog('[MCP] Found data in file system:', msg.data);
                        resolve(msg.data);
                    }
                    else {
                        debugLog('[MCP] No data found in file system');
                        resolve(null);
                    }
                }
            };
            figma.ui.on('message', handleFileResponse);
            figma.ui.postMessage({ type: 'request-file-mcp-data' });
            // Timeout after 500ms if no response
            setTimeout(() => {
                figma.ui.off('message', handleFileResponse);
                resolve(null);
            }, 500);
        });
    }
    catch (error) {
        console.log('[MCP] Error reading MCP data:', error);
        return null;
    }
}
// Delete shared data after processing (file-based)
async function deleteMCPSharedData() {
    try {
        figma.ui.postMessage({ type: 'delete-file-mcp-data' });
        debugLog('[MCP] Requested deletion of MCP data file');
        return true;
    }
    catch (error) {
        console.log('[MCP] Could not delete MCP data:', error);
        return false;
    }
}
// NEW: SSE-based MCP Monitoring with Intelligent Fallback
function startMCPMonitoring() {
    console.log('[MCP] Starting SSE-based monitoring with intelligent fallback...');
    // Stop any existing polling interval
    if (mcpMonitoringInterval) {
        clearInterval(mcpMonitoringInterval);
        mcpMonitoringInterval = null;
    }
    // Reset SSE tracking
    sseConnected = false;
    sseLastSuccessTimestamp = Date.now(); // Start with current time instead of 0
    // Start SSE connection in UI
    figma.ui.postMessage({ type: 'start-sse' });
    // ✅ INTELLIGENT FALLBACK: Only activates when SSE fails
    mcpMonitoringInterval = setInterval(async () => {
        const now = Date.now();
        const timeSinceLastSSE = now - sseLastSuccessTimestamp;
        // Only use fallback if SSE has been silent for more than 30 seconds
        if (!sseConnected || timeSinceLastSSE > 30000) {
            console.log('[MCP] 🔄 SSE inactive, checking fallback...');
            try {
                const mcpData = await readMCPSharedData();
                if (mcpData) {
                    const dataTimestamp = mcpData.timestamp ? new Date(mcpData.timestamp).getTime() : 0;
                    // Only process if this data is newer than our last SSE success
                    if (dataTimestamp > sseLastSuccessTimestamp) {
                        console.log('[MCP] 💾 Fallback processing new data');
                        // Process and clean up
                        figma.ui.postMessage({
                            type: 'parse-mcp-html',
                            html: mcpData.content,
                            name: mcpData.name || 'Fallback Import',
                            fromMCP: true,
                            mcpSource: 'fallback'
                        });
                        await deleteMCPSharedData();
                    }
                }
            }
            catch (error) {
                console.log('[MCP] Fallback check failed:', error);
            }
        }
        else {
            debugLog('[MCP] 🟢 SSE active, fallback not needed');
        }
    }, 15000); // Check every 15 seconds
    console.log('[MCP] ✅ Intelligent fallback enabled (SSE-priority)');
}
function stopMCPMonitoring() {
    console.log('[MCP] Stopping SSE-based monitoring...');
    // Stop SSE connection in UI
    figma.ui.postMessage({ type: 'stop-sse' });
    // Stop fallback polling
    if (mcpMonitoringInterval) {
        clearInterval(mcpMonitoringInterval);
        mcpMonitoringInterval = null;
    }
}
async function testMCPConnection() {
    let results = [];
    // Test file system access only
    try {
        const fileData = await readMCPSharedData();
        if (fileData !== null) {
            results.push('✅ MCP FileSystem: Working - data found');
            results.push(`• Source: ${fileData.source || 'unknown'}`);
            results.push(`• Tool: ${fileData.tool || 'unknown'}`);
            results.push(`• Environment: ${fileData.environment || 'unknown'}`);
            results.push(`• Type: ${fileData.type || 'unknown'}`);
            results.push(`• Function: ${fileData.function || 'unknown'}`);
        }
        else {
            results.push('⚠️ MCP FileSystem: Ready - no data yet');
        }
    }
    catch (error) {
        results.push('❌ MCP FileSystem: Error - ' + error);
    }
    if (results.filter(r => r.includes('data found')).length === 0) {
        results.push('');
        results.push('💡 To test:');
        results.push('• Run: node ai-to-figma.js "test" "Test"');
        results.push('• Or use browser console with test script');
    }
    const message = results.join('\n');
    figma.ui.postMessage({ type: 'mcp-test-response', message: message });
}
figma.ui.onmessage = async (msg) => {
    var _a;
    debugLog('[MAIN HANDLER] Message received:', msg.type);
    if (msg.type === 'mcp-test') {
        // Test actual MCP server connection
        testMCPConnection();
        return;
    }
    // Handle minimize/expand resize
    if (msg.type === 'resize-plugin') {
        if (msg.minimized) {
            figma.ui.resize(360, 40);
        }
        else {
            figma.ui.resize(360, 380);
        }
        return;
    }
    // NEW: Handle MCP data storage from external sources
    if (msg.type === 'store-mcp-data') {
        debugLog('[MCP] Storing external MCP data in clientStorage');
        try {
            await figma.clientStorage.setAsync('mcp-shared-data', msg.data);
            debugLog('[MCP] Successfully stored MCP data in clientStorage');
            figma.ui.postMessage({
                type: 'mcp-storage-response',
                success: true,
                message: 'MCP data stored successfully'
            });
        }
        catch (error) {
            console.error('[MCP] Error storing MCP data:', error);
            figma.ui.postMessage({
                type: 'mcp-storage-response',
                success: false,
                message: 'Error storing MCP data: ' + error.message
            });
        }
        return;
    }
    // REMOVED: Let UI handle parse-mcp-html directly (it already works correctly)
    if (msg.type === 'mcp-html') {
        debugLog('[MCP] Recibido HTML vía MCP');
        try {
            figma.notify('Procesando HTML recibido vía MCP...');
            figma.ui.postMessage({ type: 'mcp-html-response', message: '✅ HTML recibido y procesado vía MCP.' });
            debugLog('[MCP] HTML procesado correctamente.');
        }
        catch (error) {
            figma.ui.postMessage({ type: 'mcp-html-response', message: '❌ Error procesando HTML vía MCP: ' + error.message });
            console.error('[MCP] Error procesando HTML vía MCP:', error);
        }
        return;
    }
    if (msg.type === 'html-structure') {
        console.log(`[HTML] Processing: ${msg.name || 'Unnamed'}`);
        debugLog('[MAIN HANDLER] Structure length:', ((_a = msg.structure) === null || _a === void 0 ? void 0 : _a.length) || 0);
        debugLog('[MAIN HANDLER] From MCP:', msg.fromMCP);
        // ✅ DEDUPLICATION: Check if RequestID was already processed
        const requestId = msg.requestId || msg.timestamp || `fallback-${Date.now()}`;
        if (isRequestProcessed(requestId)) {
            console.log(`[DEDUP] 🚫 RequestID already processed, skipping: ${requestId}`);
            return;
        }
        // Mark as processed immediately to prevent any race conditions
        markRequestProcessed(requestId);
        console.log(`[HTML] ✅ Passed dedup check, proceeding with requestId: ${requestId}`);
        // Detect full page layout pattern (sidebar + main content, grid layouts, etc.)
        const detectFullPageLayout = (structure) => {
            if (!structure || structure.length === 0)
                return false;
            const checkNode = (node) => {
                var _a, _b, _c, _d, _e, _f, _g;
                // Check for grid with grid-template-areas (complex layout = full page)
                if (((_a = node.styles) === null || _a === void 0 ? void 0 : _a.display) === 'grid' && ((_b = node.styles) === null || _b === void 0 ? void 0 : _b['grid-template-areas'])) {
                    return true;
                }
                // Check for grid with multiple columns
                if (((_c = node.styles) === null || _c === void 0 ? void 0 : _c.display) === 'grid' && ((_d = node.styles) === null || _d === void 0 ? void 0 : _d['grid-template-columns'])) {
                    const cols = parseGridColumns(node.styles['grid-template-columns']);
                    if (cols >= 3)
                        return true; // 3+ column grid = likely full page
                }
                // Check for body/html with padding (indicates designed layout)
                if ((node.tagName === 'body' || node.tagName === 'html') && ((_e = node.styles) === null || _e === void 0 ? void 0 : _e.padding)) {
                    const padding = parseSize(node.styles.padding);
                    if (padding && padding >= 16)
                        return true;
                }
                if (!node.children || node.children.length < 2) {
                    // Still check single children recursively
                    if (node.children) {
                        for (const child of node.children) {
                            if (checkNode(child))
                                return true;
                        }
                    }
                    return false;
                }
                // Look for sidebar pattern: position fixed/absolute with fixed width
                const hasSidebar = node.children.some((child) => {
                    var _a, _b;
                    const pos = (_a = child.styles) === null || _a === void 0 ? void 0 : _a.position;
                    const width = (_b = child.styles) === null || _b === void 0 ? void 0 : _b.width;
                    return (pos === 'fixed' || pos === 'absolute') && width && !width.includes('%');
                });
                // Look for main content with margin-left
                const hasMainContent = node.children.some((child) => {
                    var _a;
                    const ml = (_a = child.styles) === null || _a === void 0 ? void 0 : _a['margin-left'];
                    return ml && parseSize(ml) && parseSize(ml) > 50;
                });
                // Also detect 100vh height (full viewport)
                const hasFullHeight = ((_f = node.styles) === null || _f === void 0 ? void 0 : _f.height) === '100vh' ||
                    ((_g = node.styles) === null || _g === void 0 ? void 0 : _g['min-height']) === '100vh';
                if (hasSidebar && hasMainContent)
                    return true;
                if (hasFullHeight)
                    return true;
                // Recursively check children
                for (const child of node.children) {
                    if (checkNode(child))
                        return true;
                }
                return false;
            };
            for (const node of structure) {
                if (checkNode(node))
                    return true;
            }
            return false;
        };
        const isFullPageLayout = detectFullPageLayout(msg.structure);
        const DEFAULT_PAGE_WIDTH = 1440; // Standard desktop width
        // Helper to calculate dynamic width based on layout structure
        const calculateDynamicWidth = (structure) => {
            if (!structure || structure.length === 0)
                return null;
            let sidebarWidth = 0;
            let mainContentMargin = 0;
            let explicitWidth = null;
            const analyzeNode = (node, depth = 0) => {
                var _a, _b, _c, _d, _e, _f;
                // Check for explicit width on root elements
                if (depth <= 1 && ((_a = node.styles) === null || _a === void 0 ? void 0 : _a.width)) {
                    const width = parseSize(node.styles.width);
                    if (width && width > 0 && !((_c = (_b = node.styles) === null || _b === void 0 ? void 0 : _b.position) === null || _c === void 0 ? void 0 : _c.includes('fixed'))) {
                        console.log('[WIDTH] Found explicit width:', width, 'on', node.tagName);
                        explicitWidth = width;
                    }
                }
                // Detect fixed sidebar with explicit width
                if (((_d = node.styles) === null || _d === void 0 ? void 0 : _d.position) === 'fixed' && ((_e = node.styles) === null || _e === void 0 ? void 0 : _e.width)) {
                    const width = parseSize(node.styles.width);
                    if (width && width > 0) {
                        sidebarWidth = Math.max(sidebarWidth, width);
                        console.log('[WIDTH] Detected fixed sidebar width:', width);
                    }
                }
                // Detect main content with margin-left (sidebar offset)
                if ((_f = node.styles) === null || _f === void 0 ? void 0 : _f['margin-left']) {
                    const margin = parseSize(node.styles['margin-left']);
                    if (margin && margin > 0) {
                        mainContentMargin = Math.max(mainContentMargin, margin);
                        console.log('[WIDTH] Detected main content margin-left:', margin);
                    }
                }
                // Check children
                if (node.children) {
                    for (const child of node.children) {
                        analyzeNode(child, depth + 1);
                    }
                }
            };
            for (const node of structure) {
                analyzeNode(node, 0);
            }
            // If we found explicit width, use it
            if (explicitWidth)
                return explicitWidth;
            // If we detected sidebar + main content pattern, calculate total width
            // Main content should be ~1200px, so total = sidebar + 1200
            if (sidebarWidth > 0 && mainContentMargin > 0) {
                const calculatedWidth = sidebarWidth + 1200; // sidebar + reasonable main content width
                console.log('[WIDTH] Calculated width from sidebar pattern:', calculatedWidth);
                return calculatedWidth;
            }
            return null;
        };
        const explicitWidth = calculateDynamicWidth(msg.structure);
        debugLog('[MAIN HANDLER] Full page layout detected:', isFullPageLayout);
        debugLog('[MAIN HANDLER] Explicit width from CSS:', explicitWidth);
        // Create a main container frame for all HTML content
        const mainContainer = figma.createFrame();
        const containerName = msg.fromMCP ? `${msg.name || 'MCP Import'}` : 'HTML Import Container';
        mainContainer.name = containerName;
        mainContainer.fills = []; // Sin fondo - el body lo controla
        // Enable auto-layout - el body controlará el layout interno
        mainContainer.layoutMode = 'VERTICAL';
        mainContainer.primaryAxisSizingMode = 'AUTO';
        // Determine container width: explicit CSS width > full page default > auto
        const containerWidth = explicitWidth || (isFullPageLayout ? DEFAULT_PAGE_WIDTH : null);
        if (containerWidth) {
            mainContainer.counterAxisSizingMode = 'FIXED';
            mainContainer.resize(containerWidth, mainContainer.height);
            debugLog('[MAIN HANDLER] Set container width to:', containerWidth);
        }
        else {
            mainContainer.counterAxisSizingMode = 'AUTO';
        }
        // Sin padding ni spacing hardcodeado - respetamos el CSS del HTML
        mainContainer.paddingLeft = 0;
        mainContainer.paddingRight = 0;
        mainContainer.paddingTop = 0;
        mainContainer.paddingBottom = 0;
        mainContainer.itemSpacing = 0;
        // Position the container at current viewport center
        const viewport = figma.viewport.center;
        mainContainer.x = viewport.x - (containerWidth ? containerWidth / 2 : 200);
        mainContainer.y = viewport.y - 200;
        // Add to current page
        figma.currentPage.appendChild(mainContainer);
        debugLog('[MAIN HANDLER] Created main container, calling createFigmaNodesFromStructure...');
        // Create all HTML content inside this container
        await createFigmaNodesFromStructure(msg.structure, mainContainer, 0, 0, undefined);
        console.log('[HTML] ✅ Conversion completed');
        // Select the created container for immediate visibility
        figma.currentPage.selection = [mainContainer];
        figma.viewport.scrollAndZoomIntoView([mainContainer]);
        figma.notify('✅ HTML converted successfully!');
    }
    // MCP MONITORING HANDLERS
    if (msg.type === 'start-mcp-monitoring') {
        console.log('[MCP] Starting MCP monitoring...');
        startMCPMonitoring();
        figma.notify('🔄 MCP Monitoring iniciado');
    }
    if (msg.type === 'stop-mcp-monitoring') {
        console.log('[MCP] Stopping MCP monitoring...');
        stopMCPMonitoring();
        figma.notify('⏹️ MCP Monitoring detenido');
    }
    // NEW: SSE Status Updates from UI
    if (msg.type === 'sse-connected') {
        sseConnected = true;
        sseLastSuccessTimestamp = Date.now();
        console.log('[SSE] 🟢 Connected');
    }
    if (msg.type === 'sse-disconnected') {
        sseConnected = false;
        console.log('[SSE] 🔴 Disconnected');
    }
    if (msg.type === 'sse-message-processed') {
        sseLastSuccessTimestamp = msg.timestamp || Date.now();
        debugLog('[MCP] 📡 SSE message processed, timestamp updated');
    }
    if (msg.type === 'sse-processing-timestamp') {
        // SSE is actively processing this timestamp - mark it to prevent fallback
        sseLastSuccessTimestamp = msg.timestamp;
        debugLog('[MCP] 🎯 SSE processing timestamp - fallback blocked');
    }
    // NEW UI ELEMENT HANDLERS
    // SSE HANDLERS - Properly integrated
    if (msg.type === 'start-sse') {
        debugLog('[SSE] Starting SSE connection from UI...');
        // Start actual SSE connection
        figma.ui.postMessage({
            type: 'start-sse-connection'
        });
    }
    if (msg.type === 'stop-sse') {
        debugLog('[SSE] Stopping SSE connection from UI...');
        // Stop actual SSE connection
        figma.ui.postMessage({
            type: 'stop-sse-connection'
        });
    }
    if (msg.type === 'test-broadcast') {
        debugLog('[SSE] Connection test requested from UI...');
        // This could trigger a test request to the bridge server
        figma.notify('🔗 Connection test sent');
        // Send confirmation back to UI
        setTimeout(() => {
            figma.ui.postMessage({ type: 'test-broadcast-complete' });
        }, 1000);
    }
};
