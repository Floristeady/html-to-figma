// ============================================
// CSS Parser
// ============================================
// Functions for extracting and parsing CSS from HTML

import { CSSProperties, CSSRules, CSSVariables } from '../types';
import {
  UNSUPPORTED_CSS_PROPERTIES,
  SUPPORTED_CONTENT,
  UNSUPPORTED_PSEUDO_SELECTORS
} from './css-constants';

/**
 * Filter out unsupported CSS properties
 */
export function filterUnsupportedCSS(styles: CSSProperties): CSSProperties {
  const filteredStyles: CSSProperties = {};

  for (const prop in styles) {
    if (styles.hasOwnProperty(prop)) {
      if (prop === 'content') {
        const contentValue = styles[prop];
        if (contentValue && SUPPORTED_CONTENT.hasOwnProperty(contentValue)) {
          filteredStyles[prop] = styles[prop];
        }
      } else if (!UNSUPPORTED_CSS_PROPERTIES.includes(prop as any)) {
        filteredStyles[prop] = styles[prop];
      }
    }
  }

  return filteredStyles;
}

/**
 * Parse inline style string to object
 * Example: "color: red; font-size: 16px;" → { color: 'red', 'font-size': '16px' }
 */
export function parseInlineStyles(styleStr: string | undefined): CSSProperties {
  const styles: CSSProperties = {};
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

  return filterUnsupportedCSS(styles);
}

/**
 * Check if a CSS selector is unsupported (should be skipped)
 */
export function isUnsupportedSelector(selector: string): boolean {
  // Skip @keyframes, @media, etc.
  if (selector.charAt(0) === '@') {
    return true;
  }

  // Skip unsupported pseudo-selectors (except ::before/::after which we support)
  for (const pseudo of UNSUPPORTED_PSEUDO_SELECTORS) {
    if (selector.includes(pseudo)) {
      return true;
    }
  }

  // Allow ::before and ::after
  return false;
}

/**
 * Parse complex selector with commas into array of individual selectors
 * Example: ".card, .box" → [".card", ".box"]
 */
export function parseComplexSelector(selector: string): string[] {
  // Clean extra spaces
  selector = selector.split(/[ ]+/).join(' ').trim();

  // Handle multiple selectors separated by comma
  if (selector.indexOf(',') !== -1) {
    return selector.split(',').map(s => s.trim());
  }

  return [selector];
}

/**
 * Validate if a string is a valid CSS selector
 */
export function isValidCSSSelector(selector: string): boolean {
  if (!selector || selector.length === 0) return false;

  // Simple element selector (h1, div, span)
  if (/^[a-zA-Z][a-zA-Z0-9-]*$/.test(selector)) return true;

  // Class selector (.class)
  if (selector.charAt(0) === '.' && selector.indexOf(' ') === -1) return true;

  // ID selector (#id)
  if (selector.charAt(0) === '#') return true;

  // Nested selectors (.parent .child, div .class, etc.)
  if (selector.indexOf(' ') !== -1) return true;

  // Pseudo-elements (::before, ::after)
  if (selector.indexOf('::') !== -1) return true;

  return false;
}

/**
 * Remove @media, @keyframes, @supports blocks from CSS
 * These have nested braces that confuse simple parsing
 */
