/// <reference types="@figma/plugin-typings" />

// Import constants from parser module
import { VIEWPORT_PRESETS, CONTAINER_SELECTORS } from './parser/css-constants';
// Import color utilities
import { hexToRgb, hexToRgba, extractBorderColor, extractGradientColor, extractFallbackColor } from './utils/colors';
// Import CSS unit utilities
import { CSS_CONFIG, parseSize, parseCalc, parsePercentage, parseMargin, parsePadding } from './utils/css-units';
// Import effects utilities
import { parseBoxShadow, parseTransform, parseLinearGradient } from './utils/effects';
// Import grid utilities
import { parseGridColumns, parseGridTemplateAreas, getGridRowCount, getGridColCount } from './utils/grid';

// __html__ is injected by Figma when using a separate ui.html file
figma.showUI(__html__, { width: 360, height: 380 });

// Color utilities imported from ./utils/colors
// CSS unit utilities (CSS_CONFIG, parseSize, parseCalc, parsePercentage, parseMargin, parsePadding)
// imported from ./utils/css-units
// VIEWPORT_PRESETS and CONTAINER_SELECTORS imported from ./parser/css-constants

function calculatePercentageWidth(widthValue: string, parentFrame: FrameNode | null): number | null {
  if (!parentFrame || !widthValue) return null;
  const percentage = parsePercentage(widthValue);
  if (percentage === null) return null;

  // Calculate available width (parent width minus padding)
  const availableWidth = parentFrame.width - (parentFrame.paddingLeft || 0) - (parentFrame.paddingRight || 0);
  return Math.round((percentage / 100) * availableWidth);
}

