const fs = require('fs');

// Lista de propiedades CSS problemáticas que Figma no soporta
const UNSUPPORTED_CSS_PROPERTIES = [
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
const SUPPORTED_CONTENT = {
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

// Función para filtrar propiedades CSS no soportadas
function filterUnsupportedCSS(styles) {
  const filteredStyles = {};
  for (const prop in styles) {
    if (styles.hasOwnProperty(prop)) {
      // Manejar 'content' de manera especial
      if (prop === 'content') {
        const contentValue = styles[prop];
        if (SUPPORTED_CONTENT.hasOwnProperty(contentValue)) {
          // Solo incluir content si está en nuestra lista soportada
          filteredStyles[prop] = styles[prop];
        }
        // Si no está soportado, se omite automáticamente
      }
      // Omitir otras propiedades problemáticas
      else if (!UNSUPPORTED_CSS_PROPERTIES.includes(prop)) {
        filteredStyles[prop] = styles[prop];
      }
    }
  }
  return filteredStyles;
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

function parseInlineStyles(styleStr) {
  const styles = {};
  if (!styleStr) return styles;
  const declarations = styleStr.split(';');
  for (let i = 0; i < declarations.length; i++) {
    const decl = declarations[i].trim();
    if (decl) {
      const colonIdx = decl.indexOf(':');
      if (colonIdx > 0) {
        const prop = decl.substring(0, colonIdx).trim();
        const val = decl.substring(colonIdx + 1).trim();
        styles[prop] = val;
      }
    }
  }
  // Filtrar propiedades no soportadas antes de retornar
  return filterUnsupportedCSS(styles);
}

function extractAndCleanCSS(htmlStr) {
  const cssRules = {};
  const styleStart = htmlStr.indexOf('<style>');
  const styleEnd = htmlStr.indexOf('</style>');
  
  if (styleStart !== -1 && styleEnd !== -1) {
    let cssText = htmlStr.substring(styleStart + 7, styleEnd);
    
    // Remove CSS comments to prevent parsing corruption
    cssText = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remover @keyframes completos (incluyendo contenido anidado)
    cssText = cssText.replace(/@keyframes[^{]*\{[^{}]*(\{[^}]*\})*[^}]*\}/g, '');
    
    const rules = cssText.split('}');
    
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i].trim();
      if (rule) {
        const braceIdx = rule.indexOf('{');
        if (braceIdx > 0) {
          const selector = rule.substring(0, braceIdx).trim();
          const declarations = rule.substring(braceIdx + 1).trim();
          
          if (selector && declarations && !isUnsupportedSelector(selector)) {
            // Handle class selectors (simple and nested)
            if (selector.charAt(0) === '.') {
              cssRules[selector] = parseInlineStyles(declarations);
            }
            // Handle nested selectors like ".card .badge" or ".form-section h2"
            else if (selector.includes('.') && selector.includes(' ')) {
              cssRules[selector] = parseInlineStyles(declarations);
            }
            // Handle element selectors like "th" or "td"
            else if (selector.match(/^[a-zA-Z][a-zA-Z0-9]*$/)) {
              cssRules[selector] = parseInlineStyles(declarations);
            }
          }
        }
      }
    }
  }
  
  return cssRules;
}

function stylesToString(styles) {
  return Object.entries(styles)
    .map(([prop, value]) => `${prop}: ${value}`)
    .join('; ');
}

function convertHTMLForFigma(htmlContent) {
  // Extraer CSS limpio
  const cssRules = extractAndCleanCSS(htmlContent);
  
  // Remover tag <style> del HTML
  let cleanHTML = htmlContent.replace(/<style>[\s\S]*?<\/style>/g, '');
  
  // Convertir CSS a estilos inline
  // Esta es una implementación básica - se puede mejorar con un parser DOM real
  Object.keys(cssRules).forEach(selector => {
    const styles = cssRules[selector];
    const styleString = stylesToString(styles);
    
    if (selector.startsWith('.')) {
      const className = selector.substring(1);
      const classRegex = new RegExp(`class="([^"]*\\b${className}\\b[^"]*)"`, 'g');
      cleanHTML = cleanHTML.replace(classRegex, (match, classes) => {
        // Verificar si ya tiene style inline
        const elementMatch = cleanHTML.match(new RegExp(`<[^>]*${match}[^>]*>`, 'g'));
        if (elementMatch && elementMatch[0].includes('style=')) {
          // Agregar al style existente
          return match.replace(/style="([^"]*)"/, `style="$1; ${styleString}"`);
        } else {
          // Agregar nuevo style
          return `${match} style="${styleString}"`;
        }
      });
    }
  });
  
  return cleanHTML;
}

// Función principal
function processHTMLFile(inputFile) {
  try {
    // Leer el archivo HTML
    const htmlContent = fs.readFileSync(inputFile, 'utf8');
    
    // Convertir para Figma
    const figmaHTML = convertHTMLForFigma(htmlContent);
    
    // Remover el <head> y estructuras externas, quedarse solo con el body content
    let bodyContent = figmaHTML;
    const bodyStart = figmaHTML.indexOf('<body>');
    const bodyEnd = figmaHTML.indexOf('</body>');
    
    if (bodyStart !== -1 && bodyEnd !== -1) {
      bodyContent = figmaHTML.substring(bodyStart + 6, bodyEnd);
    }
    
    return bodyContent.trim();
    
  } catch (error) {
    console.error('Error procesando el archivo:', error.message);
    return null;
  }
}

// Si se ejecuta como script principal
if (require.main === module) {
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.log('Uso: node convert-html-for-figma.js <archivo.html>');
    process.exit(1);
  }
  
  const result = processHTMLFile(inputFile);
  if (result) {
    console.log('HTML convertido para Figma:');
    console.log(result);
  }
}

module.exports = { processHTMLFile, convertHTMLForFigma }; 