export function removeAtRuleBlocks(css: string): string {
  let result = '';
  let i = 0;

  while (i < css.length) {
    // Check for @ rules
    if (css[i] === '@' && (
      css.substring(i, i + 6) === '@media' ||
      css.substring(i, i + 10) === '@keyframes' ||
      css.substring(i, i + 9) === '@supports' ||
      css.substring(i, i + 8) === '@charset' ||
      css.substring(i, i + 7) === '@import'
    )) {
      // Find the opening brace
      const braceStart = css.indexOf('{', i);
      if (braceStart === -1) {
        // No brace, skip to end of line
        const lineEnd = css.indexOf(';', i);
        i = lineEnd !== -1 ? lineEnd + 1 : css.length;
        continue;
      }
      // Count braces to find matching closing brace
      let braceCount = 1;
      let j = braceStart + 1;
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

/**
 * Remove CSS comments from string
 */
export function removeCSSComments(css: string): string {
  let cleanCss = '';
  let inComment = false;

  for (let i = 0; i < css.length; i++) {
    if (!inComment && css[i] === '/' && css[i + 1] === '*') {
      inComment = true;
      i++;
    } else if (inComment && css[i] === '*' && css[i + 1] === '/') {
      inComment = false;
      i++;
    } else if (!inComment) {
      cleanCss += css[i];
    }
  }

  return cleanCss;
}

/**
 * Extract CSS variables from :root block
 */
export function extractCSSVariables(css: string): CSSVariables {
  const cssVariables: CSSVariables = {};

  const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
  if (rootMatch) {
    const rootDeclarations = rootMatch[1];
    const varPairs = rootDeclarations.split(';');

    for (let i = 0; i < varPairs.length; i++) {
      const pair = varPairs[i].trim();
      if (pair.indexOf('--') === 0) {
        const colonIdx = pair.indexOf(':');
        if (colonIdx > 0) {
          const varName = pair.substring(0, colonIdx).trim();
          const varValue = pair.substring(colonIdx + 1).trim();
          cssVariables[varName] = varValue;
        }
      }
    }
  }

  return cssVariables;
}

/**
 * Resolve CSS var() references using provided variables
 */
export function resolveVariables(value: string | undefined, cssVariables: CSSVariables): string {
  if (!value || typeof value !== 'string') return value || '';

  return value.replace(/var\(([^)]+)\)/g, (match, varRef) => {
    const parts = varRef.split(',');
    const varName = parts[0].trim();
    const fallback = parts[1] ? parts[1].trim() : null;
    return cssVariables[varName] || fallback || match;
  });
}

/**
 * Extract CSS rules from HTML string containing <style> tags
 * Returns an object mapping selectors to their properties
 */
export function extractCSS(htmlStr: string): CSSRules {
  const cssRules: CSSRules = {};
  let allCssText = '';

  // Support multiple style tags
  let searchStr = htmlStr;
  const startTag = '<style';
  const endTag = '</style>';

  while (true) {
    const styleStart = searchStr.indexOf(startTag);
    if (styleStart === -1) break;

    let contentStart = searchStr.indexOf('>', styleStart);
    if (contentStart === -1) break;
    contentStart += 1;

    const styleEnd = searchStr.indexOf(endTag, contentStart);
    if (styleEnd === -1) break;

    allCssText += searchStr.substring(contentStart, styleEnd) + ' ';
    searchStr = searchStr.substring(styleEnd + endTag.length);
  }

  if (!allCssText) return cssRules;

  // Remove comments
  allCssText = removeCSSComments(allCssText);

  // Extract CSS variables
  const cssVariables = extractCSSVariables(allCssText);

  // Remove @media, @keyframes blocks
  allCssText = removeAtRuleBlocks(allCssText);

  // Parse rules
  const rules = allCssText.split('}');

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i].trim();
    if (rule) {
      const braceIdx = rule.indexOf('{');
      if (braceIdx > 0) {
        const selector = rule.substring(0, braceIdx).trim();
        const declarations = rule.substring(braceIdx + 1).trim();

        if (selector && declarations && !isUnsupportedSelector(selector)) {
          // Handle multiple selectors (separated by comma)
          const selectors = parseComplexSelector(selector);

          for (let j = 0; j < selectors.length; j++) {
            const singleSelector = selectors[j];

            if (isValidCSSSelector(singleSelector)) {
              // Resolve CSS variables before parsing
              const resolvedDeclarations = resolveVariables(declarations, cssVariables);

              // Store the processed CSS rule
              cssRules[singleSelector] = {
                ...cssRules[singleSelector],
                ...parseInlineStyles(resolvedDeclarations)
              };

              // Also handle normalized variations for nested selectors
              if (singleSelector.includes(' ')) {
                const normalizedSelector = singleSelector.replace(/\s+/g, ' ');
                if (normalizedSelector !== singleSelector) {
                  cssRules[normalizedSelector] = {
                    ...cssRules[normalizedSelector],
                    ...parseInlineStyles(resolvedDeclarations)
                  };
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
