// ============================================
// Color Utilities
// ============================================
// Functions for parsing and converting CSS colors to Figma format

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBA extends RGB {
  a: number;
}

// CSS color keywords mapped to Figma RGB (0-1 range)
export const COLOR_KEYWORDS: { [key: string]: RGB } = {
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

/**
 * Parse a CSS color string to Figma RGB format (0-1 range)
 * Supports: hex (#fff, #ffffff), rgb(), rgba(), color keywords
 */
export function hexToRgb(color: string): RGB | null {
  // Guard against null/undefined
  if (!color) return null;

  const lowerColor = color.toLowerCase().trim();

  // Check for color keywords first
  if (COLOR_KEYWORDS[lowerColor]) {
    return COLOR_KEYWORDS[lowerColor];
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

  // Handle hexadecimal colors (6 digits)
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

/**
 * Parse a CSS color string to Figma RGBA format (0-1 range)
 * Returns alpha channel (defaults to 1, except for 'transparent')
 */
export function hexToRgba(color: string): RGBA | null {
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

/**
 * Extract color from a border shorthand value
 * Example: "1px solid #333" → "#333"
 */
export function extractBorderColor(borderValue: string): string | null {
  if (!borderValue) return null;

  // Try to find a color in the border value
  const hexMatch = borderValue.match(/#[0-9a-fA-F]{3,6}/);
  if (hexMatch) return hexMatch[0];

  const rgbMatch = borderValue.match(/rgba?\([^)]+\)/i);
  if (rgbMatch) return rgbMatch[0];

  // Check for color keywords
  const parts = borderValue.split(/\s+/);
  for (const part of parts) {
    if (COLOR_KEYWORDS[part.toLowerCase()]) {
      return part;
    }
  }

  return null;
}

/**
 * Extract the first color from a gradient string
 * Example: "linear-gradient(to right, #ff0000, #00ff00)" → "#ff0000"
 */
export function extractGradientColor(bg: string): string | null {
  if (!bg) return null;

  const hexMatch = bg.match(/#[0-9a-fA-F]{3,6}/);
  if (hexMatch) return hexMatch[0];

  const rgbMatch = bg.match(/rgba?\([^)]+\)/i);
  if (rgbMatch) return rgbMatch[0];

  return null;
}

/**
 * Extract fallback color from a background string
 * Handles gradients with fallback colors, images, and solid colors
 * e.g., "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), #e5e5e5" -> "#e5e5e5"
 */
export function extractFallbackColor(bgStr: string): string | null {
  if (!bgStr) return null;

  // Look for color after the gradient (after the last closing paren of gradient)
  // Pattern: ...gradient(...)), COLOR
  const afterGradient = bgStr.match(/\)\s*\)\s*,\s*(#[a-fA-F0-9]{3,6}|rgba?\([^)]+\)|[a-z]+)/i);
  if (afterGradient) {
    return afterGradient[1];
  }

  // Also try simpler pattern: gradient(...), COLOR
  const simpleMatch = bgStr.match(/gradient\([^)]+\)\s*,\s*(#[a-fA-F0-9]{3,6})/i);
  if (simpleMatch) {
    return simpleMatch[1];
  }

  // If it's a gradient without fallback, extract the first color
  if (bgStr.includes('gradient')) {
    return extractGradientColor(bgStr);
  }

  // If it's a url (image), return null
  if (bgStr.includes('url(')) {
    return null;
  }

  // Otherwise, try to parse as color
  const rgb = hexToRgb(bgStr);
  if (rgb) return bgStr;

  return null;
}
