// ============================================
// CSS Constants
// ============================================

import { CSSProperties, CSSVariables, CSSRules } from '../types';

// CSS properties that are not supported and should be filtered out
export const UNSUPPORTED_CSS_PROPERTIES = [
  'animation', 'animation-name', 'animation-duration', 'animation-timing-function',
  'animation-delay', 'animation-iteration-count', 'animation-direction',
  'animation-fill-mode', 'animation-play-state', 'transition', 'transition-property',
  'transition-duration', 'transition-timing-function', 'transition-delay', 'transform'
] as const;

// Supported content values for pseudo-elements (::before, ::after)
export const SUPPORTED_CONTENT: { [key: string]: string } = {
  '"📚"': '📚', '"💬"': '💬', '"🏛️"': '🏛️', '"⚽"': '⚽', '"🏠"': '🏠', '"👥"': '👥',
  '"📈"': '📈', '"📖"': '📖', '"★"': '★', '"•"': '•', '"→"': '→', '"←"': '←',
  '"▼"': '▼', '"▲"': '▲', '"✓"': '✓', '"✗"': '✗', '"💡"': '💡', '"🎯"': '🎯',
  '"📅"': '📅', '"🕐"': '🕐', '"⏱️"': '⏱️', '"📊"': '📊', '"📝"': '📝',
  '"🏟️"': '🏟️', '"📍"': '📍', '"🏢"': '🏢', '""': ''
};

// Viewport presets for responsive design width detection
export const VIEWPORT_PRESETS: { [key: string]: number } = {
  'mobile': 375,
  'tablet': 768,
  'desktop': 1440,
  'large': 1600,
  'wide': 1920
};

// Container selectors to check for design width detection
export const CONTAINER_SELECTORS = [
  '.container', '.wrapper', '.content', '.main', '.page',
  'main', 'body', 'html', '.app', '#app', '#root', '.layout'
] as const;

// Pseudo-selectors that are not supported
export const UNSUPPORTED_PSEUDO_SELECTORS = [
  ':hover', ':active', ':focus', ':visited',
  ':nth-child', ':first-child', ':last-child',
  ':nth-of-type', ':first-of-type', ':last-of-type',
  ':not', ':empty', ':checked', ':disabled', ':enabled'
] as const;
