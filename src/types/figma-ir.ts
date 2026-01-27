// ============================================
// Figma Intermediate Representation (IR)
// ============================================
// These interfaces define the intermediate data structure
// between parsed HTML and Figma nodes.

// --- Layout Types ---
export type LayoutMode = 'NONE' | 'HORIZONTAL' | 'VERTICAL';
export type LayoutWrap = 'NO_WRAP' | 'WRAP';
export type PrimaryAxisAlign = 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
export type CounterAxisAlign = 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'BASELINE';
export type LayoutAlign = 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'INHERIT';
export type SizingMode = 'FIXED' | 'HUG' | 'FILL';
export type LayoutPositioning = 'AUTO' | 'ABSOLUTE';

// --- Paint Types ---
export interface FigmaColor {
  r: number;  // 0-1
  g: number;  // 0-1
  b: number;  // 0-1
  a?: number; // 0-1, default 1
}

export interface SolidPaint {
  type: 'SOLID';
  color: FigmaColor;
  opacity?: number;
}

export interface GradientStop {
  position: number; // 0-1
  color: FigmaColor;
}

export interface GradientPaint {
  type: 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL';
  gradientStops: GradientStop[];
  gradientTransform?: number[][];
  opacity?: number;
}

export interface ImagePaint {
  type: 'IMAGE';
  imageHash: string;
  scaleMode: 'FILL' | 'FIT' | 'CROP' | 'TILE';
  opacity?: number;
}

export type Paint = SolidPaint | GradientPaint | ImagePaint;

// --- Node Types ---
export interface FigmaNodeBase {
  name: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  opacity?: number;
  visible?: boolean;
  layoutPositioning?: LayoutPositioning;
}

export interface FigmaFrameIR extends FigmaNodeBase {
  nodeType: 'FRAME';

  // Layout
  layoutMode: LayoutMode;
  layoutWrap?: LayoutWrap;
  primaryAxisAlignItems?: PrimaryAxisAlign;
  counterAxisAlignItems?: CounterAxisAlign;
  primaryAxisSizingMode?: SizingMode;
  counterAxisSizingMode?: SizingMode;

  // Spacing
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  itemSpacing?: number;
  counterAxisSpacing?: number;

  // Constraints
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;

  // Visual
  fills?: Paint[];
  strokes?: Paint[];
  strokeWeight?: number;
  cornerRadius?: number;
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomLeftRadius?: number;
  bottomRightRadius?: number;

  // Behavior
  clipsContent?: boolean;

  // Children
  children?: FigmaNodeIR[];
}

export interface FigmaTextIR extends FigmaNodeBase {
  nodeType: 'TEXT';
  characters: string;

  // Typography
  fontFamily?: string;
  fontStyle?: string;
  fontSize?: number;
  fontWeight?: number;
  lineHeight?: number | { value: number; unit: 'PIXELS' | 'PERCENT' | 'AUTO' };
  letterSpacing?: number;

  // Alignment
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';

  // Decoration
  textDecoration?: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';

  // Visual
  fills?: Paint[];
}

export interface FigmaRectangleIR extends FigmaNodeBase {
  nodeType: 'RECTANGLE';
  fills?: Paint[];
  strokes?: Paint[];
  strokeWeight?: number;
  cornerRadius?: number;
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomLeftRadius?: number;
  bottomRightRadius?: number;
}

export interface FigmaEllipseIR extends FigmaNodeBase {
  nodeType: 'ELLIPSE';
  fills?: Paint[];
  strokes?: Paint[];
  strokeWeight?: number;
}

export interface FigmaLineIR extends FigmaNodeBase {
  nodeType: 'LINE';
  strokes?: Paint[];
  strokeWeight?: number;
}

export type FigmaNodeIR =
  | FigmaFrameIR
  | FigmaTextIR
  | FigmaRectangleIR
  | FigmaEllipseIR
  | FigmaLineIR;
