// ============================================
// Effects Utilities
// ============================================
// Functions for parsing CSS effects (shadows, transforms, gradients)

import { hexToRgb, hexToRgba, extractGradientColor, extractFallbackColor } from './colors';
import { parseSize } from './css-units';

export interface FigmaShadow {
  type: 'DROP_SHADOW' | 'INNER_SHADOW';
  offset: { x: number; y: number };
  radius: number;
  color: { r: number; g: number; b: number; a: number };
  blendMode: string;
  visible: boolean;
}

export interface TransformResult {
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  translateX?: number;
  translateY?: number;
}

export interface FilterResult {
  blur?: number;           // Layer blur radius in px
  dropShadow?: FigmaShadow; // Drop shadow from filter
}

export interface BackdropFilterResult {
  blur?: number;           // Background blur radius in px
}

export interface GradientStop {
  position: number;
  color: { r: number; g: number; b: number; a: number };
}

export interface GradientResult {
  gradientStops?: GradientStop[];
  fallbackColor?: string;
}

/**
 * Parse CSS box-shadow to Figma shadow effect
 * Example: "0 2px 12px rgba(44,62,80,0.08)"
 * Returns a Figma-compatible effect object (using any for compatibility with Figma API)
 */
export function parseBoxShadow(shadowValue: string): any | null {
  const match = shadowValue.match(/(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)?\s*(-?\d+(?:\.\d+)?(?:px)?)?\s*(rgba?\([^)]+\)|#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3})?/);

  if (match) {
    const offsetX = parseSize(match[1]) || 0;
    const offsetY = parseSize(match[2]) || 0;
    const blurRadius = parseSize(match[3]) || 0;
    const colorStr = match[5];

    let color = { r: 0, g: 0, b: 0, a: 0.25 }; // Default shadow color

    if (colorStr) {
      // If rgba, extract opacity
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

/**
 * Parse CSS transform property
 * Supports: rotate, scale, scaleX, scaleY, translate, translateX, translateY
 */
export function parseTransform(transformValue: string): TransformResult {
  const result: TransformResult = {};

  // Parse rotate (degrees) - Figma uses degrees directly
  const rotateMatch = transformValue.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/);
  if (rotateMatch) {
    result.rotation = parseFloat(rotateMatch[1]); // Keep in degrees for Figma
  }

  // Parse scale(x) or scale(x, y)
  const scaleMatch = transformValue.match(/scale\((-?\d+(?:\.\d+)?)\s*(?:,\s*(-?\d+(?:\.\d+)?))?\)/);
  if (scaleMatch) {
    result.scaleX = parseFloat(scaleMatch[1]);
    result.scaleY = scaleMatch[2] ? parseFloat(scaleMatch[2]) : result.scaleX;
  }

  // Parse scaleX
  const scaleXMatch = transformValue.match(/scaleX\((-?\d+(?:\.\d+)?)\)/);
  if (scaleXMatch) {
    result.scaleX = parseFloat(scaleXMatch[1]);
  }

  // Parse scaleY
  const scaleYMatch = transformValue.match(/scaleY\((-?\d+(?:\.\d+)?)\)/);
  if (scaleYMatch) {
    result.scaleY = parseFloat(scaleYMatch[1]);
  }

  // Parse translate(x, y) - supports px, rem, em, %
  const translateMatch = transformValue.match(/translate\(([^,)]+)(?:,\s*([^)]+))?\)/);
  if (translateMatch) {
    result.translateX = parseSize(translateMatch[1]) || 0;
    result.translateY = translateMatch[2] ? (parseSize(translateMatch[2]) || 0) : 0;
  }

  // Parse translateX
  const translateXMatch = transformValue.match(/translateX\(([^)]+)\)/);
  if (translateXMatch) {
    result.translateX = parseSize(translateXMatch[1]) || 0;
  }

  // Parse translateY
  const translateYMatch = transformValue.match(/translateY\(([^)]+)\)/);
  if (translateYMatch) {
    result.translateY = parseSize(translateYMatch[1]) || 0;
  }

  return result;
}

/**
 * Parse CSS linear-gradient to Figma gradient
 * Handles nested parentheses (rgba inside gradient)
 */