// Detect design width from HTML meta tags and CSS
function detectDesignWidth(htmlStr: string, cssRules: { [key: string]: any }): number | null {
  const DEFAULT_WIDTH = 1440;

  // 1. Check for meta tag: <meta name="figma-width" content="375">
  const widthMetaMatch = htmlStr.match(/<meta\s+name=["']figma-width["']\s+content=["'](\d+)["']/i);
  if (widthMetaMatch) {
    const width = parseInt(widthMetaMatch[1], 10);
    if (!isNaN(width) && width > 0) {
      console.log('[WIDTH] Detected from meta figma-width:', width);
      return width;
    }
  }

  // 2. Check for viewport preset: <meta name="figma-viewport" content="mobile">
  const viewportMetaMatch = htmlStr.match(/<meta\s+name=["']figma-viewport["']\s+content=["'](\w+)["']/i);
  if (viewportMetaMatch) {
    const preset = viewportMetaMatch[1].toLowerCase();
    if (VIEWPORT_PRESETS[preset]) {
      console.log('[WIDTH] Detected from meta figma-viewport:', preset, '=', VIEWPORT_PRESETS[preset]);
      return VIEWPORT_PRESETS[preset];
    }
  }

  // 3. Check for HTML comment: <!-- figma-width: 1920 -->
  const commentMatch = htmlStr.match(/<!--\s*figma-width:\s*(\d+)\s*-->/i);
  if (commentMatch) {
    const width = parseInt(commentMatch[1], 10);
    if (!isNaN(width) && width > 0) {
      console.log('[WIDTH] Detected from HTML comment:', width);
      return width;
    }
  }

  // 4. Check for max-width on container selectors from CSS
  for (const selector of CONTAINER_SELECTORS) {
    const rule = cssRules[selector];
    if (rule) {
      // Check max-width first (more reliable indicator of design width)
      if (rule['max-width']) {
        const maxWidth = parseSize(rule['max-width']);
        if (maxWidth && maxWidth > 0 && maxWidth < 3000) {
          console.log('[WIDTH] Detected from CSS max-width on', selector, ':', maxWidth);
          // Add typical padding/margins to container max-width for full page width
          // Most designs have ~20-40px padding on sides
          return maxWidth + 80; // Container + padding compensation
        }
      }

      // Check explicit width (non-percentage)
      if (rule['width'] && !rule['width'].includes('%')) {
        const width = parseSize(rule['width']);
        if (width && width > 100 && width < 3000) {
          console.log('[WIDTH] Detected from CSS width on', selector, ':', width);
          return width;
        }
      }
    }
  }

  // 5. No width detected, return null (caller will use default)
  console.log('[WIDTH] No explicit width detected, will use default');
  return null;
}

// parseMargin, parsePadding imported from ./utils/css-units
// parseBoxShadow, parseTransform, parseLinearGradient imported from ./utils/effects

function applyStylesToFrame(frame: FrameNode, styles: any) {

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
      // FIX: Create proper gradient fills with opacity support
      frame.fills = [{
        type: 'GRADIENT_LINEAR',
        gradientTransform: [
          [1, 0, 0],
          [0, 1, 0]
        ],
        gradientStops: gradient.gradientStops.map((stop: any) => ({
          position: stop.position,
          color: { r: stop.color.r, g: stop.color.g, b: stop.color.b, a: stop.color.a || 1 }
        }))
      }];
    } else if (gradient && gradient.fallbackColor) {
      // FIX: Use fallback color when gradient can't be fully parsed
      const fallbackRgba = hexToRgba(gradient.fallbackColor);
      if (fallbackRgba) {
        frame.fills = [{
          type: 'SOLID',
          color: { r: fallbackRgba.r, g: fallbackRgba.g, b: fallbackRgba.b },
          opacity: fallbackRgba.a
        }];
      }
    } else {
      // FIX: Try to extract any fallback color from the background string
      const fallbackColor = extractFallbackColor(styles['background']);
      if (fallbackColor) {
        const fallbackRgba = hexToRgba(fallbackColor);
        if (fallbackRgba) {
          frame.fills = [{
            type: 'SOLID',
            color: { r: fallbackRgba.r, g: fallbackRgba.g, b: fallbackRgba.b },
            opacity: fallbackRgba.a
          }];
        }
      }
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
  } else if (!hasExplicitBackground) {
    // FIXED: Explicitly set empty fills for elements without background CSS
    frame.fills = [];
  }

  // Width - Aplicar ancho según CSS
  if (styles.width) {
    let targetWidth = parseSize(styles.width);

    if (targetWidth && targetWidth > 0) {
      frame.resize(targetWidth, frame.height);
      frame.setPluginData('hasExplicitWidth', 'true');
    } else if (styles.width === '100%') {
      frame.setPluginData('hasExplicitWidth', 'true');
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
  } else if (styles['justify-content'] === 'space-evenly') {
    // Figma doesn't have SPACE_EVENLY, use SPACE_BETWEEN as closest approximation
    frame.primaryAxisAlignItems = 'SPACE_BETWEEN';
  }

  if (styles['align-items'] === 'center') {
    frame.counterAxisAlignItems = 'CENTER';
  } else if (styles['align-items'] === 'flex-start' || styles['align-items'] === 'start') {
    frame.counterAxisAlignItems = 'MIN';
  } else if (styles['align-items'] === 'flex-end' || styles['align-items'] === 'end') {
    frame.counterAxisAlignItems = 'MAX';
  } else if (styles['align-items'] === 'baseline') {
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
  
  // Font size - Figma requires fontSize >= 1
  const fontSize = parseSize(styles['font-size']);
  if (fontSize) {
    text.fontSize = Math.max(1, fontSize);
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

  // FIXED: white-space support
  if (styles['white-space']) {
    const whiteSpace = styles['white-space'];
    if (whiteSpace === 'nowrap' || whiteSpace === 'pre') {
      // No wrapping - use WIDTH_AND_HEIGHT to prevent line breaks
      text.textAutoResize = 'WIDTH_AND_HEIGHT';
    } else if (whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line') {
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
function reorderChildrenByZIndex(parentFrame: FrameNode) {
  try {
    const children = [...parentFrame.children];
    const childrenWithZIndex: { node: SceneNode, zIndex: number }[] = [];

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
  } catch (error) {
    console.error('Error reordering by z-index:', error);
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

// Grid utility functions imported from ./utils/grid
// (parseGridColumns, parseGridTemplateAreas, getGridRowCount, getGridColCount)

// Create grid layout using grid-template-areas
async function createGridLayoutWithAreas(
  children: any[],
  parentFrame: FrameNode,
  areaMap: { [key: string]: { rowStart: number, rowEnd: number, colStart: number, colEnd: number } },
  numRows: number,
  numCols: number,
  gap: number,
  inheritedStyles?: any
) {
  // Check if any area spans multiple rows (for height synchronization)
  const hasMultiRowSpans = Object.values(areaMap).some(bounds => (bounds.rowEnd - bounds.rowStart) > 1);

  // Create a 2D array to track which cells are occupied
  const grid: (FrameNode | null)[][] = [];
  for (let r = 0; r < numRows; r++) {
    grid[r] = new Array(numCols).fill(null);
  }

  // Create row frames
  const rowFrames: FrameNode[] = [];
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
      } catch (error) {}
    }
    rowFrames.push(rowFrame);
  }

  // Map children to their grid areas
  const childrenByArea: { [key: string]: any } = {};
  for (const child of children) {
    const gridArea = child.styles?.['grid-area'];
    if (gridArea && areaMap[gridArea]) {
      childrenByArea[gridArea] = child;
    }
  }

  // Process each unique area and place children
  const processedAreas = new Set<string>();

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      // Find which area this cell belongs to
      let cellArea: string | null = null;
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
        } catch (error) {}
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
            } catch (error) {}

            const gridInheritedStyles = { ...inheritedStyles, '_hasConstrainedWidth': true };
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
              } catch (error) {}
            }
          } else {
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
            } catch (error) {}

            // Pass flag to children to also use FILL vertical
            const gridInheritedStyles = {
              ...inheritedStyles,
              '_hasConstrainedWidth': true,
              '_shouldFillVertical': hasMultiRowSpans
            };
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
              } catch (error) {}
            }
          }
        } else {
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
          } catch (error) {}
        }
      } else if (!isFirstCellOfArea) {
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
            } catch (error) {}
          }
        }
        // Skip other cells in the span
      }
    }
  }
}

// Grid layout genérico para N columnas
async function createGridLayout(children: any[], parentFrame: FrameNode, columns: number, gap: number, inheritedStyles?: any) {
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
      } catch (error) {
        rowFrame.resize(Math.max(400, rowFrame.width), rowFrame.height);
      }
    }
    for (let j = 0; j < columns; j++) {
      if (children[i + j]) {
        // Grid items have constrained width (FILL layout)
        const gridInheritedStyles = { ...inheritedStyles, '_hasConstrainedWidth': true };
        await createFigmaNodesFromStructure([children[i + j]], rowFrame, 0, 0, gridInheritedStyles);
      }
    }
    // Hacer que los items llenen el espacio de la fila
    for (let k = 0; k < rowFrame.children.length; k++) {
      try {
        const child = rowFrame.children[k] as FrameNode;
        child.layoutGrow = 1;
        child.layoutSizingHorizontal = 'FILL';
        child.setPluginData('hasExplicitWidth', 'true');
      } catch (error) {}
    }
  }
}

