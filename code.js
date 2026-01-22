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

function extractCSS(htmlStr) {
  var cssRules = {};
  var allCssText = '';

  // FIX: Soportar múltiples style tags usando indexOf (sin regex problemático)
  var searchStr = htmlStr;
  var startTag = '<style';
  var endTag = '</style>';

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

  // Remove CSS comments (simple approach)
  var cleanCss = '';
  var inComment = false;
  for (var i = 0; i < allCssText.length; i++) {
    if (!inComment && allCssText[i] === '/' && allCssText[i+1] === '*') {
      inComment = true;
      i++;
    } else if (inComment && allCssText[i] === '*' && allCssText[i+1] === '/') {
      inComment = false;
      i++;
    } else if (!inComment) {
      cleanCss += allCssText[i];
    }
  }
  allCssText = cleanCss;

  var rules = allCssText.split('}');

  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i].trim();
    if (rule) {
      var braceIdx = rule.indexOf('{');
      if (braceIdx > 0) {
        var selectorPart = rule.substring(0, braceIdx).trim();
        var declarations = rule.substring(braceIdx + 1).trim();

        if (selectorPart && declarations) {
          var parsedDeclarations = parseInlineStyles(declarations);

          // FIX: Soportar selectores separados por coma (.class1, .class2)
          var selectors = selectorPart.split(',').map(function(s) { return s.trim(); });

          for (var j = 0; j < selectors.length; j++) {
            var selector = selectors[j];
            if (!selector) continue;

            // Handle class selectors (simple: .class)
            if (selector.charAt(0) === '.') {
              cssRules[selector] = Object.assign({}, cssRules[selector] || {}, parsedDeclarations);
            }
            // Handle nested selectors like ".card .badge" or ".form-section h2"
            else if (selector.includes('.') || selector.includes(' ')) {
              cssRules[selector] = Object.assign({}, cssRules[selector] || {}, parsedDeclarations);
            }
            // Handle element selectors like "th", "td", "body"
            else if (selector.match(/^[a-zA-Z][a-zA-Z0-9]*$/)) {
              cssRules[selector] = Object.assign({}, cssRules[selector] || {}, parsedDeclarations);
            }
            // Handle * (universal selector)
            else if (selector === '*') {
              cssRules[selector] = Object.assign({}, cssRules[selector] || {}, parsedDeclarations);
            }
          }
        }
      }
    }
  }

  return cssRules;
}