export function parseLinearGradient(gradientStr: string): GradientResult | null {
  try {
    if (!gradientStr || !gradientStr.includes('linear-gradient')) {
      return null;
    }

    // Find the start of linear-gradient and match balanced parentheses
    const startIndex = gradientStr.indexOf('linear-gradient(');
    if (startIndex === -1) return null;

    let depth = 0;
    let endIndex = startIndex + 16; // length of 'linear-gradient('

    for (let i = endIndex; i < gradientStr.length; i++) {
      if (gradientStr[i] === '(') depth++;
      else if (gradientStr[i] === ')') {
        if (depth === 0) {
          endIndex = i;
          break;
        }
        depth--;
      }
    }

    const content = gradientStr.substring(startIndex + 16, endIndex);

    // Split by comma but respect parentheses (don't split inside rgba())
    const parts: string[] = [];
    let current = '';
    let parenDepth = 0;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      if (char === '(') parenDepth++;
      else if (char === ')') parenDepth--;
      else if (char === ',' && parenDepth === 0) {
        parts.push(current.trim());
        current = '';
        continue;
      }
      current += char;
    }
    if (current.trim()) parts.push(current.trim());

    if (parts.length < 2) {
      return null;
    }

    const stops: GradientStop[] = [];
    let position = 0;

    // Skip first part if it's a direction (e.g., "90deg", "to right")
    let startIdx = 0;
    if (parts[0].includes('deg') || parts[0].includes('to ')) {
      startIdx = 1;
    }

    const colorParts = parts.slice(startIdx);
    const increment = colorParts.length > 1 ? 1 / (colorParts.length - 1) : 1;

    for (let i = 0; i < colorParts.length; i++) {
      const part = colorParts[i];
      const color = extractGradientColor(part);

      if (color) {
        const rgba = hexToRgba(color);
        if (rgba) {
          stops.push({
            position: position,
            color: { r: rgba.r, g: rgba.g, b: rgba.b, a: rgba.a }
          });
          position += increment;
        }
      }
    }

    if (stops.length >= 2) {
      // Ensure last stop is at position 1
      stops[stops.length - 1].position = 1;
      return { gradientStops: stops };
    }

    // If gradient parsing failed, try to extract fallback color
    const fallback = extractFallbackColor(gradientStr);
    if (fallback) {
      return { fallbackColor: fallback };
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Parse CSS filter property
 * Supports: blur(Npx), drop-shadow(x y blur color)
 */
export function parseFilter(filterValue: string): FilterResult {
  const result: FilterResult = {};

  if (!filterValue) return result;

  // Parse blur(Npx)
  const blurMatch = filterValue.match(/blur\((\d+(?:\.\d+)?)(px)?\)/);
  if (blurMatch) {
    result.blur = parseFloat(blurMatch[1]);
  }

  // Parse drop-shadow(x y blur color) or drop-shadow(x y blur spread color)
  const dropShadowMatch = filterValue.match(/drop-shadow\(([^)]+)\)/);
  if (dropShadowMatch) {
    const shadowParts = dropShadowMatch[1].trim();
    // Parse shadow parts: offsetX offsetY blur [spread] color
    const values = shadowParts.match(/(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s+(\d+(?:\.\d+)?(?:px)?)\s*(.*)/);
    if (values) {
      const offsetX = parseSize(values[1]) || 0;
      const offsetY = parseSize(values[2]) || 0;
      const blurRadius = parseSize(values[3]) || 0;
      const colorPart = values[4]?.trim() || 'rgba(0,0,0,0.5)';

      // Parse color
      let color = { r: 0, g: 0, b: 0, a: 0.5 };
      const rgba = hexToRgba(colorPart);
      if (rgba) {
        color = rgba;
      } else {
        const rgb = hexToRgb(colorPart);
        if (rgb) {
          color = { ...rgb, a: 1 };
        }
      }

      result.dropShadow = {
        type: 'DROP_SHADOW',
        offset: { x: offsetX, y: offsetY },
        radius: blurRadius,
        color,
        blendMode: 'NORMAL',
        visible: true
      };
    }
  }

  return result;
}

/**
 * Parse CSS backdrop-filter property
 * Supports: blur(Npx)
 */
export function parseBackdropFilter(filterValue: string): BackdropFilterResult {
  const result: BackdropFilterResult = {};

  if (!filterValue) return result;

  // Parse blur(Npx)
  const blurMatch = filterValue.match(/blur\((\d+(?:\.\d+)?)(px)?\)/);
  if (blurMatch) {
    result.blur = parseFloat(blurMatch[1]);
  }

  return result;
}

export interface ClipPathResult {
  type: 'inset' | 'circle' | 'ellipse' | 'polygon' | 'none';
  hasClip: boolean;
  // For inset: top, right, bottom, left values
  inset?: { top: number; right: number; bottom: number; left: number };
  // For circle: radius and optional center position
  circle?: { radius: number; radiusUnit: '%' | 'px'; centerX?: number; centerY?: number };
  // For ellipse: radiusX, radiusY and optional center
  ellipse?: { radiusX: number; radiusY: number; centerX?: number; centerY?: number };
}

/**
 * Parse CSS clip-path property
 * Supports: inset(), circle(), ellipse(), polygon() (detection only)
 * Note: Figma doesn't have direct clip-path support, but we can:
 * - Use clipsContent=true for basic clipping
 * - Create mask shapes for circle/ellipse (future enhancement)
 */
export function parseClipPath(clipPathValue: string): ClipPathResult {
  const result: ClipPathResult = { type: 'none', hasClip: false };

  if (!clipPathValue || clipPathValue === 'none') {
    return result;
  }

  // Parse inset(top right bottom left) or inset(all) or inset(vertical horizontal)
  const insetMatch = clipPathValue.match(/inset\(([^)]+)\)/);
  if (insetMatch) {
    result.type = 'inset';
    result.hasClip = true;

    const values = insetMatch[1].trim().split(/\s+/).map(v => parseFloat(v) || 0);

    if (values.length === 1) {
      result.inset = { top: values[0], right: values[0], bottom: values[0], left: values[0] };
    } else if (values.length === 2) {
      result.inset = { top: values[0], right: values[1], bottom: values[0], left: values[1] };
    } else if (values.length === 3) {
      result.inset = { top: values[0], right: values[1], bottom: values[2], left: values[1] };
    } else if (values.length >= 4) {
      result.inset = { top: values[0], right: values[1], bottom: values[2], left: values[3] };
    }

    return result;
  }

  // Parse circle(radius at centerX centerY) or circle(radius)
  const circleMatch = clipPathValue.match(/circle\((\d+(?:\.\d+)?)(%)?\s*(?:at\s+(\d+(?:\.\d+)?)(%)?\s+(\d+(?:\.\d+)?)(%)?)?\)/);
  if (circleMatch) {
    result.type = 'circle';
    result.hasClip = true;
    result.circle = {
      radius: parseFloat(circleMatch[1]),
      radiusUnit: circleMatch[2] === '%' ? '%' : 'px',
      centerX: circleMatch[3] ? parseFloat(circleMatch[3]) : 50,
      centerY: circleMatch[5] ? parseFloat(circleMatch[5]) : 50
    };
    return result;
  }

  // Parse ellipse(radiusX radiusY at centerX centerY)
  const ellipseMatch = clipPathValue.match(/ellipse\((\d+(?:\.\d+)?)(%)?\s+(\d+(?:\.\d+)?)(%)?\s*(?:at\s+(\d+(?:\.\d+)?)(%)?\s+(\d+(?:\.\d+)?)(%)?)?\)/);
  if (ellipseMatch) {
    result.type = 'ellipse';
    result.hasClip = true;
    result.ellipse = {
      radiusX: parseFloat(ellipseMatch[1]),
      radiusY: parseFloat(ellipseMatch[3]),
      centerX: ellipseMatch[5] ? parseFloat(ellipseMatch[5]) : 50,
      centerY: ellipseMatch[7] ? parseFloat(ellipseMatch[7]) : 50
    };
    return result;
  }

  // Detect polygon (complex to implement, just flag it)
  if (clipPathValue.includes('polygon(')) {
    result.type = 'polygon';
    result.hasClip = true;
    return result;
  }

  return result;
}