async function createFigmaNodesFromStructure(structure: any[], parentFrame?: FrameNode, startX = 0, startY = 0, inheritedStyles?: any) {
  debugLog('[NODE CREATION] Starting createFigmaNodesFromStructure');
  debugLog('[NODE CREATION] Structure:', structure);
  debugLog('[NODE CREATION] ParentFrame:', parentFrame?.name || 'none');
  debugLog('[NODE CREATION] Structure length:', structure?.length || 0);
  
  for (const node of structure) {
    debugLog('[NODE CREATION] Processing node:', node.tagName, node.type);
    
    if (node.type === 'element') {
      // Skip script, style, and other non-visual elements
      if (['script', 'style', 'meta', 'link', 'title'].includes(node.tagName)) {
        continue;
      }

      // FIXED: Skip elements with display: none (don't render at all)
      if (node.styles?.display === 'none') {
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
      
      if (['body', 'div', 'section', 'article', 'nav', 'header', 'footer', 'main', 'aside', 'blockquote', 'figure', 'figcaption', 'address', 'details', 'summary'].includes(node.tagName)) {
        const frame = figma.createFrame();
        frame.name = node.tagName.toUpperCase() + ' Frame';
        
        // LAYOUT MODE: Aplicar display CSS directamente PRIMERO
        let layoutMode: 'HORIZONTAL' | 'VERTICAL' = 'VERTICAL';
        if (node.styles?.display === 'flex' || node.styles?.display === 'inline-flex') {
          // Flex direction: row = HORIZONTAL, column = VERTICAL
          layoutMode = node.styles?.['flex-direction'] === 'column' ? 'VERTICAL' : 'HORIZONTAL';
        } else if (node.styles?.display === 'grid') {
          // Keep vertical layout for grid - we'll handle 2x2 layout in child processing
          layoutMode = 'VERTICAL';
        } else if (node.styles?.display === 'inline' || node.styles?.display === 'inline-block') {
          // Inline elements: children flow horizontally
          layoutMode = 'HORIZONTAL';
        }

        // SIDEBAR PATTERN DETECTION: Si hay hijo con position:fixed/width + hijo con margin-left
        // Cambiar a HORIZONTAL para layout sidebar + contenido
        if (layoutMode === 'VERTICAL' && node.children && node.children.length >= 2) {
          const hasSidebar = node.children.some((child: any) => {
            const pos = child.styles?.position;
            const width = child.styles?.width;
            return (pos === 'fixed' || pos === 'absolute') && width && !width.includes('%');
          });
          const hasMainContent = node.children.some((child: any) => {
            const ml = child.styles?.['margin-left'];
            return ml && parseSize(ml) && parseSize(ml)! > 50;
          });
          if (hasSidebar && hasMainContent) {
            layoutMode = 'HORIZONTAL';
          }
        }

        frame.layoutMode = layoutMode;

        // FIXED: Support flex-wrap
        if (node.styles?.['flex-wrap'] === 'wrap' || node.styles?.['flex-wrap'] === 'wrap-reverse') {
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
        // BUT preserve FILL if _shouldFillVertical is set (for grid rows with multi-row spans)
        if (node.styles?.['max-width'] && !node.styles?.height && !inheritedStyles?.['_shouldFillVertical']) {
          // For containers with max-width but no explicit height, allow vertical growth
          frame.layoutSizingVertical = 'HUG';
        }

        // FIXED: Determine if element should fill width based on CSS display property
        // Block-level elements fill width, inline elements don't
        const display = node.styles?.display || 'block'; // Default is block for div
        const isInlineElement = display === 'inline' || display === 'inline-block' || display === 'inline-flex';
        const needsFullWidth = !isInlineElement; // Only block-level elements fill parent width
        
        // Remove early height filling - will do it after appendChild
        
        // Only apply default background if the element doesn't have any background AND it's not inside a gradient container
        const hasBackground = frame.fills && (frame.fills as Paint[]).length > 0;
        const isInsideGradientContainer = inheritedStyles?.['parent-has-gradient'];
        
        // Remove hardcoded backgrounds - let CSS handle all styling
        if (!hasBackground && !isInsideGradientContainer) {
          // Check if element has CSS background that should be applied
          const cssBackgroundColor = node.styles?.['background-color'] || node.styles?.['background'];
          if (cssBackgroundColor && cssBackgroundColor !== 'transparent') {
            const bgColor = hexToRgb(cssBackgroundColor);
            if (bgColor) {
              frame.fills = [{ type: 'SOLID', color: bgColor }];
            }
          } else {
            // FIXED: Explicitly set no background for elements without CSS background
            frame.fills = [];
          }
        }
        
        // Padding ONLY from CSS - no hardcoded defaults
        // FIXED: Use ?? instead of || to respect padding: 0
        const basePadding = parseSize(node.styles?.padding);

        const cssTopPadding = parseSize(node.styles?.['padding-top']) ?? basePadding ?? 0;
        const cssRightPadding = parseSize(node.styles?.['padding-right']) ?? basePadding ?? 0;
        const cssBottomPadding = parseSize(node.styles?.['padding-bottom']) ?? basePadding ?? 0;
        const cssLeftPadding = parseSize(node.styles?.['padding-left']) ?? basePadding ?? 0;
        
        frame.paddingTop = cssTopPadding;
        frame.paddingRight = cssRightPadding;
        frame.paddingBottom = cssBottomPadding;
        frame.paddingLeft = cssLeftPadding;
        
        // Set spacing: RESPETAR CSS gap (incluyendo gap: 0)
        let gap: number;
        if (node.styles?.gap !== undefined) {
          gap = parseSize(node.styles.gap) ?? 0;
        } else {
          gap = layoutMode === 'HORIZONTAL' ? 16 : 12;
        }
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

          // CRITICAL: Set FILL vertical AFTER appendChild (requires auto-layout parent)
          if (inheritedStyles?.['_shouldFillVertical'] && parentFrame.layoutMode !== 'NONE') {
            try {
              frame.layoutSizingVertical = 'FILL';
            } catch (e) {
              // Silently ignore if parent doesn't support FILL
            }
          }
        }

        // FIXED: Handle position: absolute/relative with top/left/right/bottom
        if (node.styles?.position === 'absolute' && parentFrame) {
          try {
            // In Figma, use absolute positioning within auto-layout
            frame.layoutPositioning = 'ABSOLUTE';

            // Apply top/left/right/bottom as constraints
            const top = parseSize(node.styles?.top);
            const left = parseSize(node.styles?.left);
            const right = parseSize(node.styles?.right);
            const bottom = parseSize(node.styles?.bottom);

            // Set position based on top/left
            if (top !== null) frame.y = top;
            if (left !== null) frame.x = left;

            // Set constraints based on which values are defined
            if (top !== null && bottom !== null) {
              frame.constraints = { vertical: 'STRETCH', horizontal: frame.constraints?.horizontal || 'MIN' };
            } else if (bottom !== null) {
              frame.constraints = { vertical: 'MAX', horizontal: frame.constraints?.horizontal || 'MIN' };
            } else if (top !== null) {
              frame.constraints = { vertical: 'MIN', horizontal: frame.constraints?.horizontal || 'MIN' };
            }

            if (left !== null && right !== null) {
              frame.constraints = { vertical: frame.constraints?.vertical || 'MIN', horizontal: 'STRETCH' };
            } else if (right !== null) {
              frame.constraints = { vertical: frame.constraints?.vertical || 'MIN', horizontal: 'MAX' };
            } else if (left !== null) {
              frame.constraints = { vertical: frame.constraints?.vertical || 'MIN', horizontal: 'MIN' };
            }
          } catch (error) {
            // Fallback: just position with x/y if absolute positioning fails
            console.error('Absolute positioning error:', error);
          }
        }

        // Apply sizing AFTER appendChild (proper timing)
        const widthValue = node.styles?.width;
        const heightValue = node.styles?.height;
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
            } catch (e) {
              // Fallback to calculated width
              const calculatedWidth = calculatePercentageWidth(widthValue, parentFrame);
              if (calculatedWidth && calculatedWidth > 0) {
                frame.resize(calculatedWidth, frame.height);
              }
            }
          } else {
            const calculatedWidth = calculatePercentageWidth(widthValue, parentFrame);
            if (calculatedWidth && calculatedWidth > 0) {
              frame.resize(calculatedWidth, frame.height);
              frame.layoutSizingHorizontal = 'FIXED';
            }
          }
        } else if (!hasExplicitDimensions && needsFullWidth && parentFrame && parentFrame.layoutMode !== 'NONE') {
          try {
            // FIX: In HORIZONTAL parent (flex row), children should HUG by default unless they have flex-grow
            // Only apply FILL in VERTICAL parent or if element has flex-grow/flex: 1
            const hasFlex = node.styles?.flex || node.styles?.['flex-grow'];
            const flexValue = node.styles?.flex;
            const flexGrowValue = node.styles?.['flex-grow'];
            const shouldFillHorizontal = parentFrame.layoutMode === 'VERTICAL' ||
                                         hasFlex === '1' || flexValue === '1' || flexGrowValue === '1' ||
                                         node.styles?.['margin-right'] === 'auto'; // margin-right: auto in flexbox

            if (shouldFillHorizontal) {
              frame.layoutSizingHorizontal = 'FILL';
            } else if (parentFrame.layoutMode === 'HORIZONTAL') {
              // In horizontal flex, children should HUG to their content
              frame.layoutSizingHorizontal = 'HUG';
            } else {
              frame.layoutSizingHorizontal = 'FILL';
            }

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

        // FIXED: Apply max-width, min-width, max-height, min-height from CSS
        const maxWidthValue = parseSize(node.styles?.['max-width']);
        const minWidthValue = parseSize(node.styles?.['min-width']);
        const maxHeightValue = parseSize(node.styles?.['max-height']);
        const minHeightValue = parseSize(node.styles?.['min-height']);

        if (maxWidthValue !== null && maxWidthValue > 0) {
          try {
            frame.maxWidth = maxWidthValue;
          } catch (error) {
            // Fallback: if maxWidth property doesn't exist, resize if needed
            if (frame.width > maxWidthValue) {
              frame.resize(maxWidthValue, frame.height);
            }
          }
        }

        if (minWidthValue !== null && minWidthValue > 0) {
          try {
            frame.minWidth = minWidthValue;
          } catch (error) {
            // Fallback: if minWidth property doesn't exist, resize if needed
            if (frame.width < minWidthValue) {
              frame.resize(minWidthValue, frame.height);
            }
          }
        }

        if (maxHeightValue !== null && maxHeightValue > 0) {
          try {
            frame.maxHeight = maxHeightValue;
          } catch (error) {
            // Fallback: if maxHeight property doesn't exist, resize if needed
            if (frame.height > maxHeightValue) {
              frame.resize(frame.width, maxHeightValue);
            }
          }
        }

        if (minHeightValue !== null && minHeightValue > 0) {
          try {
            frame.minHeight = minHeightValue;
          } catch (error) {
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
        const thisHasWidth = Boolean(node.styles?.width);
        const parentHadWidth = inheritedStyles?.['_hasConstrainedWidth'] === true;

        // FIX: In HORIZONTAL flex containers, children should NOT inherit width constraint
        // because flex row children size to their content, not to parent width
        const isHorizontalFlex = frame.layoutMode === 'HORIZONTAL';
        const shouldPropagateWidthConstraint = isHorizontalFlex ? thisHasWidth : (thisHasWidth || parentHadWidth);

        const inheritableStyles = {
          ...inheritedStyles,
          // CRITICAL: Propagate width constraint - but not through horizontal flex containers
          '_hasConstrainedWidth': shouldPropagateWidthConstraint,
          // CRITICAL: Propagate FILL vertical for grid rows with multi-row spans
          '_shouldFillVertical': inheritedStyles?.['_shouldFillVertical'],

          // TEXT PROPERTIES - CSS inherited properties
          color: node.styles?.color || inheritedStyles?.color,
          'font-family': node.styles?.['font-family'] || inheritedStyles?.['font-family'],
          'font-size': node.styles?.['font-size'] || inheritedStyles?.['font-size'],
          'font-weight': node.styles?.['font-weight'] || inheritedStyles?.['font-weight'],
          'font-style': node.styles?.['font-style'] || inheritedStyles?.['font-style'],
          'line-height': node.styles?.['line-height'] || inheritedStyles?.['line-height'],
          'text-align': node.styles?.['text-align'] || inheritedStyles?.['text-align'],
          'letter-spacing': node.styles?.['letter-spacing'] || inheritedStyles?.['letter-spacing'],
          'word-spacing': node.styles?.['word-spacing'] || inheritedStyles?.['word-spacing'],
          'text-transform': node.styles?.['text-transform'] || inheritedStyles?.['text-transform'],

          // FIXED: Don't inherit background/background-color - only pass info for gradient container detection
          'parent-has-gradient': (node.styles?.['background'] && node.styles['background'].includes('linear-gradient')) ||
                                (inheritedStyles?.['parent-has-gradient']),

          // Pass parent class name to help with styling decisions
          'parent-class': node.styles?.className || inheritedStyles?.['parent-class']
        };
        
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
              applyStylesToText(textNode, { ...inheritableStyles, ...node.styles });

              frame.appendChild(textNode);

              // For mixed content, use HUG so text sits inline with elements
              if (frame.layoutMode === 'HORIZONTAL') {
                textNode.layoutSizingHorizontal = 'HUG';
                textNode.textAutoResize = 'WIDTH_AND_HEIGHT';
              } else if (frame.layoutMode === 'VERTICAL') {
                textNode.layoutSizingHorizontal = 'FILL';
                textNode.textAutoResize = 'HEIGHT';
              } else {
                textNode.textAutoResize = 'WIDTH_AND_HEIGHT';
              }
            } else if (item.type === 'element' && item.node) {
              // Process element child in order
              await createFigmaNodesFromStructure([item.node], frame, 0, 0, inheritableStyles);
            }
          }
        } else {
          // Legacy behavior: Create text node if there's direct text content
          if (node.text && node.text.trim()) {
            await figma.loadFontAsync({ family: "Inter", style: "Regular" });
            const textNode = figma.createText();
            textNode.characters = node.text.trim();
            textNode.name = 'DIV Text';

            // Apply inherited styles and specific text styles
            applyStylesToText(textNode, { ...inheritableStyles, ...node.styles });

            frame.appendChild(textNode);

            // FIXED: Use FILL for text in auto-layout containers instead of hardcoded width
            // But if the parent is HORIZONTAL flex and this frame will HUG, text should expand naturally
            const parentIsHorizontal = parentFrame && parentFrame.layoutMode === 'HORIZONTAL';
            const frameHasNoExplicitWidth = !node.styles?.width;
            const frameWillHugHorizontal = parentIsHorizontal && frameHasNoExplicitWidth && !node.styles?.flex && !node.styles?.['flex-grow'];

            if (frameWillHugHorizontal) {
              // Parent is horizontal flex and this frame will HUG - text should size naturally
              textNode.textAutoResize = 'WIDTH_AND_HEIGHT';
            } else if (frame.layoutMode === 'HORIZONTAL' || frame.layoutMode === 'VERTICAL') {
              // Text should fill the container width and wrap
              textNode.layoutSizingHorizontal = 'FILL';
              textNode.textAutoResize = 'HEIGHT';
            } else {
              // No auto-layout: let text size naturally
              textNode.textAutoResize = 'WIDTH_AND_HEIGHT';
            }
          }

          // Process children if they exist
          if (node.children && node.children.length > 0) {
            // Manejo de grid genérico
            if (node.styles?.display === 'grid') {
              console.log('[GRID] Grid detected! Children:', node.children.length);
              const gridTemplateAreas = node.styles?.['grid-template-areas'];
              const gridTemplateColumns = node.styles?.['grid-template-columns'];
              console.log('[GRID] template-areas:', gridTemplateAreas);
              console.log('[GRID] template-columns:', gridTemplateColumns);
              const gap = parseSize(node.styles?.gap) || parseSize(parentFrame?.getPluginData('gridGap') || '') || 12;

              // Check if grid-template-areas is defined
              const areaMap = parseGridTemplateAreas(gridTemplateAreas);

              if (areaMap) {
                // Use grid-template-areas layout
                const numRows = getGridRowCount(gridTemplateAreas);
                const numCols = getGridColCount(gridTemplateAreas);
                await createGridLayoutWithAreas(node.children, frame, areaMap, numRows, numCols, gap, inheritableStyles);
              } else {
                // Fallback to column-based grid layout
                const columns = parseGridColumns(gridTemplateColumns);
                const finalColumns = columns > 0 ? columns : 2;
                await createGridLayout(node.children, frame, finalColumns, gap, inheritableStyles);
              }
            } else {
              await createFigmaNodesFromStructure(node.children, frame, 0, 0, inheritableStyles);
            }

            // FIXED: Reorder children by z-index after all children are created
            reorderChildrenByZIndex(frame);
          }
        }
        
        // FIXED: Store z-index for later reordering
        if (node.styles?.['z-index']) {
          const zIndex = parseInt(node.styles['z-index'], 10);
          if (!isNaN(zIndex)) {
            frame.setPluginData('zIndex', zIndex.toString());
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

        // FIXED: Apply align-self for individual item alignment within parent
        if (node.styles?.['align-self'] && parentFrame) {
          try {
            const alignSelf = node.styles['align-self'];
            if (alignSelf === 'center') {
              frame.layoutAlign = 'CENTER';
            } else if (alignSelf === 'flex-start' || alignSelf === 'start') {
              frame.layoutAlign = 'MIN';
            } else if (alignSelf === 'flex-end' || alignSelf === 'end') {
              frame.layoutAlign = 'MAX';
            } else if (alignSelf === 'stretch') {
              frame.layoutAlign = 'STRETCH';
            }
          } catch (error) {
            console.error('Error applying align-self:', error);
          }
        }

      } else if (node.tagName === 'form') {
        const form = figma.createFrame();
        form.name = 'FORM';
        form.fills = []; // FIXED: No hardcoded background - let CSS handle it
        form.layoutMode = 'VERTICAL';
        form.primaryAxisSizingMode = 'AUTO';
        form.counterAxisSizingMode = 'AUTO';

        // FIXED: Only apply default padding/spacing if no CSS values
        const basePadding = parseSize(node.styles?.padding);
        form.paddingLeft = parseSize(node.styles?.['padding-left']) ?? basePadding ?? 0;
        form.paddingRight = parseSize(node.styles?.['padding-right']) ?? basePadding ?? 0;
        form.paddingTop = parseSize(node.styles?.['padding-top']) ?? basePadding ?? 0;
        form.paddingBottom = parseSize(node.styles?.['padding-bottom']) ?? basePadding ?? 0;
        form.itemSpacing = parseSize(node.styles?.gap) ?? 0;

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

        // FIXED: Use CSS dimensions or auto-size
        const cellWidth = parseSize(node.styles?.width) || 100; // Reasonable default
        const cellHeight = parseSize(node.styles?.height) || 40;
        cell.resize(cellWidth, cellHeight);

        // FIXED: Use CSS background-color or transparent
        const bgColor = node.styles?.['background-color'] || node.styles?.background;
        if (bgColor && bgColor !== 'transparent') {
          const parsedBg = hexToRgb(bgColor);
          cell.fills = parsedBg ? [{ type: 'SOLID', color: parsedBg }] : [];
        } else {
          cell.fills = [];
        }

        // FIXED: Use CSS border or light default
        const borderColor = node.styles?.['border-color'];
        if (borderColor) {
          const parsedBorder = hexToRgb(borderColor);
          cell.strokes = parsedBorder ? [{ type: 'SOLID', color: parsedBorder }] : [];
        } else {
          cell.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        }
        cell.strokeWeight = parseSize(node.styles?.['border-width']) ?? 0.5;

        cell.name = node.tagName.toUpperCase();
        cell.layoutMode = 'HORIZONTAL';
        cell.primaryAxisAlignItems = 'CENTER';
        cell.counterAxisAlignItems = 'CENTER';

        // FIXED: Use CSS padding
        const basePadding = parseSize(node.styles?.padding);
        cell.paddingLeft = parseSize(node.styles?.['padding-left']) ?? basePadding ?? 8;
        cell.paddingRight = parseSize(node.styles?.['padding-right']) ?? basePadding ?? 8;
        cell.paddingTop = parseSize(node.styles?.['padding-top']) ?? basePadding ?? 4;
        cell.paddingBottom = parseSize(node.styles?.['padding-bottom']) ?? basePadding ?? 4;
        
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
        
        cellText.characters = textContent || '';

        // FIXED: Use CSS color or default to black, let CSS override
        const textColor = node.styles?.color;
        if (textColor) {
          const parsedColor = hexToRgb(textColor);
          cellText.fills = parsedColor ? [{ type: 'SOLID', color: parsedColor }] : [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
        } else {
          cellText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
        }

        // TH gets bold by default (browser behavior)
        if (node.tagName === 'th') {
          figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
            cellText.fontName = { family: "Inter", style: "Bold" };
          }).catch(() => {});
        }

        cell.appendChild(cellText);

        // Apply additional text styles from CSS
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
        const buttonWidth = parseSize(node.styles?.width) || Math.max(120, (node.text?.length || 6) * 12);
        const buttonHeight = parseSize(node.styles?.height) || 44;

        const frame = figma.createFrame();
        frame.resize(buttonWidth, buttonHeight);

        // FIXED: Use CSS background-color or default to transparent (browser default)
        const bgColor = node.styles?.['background-color'] || node.styles?.background;
        if (bgColor) {
          const parsedColor = hexToRgb(bgColor);
          if (parsedColor) {
            frame.fills = [{ type: 'SOLID', color: parsedColor }];
          } else {
            frame.fills = [];
          }
        } else {
          // Default button style - light gray like browser default
          frame.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        }

        // FIXED: Use CSS border-radius or default to small radius
        const borderRadius = parseSize(node.styles?.['border-radius']) ?? 4;
        frame.cornerRadius = borderRadius;
        frame.name = 'Button';

        // Enable auto-layout for centering
        frame.layoutMode = 'HORIZONTAL';
        frame.primaryAxisAlignItems = 'CENTER';
        frame.counterAxisAlignItems = 'CENTER';

        // FIXED: Use CSS padding or sensible defaults
        const basePadding = parseSize(node.styles?.padding);
        frame.paddingLeft = parseSize(node.styles?.['padding-left']) ?? basePadding ?? 16;
        frame.paddingRight = parseSize(node.styles?.['padding-right']) ?? basePadding ?? 16;
        frame.paddingTop = parseSize(node.styles?.['padding-top']) ?? basePadding ?? 8;
        frame.paddingBottom = parseSize(node.styles?.['padding-bottom']) ?? basePadding ?? 8;

        // Apply styles (including new CSS properties)
        if (node.styles) {
          applyStylesToFrame(frame, node.styles);
        }

        // Add button text
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        const buttonText = figma.createText();
        buttonText.characters = node.text || 'Button';

        // FIXED: Use CSS color or default to dark text (for light background default)
        const textColor = node.styles?.color;
        if (textColor) {
          const parsedTextColor = hexToRgb(textColor);
          if (parsedTextColor) {
            buttonText.fills = [{ type: 'SOLID', color: parsedTextColor }];
          } else {
            buttonText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
          }
        } else {
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
        
      } else if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a', 'label', 'strong', 'b', 'em', 'i', 'code', 'small', 'mark', 'del', 'ins', 'sub', 'sup', 'cite', 'q', 'abbr', 'time'].includes(node.tagName)) {

        // FIX: If text element has children but no direct text, process children instead
        const hasNoDirectText = !node.text || !node.text.trim();
        const hasChildren = node.children && node.children.length > 0;

        if (hasNoDirectText && hasChildren) {
          // Process children instead of creating empty text
          await createFigmaNodesFromStructure(node.children, parentFrame, startX, startY, inheritedStyles);
          continue; // Skip the rest of this element's processing
        }

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

        // Inline element styling - bold
        if (node.tagName === 'strong' || node.tagName === 'b') {
          try {
            await figma.loadFontAsync({ family: "Inter", style: "Bold" });
            text.fontName = { family: "Inter", style: "Bold" };
          } catch (e) {
            // Fallback: keep regular font
          }
        }

        // Inline element styling - italic
        if (node.tagName === 'em' || node.tagName === 'i' || node.tagName === 'cite') {
          try {
            await figma.loadFontAsync({ family: "Inter", style: "Italic" });
            text.fontName = { family: "Inter", style: "Italic" };
          } catch (e) {
            // Fallback: keep regular font
          }
        }

        // Inline element styling - code (monospace)
        if (node.tagName === 'code') {
          try {
            await figma.loadFontAsync({ family: "Roboto Mono", style: "Regular" });
            text.fontName = { family: "Roboto Mono", style: "Regular" };
          } catch (e) {
            // Fallback: keep regular font
          }
        }

        // Inline element styling - small
        if (node.tagName === 'small') {
          text.fontSize = Math.max(10, (text.fontSize as number) * 0.85);
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

          const parentHasAutoLayout = parentFrame.layoutMode === 'HORIZONTAL' || parentFrame.layoutMode === 'VERTICAL';
          const hasConstrainedWidth = inheritedStyles?.['_hasConstrainedWidth'] === true;

          if (parentHasAutoLayout) {
            if (hasConstrainedWidth) {
              // Inside width-constrained container → wrap
              text.layoutSizingHorizontal = 'FILL';
              text.textAutoResize = 'HEIGHT';
            } else {
              // No width constraint → expand freely
              text.textAutoResize = 'WIDTH_AND_HEIGHT';
            }
          } else {
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

// NEW: SSE status tracking for intelligent fallback
let sseConnected: boolean = false;
let sseLastSuccessTimestamp: number = 0;
let sseHeartbeatTimeout: any = null;

// Debug logs control (cleaned up for production)
var detailedLogsEnabled = false; // Set to true only for debugging
function debugLog(...args: any[]) {
  if (detailedLogsEnabled) {
    console.log(...args);
  }
}

// RequestID deduplication to prevent duplicate processing
const processedRequestIDs = new Set<string>();
const PROCESSED_IDS_MAX_SIZE = 1000; // Prevent memory leaks

function isRequestProcessed(requestId: string): boolean {
  return processedRequestIDs.has(requestId);
}

function markRequestProcessed(requestId: string): void {
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
async function readMCPSharedData(): Promise<any | null> {
  try {
    debugLog('[MCP] Reading MCP data from file system...');
    
    // Simple file-based reading via UI
    return new Promise((resolve) => {
      const handleFileResponse = (msg: any) => {
        if (msg.type === 'file-mcp-data-response') {
          figma.ui.off('message', handleFileResponse);
          if (msg.data) {
            debugLog('[MCP] Found data in file system:', msg.data);
            resolve(msg.data);
          } else {
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
    
  } catch (error) {
    console.log('[MCP] Error reading MCP data:', error);
    return null;
  }
}

// Delete shared data after processing (file-based)
async function deleteMCPSharedData(): Promise<boolean> {
  try {
    figma.ui.postMessage({ type: 'delete-file-mcp-data' });
    debugLog('[MCP] Requested deletion of MCP data file');
    return true;
  } catch (error) {
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
      } catch (error) {
        console.log('[MCP] Fallback check failed:', error);
      }
    } else {
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
    } else {
      results.push('⚠️ MCP FileSystem: Ready - no data yet');
    }
  } catch (error) {
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
    } else {
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

  // REMOVED: Let UI handle parse-mcp-html directly (it already works correctly)
  
  if (msg.type === 'mcp-html') {
    debugLog('[MCP] Recibido HTML vía MCP');
    try {
      figma.notify('Procesando HTML recibido vía MCP...');
      figma.ui.postMessage({ type: 'mcp-html-response', message: '✅ HTML recibido y procesado vía MCP.' });
      debugLog('[MCP] HTML procesado correctamente.');
    } catch (error: any) {
      figma.ui.postMessage({ type: 'mcp-html-response', message: '❌ Error procesando HTML vía MCP: ' + error.message });
      console.error('[MCP] Error procesando HTML vía MCP:', error);
    }
    return;
  }
  
  if (msg.type === 'html-structure') {
    console.log(`[HTML] Processing: ${msg.name || 'Unnamed'}`);
    debugLog('[MAIN HANDLER] Structure length:', msg.structure?.length || 0);
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

    // ✅ DESIGN WIDTH DETECTION: Use width detected by UI (from meta tags and CSS)
    const detectedDesignWidth: number | null = msg.detectedWidth || null;
    if (detectedDesignWidth) {
      // Update CSS_CONFIG.viewportWidth for vw calculations
      (CSS_CONFIG as any).viewportWidth = detectedDesignWidth;
      console.log('[WIDTH] Using detected width from UI:', detectedDesignWidth);
      console.log('[WIDTH] Updated CSS_CONFIG.viewportWidth to:', detectedDesignWidth);
    }

    // Detect full page layout pattern (sidebar + main content, grid layouts, etc.)
    const detectFullPageLayout = (structure: any[]): boolean => {
      if (!structure || structure.length === 0) return false;

      const checkNode = (node: any): boolean => {
        // Check for grid with grid-template-areas (complex layout = full page)
        if (node.styles?.display === 'grid' && node.styles?.['grid-template-areas']) {
          return true;
        }

        // Check for grid with multiple columns
        if (node.styles?.display === 'grid' && node.styles?.['grid-template-columns']) {
          const cols = parseGridColumns(node.styles['grid-template-columns']);
          if (cols >= 3) return true; // 3+ column grid = likely full page
        }

        // Check for body/html with padding (indicates designed layout)
        if ((node.tagName === 'body' || node.tagName === 'html') && node.styles?.padding) {
          const padding = parseSize(node.styles.padding);
          if (padding && padding >= 16) return true;
        }

        if (!node.children || node.children.length < 2) {
          // Still check single children recursively
          if (node.children) {
            for (const child of node.children) {
              if (checkNode(child)) return true;
            }
          }
          return false;
        }

        // Look for sidebar pattern: position fixed/absolute with fixed width
        const hasSidebar = node.children.some((child: any) => {
          const pos = child.styles?.position;
          const width = child.styles?.width;
          return (pos === 'fixed' || pos === 'absolute') && width && !width.includes('%');
        });

        // Look for main content with margin-left
        const hasMainContent = node.children.some((child: any) => {
          const ml = child.styles?.['margin-left'];
          return ml && parseSize(ml) && parseSize(ml)! > 50;
        });

        // Also detect 100vh height (full viewport)
        const hasFullHeight = node.styles?.height === '100vh' ||
                              node.styles?.['min-height'] === '100vh';

        if (hasSidebar && hasMainContent) return true;
        if (hasFullHeight) return true;

        // Recursively check children
        for (const child of node.children) {
          if (checkNode(child)) return true;
        }
        return false;
      };

      for (const node of structure) {
        if (checkNode(node)) return true;
      }
      return false;
    };

    const isFullPageLayout = detectFullPageLayout(msg.structure);
    const DEFAULT_PAGE_WIDTH = 1440; // Standard desktop width

    // Helper to calculate dynamic width based on layout structure
    const calculateDynamicWidth = (structure: any[]): number | null => {
      if (!structure || structure.length === 0) return null;

      let sidebarWidth = 0;
      let mainContentMargin = 0;
      let explicitWidth: number | null = null;

      const analyzeNode = (node: any, depth: number = 0): void => {
        // Check for explicit width on root elements
        if (depth <= 1 && node.styles?.width) {
          const width = parseSize(node.styles.width);
          if (width && width > 0 && !node.styles?.position?.includes('fixed')) {
            console.log('[WIDTH] Found explicit width:', width, 'on', node.tagName);
            explicitWidth = width;
          }
        }

        // Detect fixed sidebar with explicit width
        if (node.styles?.position === 'fixed' && node.styles?.width) {
          const width = parseSize(node.styles.width);
          if (width && width > 0) {
            sidebarWidth = Math.max(sidebarWidth, width);
            console.log('[WIDTH] Detected fixed sidebar width:', width);
          }
        }

        // Detect main content with margin-left (sidebar offset)
        if (node.styles?.['margin-left']) {
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
      if (explicitWidth) return explicitWidth;

      // If we detected sidebar + main content pattern, calculate total width
      // Main content should be ~1200px, so total = sidebar + 1200
      if (sidebarWidth > 0 && mainContentMargin > 0) {
        const calculatedWidth = sidebarWidth + 1200; // sidebar + reasonable main content width
        console.log('[WIDTH] Calculated width from sidebar pattern:', calculatedWidth);
        return calculatedWidth;
      }

      return null;
    };

    const structureWidth = calculateDynamicWidth(msg.structure);
    debugLog('[MAIN HANDLER] Full page layout detected:', isFullPageLayout);
    debugLog('[MAIN HANDLER] Detected design width (meta/CSS):', detectedDesignWidth);
    debugLog('[MAIN HANDLER] Structure-based width:', structureWidth);

    // Create a main container frame for all HTML content
    const mainContainer = figma.createFrame();
    const containerName = msg.fromMCP ? `${msg.name || 'MCP Import'}` : 'HTML Import Container';
    mainContainer.name = containerName;
    mainContainer.fills = []; // Sin fondo - el body lo controla

    // Enable auto-layout - el body controlará el layout interno
    mainContainer.layoutMode = 'VERTICAL';
    mainContainer.primaryAxisSizingMode = 'AUTO';

    // Determine container width priority:
    // 1. Meta tag / CSS detection (most reliable - explicit user intent)
    // 2. Structure-based detection (sidebar patterns, explicit widths)
    // 3. Full page layout default
    // 4. Auto (null)
    const containerWidth = detectedDesignWidth || structureWidth || (isFullPageLayout ? DEFAULT_PAGE_WIDTH : null);

    if (containerWidth) {
      mainContainer.counterAxisSizingMode = 'FIXED';
      mainContainer.resize(containerWidth, mainContainer.height);
      debugLog('[MAIN HANDLER] Set container width to:', containerWidth);
    } else {
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

