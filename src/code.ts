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
      padding: 20px;
      line-height: 1.4;
      height: 360px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .header {
      text-align: left;
      margin-bottom: 16px;
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
      margin-bottom: 20px;
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
      flex: 1;
      display: none;
      min-height: 0;
      overflow: hidden;
    }
    
    .tab-content.active {
      display: flex;
      flex-direction: column;
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
      margin-bottom: 16px;
      padding: 14px;
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
    
    /* Status Messages */
    .status-messages {
      padding: 12px;
      background: #FFFFFF;
      border: 2px solid #E6E6E6;
      border-radius: 6px;
      font-size: 12px;
      color: #333;
      min-height: 40px;
      margin-bottom: 12px;
      display: none;
      overflow-y: auto;
    }
    
    .status-messages.visible {
      display: block;
    }
    
    .status-messages.success {
      border-color: #28a745;
      color: #155724;
    }
    
    .status-messages.error {
      border-color: #dc3545;
      color: #721c24;
    }
    
    .status-messages.info {
      border-color: #9747FF;
      color: #5a2d91;
    }
    
    .status-messages.test {
      border-color: #CCCCCC;
      color: #666666;
    }
    
    /* Paste HTML Tab Styles */
    .input-container {
      margin-bottom: 20px;
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
      background: #353030;
      margin-bottom: 16px;
      height: 32px;
      font-size: 13px;
    }

    .test-button:hover {
      background: #2a2626;
    }

    .description-text {
      font-size: 14px;
      color: #1A1A1A;
      opacity: 0.7;
      margin-bottom: 16px;
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="subtitle">Select an option to convert to Figma.</div>
  </div>
  
  <!-- Tabs -->
  <div class="tab-container">
    <button class="tab active" data-tab="mcp">MCP Cursor</button>
    <button class="tab" data-tab="paste">Paste HTML to Figma</button>
  </div>
  
  <!-- MCP Cursor Tab Content -->
  <div class="tab-content active" id="mcp-tab">
    <div class="description-text">Connect with Cursor and send HTML to Figma</div>
    
    <div class="switch-container">
      <span class="switch-label">Start MCP Monitoring</span>
      <label class="switch">
        <input type="checkbox" id="mcp-switch">
        <span class="slider"></span>
      </label>
    </div>
    
    <div class="status-messages" id="status-messages"></div>
    
    <button id="mcp-test-btn" class="button test-button">Test MCP Connection</button>
    
    <button id="direct-test-btn" class="button test-button" style="background:#28a745;margin-top:8px;">Direct MCP Test</button>
    
    <div style="
      margin-top: 10px;
      padding: 8px;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      font-size: 11px;
      color: #6c757d;
      max-height: 60px;
      overflow-y: auto;
    ">
      <strong>Test Instructions:</strong><br>
      1. Open console (F12) → Copy simple-test.js<br>
      2. Enable monitoring → Watch it work!
    </div>
  </div>
  
  <!-- Paste HTML Tab Content -->
  <div class="tab-content" id="paste-tab">
    <div class="description-text">Copy your HTML code, paste it here, and click 'Convert to Figma'</div>
    
    <div class="input-container">
      <textarea 
        id="html-input" 
        class="textarea" 
        placeholder="Paste your HTML here..."
      ></textarea>
    </div>
    
    <button id="send-btn" class="button">Convert to Figma</button>
  </div>

<script>
// Lista de propiedades CSS problemáticas que Figma no soporta
var UNSUPPORTED_CSS_PROPERTIES = [
  'animation',
  'animation-name',
  'animation-duration', 
  'animation-timing-function',
  'animation-delay',
  'animation-iteration-count',
  'animation-direction',
  'animation-fill-mode',
  'animation-play-state',
  'transition',
  'transition-property',
  'transition-duration',
  'transition-timing-function', 
  'transition-delay',
  'transform'
  // Nota: 'content' ya no está aquí - ahora lo soportamos parcialmente
];

// Content soportado para pseudoelementos ::before/::after
var SUPPORTED_CONTENT = {
  '"📚"': '📚',
  '"💬"': '💬', 
  '"🏛️"': '🏛️',
  '"⚽"': '⚽',
  '"🏠"': '🏠',
  '"👥"': '👥',
  '"📈"': '📈',
  '"📖"': '📖',
  '"★"': '★',
  '"•"': '•',
  '"→"': '→',
  '"←"': '←',
  '"▼"': '▼',
  '"▲"': '▲',
  '"✓"': '✓',
  '"✗"': '✗',
  '"💡"': '💡',
  '"🎯"': '🎯',
  '"📅"': '📅',
  '"🕐"': '🕐',
  '"⏱️"': '⏱️',
  '"📊"': '📊',
  '"📝"': '📝',
  '"🏟️"': '🏟️',
  '"📍"': '📍',
  '"🏢"': '🏢',
  '""': '' // Content vacío
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
  var statusMessages = document.getElementById('status-messages');
  var testBtn = document.getElementById('mcp-test-btn');
  
  if (mcpMonitoring) {
    updateStatusMessage('MCP Monitoring started. Waiting for connections...', 'test');
    // Hide test button when monitoring is active
    if (testBtn) {
      testBtn.style.display = 'none';
    }
    parent.postMessage({
      pluginMessage: {
        type: 'start-mcp-monitoring'
      }
    }, '*');
  } else {
    statusMessages.classList.remove('visible', 'success', 'error', 'info', 'test');
    // Show test button when monitoring is stopped
    if (testBtn) {
      testBtn.style.display = 'block';
    }
    parent.postMessage({
      pluginMessage: {
        type: 'stop-mcp-monitoring'
      }
    }, '*');
  }
});

// Función para filtrar propiedades CSS no soportadas
function filterUnsupportedCSS(styles) {
  var filteredStyles = {};
  for (var prop in styles) {
    if (styles.hasOwnProperty(prop)) {
      // Manejar 'content' de manera especial
      if (prop === 'content') {
        var contentValue = styles[prop];
        if (SUPPORTED_CONTENT.hasOwnProperty(contentValue)) {
          // Solo incluir content si está en nuestra lista soportada
          filteredStyles[prop] = styles[prop];
        }
        // Si no está soportado, se omite automáticamente
      }
      // Omitir otras propiedades problemáticas
      else if (UNSUPPORTED_CSS_PROPERTIES.indexOf(prop) === -1) {
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
  // Filtrar propiedades no soportadas antes de retornar
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
  // Limpiar espacios extra
  selector = selector.replace(/\\s+/g, ' ').trim();
  
  // Manejar múltiples selectores separados por coma
  if (selector.includes(',')) {
    return selector.split(',').map(s => s.trim());
  }
  
  return [selector];
}

// Función mejorada para validar selectores CSS
function isValidCSSSelector(selector) {
  // Selectores básicos válidos
  var validPatterns = [
    /^[a-zA-Z][a-zA-Z0-9-]*$/,           // elementos: h1, div, span
    /^\\.[a-zA-Z][a-zA-Z0-9-_]*$/,        // clases: .class
    /^#[a-zA-Z][a-zA-Z0-9-_]*$/,         // IDs: #id
    /^\\.[\\w-]+(\\s+\\.[\\w-]+)*$/,       // clases anidadas: .parent .child
    /^\\.[\\w-]+(\\s+[a-zA-Z][\\w-]*)*$/, // clase + elemento: .parent h2
    /^[a-zA-Z][\\w-]*(\\s+\\.[\\w-]+)*$/, // elemento + clase: div .child
    /^\\.[a-zA-Z][a-zA-Z0-9-_]*::(before|after)$/, // pseudoelementos de clase: .class::before
    /^[a-zA-Z][a-zA-Z0-9-]*::(before|after)$/,     // pseudoelementos de elemento: div::before
  ];
  
  return validPatterns.some(pattern => pattern.test(selector));
}

function extractCSS(htmlStr) {
  var cssRules = {};
  var styleStart = htmlStr.indexOf('<style>');
  var styleEnd = htmlStr.indexOf('</style>');
  
  if (styleStart !== -1 && styleEnd !== -1) {
    var cssText = htmlStr.substring(styleStart + 7, styleEnd);
    
    // Remove CSS comments to prevent parsing corruption
    cssText = cssText.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '');
    
    // Remover @keyframes completos (incluyendo contenido anidado)
    cssText = cssText.replace(/@keyframes[^{]*{[^{}]*({[^}]*})*[^}]*}/g, '');
    
    // Remover @media queries completas
    cssText = cssText.replace(/@media[^{]*{[\\s\\S]*?}\\s*}/g, '');
    
    var rules = cssText.split('}');
    
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
                // Almacenar la regla CSS procesada
                cssRules[singleSelector] = parseInlineStyles(declarations);
                
                // También manejar variaciones del selector
                if (singleSelector.includes(' ')) {
                  // Para selectores anidados, también guardar versión normalizada
                  var normalizedSelector = singleSelector.replace(/\\s+/g, ' ');
                  if (normalizedSelector !== singleSelector) {
                    cssRules[normalizedSelector] = parseInlineStyles(declarations);
                  }
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
      var classes = className.split(' ').filter(c => c.trim());
      
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
    while (currentElement && currentElement.tagName !== 'BODY') {
      var ancestorClasses = currentElement.getAttribute('class');
      var ancestorTag = currentElement.tagName.toLowerCase();
      var ancestorId = currentElement.getAttribute('id');
      
      ancestors.push({
        classes: ancestorClasses ? ancestorClasses.split(' ').filter(c => c.trim()) : [],
        tag: ancestorTag,
        id: ancestorId
      });
      currentElement = currentElement.parentElement;
    }
    
    // Verificar todos los selectores CSS disponibles
    for (var selector in cssRules) {
      if (cssRules.hasOwnProperty(selector)) {
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
    // Selector de elemento simple
    if (selector === tagName) {
      return true;
    }
    
    // Selector de clase simple
    if (selector.charAt(0) === '.' && className) {
      var selectorClass = selector.substring(1);
      var classes = className.split(' ').filter(c => c.trim());
      return classes.includes(selectorClass);
    }
    
    // Selector de ID
    if (selector.charAt(0) === '#' && elementId) {
      return selector.substring(1) === elementId;
    }
    
    // Selectores anidados (descendant)
    if (selector.includes(' ')) {
      return matchesNestedSelector(selector, element, className, tagName, elementId, ancestors);
    }
    
    // Selectores múltiples con clases combinadas (.class1.class2)
    if (selector.includes('.') && !selector.includes(' ') && selector.indexOf('.') !== selector.lastIndexOf('.')) {
      return matchesCombinedClasses(selector, className);
    }
    
    return false;
  }
  
  // Función para manejar selectores anidados
  function matchesNestedSelector(selector, element, className, tagName, elementId, ancestors) {
    var parts = selector.split(' ').filter(p => p.trim()).reverse(); // Reverse para ir desde el elemento hacia arriba
    
    // La primera parte debe coincidir con el elemento actual
    if (!selectorMatches(parts[0], element, className, tagName, elementId, [])) {
      return false;
    }
    
    // Verificar las partes restantes con los ancestors
    var ancestorIndex = 0;
    for (var i = 1; i < parts.length; i++) {
      var found = false;
      while (ancestorIndex < ancestors.length) {
        var ancestor = ancestors[ancestorIndex];
        var ancestorClassNames = ancestor.classes.join(' ');
        
        if (selectorMatches(parts[i], null, ancestorClassNames, ancestor.tag, ancestor.id, [])) {
          found = true;
          ancestorIndex++;
          break;
        }
        ancestorIndex++;
      }
      
      if (!found) {
        return false;
      }
    }
    
    return true;
  }
  
  // Función para manejar clases combinadas (.class1.class2)
  function matchesCombinedClasses(selector, className) {
    if (!className) return false;
    
    var requiredClasses = selector.split('.').filter(c => c.trim());
    var elementClasses = className.split(' ').filter(c => c.trim());
    
    return requiredClasses.every(function(reqClass) {
      return elementClasses.includes(reqClass);
    });
  }
  
  // Calcular especificidad CSS básica
  function calculateSpecificity(selector) {
    var specificity = 0;
    
    // IDs = 100
    specificity += (selector.match(/#/g) || []).length * 100;
    
    // Classes = 10
    specificity += (selector.match(/\\./g) || []).length * 10;
    
    // Elements = 1
    var elementMatches = selector.match(/\\b[a-z][a-z0-9]*\\b/gi) || [];
    specificity += elementMatches.length * 1;
    
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

      // Extraer contenido de pseudoelementos
      var pseudoContent = extractPseudoContent(node, cssRules);

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

      // Agregar contenido ::before como texto inicial
      if (pseudoContent.before) {
        text = pseudoContent.before + (text ? ' ' + text : '');
      }

      // Agregar contenido ::after como texto final
      if (pseudoContent.after) {
        text = (text || '') + (text ? ' ' : '') + pseudoContent.after;
      }

      return {
        type: 'element',
        tagName: tag,
        text: text.trim(),
        styles: styles,
        attributes: {},
        children: children,
        pseudoContent: pseudoContent // Guardar para referencia
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

document.getElementById('send-btn').onclick = function() {
  var htmlValue = document.getElementById('html-input').value;
  var structure = simpleParseHTML(htmlValue);
  parent.postMessage({
    pluginMessage: {
      type: 'html-structure',
      structure: structure
    }
  }, '*');
};

// MCP Test Button Handler
document.getElementById('mcp-test-btn').onclick = function() {
  var testBtn = document.getElementById('mcp-test-btn');
  var statusMessages = document.getElementById('status-messages');
  
  // Hide button and show loading message
  testBtn.style.display = 'none';
  updateStatusMessage('Testing MCP connection...', 'test');
  
  parent.postMessage({
    pluginMessage: {
      type: 'mcp-test'
    }
  }, '*');
};

// Direct Test Button Handler - BYPASS CONSOLE
document.getElementById('direct-test-btn').onclick = function() {
  var testBtn = document.getElementById('direct-test-btn');
  var statusMessages = document.getElementById('status-messages');
  
  testBtn.style.display = 'none';
  updateStatusMessage('Direct MCP test running...', 'test');
  
  // Send direct test data
  parent.postMessage({
    pluginMessage: {
      type: 'store-mcp-data',
      data: {
        timestamp: Date.now(),
        type: 'mcp-request',
        function: 'mcp_html_to_design_import-html',
        arguments: {
          html: '<div style="background:linear-gradient(45deg,#ff6b6b,#4ecdc4);padding:30px;border-radius:12px;color:white;font-family:Inter;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.2);"><h1>🎉 FASE 1 COMPLETADA!</h1><p>MCP Storage funcionando perfectamente!</p><p>✅ Cursor → Bridge → Monitor → Plugin → Figma</p></div>',
          name: 'Phase 1 Success'
        },
        requestId: Date.now().toString()
      }
    }
  }, '*');
  
  // Show button again after 3 seconds
  setTimeout(function() {
    testBtn.style.display = 'block';
  }, 3000);
};

// Function to update status messages
function updateStatusMessage(message, type) {
  var statusMessages = document.getElementById('status-messages');
  if (statusMessages) {
    statusMessages.textContent = message;
    statusMessages.classList.add('visible');
    
    // Remove previous type classes
    statusMessages.classList.remove('success', 'error', 'info', 'test');
    
    // Add current type class
    if (type) {
      statusMessages.classList.add(type);
    }
    
    // Auto-hide messages after 3 seconds for test button clicks and show button again
    if (type === 'test' || (type === 'info' && message.includes('MCP Test:'))) {
      setTimeout(function() {
        if (statusMessages.textContent === message) {
          statusMessages.classList.remove('visible', 'success', 'error', 'info', 'test');
          // Show test button again
          var testBtn = document.getElementById('mcp-test-btn');
          if (testBtn) {
            testBtn.style.display = 'block';
          }
        }
      }, 3000);
    }
  }
}

// Listen for messages from plugin code
window.addEventListener('message', function(event) {
  if (event.data.pluginMessage) {
    var msg = event.data.pluginMessage;
    if (msg.type === 'mcp-test-response') {
      updateStatusMessage('MCP: ' + msg.message, 'test');
    } else if (msg.type === 'mcp-storage-response') {
      // Handle storage confirmation messages
      if (msg.success) {
        updateStatusMessage('✅ MCP data stored successfully!', 'success');
      } else {
        updateStatusMessage('❌ Storage error: ' + msg.message, 'error');
      }
    } else if (msg.type === 'mcp-html-response') {
      updateStatusMessage('MCP HTML: ' + msg.message, 'info');
    } else if (msg.type === 'mcp-status-update') {
      updateStatusMessage(msg.message, msg.status || 'test');
    } else if (msg.type === 'parse-mcp-html') {
      // MCP HTML PARSING - Use same logic as Convert to Figma button
      console.log('[MCP UI] Parsing HTML for MCP:', msg.name);
              updateStatusMessage('Processing HTML from MCP: ' + msg.name, 'test');
      
      try {
        // Use the same DOMParser function as the Convert to Figma button
        var structure = simpleParseHTML(msg.html);
        console.log('[MCP UI] Parsed successfully, sending back to plugin');
        
        // Send parsed structure back to plugin
        parent.postMessage({
          pluginMessage: {
            type: 'html-structure',
            structure: structure,
            name: msg.name,
            fromMCP: true
          }
        }, '*');
        
        updateStatusMessage('Successfully processed HTML: ' + msg.name, 'test');
        
      } catch (error) {
        console.error('[MCP UI] Error parsing HTML:', error);
        updateStatusMessage('Error processing HTML: ' + error.message, 'test');
      }
    }
  }
});
</script>
</body>
</html>`;

figma.showUI(html, { width: 360, height: 400 });

function hexToRgb(color: string): {r: number, g: number, b: number} | null {
  // First handle CSS color keywords
  const colorKeywords: {[key: string]: {r: number, g: number, b: number}} = {
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

function hexToRgba(color: string): {r: number, g: number, b: number, a: number} | null {
  const rgb = hexToRgb(color);
  if (!rgb) return null;
  
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
  return { ...rgb, a: 1 };
}

function parseSize(value: string): number | null {
  if (!value || value === 'auto' || value === 'inherit' || value === 'initial') return null;
  
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

function parseMargin(marginValue: string): {top: number, right: number, bottom: number, left: number} {
  const values = marginValue.split(' ').map(v => parseSize(v) || 0);
  
  if (values.length === 1) {
    return { top: values[0], right: values[0], bottom: values[0], left: values[0] };
  } else if (values.length === 2) {
    return { top: values[0], right: values[1], bottom: values[0], left: values[1] };
  } else if (values.length === 3) {
    return { top: values[0], right: values[1], bottom: values[2], left: values[1] };
  } else if (values.length === 4) {
    return { top: values[0], right: values[1], bottom: values[2], left: values[3] };
  }
  
  return { top: 0, right: 0, bottom: 0, left: 0 };
}

function parsePadding(paddingValue: string): {top: number, right: number, bottom: number, left: number} {
  const values = paddingValue.split(' ').map(v => parseSize(v) || 0);
  
  if (values.length === 1) {
    return { top: values[0], right: values[0], bottom: values[0], left: values[0] };
  } else if (values.length === 2) {
    return { top: values[0], right: values[1], bottom: values[0], left: values[1] };
  } else if (values.length === 3) {
    return { top: values[0], right: values[1], bottom: values[2], left: values[1] };
  } else if (values.length === 4) {
    return { top: values[0], right: values[1], bottom: values[2], left: values[3] };
  }
  
  return { top: 0, right: 0, bottom: 0, left: 0 };
}

function parseBoxShadow(shadowValue: string): any {
  // Parse box-shadow: offset-x offset-y blur-radius spread-radius color
  // Ejemplo: "0 2px 12px rgba(44,62,80,0.08)"
  const match = shadowValue.match(/(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)?\s*(-?\d+(?:\.\d+)?(?:px)?)?\s*(rgba?\([^)]+\)|#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3})?/);
  
  if (match) {
    const offsetX = parseSize(match[1]) || 0;
    const offsetY = parseSize(match[2]) || 0;
    const blurRadius = parseSize(match[3]) || 0;
    const colorStr = match[5];
    
    let color = {r: 0, g: 0, b: 0, a: 0.25}; // Incluir alpha en color
    
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
      } else {
        const rgb = hexToRgb(colorStr);
        if (rgb) {
          color = { ...rgb, a: 0.25 }; // Default alpha for hex colors
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

function parseTransform(transformValue: string): {rotation?: number, scaleX?: number, scaleY?: number, translateX?: number, translateY?: number} {
  const result: any = {};
  
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

function extractBorderColor(borderValue: string): string | null {
  // Busca un color en la propiedad border (hex, rgb, rgba, palabra clave)
  if (!borderValue) return null;
  // Hex
  const hex = borderValue.match(/#([a-fA-F0-9]{3,6})/);
  if (hex) return hex[0];
  // rgb/rgba
  const rgb = borderValue.match(/rgba?\([^\)]+\)/);
  if (rgb) return rgb[0];
  // Palabra clave (ej: 'red', 'blue', 'black', 'white', 'gray', 'grey', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown')
  const keyword = borderValue.match(/\b(white|black|red|blue|green|yellow|orange|purple|pink|brown|gray|grey)\b/i);
  if (keyword) return keyword[0];
  return null;
}

function extractGradientColor(bg: string): string | null {
  if (!bg) return null;
  // linear-gradient(90deg, #2c3e50 60%, #2980b9 100%)
  const hex = bg.match(/#([a-fA-F0-9]{3,6})/);
  if (hex) return hex[0];
  const rgb = bg.match(/rgba?\([^\)]+\)/);
  if (rgb) return rgb[0];
  const keyword = bg.match(/\b(white|black|red|blue|green|yellow|orange|purple|pink|brown|gray|grey)\b/i);
  if (keyword) return keyword[0];
  return null;
}

// Simplified gradient parsing function with minimal logging
function parseLinearGradient(gradientStr: string): any {
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
    
    const stops: any[] = [];
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
  } catch (error) {
    return null;
  }
}

function applyStylesToFrame(frame: FrameNode, styles: any) {
  

  
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
  } else if ((styles['background-color'] && styles['background-color'] !== 'transparent') || 
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

  // Width - Aplicar ancho según CSS
  if (styles.width) {
    let targetWidth = parseSize(styles.width);
    
    if (targetWidth && targetWidth > 0) {
      frame.resize(targetWidth, frame.height);
    } else if (styles.width === '100%') {
      // Para elementos de ancho completo, aplicar lógica especial
      if (frame.parent && frame.parent.type === 'FRAME') {
        const parentFrame = frame.parent as FrameNode;
        const availableWidth = Math.max(parentFrame.width - parentFrame.paddingLeft - parentFrame.paddingRight, 300);
        frame.resize(availableWidth, frame.height);
      } else {
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
      const colorObj = hexToRgb(borderColor) || {r: 0.87, g: 0.87, b: 0.87};
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
    } else {
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
      } catch (e) {}
      const side = prop.split('-')[1] as keyof typeof margin;
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
      if (side === 'top') frame.paddingTop = value;
      else if (side === 'right') frame.paddingRight = value;
      else if (side === 'bottom') frame.paddingBottom = value;
      else if (side === 'left') frame.paddingLeft = value;
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

  } else if (styles['justify-content'] === 'space-between') {
    frame.primaryAxisAlignItems = 'SPACE_BETWEEN';
    // SMART: Solo si frame actual es muy pequeño para space-between
    if (frame.layoutMode === 'HORIZONTAL' && !styles.width && frame.width < 200) {
      frame.minWidth = Math.max(frame.width * 1.5, 200); // Dinámico basado en contenido
    }
  } else if (styles['justify-content'] === 'space-around') {
    frame.primaryAxisAlignItems = 'SPACE_BETWEEN'; // Fallback
    // SMART: También para space-around
    if (frame.layoutMode === 'HORIZONTAL' && !styles.width && frame.width < 200) {
      frame.minWidth = Math.max(frame.width * 1.5, 200);
    }
  } else if (styles['justify-content'] === 'flex-start') {
    frame.primaryAxisAlignItems = 'MIN';
  } else if (styles['justify-content'] === 'flex-end') {
    frame.primaryAxisAlignItems = 'MAX';
  }
  
  if (styles['align-items'] === 'center') {
    frame.counterAxisAlignItems = 'CENTER';

  } else if (styles['align-items'] === 'flex-start') {
    frame.counterAxisAlignItems = 'MIN';
  } else if (styles['align-items'] === 'flex-end') {
    frame.counterAxisAlignItems = 'MAX';
  }

  // TEXT-ALIGN: center support (for containers with text children)
  if (styles['text-align'] === 'center') {
    // For containers with text-align center, center all children
    if (frame.layoutMode === 'VERTICAL') {
      frame.primaryAxisAlignItems = 'CENTER';
      // Also center horizontally in vertical layout
      frame.counterAxisAlignItems = 'CENTER';
    } else if (frame.layoutMode === 'HORIZONTAL') {
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

function applyStylesToText(text: TextNode, styles: any) {
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
      if (!isNaN(px)) text.lineHeight = { value: px, unit: 'PIXELS' };
    } else if (value.match(/^[0-9.]+%$/)) {
      // %: usar PERCENT
      const percent = parseFloat(value);
      if (!isNaN(percent)) text.lineHeight = { value: percent, unit: 'PERCENT' };
    } else if (!isNaN(Number(value))) {
      // Unitless: NO aplicar nada
    } else {
      // Otros valores (normal, inherit, etc): ignorar
    }
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
    } else if (weight === 'lighter' || weight === '300' || weight === '200' || weight === '100') {
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
    } else if (decoration.includes('line-through')) {
      text.textDecoration = 'STRIKETHROUGH';
    } else {
      text.textDecoration = 'NONE';
    }
  }
  
  // Text transform
  if (styles['text-transform']) {
    const transform = styles['text-transform'];
    let characters = text.characters;
    
    if (transform === 'uppercase') {
      text.characters = characters.toUpperCase();
    } else if (transform === 'lowercase') {
      text.characters = characters.toLowerCase();
    } else if (transform === 'capitalize') {
      text.characters = characters.replace(/\b\w/g, l => l.toUpperCase());
    }
  }
  
  // Text align
  if (styles['text-align']) {
    const align = styles['text-align'];
    if (align === 'center') text.textAlignHorizontal = 'CENTER';
    else if (align === 'right') text.textAlignHorizontal = 'RIGHT';
    else if (align === 'justify') text.textAlignHorizontal = 'JUSTIFIED';
    else text.textAlignHorizontal = 'LEFT';
    
  }
  
  // Opacity
  if (styles.opacity) {
    const opacity = parseFloat(styles.opacity);
    if (opacity >= 0 && opacity <= 1) {
      text.opacity = opacity;
    }
  }
}

async function calculateContentSize(children: any[]): Promise<{width: number, height: number}> {
  let totalHeight = 0;
  let maxWidth = 0;
  
  for (const child of children) {
    if (child.type === 'element') {
      if (child.tagName === 'h1') {
        totalHeight += 50;
        maxWidth = Math.max(maxWidth, child.text.length * 20);
      } else if (child.tagName === 'h2') {
        totalHeight += 40;
        maxWidth = Math.max(maxWidth, child.text.length * 16);
      } else if (child.tagName === 'p' || child.tagName === 'span') {
        totalHeight += 30;
        maxWidth = Math.max(maxWidth, child.text.length * 10);
      } else if (child.tagName === 'button' || child.tagName === 'input') {
        totalHeight += 50;
        maxWidth = Math.max(maxWidth, Math.max(200, child.text.length * 12));
      } else if (child.tagName === 'ul' || child.tagName === 'ol') {
        totalHeight += child.children.length * 25 + 10;
        maxWidth = Math.max(maxWidth, 250);
      } else if (child.tagName === 'img') {
        const width = parseSize(child.styles?.width) || 200;
        const height = parseSize(child.styles?.height) || 150;
        totalHeight += height + 10;
        maxWidth = Math.max(maxWidth, width);
      } else if (child.tagName === 'table') {
        totalHeight += child.children.length * 40 + 20;
        maxWidth = Math.max(maxWidth, 400);
      } else if (child.tagName === 'form') {
        const formSize = await calculateContentSize(child.children);
        totalHeight += formSize.height + 20;
        maxWidth = Math.max(maxWidth, formSize.width);
      } else if (['div', 'section', 'article', 'nav', 'header', 'footer', 'main'].includes(child.tagName)) {
        const childSize = await calculateContentSize(child.children);
        totalHeight += childSize.height + 20;
        maxWidth = Math.max(maxWidth, childSize.width);
      }
    }
  }
  
  return { width: Math.max(maxWidth, 200), height: Math.max(totalHeight, 50) };
}

// Helper function to parse number of columns from grid-template-columns
function parseGridColumns(gridTemplate: string | undefined): number {
  if (!gridTemplate) return 1;
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
async function createGridLayout(children: any[], parentFrame: FrameNode, columns: number, gap: number, inheritedStyles?: any) {
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
      } catch (error) {
        rowFrame.resize(Math.max(400, rowFrame.width), rowFrame.height);
      }
    }
    for (let j = 0; j < columns; j++) {
      if (children[i + j]) {
        await createFigmaNodesFromStructure([children[i + j]], rowFrame, 0, 0, inheritedStyles);
      }
    }
    // Hacer que los items llenen el espacio de la fila
    for (let k = 0; k < rowFrame.children.length; k++) {
      try {
        (rowFrame.children[k] as FrameNode).layoutGrow = 1;
      } catch (error) {}
    }
  }
}

async function createFigmaNodesFromStructure(structure: any[], parentFrame?: FrameNode, startX = 0, startY = 0, inheritedStyles?: any) {
  for (const node of structure) {
    
    if (node.type === 'element') {
      // Skip script, style, and other non-visual elements
      if (['script', 'style', 'meta', 'link', 'title'].includes(node.tagName)) {
        continue;
      }
      
      // Convert sticky/fixed positioning to normal (but still render)
      if (node.styles?.position === 'sticky' || node.styles?.position === 'fixed') {

        // Don't skip - just normalize the positioning
        node.styles.position = 'relative';
      }
      

      
      // Merge inherited styles with node's own styles
      const nodeStyles = { ...inheritedStyles, ...node.styles };
      node.styles = nodeStyles;
      
      if (['div', 'section', 'article', 'nav', 'header', 'footer', 'main'].includes(node.tagName)) {
        const frame = figma.createFrame();
        frame.name = node.tagName.toUpperCase() + ' Frame';
        
        // LAYOUT MODE: Aplicar display CSS directamente PRIMERO
        let layoutMode: 'HORIZONTAL' | 'VERTICAL' = 'VERTICAL';
        if (node.styles?.display === 'flex') {
          // Flex direction: row = HORIZONTAL, column = VERTICAL
          layoutMode = node.styles?.['flex-direction'] === 'column' ? 'VERTICAL' : 'HORIZONTAL';
          
          // Debug flexbox layout
          if (node.styles?.className === 'dashboard') {
          }
        } else if (node.styles?.display === 'grid') {
          // Keep vertical layout for grid - we'll handle 2x2 layout in child processing
          layoutMode = 'VERTICAL';

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
        if (node.styles?.className === 'detail-label' || node.styles?.className === 'detail-value') {
        }
        
        // INHERIT text-align from parent for DIV containers too
        if (parentFrame && parentFrame.getPluginData('textAlign') === 'center') {
          // If parent container has text-align center and this container doesn't have its own text-align
          if (!node.styles?.['text-align']) {
            // Apply centering to this container as well
            if (frame.layoutMode === 'VERTICAL') {
              frame.primaryAxisAlignItems = 'CENTER';
              frame.counterAxisAlignItems = 'CENTER';
            } else if (frame.layoutMode === 'HORIZONTAL') {
              frame.counterAxisAlignItems = 'CENTER';
              frame.primaryAxisAlignItems = 'CENTER';
            }
            // Also mark this frame as having centered text for its children
            frame.setPluginData('textAlign', 'center');
            
            // Log only detail-related inheritance
            if (node.styles?.className?.includes('detail')) {
            }
          }
        }
        
        // CRITICAL: After applying styles, ensure containers can still grow vertically
        if (node.styles?.['max-width'] && !node.styles?.height) {
          // For containers with max-width but no explicit height, allow vertical growth
          frame.layoutSizingVertical = 'HUG';

        }
        

        

        
        // Store if we need to apply full width (ALL div containers should fill parent width)
        const needsFullWidth = true; // All div containers should fill their parent width when in auto-layout
        
        // Remove early height filling - will do it after appendChild
        
        // Only apply default background if the element doesn't have any background AND it's not inside a gradient container
        const hasBackground = frame.fills && (frame.fills as Paint[]).length > 0;
        const isInsideGradientContainer = inheritedStyles?.['background'] && inheritedStyles['background'].includes('linear-gradient');
        
        // Remove hardcoded backgrounds - let CSS handle all styling
        if (!hasBackground && !isInsideGradientContainer) {
          // Check if element has CSS background that should be applied
          const cssBackgroundColor = node.styles?.['background-color'] || node.styles?.['background'];
          if (cssBackgroundColor && cssBackgroundColor !== 'transparent') {
            const bgColor = hexToRgb(cssBackgroundColor);
            if (bgColor) {
              frame.fills = [{ type: 'SOLID', color: bgColor }];
            }
          }
          // If no CSS background, leave transparent (no hardcoded defaults)
        }
        
        // Padding ONLY from CSS - no hardcoded defaults
        const defaultPadding = 0; // No default padding - respect CSS only
        
        const cssTopPadding = parseSize(node.styles?.['padding-top']) || parseSize(node.styles?.padding) || defaultPadding;
        const cssRightPadding = parseSize(node.styles?.['padding-right']) || parseSize(node.styles?.padding) || defaultPadding;
        const cssBottomPadding = parseSize(node.styles?.['padding-bottom']) || parseSize(node.styles?.padding) || defaultPadding;
        const cssLeftPadding = parseSize(node.styles?.['padding-left']) || parseSize(node.styles?.padding) || defaultPadding;
        
        frame.paddingTop = cssTopPadding;
        frame.paddingRight = cssRightPadding;
        frame.paddingBottom = cssBottomPadding;
        frame.paddingLeft = cssLeftPadding;
        
        // Set spacing: usar CSS gap o default más generoso
        const gap = parseSize(node.styles?.gap) || (layoutMode === 'HORIZONTAL' ? 16 : 12);
        frame.itemSpacing = gap;
        
        // Store gap for grid layout
        if (node.styles?.display === 'grid') {
          frame.setPluginData('gridGap', gap.toString());
        }
        
        // Only set position if there's no parent (root elements)
        if (!parentFrame) {
          frame.x = startX;
          frame.y = startY;
          figma.currentPage.appendChild(frame);
        } else {
          parentFrame.appendChild(frame);
        }
        
        // Apply full width AFTER appendChild (proper timing) - BUT NOT for elements with explicit dimensions
        const hasExplicitDimensions = node.styles?.width || node.styles?.height;
        
        if (!hasExplicitDimensions && needsFullWidth && parentFrame && parentFrame.layoutMode !== 'NONE') {
          try {
            frame.layoutSizingHorizontal = 'FILL';
            // Maintain vertical HUG for containers to grow with content
            if (!node.styles?.height) {
              frame.layoutSizingVertical = 'HUG';
            }

          } catch (error) {
            console.error('Layout error:', error);
            frame.resize(Math.max(480, frame.width), frame.height);
          }
        } else if (!hasExplicitDimensions && needsFullWidth) {
          // Only resize if needed, don't force arbitrary widths
          frame.resize(Math.max(frame.width, 300), frame.height);
          // Allow vertical growth for containers
          if (!node.styles?.height) {
            frame.layoutSizingVertical = 'HUG';
          }
        } else if (hasExplicitDimensions) {
  
        }
        
        // Handle flex child height separately for ALL elements (including those with explicit width like sidebar)
        if (parentFrame && parentFrame.layoutMode === 'HORIZONTAL' && !node.styles?.height) {
          try {
            frame.layoutSizingVertical = 'FILL';
            
            // Debug height filling for sidebar
            if (node.styles?.className === 'sidebar') {
            }
          } catch (error) {
            console.error('Height fill error for', node.styles?.className || 'element', error);
          }
        }
        
        // Apply centering for elements marked with margin: 0 auto
        if (frame.getPluginData('centerHorizontally') === 'true' && parentFrame) {
          if (parentFrame.layoutMode === 'VERTICAL') {
            parentFrame.primaryAxisAlignItems = 'CENTER';

          }
        }
        
        // Pass styles that should be inherited by children
        const inheritableStyles = {
          ...inheritedStyles,
          // Solo heredar color si el hijo no tiene uno propio
          color: node.styles?.color || inheritedStyles?.color,
          'font-family': node.styles?.['font-family'] || inheritedStyles?.['font-family'],
          'font-size': node.styles?.['font-size'] || inheritedStyles?.['font-size'],
          'line-height': node.styles?.['line-height'] || inheritedStyles?.['line-height'],
          
          // Pass gradient background info to children so they don't get default backgrounds
          'background': node.styles?.['background'] || inheritedStyles?.['background'],
          
          // Heredar background-color solo si el elemento no tiene uno propio
          'background-color': node.styles?.['background-color'] || 
                             (inheritedStyles?.['background-color'] && !node.styles?.['background-color'] ? 
                              inheritedStyles?.['background-color'] : undefined),
                              
          // Pass parent class name to help with styling decisions
          'parent-class': node.styles?.className || inheritedStyles?.['parent-class']
        };
        
        // Create text node if there's direct text content
        if (node.text && node.text.trim()) {
          await figma.loadFontAsync({ family: "Inter", style: "Regular" });
          const textNode = figma.createText();
          textNode.characters = node.text.trim();
          textNode.name = 'DIV Text';
          
          // Apply inherited styles and specific text styles
          applyStylesToText(textNode, { ...inheritableStyles, ...node.styles });
          
          frame.appendChild(textNode);
        }
        
        // Process children if they exist
        if (node.children && node.children.length > 0) {
          // Manejo de grid genérico
          if (node.styles?.display === 'grid') {
            const gridTemplateColumns = node.styles?.['grid-template-columns'];
            const columns = parseGridColumns(gridTemplateColumns);
            const gap = parseSize(node.styles?.gap) || parseSize(parentFrame?.getPluginData('gridGap') || '') || 12;
            
            // Si no se pudieron parsear columnas, usar fallback
            const finalColumns = columns > 0 ? columns : 2;
            await createGridLayout(node.children, frame, finalColumns, gap, inheritableStyles);
          } else {
            await createFigmaNodesFromStructure(node.children, frame, 0, 0, inheritableStyles);
          }
        }
        
        // Apply flex grow after appendChild for proper timing
        if ((node.styles?.flex === '1' || node.styles?.['flex-grow'] === '1') && parentFrame) {
          if (parentFrame.layoutMode === 'HORIZONTAL' || parentFrame.layoutMode === 'VERTICAL') {
            try {
              frame.layoutGrow = 1;
              frame.layoutSizingHorizontal = 'FILL';
              frame.layoutSizingVertical = 'HUG';
            } catch (error) {
              console.error('Error applying flex grow:', error);
              // Fallback: only apply layoutGrow
              try {
                frame.layoutGrow = 1;
              } catch (fallbackError) {
                console.error('Fallback error:', fallbackError);
              }
            }
          }
        }
        
      } else if (node.tagName === 'form') {
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
        } else {
          parentFrame.appendChild(form);
        }
        
        await createFigmaNodesFromStructure(node.children, form, 0, 0, inheritedStyles);
        
      } else if (['input', 'textarea', 'select'].includes(node.tagName)) {
        // Calcular alto y ancho
        let inputWidth: number | null = parseSize(node.styles?.width);
        const inputHeight = node.tagName === 'textarea' ? 
          (parseSize(node.attributes?.rows) || 3) * 20 + 20 : 
          parseSize(node.styles?.height) || 40;

        const input = figma.createFrame();
        // Fondo y borde: usar CSS si está, si no, fallback blanco/gris
        let bgColor = { r: 1, g: 1, b: 1 };
        if (node.styles?.['background'] && node.styles['background'] !== 'transparent') {
          const bgParsed = hexToRgb(node.styles['background']);
          if (bgParsed) bgColor = bgParsed;
        } else if (node.styles?.['background-color'] && node.styles['background-color'] !== 'transparent') {
          const bgParsed = hexToRgb(node.styles['background-color']);
          if (bgParsed) bgColor = bgParsed;
        }
        input.fills = [{ type: 'SOLID', color: bgColor }];

        let borderColor = { r: 0.8, g: 0.8, b: 0.8 };
        if (node.styles?.['border'] || node.styles?.['border-color']) {
          const borderParsed = hexToRgb(node.styles['border-color'] || extractBorderColor(node.styles['border']));
          if (borderParsed) borderColor = borderParsed;
        }
        input.strokes = [{ type: 'SOLID', color: borderColor }];
        input.strokeWeight = parseSize(node.styles?.['border-width']) || 1;
        input.cornerRadius = parseSize(node.styles?.['border-radius']) || 4;
        input.name = node.tagName.toUpperCase();

        input.layoutMode = 'HORIZONTAL';
        // Solo centrar si el CSS lo especifica (no hardcodear centrado)
        if (node.styles?.['text-align'] === 'center') {
          input.primaryAxisAlignItems = 'CENTER'; // Horizontal center
          input.counterAxisAlignItems = 'CENTER'; // Vertical center
        } else {
          input.primaryAxisAlignItems = 'MIN'; // Alineado a la izquierda horizontalmente (eje principal)
          input.counterAxisAlignItems = 'CENTER'; // Centrado verticalmente (eje perpendicular)
        }
        input.paddingLeft = parseSize(node.styles?.['padding-left']) || 12;
        input.paddingRight = parseSize(node.styles?.['padding-right']) || 12;

        // Detectar si el parent es auto-layout
        const parentIsAutoLayout = parentFrame && parentFrame.type === 'FRAME' && parentFrame.layoutMode && parentFrame.layoutMode !== 'NONE';
        // Soporte width: 100% (FILL) si el CSS lo pide y el parent es auto-layout
        let useFill = false;
        if (node.styles?.width === '100%') {
          if (parentIsAutoLayout) {
            useFill = true;
            // NO setear FILL aquí - lo haremos después de appendChild
          } else {
            // Si no hay parent auto-layout, usar el ancho del parent o mínimo 300
            inputWidth = parentFrame && 'width' in parentFrame ? Math.max((parentFrame as FrameNode).width, 300) : 300;
          }
        }
        if (!useFill) {
          input.resize(inputWidth || 300, inputHeight);
        } else {
          input.resize(input.width, inputHeight); // Solo setea el alto
        }

        if (node.styles) {
          applyStylesToFrame(input, node.styles);
        }

        // Add placeholder or value text
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        const inputText = figma.createText();
        const displayText = node.attributes?.value || node.attributes?.placeholder || 
          (node.tagName === 'select' ? 'Select option ▼' : 'Input field');
        inputText.characters = displayText;
        // Color de texto: usar CSS si está, si no, gris claro para placeholder
        let textColor = { r: 0.2, g: 0.2, b: 0.2 };
        if (node.styles?.color) {
          const colorParsed = hexToRgb(node.styles.color);
          if (colorParsed) textColor = colorParsed;
        } else if (!node.attributes?.value) {
          textColor = { r: 0.6, g: 0.6, b: 0.6 };
        }
        inputText.fills = [{ type: 'SOLID', color: textColor }];
        input.appendChild(inputText);

        if (!parentFrame) {
          input.x = startX;
          input.y = startY;
          figma.currentPage.appendChild(input);
        } else {
          parentFrame.appendChild(input);
        }
        // Si corresponde, setear FILL después de añadir al parent (para evitar error de Figma)
        if (useFill) {
          try {
            input.layoutSizingHorizontal = 'FILL';
          } catch (e) {
            // Si falla, hacer resize manual
            if (parentFrame && 'width' in parentFrame) {
              input.resize(Math.max((parentFrame as FrameNode).width, 300), input.height);
            } else {
              input.resize(300, input.height);
            }
          }
        }
        
      } else if (node.tagName === 'table') {
        const tableWidth = parseSize(node.styles?.width) || 500; // Increased default width
        let tableHeight = 60; // Base height for header
        
        // Calculate table height based on rows
        const bodyRows = node.children.filter((c: any) => 
          c.tagName === 'tbody' || c.tagName === 'tr'
        );
        const totalRows = bodyRows.reduce((count: number, section: any) => {
          if (section.tagName === 'tbody') {
            return count + section.children.filter((c: any) => c.tagName === 'tr').length;
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
        } else {
          parentFrame.appendChild(table);
        }
        
        await createFigmaNodesFromStructure(node.children, table, 0, 0, inheritedStyles);
        
      } else if (['tr', 'thead', 'tbody'].includes(node.tagName)) {
        if (node.tagName === 'thead' || node.tagName === 'tbody') {
          // Process container elements, create their children directly
          await createFigmaNodesFromStructure(node.children, parentFrame, 0, 0, inheritedStyles);
        } else {
          // This is a TR (table row)
          const row = figma.createFrame();
          row.resize(450, 55); // Aumentado de 45 a 55
          
          // Check if this row contains th elements (header row)
          const isHeaderRow = node.children.some((c: any) => c.tagName === 'th');
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
          } else {
            parentFrame.appendChild(row);
          }
          
          await createFigmaNodesFromStructure(node.children, row, 0, 0, inheritedStyles);
        }
        
      } else if (['td', 'th'].includes(node.tagName)) {
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
        } else if (node.children && node.children.length > 0) {
          textContent = node.children.map((child: any) => {
            if (child.type === 'text') return child.text;
            if (child.type === 'element' && child.tagName === 'button') {
              return child.text || 'Button';
            }
            return child.text || '';
          }).filter((text: string) => text.trim()).join(' ');
        }
        
        cellText.characters = textContent || 'Cell';
        
        if (node.tagName === 'th') {
          const currentSize = typeof cellText.fontSize === 'number' ? cellText.fontSize : 16;
          cellText.fontSize = currentSize * 1.1;
          cellText.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
        } else {
          cellText.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
        }
        
        cell.appendChild(cellText);
        
        if (node.styles) {
          applyStylesToText(cellText, node.styles);
        }
        
        // Check if parent has text-align center and inherit it
        if (parentFrame && parentFrame.getPluginData('textAlign') === 'center') {
          // If parent container has text-align center, apply it to this text
          if (!node.styles?.['text-align']) {
            cellText.textAlignHorizontal = 'CENTER';
          }
        }
        
        // Special debug for detail elements
        if (node.styles?.className?.includes('detail')) {
        }
        
        if (!parentFrame) {
          cell.x = startX;
          cell.y = startY;
          figma.currentPage.appendChild(cell);
        } else {
          parentFrame.appendChild(cell);
        }
        
      } else if (node.tagName === 'button') {
        const buttonWidth = parseSize(node.styles?.width) || Math.max(120, node.text.length * 12);
        const buttonHeight = parseSize(node.styles?.height) || 50; // Aumentado de 40 a 50
        
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
        } else {
          parentFrame.appendChild(frame);
        }
        
      } else if (node.tagName === 'img') {
        const width = parseSize(node.styles?.width) || 200;
        const height = parseSize(node.styles?.height) || 150;
        
        const frame = figma.createFrame();
        frame.resize(width, height);
        frame.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        frame.name = 'Image: ' + (node.attributes?.alt || 'Unnamed');
        
        // Center the placeholder text
        frame.layoutMode = 'HORIZONTAL';
        frame.primaryAxisAlignItems = 'CENTER';
        frame.counterAxisAlignItems = 'CENTER';
        
        // Add placeholder text
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        const placeholderText = figma.createText();
        placeholderText.characters = node.attributes?.alt || 'Image';
        placeholderText.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
        frame.appendChild(placeholderText);
        
        if (!parentFrame) {
          frame.x = startX;
          frame.y = startY;
          figma.currentPage.appendChild(frame);
        } else {
          parentFrame.appendChild(frame);
        }
        
      } else if (['ul', 'ol'].includes(node.tagName)) {
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
        } else {
          parentFrame.appendChild(listFrame);
        }
        
        await createFigmaNodesFromStructure(node.children, listFrame, 0, 0, inheritedStyles);
        
      } else if (node.tagName === 'li') {
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        const text = figma.createText();
        const parentList = parentFrame?.name?.includes('OL') ? 'OL' : 'UL';
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
          if (!node.styles?.['text-align']) {
            text.textAlignHorizontal = 'CENTER';
          }
        }
        
        // Special debug for detail elements
        if (node.styles?.className?.includes('detail')) {
        }
        
        if (!parentFrame) {
          text.x = startX;
          text.y = startY;
          figma.currentPage.appendChild(text);
        } else {
          parentFrame.appendChild(text);
        }
        
      } else if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a', 'label'].includes(node.tagName)) {
        
        // Special handling for span elements with backgrounds (like badges)
        const hasBackground = node.styles?.['background'] || node.styles?.['background-color'];
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
          } else {
            parentFrame.appendChild(spanFrame);
          }
          
        } else {
          // Regular text handling for other elements and spans without backgrounds
          await figma.loadFontAsync({ family: "Inter", style: "Regular" });
          const text = figma.createText();
          text.characters = node.text || 'Empty text';
          text.name = node.tagName.toUpperCase() + ' Text';
        
        // Default sizes for headings con mejor legibilidad
        if (node.tagName.startsWith('h')) {
          const level = parseInt(node.tagName.charAt(1));
          const headingSizes = { 1: 36, 2: 28, 3: 22, 4: 20, 5: 18, 6: 16 }; // Todas aumentadas
          text.fontSize = headingSizes[level as keyof typeof headingSizes] || 16;
          // NO aplicar lineHeight aquí - dejar que applyStylesToText lo maneje
        } else if (node.tagName === 'p') {
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
          if (!node.styles?.['text-align']) {
            text.textAlignHorizontal = 'CENTER';
          }
        }
        
        // Special debug for detail elements
        if (node.styles?.className?.includes('detail')) {
        }
        
        // Better text positioning and width
        if (!parentFrame) {
          text.x = startX;
          text.y = startY;
          figma.currentPage.appendChild(text);
        } else {
          parentFrame.appendChild(text);
          // If parent has auto-layout, text will auto-size
          if (parentFrame.layoutMode !== 'NONE') {
            text.textAutoResize = 'WIDTH_AND_HEIGHT';
          }
        }
        }
        
      } else if (node.children && node.children.length > 0) {
        await createFigmaNodesFromStructure(node.children, parentFrame, 0, 0, inheritedStyles);
      }
    }
  }
}

// MCP Monitoring variables
let mcpMonitoringInterval: any = null;
let lastProcessedTimestamp: number = 0;

// NEW: Use figma.clientStorage for MCP communication (replaces file system)
async function readMCPSharedData(): Promise<any | null> {
  try {
    console.log('[MCP] Attempting to read shared data from clientStorage...');
    
    // Use Figma's clientStorage as the communication mechanism
    const storedData = await figma.clientStorage.getAsync('mcp-shared-data');
    
    if (storedData) {
      console.log('[MCP] Found data in clientStorage:', storedData);
      return storedData;
    } else {
      console.log('[MCP] No data found in clientStorage');
      return null;
    }
    
  } catch (error) {
    console.log('[MCP] Could not read from clientStorage:', error);
    return null;
  }
}

// NEW: Delete shared data after processing
async function deleteMCPSharedData(): Promise<boolean> {
  try {
    await figma.clientStorage.deleteAsync('mcp-shared-data');
    console.log('[MCP] Successfully deleted shared data from clientStorage');
    return true;
  } catch (error) {
    console.log('[MCP] Could not delete shared data:', error);
    return false;
  }
}

// MODIFIED: MCP Monitoring with hybrid approach (file first, HTTP fallback)
function startMCPMonitoring() {
  if (mcpMonitoringInterval) {
    clearInterval(mcpMonitoringInterval);
  }
  
  mcpMonitoringInterval = setInterval(async () => {
    try {
      // Pure MCP storage approach - no HTTP calls
      const storageData = await readMCPSharedData();
      let data = null;
      let source = '';
      
      if (storageData && storageData.timestamp && storageData.function && storageData.timestamp > lastProcessedTimestamp) {
        data = storageData;
        source = 'storage';
        console.log('[MCP] Using clientStorage data source');
      }
      
      // Process data regardless of source
      if (data && data.timestamp && data.function && data.timestamp > lastProcessedTimestamp) {
        console.log(`[MCP] Found new request from ${source}:`, data);
        console.log('[MCP DEBUG] About to update lastProcessedTimestamp');
        lastProcessedTimestamp = data.timestamp;
        console.log('[MCP DEBUG] Updated lastProcessedTimestamp to:', lastProcessedTimestamp);
        
        // Process the MCP request DIRECTLY (not via postMessage)
        console.log('[MCP DEBUG] Checking function type:', data.function);
        if (data.function === 'mcp_html_to_design_import-html') {
          console.log('[MCP DEBUG] Function matches, extracting data');
          const htmlContent = data.arguments.html;
          const name = data.arguments.name || 'MCP Import';
          
          console.log('[MCP] Processing MCP request:', data);
          console.log('[MCP] Sending HTML to UI for parsing:', name);
          
          // Send HTML to UI for parsing (same as Convert to Figma button)
          console.log('[MCP DEBUG] About to send postMessage to UI');
          figma.ui.postMessage({ 
            type: 'parse-mcp-html',
            html: htmlContent,
            name: name
          });
          console.log('[MCP DEBUG] PostMessage sent successfully');
        } else {
          console.log('[MCP DEBUG] Function does not match:', data.function);
        }
        
        // Clear the processed request from storage
        console.log('[MCP DEBUG] About to clear processed request');
        try {
          await deleteMCPSharedData();
          console.log('[MCP DEBUG] Storage cleared successfully');
        } catch (deleteError) {
          console.log('[MCP] Could not clear processed request (non-critical):', deleteError);
        }
      }
    } catch (error) {
      console.log('[MCP] Monitoring error:', error);
    }
  }, 2000); // Check every 2 seconds
}

function stopMCPMonitoring() {
  if (mcpMonitoringInterval) {
    clearInterval(mcpMonitoringInterval);
    mcpMonitoringInterval = null;
  }
}

async function testMCPConnection() {
  let results = [];
  
  // Test storage access
  try {
    const storageData = await readMCPSharedData();
    if (storageData !== null) {
      results.push('✅ MCP Storage: Working - data found');
      results.push(`• Type: ${storageData.type || 'unknown'}`);
      results.push(`• Function: ${storageData.function || 'unknown'}`);
    } else {
      results.push('⚠️ MCP Storage: Ready - no data yet');
      results.push('• Use console test to send data');
    }
  } catch (error) {
    results.push('❌ MCP Storage: Error - ' + error);
  }
  
  const message = results.join('\n');
  figma.ui.postMessage({ type: 'mcp-test-response', message: message });
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'mcp-test') {
    // Test actual MCP server connection
    testMCPConnection();
    return;
  }
  
  // NEW: Handle MCP data storage from external sources
  if (msg.type === 'store-mcp-data') {
    console.log('[MCP] Storing external MCP data in clientStorage:', msg.data);
    try {
      await figma.clientStorage.setAsync('mcp-shared-data', msg.data);
      console.log('[MCP] Successfully stored MCP data in clientStorage');
      figma.ui.postMessage({ 
        type: 'mcp-storage-response', 
        success: true, 
        message: 'MCP data stored successfully' 
      });
    } catch (error: any) {
      console.error('[MCP] Error storing MCP data:', error);
      figma.ui.postMessage({ 
        type: 'mcp-storage-response', 
        success: false, 
        message: 'Error storing MCP data: ' + error.message 
      });
    }
    return;
  }
  
  if (msg.type === 'mcp-html') {
    console.log('[MCP] Recibido HTML vía MCP:', msg.html);
    try {
      figma.notify('Procesando HTML recibido vía MCP...');
      figma.ui.postMessage({ type: 'mcp-html-response', message: '✅ HTML recibido y procesado vía MCP.' });
      console.log('[MCP] HTML procesado correctamente.');
    } catch (error: any) {
      figma.ui.postMessage({ type: 'mcp-html-response', message: '❌ Error procesando HTML vía MCP: ' + error.message });
      console.error('[MCP] Error procesando HTML vía MCP:', error);
    }
    return;
  }
  
  if (msg.type === 'html-structure') {
    // Create a main container frame for all HTML content
    const mainContainer = figma.createFrame();
    const containerName = msg.fromMCP ? `${msg.name || 'MCP Import'} (from Cursor)` : 'HTML Import Container';
    mainContainer.name = containerName;
    mainContainer.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    
    // Enable auto-layout for better organization
    mainContainer.layoutMode = 'VERTICAL';
    mainContainer.primaryAxisSizingMode = 'AUTO';
    mainContainer.counterAxisSizingMode = 'AUTO';
    
    // Set minimum width to ensure proper sizing
    mainContainer.minWidth = 600;
    
    mainContainer.paddingLeft = 30;
    mainContainer.paddingRight = 30;
    mainContainer.paddingTop = 30;
    mainContainer.paddingBottom = 30;
    mainContainer.itemSpacing = 20;
    
    // Position the container at current viewport center
    const viewport = figma.viewport.center;
    mainContainer.x = viewport.x - 200;
    mainContainer.y = viewport.y - 200;
    
    // Add to current page
    figma.currentPage.appendChild(mainContainer);
    
    // Create all HTML content inside this container
    await createFigmaNodesFromStructure(msg.structure, mainContainer, 0, 0, undefined);
    

    
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
}; 