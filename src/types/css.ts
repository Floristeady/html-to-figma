// ============================================
// CSS Types
// ============================================

export interface CSSVariables {
  [variableName: string]: string;
}

export interface CSSProperties {
  [property: string]: string;
}

export interface CSSRule {
  selector: string;
  properties: CSSProperties;
  specificity?: number;
}

export interface CSSRules {
  [selector: string]: CSSProperties;
}

export interface ComputedStyles {
  // Layout
  display?: string;
  flexDirection?: string;
  flexWrap?: string;
  justifyContent?: string;
  alignItems?: string;
  alignSelf?: string;
  flexGrow?: string;
  flexShrink?: string;
  flexBasis?: string;
  gap?: string;
  rowGap?: string;
  columnGap?: string;

  // Grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridTemplateAreas?: string;
  gridColumn?: string;
  gridRow?: string;
  gridArea?: string;

  // Positioning
  position?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: string;

  // Dimensions
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  boxSizing?: string;

  // Spacing
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;

  // Visual
  backgroundColor?: string;
  background?: string;
  color?: string;
  opacity?: string;
  visibility?: string;
  overflow?: string;
  overflowX?: string;
  overflowY?: string;

  // Borders
  border?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;

  // Effects
  boxShadow?: string;
  transform?: string;
  transformOrigin?: string;

  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  textDecoration?: string;
  textTransform?: string;
  whiteSpace?: string;
  textOverflow?: string;
  wordBreak?: string;
  wordWrap?: string;

  // Allow any other CSS property
  [property: string]: string | undefined;
}

// CSS Specificity calculation result
export interface SpecificityResult {
  selector: string;
  specificity: number;
  properties: CSSProperties;
}

// Viewport presets for responsive design
export interface ViewportPresets {
  [preset: string]: number;
}

// CSS configuration options
export interface CSSConfig {
  baseFontSize: number;
  viewportWidth: number;
  viewportHeight: number;
}
