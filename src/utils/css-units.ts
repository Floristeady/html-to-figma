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
 *
 * @param value - CSS size value
 * @param referenceWidth - Reference width for calc() percentage calculations
 */
export function parseSize(value: string, referenceWidth?: number): number | null {
  if (!value || value === 'auto' || value === 'inherit' || value === 'initial') return null;

  // Handle calc() expressions
  if (value.includes('calc(')) {
    return parseCalc(value, referenceWidth || CSS_CONFIG.viewportWidth);
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
 * Parse calc() expressions with mixed units
 * Handles: calc(100% - 50px), calc(50px + 20px), calc(100% / 3), calc(2rem * 3)
 *
 * @param value - CSS calc() expression
 * @param referenceWidth - Reference width for percentage calculations (default: 100)
 */
export function parseCalc(value: string, referenceWidth: number = 100): number | null {
  // Extract content inside calc() - handle nested parentheses
  const match = value.match(/calc\((.+)\)$/);
  if (!match) return null;

  let expression = match[1].trim();

  // Helper: convert a single value with unit to pixels
  const toPixels = (val: string): number | null => {
    val = val.trim();

    // Percentage
    if (val.endsWith('%')) {
      const pct = parseFloat(val);
      return isNaN(pct) ? null : (pct / 100) * referenceWidth;
    }

    // Pixels
    if (val.endsWith('px')) {
      const px = parseFloat(val);
      return isNaN(px) ? null : px;
    }

    // REM
    if (val.endsWith('rem')) {
      const rem = parseFloat(val);
      return isNaN(rem) ? null : rem * CSS_CONFIG.remBase;
    }

    // EM (treat as rem for simplicity)
    if (val.endsWith('em')) {
      const em = parseFloat(val);
      return isNaN(em) ? null : em * CSS_CONFIG.remBase;
    }

    // VW
    if (val.endsWith('vw')) {
      const vw = parseFloat(val);
      return isNaN(vw) ? null : (vw / 100) * CSS_CONFIG.viewportWidth;
    }

    // VH
    if (val.endsWith('vh')) {
      const vh = parseFloat(val);
      return isNaN(vh) ? null : (vh / 100) * CSS_CONFIG.viewportHeight;
    }

    // Plain number (assume pixels)
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
  };

  // Tokenize the expression: split into numbers with units and operators
  // Match: number with optional unit, or operator (+, -, *, /)
  const tokens: string[] = [];
  const tokenRegex = /([+-]?\d*\.?\d+(?:px|%|rem|em|vw|vh)?)|([+\-*/])/g;
  let tokenMatch;

  while ((tokenMatch = tokenRegex.exec(expression)) !== null) {
    const token = (tokenMatch[1] || tokenMatch[2]).trim();
    if (token) tokens.push(token);
  }

  if (tokens.length === 0) return null;

  // Convert all values to pixels first
  const values: (number | string)[] = [];
  for (const token of tokens) {
    if (['+', '-', '*', '/'].includes(token)) {
      values.push(token);
    } else {
      const px = toPixels(token);
      if (px === null) return null;
      values.push(px);
    }
  }

  // Evaluate: first pass for * and /
  const afterMultDiv: (number | string)[] = [];
  let i = 0;
  while (i < values.length) {
    if (values[i] === '*' || values[i] === '/') {
      const left = afterMultDiv.pop() as number;
      const right = values[i + 1] as number;
      if (values[i] === '*') {
        afterMultDiv.push(left * right);
      } else {
        afterMultDiv.push(right !== 0 ? left / right : 0);
      }
      i += 2;
    } else {
      afterMultDiv.push(values[i]);
      i++;
    }
  }

  // Second pass for + and -
  let result = afterMultDiv[0] as number;
  i = 1;
  while (i < afterMultDiv.length) {
    const op = afterMultDiv[i] as string;
    const val = afterMultDiv[i + 1] as number;
    if (op === '+') {
      result += val;
    } else if (op === '-') {
      result -= val;
    }
    i += 2;
  }

  return Math.round(result * 100) / 100; // Round to 2 decimal places
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