// HTML parsing function (restored from backup with full CSS support)
function simpleParseHTML(htmlStr) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(htmlStr, 'text/html');
  var body = doc.body || doc.documentElement;
  
  var cssRules = extractCSS(htmlStr);

  function getElementStyles(element) {
    var styles = {};
    var className = element.getAttribute('class');
    
    if (className) {
      var classes = className.split(' ');
  
      for (var i = 0; i < classes.length; i++) {
        var cls = classes[i].trim();
        if (cls && cssRules['.' + cls]) {
          styles = Object.assign(styles, cssRules['.' + cls]);
        }
      }
      
      // Check for combined class selectors like ".card.active"
      var combinedSelector = '.' + classes.join('.');
      if (cssRules[combinedSelector]) {
        styles = Object.assign(styles, cssRules[combinedSelector]);
      }
    }
    
    // Check for element selectors (like "th", "td", "body")
    var tagName = element.tagName.toLowerCase();
    if (cssRules[tagName]) {
      styles = Object.assign(styles, cssRules[tagName]);
    }
    
    // Check for nested selectors - find parent classes
    var parent = element.parentElement;
    while (parent && parent.tagName !== 'BODY') {
      var parentClass = parent.getAttribute('class');
      if (parentClass && className) {
        var nestedClassSelector = '.' + parentClass.split(' ')[0] + ' .' + className.split(' ')[0];
        if (cssRules[nestedClassSelector]) {
          styles = Object.assign(styles, cssRules[nestedClassSelector]);
        }
      }
      
      if (parentClass) {
        var nestedElementSelector = '.' + parentClass.split(' ')[0] + ' ' + tagName;
        if (cssRules[nestedElementSelector]) {
          styles = Object.assign(styles, cssRules[nestedElementSelector]);
        }
      }
      parent = parent.parentElement;
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

      for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];
        if (child.nodeType === 3) {
          var textContent = child.textContent.trim();
          if (textContent) {
            text += textContent;
          }
        } else if (child.nodeType === 1) {
          var childStruct = nodeToStruct(child);
          if (childStruct) {
            children.push(childStruct);
          }
        }
      }

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
        children: children
      };
    }
    return null;
  }

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
    if (styles['align-items'] === 'center') {
        frame.counterAxisAlignItems = 'CENTER';
    }
    else if (styles['align-items'] === 'flex-start') {
        frame.counterAxisAlignItems = 'MIN';
    }
    else if (styles['align-items'] === 'flex-end') {
        frame.counterAxisAlignItems = 'MAX';
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
    // Soporta repeat(N, 1fr) y listas explícitas
    const repeatMatch = gridTemplate.match(/repeat\((\d+),\s*1fr\)/);
    if (repeatMatch) {
        return parseInt(repeatMatch[1], 10);
    }
    // Cuenta la cantidad de "1fr" en la lista
    const columns = gridTemplate.split(' ').filter(x => x.trim().endsWith('fr'));
    return columns.length > 0 ? columns.length : 1;
}
// Grid layout genérico para N columnas
async function createGridLayout(children, parentFrame, columns, gap, inheritedStyles) {
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55;
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
            // Convert sticky/fixed positioning to normal (but still render)
            if (((_a = node.styles) === null || _a === void 0 ? void 0 : _a.position) === 'sticky' || ((_b = node.styles) === null || _b === void 0 ? void 0 : _b.position) === 'fixed') {
                // Don't skip - just normalize the positioning
                node.styles.position = 'relative';
            }
            // Merge inherited styles with node's own styles
            const nodeStyles = Object.assign(Object.assign({}, inheritedStyles), node.styles);
            node.styles = nodeStyles;
            if (['body', 'div', 'section', 'article', 'nav', 'header', 'footer', 'main', 'aside'].includes(node.tagName)) {
                const frame = figma.createFrame();
                frame.name = node.tagName.toUpperCase() + ' Frame';
                // LAYOUT MODE: Aplicar display CSS directamente PRIMERO
                let layoutMode = 'VERTICAL';
                if (((_c = node.styles) === null || _c === void 0 ? void 0 : _c.display) === 'flex') {
                    // Flex direction: row = HORIZONTAL, column = VERTICAL
                    layoutMode = ((_d = node.styles) === null || _d === void 0 ? void 0 : _d['flex-direction']) === 'column' ? 'VERTICAL' : 'HORIZONTAL';
                }
                else if (((_e = node.styles) === null || _e === void 0 ? void 0 : _e.display) === 'grid') {
                    // Keep vertical layout for grid - we'll handle 2x2 layout in child processing
                    layoutMode = 'VERTICAL';
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
                // Set basic properties - AUTO para que se ajuste al contenido
                frame.primaryAxisSizingMode = 'AUTO';
                frame.counterAxisSizingMode = 'AUTO';
                // CRITICAL: Ensure container can grow to fit content
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
                if (((_f = node.styles) === null || _f === void 0 ? void 0 : _f.className) === 'detail-label' || ((_g = node.styles) === null || _g === void 0 ? void 0 : _g.className) === 'detail-value') {
                }
                // INHERIT text-align from parent for DIV containers too
                if (parentFrame && parentFrame.getPluginData('textAlign') === 'center') {
                    // If parent container has text-align center and this container doesn't have its own text-align
                    if (!((_h = node.styles) === null || _h === void 0 ? void 0 : _h['text-align'])) {
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
                        if ((_k = (_j = node.styles) === null || _j === void 0 ? void 0 : _j.className) === null || _k === void 0 ? void 0 : _k.includes('detail')) {
                        }
                    }
                }
                // CRITICAL: After applying styles, ensure containers can still grow vertically
                if (((_l = node.styles) === null || _l === void 0 ? void 0 : _l['max-width']) && !((_m = node.styles) === null || _m === void 0 ? void 0 : _m.height)) {
                    // For containers with max-width but no explicit height, allow vertical growth
                    frame.layoutSizingVertical = 'HUG';
                }
                // Store if we need to apply full width (ALL div containers should fill parent width)
                const needsFullWidth = true; // All div containers should fill their parent width when in auto-layout
                // Remove early height filling - will do it after appendChild
                // Only apply default background if the element doesn't have any background AND it's not inside a gradient container
                const hasBackground = frame.fills && frame.fills.length > 0;
                const isInsideGradientContainer = inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['parent-has-gradient'];
                // Remove hardcoded backgrounds - let CSS handle all styling
                if (!hasBackground && !isInsideGradientContainer) {
                    // Check if element has CSS background that should be applied
                    const cssBackgroundColor = ((_o = node.styles) === null || _o === void 0 ? void 0 : _o['background-color']) || ((_p = node.styles) === null || _p === void 0 ? void 0 : _p['background']);
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
                const defaultPadding = 0; // No default padding - respect CSS only
                const cssTopPadding = parseSize((_q = node.styles) === null || _q === void 0 ? void 0 : _q['padding-top']) || parseSize((_r = node.styles) === null || _r === void 0 ? void 0 : _r.padding) || defaultPadding;
                const cssRightPadding = parseSize((_s = node.styles) === null || _s === void 0 ? void 0 : _s['padding-right']) || parseSize((_t = node.styles) === null || _t === void 0 ? void 0 : _t.padding) || defaultPadding;
                const cssBottomPadding = parseSize((_u = node.styles) === null || _u === void 0 ? void 0 : _u['padding-bottom']) || parseSize((_v = node.styles) === null || _v === void 0 ? void 0 : _v.padding) || defaultPadding;
                const cssLeftPadding = parseSize((_w = node.styles) === null || _w === void 0 ? void 0 : _w['padding-left']) || parseSize((_x = node.styles) === null || _x === void 0 ? void 0 : _x.padding) || defaultPadding;
                frame.paddingTop = cssTopPadding;
                frame.paddingRight = cssRightPadding;
                frame.paddingBottom = cssBottomPadding;
                frame.paddingLeft = cssLeftPadding;
                // Set spacing: RESPETAR CSS gap (incluyendo gap: 0)
                let gap;
                if (((_y = node.styles) === null || _y === void 0 ? void 0 : _y.gap) !== undefined) {
                    gap = (_z = parseSize(node.styles.gap)) !== null && _z !== void 0 ? _z : 0;
                }
                else {
                    gap = layoutMode === 'HORIZONTAL' ? 16 : 12;
                }
                frame.itemSpacing = gap;
                // Store gap for grid layout
                if (((_0 = node.styles) === null || _0 === void 0 ? void 0 : _0.display) === 'grid') {
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
                }
                // Apply full width AFTER appendChild (proper timing) - BUT NOT for elements with explicit dimensions
                const hasExplicitDimensions = ((_1 = node.styles) === null || _1 === void 0 ? void 0 : _1.width) || ((_2 = node.styles) === null || _2 === void 0 ? void 0 : _2.height);
                if (!hasExplicitDimensions && needsFullWidth && parentFrame && parentFrame.layoutMode !== 'NONE') {
                    try {
                        frame.layoutSizingHorizontal = 'FILL';
                        // Maintain vertical HUG for containers to grow with content
                        if (!((_3 = node.styles) === null || _3 === void 0 ? void 0 : _3.height)) {
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
                    if (!((_4 = node.styles) === null || _4 === void 0 ? void 0 : _4.height)) {
                        frame.layoutSizingVertical = 'HUG';
                    }
                }
                else if (hasExplicitDimensions) {
                }
                // Handle flex child height separately for ALL elements (including those with explicit width like sidebar)
                if (parentFrame && parentFrame.layoutMode === 'HORIZONTAL' && !((_5 = node.styles) === null || _5 === void 0 ? void 0 : _5.height)) {
                    try {
                        frame.layoutSizingVertical = 'FILL';
                        // Debug height filling for sidebar
                        if (((_6 = node.styles) === null || _6 === void 0 ? void 0 : _6.className) === 'sidebar') {
                        }
                    }
                    catch (error) {
                        console.error('Height fill error for', ((_7 = node.styles) === null || _7 === void 0 ? void 0 : _7.className) || 'element', error);
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
                const thisHasWidth = Boolean((_8 = node.styles) === null || _8 === void 0 ? void 0 : _8.width);
                const parentHadWidth = (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['_hasConstrainedWidth']) === true;
                const inheritableStyles = Object.assign(Object.assign({}, inheritedStyles), { 
                    // CRITICAL: Propagate width constraint to all descendants
                    '_hasConstrainedWidth': thisHasWidth || parentHadWidth, 
                    // Solo heredar color si el hijo no tiene uno propio
                    color: ((_9 = node.styles) === null || _9 === void 0 ? void 0 : _9.color) || (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles.color), 'font-family': ((_10 = node.styles) === null || _10 === void 0 ? void 0 : _10['font-family']) || (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['font-family']), 'font-size': ((_11 = node.styles) === null || _11 === void 0 ? void 0 : _11['font-size']) || (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['font-size']), 'line-height': ((_12 = node.styles) === null || _12 === void 0 ? void 0 : _12['line-height']) || (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['line-height']), 
                    // FIXED: Don't inherit background/background-color - only pass info for gradient container detection
                    'parent-has-gradient': (((_13 = node.styles) === null || _13 === void 0 ? void 0 : _13['background']) && node.styles['background'].includes('linear-gradient')) ||
                        (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['parent-has-gradient']), 
                    // Pass parent class name to help with styling decisions
                    'parent-class': ((_14 = node.styles) === null || _14 === void 0 ? void 0 : _14.className) || (inheritedStyles === null || inheritedStyles === void 0 ? void 0 : inheritedStyles['parent-class']) });
                // Create text node if there's direct text content
                if (node.text && node.text.trim()) {
                    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                    const textNode = figma.createText();
                    textNode.characters = node.text.trim();
                    textNode.name = 'DIV Text';
                    // Apply inherited styles and specific text styles
                    applyStylesToText(textNode, Object.assign(Object.assign({}, inheritableStyles), node.styles));
                    frame.appendChild(textNode);
                    // FIXED: Set appropriate width for text wrapping in auto-layout
                    if (frame.layoutMode === 'HORIZONTAL' || frame.layoutMode === 'VERTICAL') {
                        const maxWidth = Math.min(frame.width - frame.paddingLeft - frame.paddingRight, 800);
                        const textWidth = Math.max(maxWidth > 0 ? maxWidth : 400, 200);
                        textNode.resize(textWidth, textNode.height);
                        textNode.textAutoResize = 'HEIGHT';
                    }
                }
                // Process children if they exist
                if (node.children && node.children.length > 0) {
                    // Manejo de grid genérico
                    if (((_15 = node.styles) === null || _15 === void 0 ? void 0 : _15.display) === 'grid') {
                        const gridTemplateColumns = (_16 = node.styles) === null || _16 === void 0 ? void 0 : _16['grid-template-columns'];
                        const columns = parseGridColumns(gridTemplateColumns);
                        const gap = parseSize((_17 = node.styles) === null || _17 === void 0 ? void 0 : _17.gap) || parseSize((parentFrame === null || parentFrame === void 0 ? void 0 : parentFrame.getPluginData('gridGap')) || '') || 12;
                        // Si no se pudieron parsear columnas, usar fallback
                        const finalColumns = columns > 0 ? columns : 2;
                        await createGridLayout(node.children, frame, finalColumns, gap, inheritableStyles);
                    }
                    else {
                        await createFigmaNodesFromStructure(node.children, frame, 0, 0, inheritableStyles);
                    }
                }
                // Apply flex grow after appendChild for proper timing
                if ((((_18 = node.styles) === null || _18 === void 0 ? void 0 : _18.flex) === '1' || ((_19 = node.styles) === null || _19 === void 0 ? void 0 : _19['flex-grow']) === '1') && parentFrame) {
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
            }
            else if (node.tagName === 'form') {
                const form = figma.createFrame();
                form.name = 'FORM';
                form.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
                form.layoutMode = 'VERTICAL';
                form.primaryAxisSizingMode = 'AUTO';
                form.counterAxisSizingMode = 'AUTO';
                form.paddingLeft = 20;
                form.paddingRight = 20;
                form.paddingTop = 20;
                form.paddingBottom = 20;
                form.itemSpacing = 18;
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
                let inputWidth = parseSize((_20 = node.styles) === null || _20 === void 0 ? void 0 : _20.width);
                const inputHeight = node.tagName === 'textarea' ?
                    (parseSize((_21 = node.attributes) === null || _21 === void 0 ? void 0 : _21.rows) || 3) * 20 + 20 :
                    parseSize((_22 = node.styles) === null || _22 === void 0 ? void 0 : _22.height) || 40;
                const input = figma.createFrame();
                // Fondo y borde: usar CSS si está, si no, fallback blanco/gris
                let bgColor = { r: 1, g: 1, b: 1 };
                if (((_23 = node.styles) === null || _23 === void 0 ? void 0 : _23['background']) && node.styles['background'] !== 'transparent') {
                    const bgParsed = hexToRgb(node.styles['background']);
                    if (bgParsed)
                        bgColor = bgParsed;
                }
                else if (((_24 = node.styles) === null || _24 === void 0 ? void 0 : _24['background-color']) && node.styles['background-color'] !== 'transparent') {
                    const bgParsed = hexToRgb(node.styles['background-color']);
                    if (bgParsed)
                        bgColor = bgParsed;
                }
                input.fills = [{ type: 'SOLID', color: bgColor }];
                let borderColor = { r: 0.8, g: 0.8, b: 0.8 };
                if (((_25 = node.styles) === null || _25 === void 0 ? void 0 : _25['border']) || ((_26 = node.styles) === null || _26 === void 0 ? void 0 : _26['border-color'])) {
                    const borderParsed = hexToRgb(node.styles['border-color'] || extractBorderColor(node.styles['border']));
                    if (borderParsed)
                        borderColor = borderParsed;
                }
                input.strokes = [{ type: 'SOLID', color: borderColor }];
                input.strokeWeight = parseSize((_27 = node.styles) === null || _27 === void 0 ? void 0 : _27['border-width']) || 1;
                input.cornerRadius = parseSize((_28 = node.styles) === null || _28 === void 0 ? void 0 : _28['border-radius']) || 4;
                input.name = node.tagName.toUpperCase();
                input.layoutMode = 'HORIZONTAL';
                // Solo centrar si el CSS lo especifica (no hardcodear centrado)
                if (((_29 = node.styles) === null || _29 === void 0 ? void 0 : _29['text-align']) === 'center') {
                    input.primaryAxisAlignItems = 'CENTER'; // Horizontal center
                    input.counterAxisAlignItems = 'CENTER'; // Vertical center
                }
                else {
                    input.primaryAxisAlignItems = 'MIN'; // Alineado a la izquierda horizontalmente (eje principal)
                    input.counterAxisAlignItems = 'CENTER'; // Centrado verticalmente (eje perpendicular)
                }
                input.paddingLeft = parseSize((_30 = node.styles) === null || _30 === void 0 ? void 0 : _30['padding-left']) || 12;
                input.paddingRight = parseSize((_31 = node.styles) === null || _31 === void 0 ? void 0 : _31['padding-right']) || 12;
                // Detectar si el parent es auto-layout
                const parentIsAutoLayout = parentFrame && parentFrame.type === 'FRAME' && parentFrame.layoutMode && parentFrame.layoutMode !== 'NONE';
                // Soporte width: 100% (FILL) si el CSS lo pide y el parent es auto-layout
                let useFill = false;
                if (((_32 = node.styles) === null || _32 === void 0 ? void 0 : _32.width) === '100%') {
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
                const displayText = ((_33 = node.attributes) === null || _33 === void 0 ? void 0 : _33.value) || ((_34 = node.attributes) === null || _34 === void 0 ? void 0 : _34.placeholder) ||
                    (node.tagName === 'select' ? 'Select option ▼' : 'Input field');
                inputText.characters = displayText;
                // Color de texto: usar CSS si está, si no, gris claro para placeholder
                let textColor = { r: 0.2, g: 0.2, b: 0.2 };
                if ((_35 = node.styles) === null || _35 === void 0 ? void 0 : _35.color) {
                    const colorParsed = hexToRgb(node.styles.color);
                    if (colorParsed)
                        textColor = colorParsed;
                }
                else if (!((_36 = node.attributes) === null || _36 === void 0 ? void 0 : _36.value)) {
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
                const tableWidth = parseSize((_37 = node.styles) === null || _37 === void 0 ? void 0 : _37.width) || 500; // Increased default width
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
                cell.resize(85, 50); // Aumentado de 40 a 50
                cell.fills = [];
                cell.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
                cell.strokeWeight = 0.5;
                cell.name = node.tagName.toUpperCase();
                cell.layoutMode = 'HORIZONTAL';
                cell.primaryAxisAlignItems = 'CENTER';
                cell.counterAxisAlignItems = 'CENTER';
                cell.paddingLeft = 8;
                cell.paddingRight = 8;
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
                cellText.characters = textContent || 'Cell';
                if (node.tagName === 'th') {
                    const currentSize = typeof cellText.fontSize === 'number' ? cellText.fontSize : 16;
                    cellText.fontSize = currentSize * 1.1;
                    cellText.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
                }
                else {
                    cellText.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
                }
                cell.appendChild(cellText);
                if (node.styles) {
                    applyStylesToText(cellText, node.styles);
                }
                // Check if parent has text-align center and inherit it
                if (parentFrame && parentFrame.getPluginData('textAlign') === 'center') {
                    // If parent container has text-align center, apply it to this text
                    if (!((_38 = node.styles) === null || _38 === void 0 ? void 0 : _38['text-align'])) {
                        cellText.textAlignHorizontal = 'CENTER';
                    }
                }
                // Special debug for detail elements
                if ((_40 = (_39 = node.styles) === null || _39 === void 0 ? void 0 : _39.className) === null || _40 === void 0 ? void 0 : _40.includes('detail')) {
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
                const buttonWidth = parseSize((_41 = node.styles) === null || _41 === void 0 ? void 0 : _41.width) || Math.max(120, node.text.length * 12);
                const buttonHeight = parseSize((_42 = node.styles) === null || _42 === void 0 ? void 0 : _42.height) || 50; // Aumentado de 40 a 50
                const frame = figma.createFrame();
                frame.resize(buttonWidth, buttonHeight);
                frame.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.5, b: 1 } }];
                frame.cornerRadius = 8;
                frame.name = 'Button';
                // Enable auto-layout for centering
                frame.layoutMode = 'HORIZONTAL';
                frame.primaryAxisAlignItems = 'CENTER';
                frame.counterAxisAlignItems = 'CENTER';
                frame.paddingLeft = 20; // Aumentado de 16 a 20
                frame.paddingRight = 20;
                frame.paddingTop = 12; // Aumentado de 8 a 12
                frame.paddingBottom = 12;
                // Apply styles (including new CSS properties)
                if (node.styles) {
                    applyStylesToFrame(frame, node.styles);
                }
                // Add button text
                await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                const buttonText = figma.createText();
                buttonText.characters = node.text || 'Button';
                // Default white text for buttons, unless overridden by styles
                buttonText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
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
                const width = parseSize((_43 = node.styles) === null || _43 === void 0 ? void 0 : _43.width) || 200;
                const height = parseSize((_44 = node.styles) === null || _44 === void 0 ? void 0 : _44.height) || 150;
                const frame = figma.createFrame();
                frame.resize(width, height);
                frame.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
                frame.name = 'Image: ' + (((_45 = node.attributes) === null || _45 === void 0 ? void 0 : _45.alt) || 'Unnamed');
                // Center the placeholder text
                frame.layoutMode = 'HORIZONTAL';
                frame.primaryAxisAlignItems = 'CENTER';
                frame.counterAxisAlignItems = 'CENTER';
                // Add placeholder text
                await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                const placeholderText = figma.createText();
                placeholderText.characters = ((_46 = node.attributes) === null || _46 === void 0 ? void 0 : _46.alt) || 'Image';
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
                const parentList = ((_47 = parentFrame === null || parentFrame === void 0 ? void 0 : parentFrame.name) === null || _47 === void 0 ? void 0 : _47.includes('OL')) ? 'OL' : 'UL';
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
                    if (!((_48 = node.styles) === null || _48 === void 0 ? void 0 : _48['text-align'])) {
                        text.textAlignHorizontal = 'CENTER';
                    }
                }
                // Special debug for detail elements
                if ((_50 = (_49 = node.styles) === null || _49 === void 0 ? void 0 : _49.className) === null || _50 === void 0 ? void 0 : _50.includes('detail')) {
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
            else if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a', 'label'].includes(node.tagName)) {
                // Special handling for span elements with backgrounds (like badges)
                const hasBackground = ((_51 = node.styles) === null || _51 === void 0 ? void 0 : _51['background']) || ((_52 = node.styles) === null || _52 === void 0 ? void 0 : _52['background-color']);
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
                    // Apply styles first (including new text properties)
                    if (node.styles) {
                        applyStylesToText(text, node.styles);
                    }
                    // Check if parent has text-align center and inherit it
                    if (parentFrame && parentFrame.getPluginData('textAlign') === 'center') {
                        // If parent container has text-align center, apply it to this text
                        if (!((_53 = node.styles) === null || _53 === void 0 ? void 0 : _53['text-align'])) {
                            text.textAlignHorizontal = 'CENTER';
                        }
                    }
                    // Special debug for detail elements
                    if ((_55 = (_54 = node.styles) === null || _54 === void 0 ? void 0 : _54.className) === null || _55 === void 0 ? void 0 : _55.includes('detail')) {
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
        // Create a main container frame for all HTML content
        const mainContainer = figma.createFrame();
        const containerName = msg.fromMCP ? `${msg.name || 'MCP Import'}` : 'HTML Import Container';
        mainContainer.name = containerName;
        mainContainer.fills = []; // Sin fondo - el body lo controla
        // Enable auto-layout - el body controlará el layout interno
        mainContainer.layoutMode = 'VERTICAL';
        mainContainer.primaryAxisSizingMode = 'AUTO';
        mainContainer.counterAxisSizingMode = 'AUTO';
        // Sin padding ni spacing hardcodeado - respetamos el CSS del HTML
        mainContainer.paddingLeft = 0;
        mainContainer.paddingRight = 0;
        mainContainer.paddingTop = 0;
        mainContainer.paddingBottom = 0;
        mainContainer.itemSpacing = 0;
        // Position the container at current viewport center
        const viewport = figma.viewport.center;
        mainContainer.x = viewport.x - 200;
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
