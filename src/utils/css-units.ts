// ============================================
// CSS Units Utilities
// ============================================
// Functions for parsing CSS units and values

export interface BoxSpacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Configuration for unit conversion
export const CSS_CONFIG = {
  remBase: 16,         // 1rem = 16px (browser default)
  viewportHeight: 900, // 100vh = 900px (reasonable desktop height)
  viewportWidth: 1440  // 100vw = 1440px (reasonable desktop width)
};

/**
 * Parse a CSS size value to pixels
 * Supports: px, rem, em, vh, vw, calc(), percentages
 */
export function parseSize(value: string): number | null {
  if (!value || value === 'auto' || value === 'inherit' || value === 'initial') return null;

  // Handle calc() expressions
  if (value.includes('calc(')) {
    return parseCalc(value);
  }

  // Handle percentage values for border-radius specially
  if (value.includes('%')) {
    // For border-radius: 50%, return special value for "make it circular"
    if (value === '50%') {
      return 999; // Special marker for circular
    }
    return null; // Other percentages handled by special logic
  }

  // Handle rem units (relative to root font-size, default 16px)
  if (value.includes('rem')) {
    const remValue = parseFloat(value);
    if (!isNaN(remValue)) {
      return remValue * CSS_CONFIG.remBase;
    }
    return null;
  }

  // Handle em units (treat same as rem for simplicity)
  if (value.includes('em') && !value.includes('rem')) {
    const emValue = parseFloat(value);
    if (!isNaN(emValue)) {
      return emValue * CSS_CONFIG.remBase;
    }
    return null;
  }

  // Handle viewport height units (vh)
  if (value.includes('vh')) {
    const vhValue = parseFloat(value);
    if (!isNaN(vhValue)) {
      return (vhValue / 100) * CSS_CONFIG.viewportHeight;
    }
    return null;
  }

  // Handle viewport width units (vw)
  if (value.includes('vw')) {
    const vwValue = parseFloat(value);
    if (!isNaN(vwValue)) {
      return (vwValue / 100) * CSS_CONFIG.viewportWidth;
    }
    return null;
  }

  const numericValue = parseFloat(value);
  return isNaN(numericValue) ? null : numericValue;
}

/**
 * Parse calc() expressions
 * Handles simple cases like calc(100px - 20px), calc(50% - 10px)
 */
export function parseCalc(value: string): number | null {
  // Extract content inside calc()
  const match = value.match(/calc\(([^)]+)\)/);
  if (!match) return null;

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
      if (parts[0].includes('px')) return parseFloat(parts[0]);
      if (parts[2].includes('px')) return parseFloat(parts[2]);
      return null;
    }

    if (operator === '+') return left + right;
    if (operator === '-') return left - right;
  }

  // For complex expressions, try to extract first numeric value
  const numMatch = expression.match(/(\d+(?:\.\d+)?)\s*px/);
  if (numMatch) return parseFloat(numMatch[1]);

  return null;
}

/**
 * Parse percentage values
 * Returns the numeric percentage value (e.g., "50%" -> 50)
 */
export function parsePercentage(value: string): number | null {
  if (!value || !value.includes('%')) return null;
  const match = value.match(/^([0-9.]+)%$/);
  if (match) {
    return parseFloat(match[1]);
  }
  return null;
}

/**
 * Parse CSS margin shorthand
 * Supports 1, 2, 3, or 4 value syntax
 */
export function parseMargin(marginValue: string): BoxSpacing {
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

/**
 * Parse CSS padding shorthand
 * Supports 1, 2, 3, or 4 value syntax
 */
export function parsePadding(paddingValue: string): BoxSpacing {
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
