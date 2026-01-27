// ============================================
// Parsed HTML Element Types
// ============================================

import { ComputedStyles } from './css';

export interface PseudoContent {
  before?: string;
  after?: string;
}

export interface MixedContentItem {
  type: 'text' | 'element';
  content?: string;       // For text nodes
  element?: ParsedElement; // For element nodes
}

export interface ElementAttributes {
  id?: string;
  class?: string;
  style?: string;
  src?: string;
  href?: string;
  alt?: string;
  title?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  name?: string;
  [key: string]: string | undefined;
}

export interface ParsedElement {
  type: 'element' | 'text';
  tagName?: string;
  text?: string;
  styles: ComputedStyles;
  children: ParsedElement[];
  mixedContent?: MixedContentItem[];
  pseudoContent?: PseudoContent;
  attributes?: ElementAttributes;
}

// Supported HTML tags that create frames
export const FRAME_TAGS = [
  'body', 'div', 'section', 'article', 'nav', 'header', 'footer',
  'main', 'aside', 'blockquote', 'figure', 'figcaption', 'address',
  'details', 'summary', 'form', 'fieldset'
] as const;

export type FrameTag = typeof FRAME_TAGS[number];

// Supported HTML tags that create text
export const TEXT_TAGS = [
  'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'em', 'b', 'i', 'a', 'code', 'pre', 'label',
  'small', 'sub', 'sup', 'mark', 'abbr', 'cite', 'q'
] as const;

export type TextTag = typeof TEXT_TAGS[number];

// Inline elements that don't force line breaks
export const INLINE_TAGS = [
  'span', 'a', 'strong', 'em', 'b', 'i', 'code', 'small',
  'sub', 'sup', 'mark', 'abbr', 'cite', 'q'
] as const;

export type InlineTag = typeof INLINE_TAGS[number];

// Block elements that force full width
export const BLOCK_TAGS = [
  'div', 'section', 'article', 'nav', 'header', 'footer',
  'main', 'aside', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'figure', 'figcaption', 'address',
  'details', 'summary', 'form', 'fieldset', 'pre'
] as const;

export type BlockTag = typeof BLOCK_TAGS[number];

// Elements that should be skipped during parsing
export const SKIP_TAGS = [
  'script', 'style', 'link', 'meta', 'head', 'title',
  'noscript', 'template'
] as const;

export type SkipTag = typeof SKIP_TAGS[number];

// CSS properties that inherit from parent
export const INHERITABLE_PROPERTIES = [
  'color',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'line-height',
  'letter-spacing',
  'text-align',
  'text-transform',
  'text-indent',
  'white-space',
  'word-spacing',
  'visibility',
  'cursor',
  'list-style',
  'list-style-type',
  'list-style-position'
] as const;

export type InheritableProperty = typeof INHERITABLE_PROPERTIES[number];

// Helper type guards
export function isFrameTag(tag: string): tag is FrameTag {
  return FRAME_TAGS.includes(tag as FrameTag);
}

export function isTextTag(tag: string): tag is TextTag {
  return TEXT_TAGS.includes(tag as TextTag);
}

export function isInlineTag(tag: string): tag is InlineTag {
  return INLINE_TAGS.includes(tag as InlineTag);
}

export function isBlockTag(tag: string): tag is BlockTag {
  return BLOCK_TAGS.includes(tag as BlockTag);
}

export function isSkipTag(tag: string): tag is SkipTag {
  return SKIP_TAGS.includes(tag as SkipTag);
}

export function isInheritableProperty(prop: string): prop is InheritableProperty {
  return INHERITABLE_PROPERTIES.includes(prop as InheritableProperty);
}
