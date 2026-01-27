"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

  // src/utils/colors.ts
  var COLOR_KEYWORDS = {
    "white": { r: 1, g: 1, b: 1 },
    "black": { r: 0, g: 0, b: 0 },
    "red": { r: 1, g: 0, b: 0 },
    "green": { r: 0, g: 0.5, b: 0 },
    "blue": { r: 0, g: 0, b: 1 },
    "yellow": { r: 1, g: 1, b: 0 },
    "cyan": { r: 0, g: 1, b: 1 },
    "magenta": { r: 1, g: 0, b: 1 },
    "orange": { r: 1, g: 0.647, b: 0 },
    "purple": { r: 0.5, g: 0, b: 0.5 },
    "pink": { r: 1, g: 0.753, b: 0.796 },
    "brown": { r: 0.647, g: 0.165, b: 0.165 },
    "gray": { r: 0.5, g: 0.5, b: 0.5 },
    "grey": { r: 0.5, g: 0.5, b: 0.5 },
    "lightgray": { r: 0.827, g: 0.827, b: 0.827 },
    "lightgrey": { r: 0.827, g: 0.827, b: 0.827 },
    "darkgray": { r: 0.663, g: 0.663, b: 0.663 },
    "darkgrey": { r: 0.663, g: 0.663, b: 0.663 },
    "lightblue": { r: 0.678, g: 0.847, b: 1 },
    "lightgreen": { r: 0.565, g: 0.933, b: 0.565 },
    "lightcyan": { r: 0.878, g: 1, b: 1 },
    "lightyellow": { r: 1, g: 1, b: 0.878 },
    "lightpink": { r: 1, g: 0.714, b: 0.757 },
    "darkred": { r: 0.545, g: 0, b: 0 },
    "darkblue": { r: 0, g: 0, b: 0.545 },
    "darkgreen": { r: 0, g: 0.392, b: 0 },
    "transparent": { r: 0, g: 0, b: 0 }
  };
  function hexToRgb(color) {
    if (!color) return null;
    const lowerColor = color.toLowerCase().trim();
    if (COLOR_KEYWORDS[lowerColor]) {
      return COLOR_KEYWORDS[lowerColor];
    }
    const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]) / 255,
        g: parseInt(rgbMatch[2]) / 255,
        b: parseInt(rgbMatch[3]) / 255
      };
    }
    const rgbaMatch = color.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/i);
    if (rgbaMatch) {
      return {
        r: parseInt(rgbaMatch[1]) / 255,
        g: parseInt(rgbaMatch[2]) / 255,
        b: parseInt(rgbaMatch[3]) / 255
      };
    }
    const hexResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (hexResult) {
      return {
        r: parseInt(hexResult[1], 16) / 255,
        g: parseInt(hexResult[2], 16) / 255,
        b: parseInt(hexResult[3], 16) / 255
      };
    }
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
  function hexToRgba(color) {
    const rgb = hexToRgb(color);
    if (!rgb) return null;
    const rgbaMatch = color.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/i);
    if (rgbaMatch) {
      return {
        r: parseInt(rgbaMatch[1]) / 255,
        g: parseInt(rgbaMatch[2]) / 255,
        b: parseInt(rgbaMatch[3]) / 255,
        a: parseFloat(rgbaMatch[4])
      };
    }
    if (color.toLowerCase().trim() === "transparent") {
      return { r: 0, g: 0, b: 0, a: 0 };
    }
    return __spreadProps(__spreadValues({}, rgb), { a: 1 });
  }
  function extractBorderColor(borderValue) {
    if (!borderValue) return null;
    const hexMatch = borderValue.match(/#[0-9a-fA-F]{3,6}/);
    if (hexMatch) return hexMatch[0];
    const rgbMatch = borderValue.match(/rgba?\([^)]+\)/i);
    if (rgbMatch) return rgbMatch[0];
    const parts = borderValue.split(/\s+/);
    for (const part of parts) {
      if (COLOR_KEYWORDS[part.toLowerCase()]) {
        return part;
      }
    }
    return null;
  }
  function extractGradientColor(bg) {
    if (!bg) return null;
    const hexMatch = bg.match(/#[0-9a-fA-F]{3,6}/);
    if (hexMatch) return hexMatch[0];
    const rgbMatch = bg.match(/rgba?\([^)]+\)/i);
    if (rgbMatch) return rgbMatch[0];
    return null;
  }
  function extractFallbackColor(bgStr) {
    if (!bgStr) return null;
    const afterGradient = bgStr.match(/\)\s*\)\s*,\s*(#[a-fA-F0-9]{3,6}|rgba?\([^)]+\)|[a-z]+)/i);
    if (afterGradient) {
      return afterGradient[1];
    }
    const simpleMatch = bgStr.match(/gradient\([^)]+\)\s*,\s*(#[a-fA-F0-9]{3,6})/i);
    if (simpleMatch) {
      return simpleMatch[1];
    }
    if (bgStr.includes("gradient")) {
      return extractGradientColor(bgStr);
    }
    if (bgStr.includes("url(")) {
      return null;
    }
    const rgb = hexToRgb(bgStr);
    if (rgb) return bgStr;
    return null;
  }

  // src/utils/css-units.ts
  var CSS_CONFIG = {
    remBase: 16,
    // 1rem = 16px (browser default)
    viewportHeight: 900,
    // 100vh = 900px (reasonable desktop height)
    viewportWidth: 1440
    // 100vw = 1440px (reasonable desktop width)
  };
  function parseSize(value) {
    if (!value || value === "auto" || value === "inherit" || value === "initial") return null;
    if (value.includes("calc(")) {
      return parseCalc(value);
    }
    if (value.includes("%")) {
      if (value === "50%") {
        return 999;
      }
      return null;
    }
    if (value.includes("rem")) {
      const remValue = parseFloat(value);
      if (!isNaN(remValue)) {
        return remValue * CSS_CONFIG.remBase;
      }
      return null;
    }
    if (value.includes("em") && !value.includes("rem")) {
      const emValue = parseFloat(value);
      if (!isNaN(emValue)) {
        return emValue * CSS_CONFIG.remBase;
      }
      return null;
    }
    if (value.includes("vh")) {
      const vhValue = parseFloat(value);
      if (!isNaN(vhValue)) {
        return vhValue / 100 * CSS_CONFIG.viewportHeight;
      }
      return null;
    }
    if (value.includes("vw")) {
      const vwValue = parseFloat(value);
      if (!isNaN(vwValue)) {
        return vwValue / 100 * CSS_CONFIG.viewportWidth;
      }
      return null;
    }
    const numericValue = parseFloat(value);
    return isNaN(numericValue) ? null : numericValue;
  }
  function parseCalc(value) {
    const match = value.match(/calc\(([^)]+)\)/);
    if (!match) return null;
    const expression = match[1].trim();
    const parts = expression.split(/\s*([+-])\s*/);
    if (parts.length === 1) {
      return parseFloat(parts[0]) || null;
    }
    if (parts.length === 3) {
      const left = parseFloat(parts[0]);
      const operator = parts[1];
      const right = parseFloat(parts[2]);
      if (isNaN(left) || isNaN(right)) {
        if (parts[0].includes("px")) return parseFloat(parts[0]);
        if (parts[2].includes("px")) return parseFloat(parts[2]);
        return null;
      }
      if (operator === "+") return left + right;
      if (operator === "-") return left - right;
    }
    const numMatch = expression.match(/(\d+(?:\.\d+)?)\s*px/);
    if (numMatch) return parseFloat(numMatch[1]);
    return null;
  }
  function parsePercentage(value) {
    if (!value || !value.includes("%")) return null;
    const match = value.match(/^([0-9.]+)%$/);
    if (match) {
      return parseFloat(match[1]);
    }
    return null;
  }
  function parseMargin(marginValue) {
    const values = marginValue.split(" ").map((v) => parseSize(v) || 0);
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
  function parsePadding(paddingValue) {
    const values = paddingValue.split(" ").map((v) => parseSize(v) || 0);
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

  // src/code.ts
  figma.showUI(__html__, { width: 360, height: 380 });
  function calculatePercentageWidth(widthValue, parentFrame) {
    if (!parentFrame || !widthValue) return null;
    const percentage = parsePercentage(widthValue);
    if (percentage === null) return null;
    const availableWidth = parentFrame.width - (parentFrame.paddingLeft || 0) - (parentFrame.paddingRight || 0);
    return Math.round(percentage / 100 * availableWidth);
  }
  function parseBoxShadow(shadowValue) {
    const match = shadowValue.match(/(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)?\s*(-?\d+(?:\.\d+)?(?:px)?)?\s*(rgba?\([^)]+\)|#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3})?/);
    if (match) {
      const offsetX = parseSize(match[1]) || 0;
      const offsetY = parseSize(match[2]) || 0;
      const blurRadius = parseSize(match[3]) || 0;
      const colorStr = match[5];
      let color = { r: 0, g: 0, b: 0, a: 0.25 };
      if (colorStr) {
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
            color = __spreadProps(__spreadValues({}, rgb), { a: 0.25 });
          }
        }
      }
      return {
        type: "DROP_SHADOW",
        offset: { x: offsetX, y: offsetY },
        radius: blurRadius,
        color,
        blendMode: "NORMAL",
        visible: true
      };
    }
    return null;
  }
  function parseTransform(transformValue) {
    const result = {};
    const rotateMatch = transformValue.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/);
    if (rotateMatch) {
      result.rotation = parseFloat(rotateMatch[1]) * (Math.PI / 180);
    }
    const scaleMatch = transformValue.match(/scale\((\d+(?:\.\d+)?)\)/);
    if (scaleMatch) {
      result.scaleX = result.scaleY = parseFloat(scaleMatch[1]);
    }
    const scaleXMatch = transformValue.match(/scaleX\((\d+(?:\.\d+)?)\)/);
    if (scaleXMatch) {
      result.scaleX = parseFloat(scaleXMatch[1]);
    }
    const scaleYMatch = transformValue.match(/scaleY\((\d+(?:\.\d+)?)\)/);
    if (scaleYMatch) {
      result.scaleY = parseFloat(scaleYMatch[1]);
    }
    const translateMatch = transformValue.match(/translate\((-?\d+(?:\.\d+)?px),\s*(-?\d+(?:\.\d+)?px)\)/);
    if (translateMatch) {
      result.translateX = parseSize(translateMatch[1]) || 0;
      result.translateY = parseSize(translateMatch[2]) || 0;
    }
    return result;
  }
  function parseLinearGradient(gradientStr) {
    try {
      if (!gradientStr || !gradientStr.includes("linear-gradient")) {
        return null;
      }
      const startIndex = gradientStr.indexOf("linear-gradient(");
      if (startIndex === -1) return null;
      let depth = 0;
      let endIndex = startIndex + 16;
      for (let i = endIndex; i < gradientStr.length; i++) {
        if (gradientStr[i] === "(") depth++;
        else if (gradientStr[i] === ")") {
          if (depth === 0) {
            endIndex = i;
            break;
          }
          depth--;
        }
      }
      const content = gradientStr.substring(startIndex + 16, endIndex);
      const parts = [];
      let current = "";
      let parenDepth = 0;
      for (let i = 0; i < content.length; i++) {
        const char = content[i];
        if (char === "(") parenDepth++;
        else if (char === ")") parenDepth--;
        else if (char === "," && parenDepth === 0) {
          parts.push(current.trim());
          current = "";
          continue;
        }
        current += char;
      }
      if (current.trim()) parts.push(current.trim());
      if (parts.length < 2) {
        return null;
      }
      const stops = [];
      let position = 0;
      let startIdx = 0;
      if (parts[0].includes("deg") || parts[0].includes("to ")) {
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
              position,
              color: { r: rgba.r, g: rgba.g, b: rgba.b, a: rgba.a }
            });
            position += increment;
          }
        }
      }
      if (stops.length >= 2) {
        stops[stops.length - 1].position = 1;
        return { gradientStops: stops };
      }
      const fallback = extractFallbackColor(gradientStr);
      if (fallback) {
        return { fallbackColor: fallback };
      }
      return null;
    } catch (error) {
      return null;
    }
  }
  function applyStylesToFrame(frame, styles) {
    if (styles["visibility"] === "hidden") {
      frame.opacity = 0;
    }
    const hasExplicitBackground = styles["background"] || styles["background-color"];
    if (styles["background"] && styles["background"].includes("linear-gradient")) {
      const gradient = parseLinearGradient(styles["background"]);
      if (gradient && gradient.gradientStops && gradient.gradientStops.length >= 2) {
        frame.fills = [{
          type: "GRADIENT_LINEAR",
          gradientTransform: [
            [1, 0, 0],
            [0, 1, 0]
          ],
          gradientStops: gradient.gradientStops.map((stop) => ({
            position: stop.position,
            color: { r: stop.color.r, g: stop.color.g, b: stop.color.b, a: stop.color.a || 1 }
          }))
        }];
      } else if (gradient && gradient.fallbackColor) {
        const fallbackRgba = hexToRgba(gradient.fallbackColor);
        if (fallbackRgba) {
          frame.fills = [{
            type: "SOLID",
            color: { r: fallbackRgba.r, g: fallbackRgba.g, b: fallbackRgba.b },
            opacity: fallbackRgba.a
          }];
        }
      } else {
        const fallbackColor = extractFallbackColor(styles["background"]);
        if (fallbackColor) {
          const fallbackRgba = hexToRgba(fallbackColor);
          if (fallbackRgba) {
            frame.fills = [{
              type: "SOLID",
              color: { r: fallbackRgba.r, g: fallbackRgba.g, b: fallbackRgba.b },
              opacity: fallbackRgba.a
            }];
          }
        }
      }
    } else if (styles["background-color"] && styles["background-color"] !== "transparent" || styles["background"] && !styles["background"].includes("gradient") && styles["background"] !== "transparent") {
      const bgColorValue = styles["background-color"] || styles["background"];
      const bgColorWithAlpha = hexToRgba(bgColorValue);
      if (bgColorWithAlpha) {
        frame.fills = [{
          type: "SOLID",
          color: { r: bgColorWithAlpha.r, g: bgColorWithAlpha.g, b: bgColorWithAlpha.b },
          opacity: bgColorWithAlpha.a
        }];
      }
    } else if (!hasExplicitBackground) {
      frame.fills = [];
    }
    if (styles.width) {
      let targetWidth = parseSize(styles.width);
      if (targetWidth && targetWidth > 0) {
        frame.resize(targetWidth, frame.height);
        frame.setPluginData("hasExplicitWidth", "true");
      } else if (styles.width === "100%") {
        frame.setPluginData("hasExplicitWidth", "true");
        if (frame.parent && frame.parent.type === "FRAME") {
          const parentFrame = frame.parent;
          const availableWidth = Math.max(parentFrame.width - parentFrame.paddingLeft - parentFrame.paddingRight, 300);
          frame.resize(availableWidth, frame.height);
        } else {
          frame.resize(Math.max(frame.width, 300), frame.height);
        }
      }
    }
    if (styles.height) {
      const height = parseSize(styles.height);
      if (height && height > 0) {
        frame.resize(frame.width, height);
      }
    }
    const borderProperties = ["border", "border-top", "border-right", "border-bottom", "border-left"];
    for (let i = 0; i < borderProperties.length; i++) {
      const prop = borderProperties[i];
      if (styles[prop] || styles[prop + "-width"] || styles[prop + "-color"] || styles[prop + "-style"]) {
        let borderColor = null;
        if (styles[prop]) {
          borderColor = extractBorderColor(styles[prop]);
        }
        if (!borderColor && styles[prop + "-color"]) {
          borderColor = styles[prop + "-color"];
        }
        if (!borderColor) {
          borderColor = "#dddddd";
        }
        const borderWidth = parseSize(styles[prop + "-width"] || styles[prop]) || 1;
        const colorObj = hexToRgb(borderColor) || { r: 0.87, g: 0.87, b: 0.87 };
        if (i === 0) {
          frame.strokes = [{ type: "SOLID", color: colorObj }];
          frame.strokeWeight = borderWidth;
        }
      }
    }
    const borderRadius = parseSize(styles["border-radius"]);
    if (borderRadius) {
      if (borderRadius === 999) {
        frame.cornerRadius = Math.min(frame.width, frame.height) / 2;
      } else {
        frame.cornerRadius = borderRadius;
      }
    }
    if (styles.opacity) {
      const opacity = parseFloat(styles.opacity);
      if (opacity >= 0 && opacity <= 1) {
        frame.opacity = opacity;
      }
    }
    if (styles["box-shadow"] && styles["box-shadow"] !== "none") {
      const shadowEffect = parseBoxShadow(styles["box-shadow"]);
      if (shadowEffect) {
        frame.effects = [shadowEffect];
      }
    }
    if (styles.transform) {
      const transform = parseTransform(styles.transform);
      if (transform.rotation !== void 0) {
        frame.rotation = transform.rotation;
      }
    }
    if (styles.margin) {
      const margin = parseMargin(styles.margin);
      frame.setPluginData("margin", JSON.stringify(margin));
    }
    ["margin-top", "margin-right", "margin-bottom", "margin-left"].forEach((prop) => {
      if (styles[prop]) {
        const value = parseSize(styles[prop]) || 0;
        let margin = { top: 0, right: 0, bottom: 0, left: 0 };
        try {
          margin = JSON.parse(frame.getPluginData("margin") || '{"top":0,"right":0,"bottom":0,"left":0}');
        } catch (e) {
        }
        const side = prop.split("-")[1];
        margin[side] = value;
        frame.setPluginData("margin", JSON.stringify(margin));
      }
    });
    if (styles.padding) {
      const padding = parsePadding(styles.padding);
      frame.paddingTop = padding.top;
      frame.paddingRight = padding.right;
      frame.paddingBottom = padding.bottom;
      frame.paddingLeft = padding.left;
    }
    ["padding-top", "padding-right", "padding-bottom", "padding-left"].forEach((prop) => {
      if (styles[prop]) {
        const value = parseSize(styles[prop]) || 0;
        const side = prop.split("-")[1];
        if (side === "top") frame.paddingTop = value;
        else if (side === "right") frame.paddingRight = value;
        else if (side === "bottom") frame.paddingBottom = value;
        else if (side === "left") frame.paddingLeft = value;
      }
    });
    if (styles.gap) {
      const gapValue = parseSize(styles.gap);
      if (gapValue && gapValue > 0) {
        frame.itemSpacing = gapValue;
      }
    }
    if (styles["justify-content"] === "center") {
      frame.primaryAxisAlignItems = "CENTER";
    } else if (styles["justify-content"] === "space-between") {
      frame.primaryAxisAlignItems = "SPACE_BETWEEN";
      if (frame.layoutMode === "HORIZONTAL" && !styles.width && frame.width < 200) {
        frame.minWidth = Math.max(frame.width * 1.5, 200);
      }
    } else if (styles["justify-content"] === "space-around") {
      frame.primaryAxisAlignItems = "SPACE_BETWEEN";
      if (frame.layoutMode === "HORIZONTAL" && !styles.width && frame.width < 200) {
        frame.minWidth = Math.max(frame.width * 1.5, 200);
      }
    } else if (styles["justify-content"] === "flex-start") {
      frame.primaryAxisAlignItems = "MIN";
    } else if (styles["justify-content"] === "flex-end") {
      frame.primaryAxisAlignItems = "MAX";
    } else if (styles["justify-content"] === "space-evenly") {
      frame.primaryAxisAlignItems = "SPACE_BETWEEN";
    }
    if (styles["align-items"] === "center") {
      frame.counterAxisAlignItems = "CENTER";
    } else if (styles["align-items"] === "flex-start" || styles["align-items"] === "start") {
      frame.counterAxisAlignItems = "MIN";
    } else if (styles["align-items"] === "flex-end" || styles["align-items"] === "end") {
      frame.counterAxisAlignItems = "MAX";
    } else if (styles["align-items"] === "baseline") {
      frame.counterAxisAlignItems = "BASELINE";
    }
    if (styles["overflow"] === "hidden" || styles["overflow-x"] === "hidden" || styles["overflow-y"] === "hidden") {
      frame.clipsContent = true;
    }
    if (styles["text-align"] === "center") {
      if (frame.layoutMode === "VERTICAL") {
        frame.primaryAxisAlignItems = "CENTER";
        frame.counterAxisAlignItems = "CENTER";
      } else if (frame.layoutMode === "HORIZONTAL") {
        frame.counterAxisAlignItems = "CENTER";
        frame.primaryAxisAlignItems = "CENTER";
      }
      frame.setPluginData("textAlign", "center");
    }
    if (styles["margin"] === "0 auto" || styles["margin-left"] === "auto" && styles["margin-right"] === "auto") {
      frame.setPluginData("centerHorizontally", "true");
    }
  }
  function applyStylesToText(text, styles) {
    let textColor = { r: 0, g: 0, b: 0 };
    if (styles.color) {
      const color = hexToRgb(styles.color);
      if (color) {
        textColor = color;
        const rgbaMatch = styles.color.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([0-9.]+)\s*\)/i);
        if (rgbaMatch) {
          const alpha = parseFloat(rgbaMatch[1]);
          if (alpha >= 0 && alpha <= 1) {
            text.opacity = alpha;
          }
        }
      }
    }
    text.fills = [{ type: "SOLID", color: textColor }];
    const fontSize = parseSize(styles["font-size"]);
    if (fontSize) {
      text.fontSize = Math.max(1, fontSize);
    }
    if (styles["line-height"]) {
      const value = styles["line-height"].trim();
      if (value.match(/^[0-9.]+px$/)) {
        const px = parseFloat(value);
        if (!isNaN(px)) text.lineHeight = { value: px, unit: "PIXELS" };
      } else if (value.match(/^[0-9.]+%$/)) {
        const percent = parseFloat(value);
        if (!isNaN(percent)) text.lineHeight = { value: percent, unit: "PERCENT" };
      } else if (!isNaN(Number(value))) {
        const multiplier = parseFloat(value);
        if (!isNaN(multiplier) && multiplier > 0) {
          text.lineHeight = { value: multiplier * 100, unit: "PERCENT" };
        }
      }
    }
    if (styles["letter-spacing"]) {
      const letterSpacing = parseSize(styles["letter-spacing"]);
      if (letterSpacing) {
        text.letterSpacing = { value: letterSpacing, unit: "PIXELS" };
      }
    }
    if (styles["font-weight"]) {
      const weight = styles["font-weight"];
      if (weight === "bold" || weight === "700" || weight === "800" || weight === "900") {
        figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
          text.fontName = { family: "Inter", style: "Bold" };
        }).catch(() => {
          const currentSize = typeof text.fontSize === "number" ? text.fontSize : 16;
          text.fontSize = currentSize * 1.1;
        });
      } else if (weight === "lighter" || weight === "300" || weight === "200" || weight === "100") {
        figma.loadFontAsync({ family: "Inter", style: "Light" }).then(() => {
          text.fontName = { family: "Inter", style: "Light" };
        }).catch(() => {
          const currentSize = typeof text.fontSize === "number" ? text.fontSize : 16;
          text.fontSize = currentSize * 0.9;
        });
      }
    }
    if (styles["font-style"] === "italic") {
      figma.loadFontAsync({ family: "Inter", style: "Italic" }).then(() => {
        text.fontName = { family: "Inter", style: "Italic" };
      }).catch(() => {
      });
    }
    if (styles["text-decoration"]) {
      const decoration = styles["text-decoration"];
      if (decoration.includes("underline")) {
        text.textDecoration = "UNDERLINE";
      } else if (decoration.includes("line-through")) {
        text.textDecoration = "STRIKETHROUGH";
      } else {
        text.textDecoration = "NONE";
      }
    }
    if (styles["text-transform"]) {
      const transform = styles["text-transform"];
      let characters = text.characters;
      if (transform === "uppercase") {
        text.characters = characters.toUpperCase();
      } else if (transform === "lowercase") {
        text.characters = characters.toLowerCase();
      } else if (transform === "capitalize") {
        text.characters = characters.replace(/\b\w/g, (l) => l.toUpperCase());
      }
    }
    if (styles["text-align"]) {
      const align = styles["text-align"];
      if (align === "center") text.textAlignHorizontal = "CENTER";
      else if (align === "right") text.textAlignHorizontal = "RIGHT";
      else if (align === "justify") text.textAlignHorizontal = "JUSTIFIED";
      else text.textAlignHorizontal = "LEFT";
    }
    if (styles.opacity) {
      const opacity = parseFloat(styles.opacity);
      if (opacity >= 0 && opacity <= 1) {
        text.opacity = opacity;
      }
    }
    if (styles["white-space"]) {
      const whiteSpace = styles["white-space"];
      if (whiteSpace === "nowrap" || whiteSpace === "pre") {
        text.textAutoResize = "WIDTH_AND_HEIGHT";
      } else if (whiteSpace === "pre-wrap" || whiteSpace === "pre-line") {
        text.textAutoResize = "HEIGHT";
      }
    }
    if (styles["text-overflow"] === "ellipsis") {
      text.textTruncation = "ENDING";
    }
  }
  function reorderChildrenByZIndex(parentFrame) {
    try {
      const children = [...parentFrame.children];
      const childrenWithZIndex = [];
      for (const child of children) {
        if ("getPluginData" in child) {
          const zIndexStr = child.getPluginData("zIndex");
          const zIndex = zIndexStr ? parseInt(zIndexStr, 10) : 0;
          childrenWithZIndex.push({ node: child, zIndex: isNaN(zIndex) ? 0 : zIndex });
        }
      }
      childrenWithZIndex.sort((a, b) => a.zIndex - b.zIndex);
      for (const item of childrenWithZIndex) {
        parentFrame.appendChild(item.node);
      }
    } catch (error) {
      console.error("Error reordering by z-index:", error);
    }
  }
  function parseGridColumns(gridTemplate) {
    if (!gridTemplate) return 1;
    const repeatMatch = gridTemplate.match(/repeat\((\d+),/);
    if (repeatMatch) {
      return parseInt(repeatMatch[1], 10);
    }
    if (gridTemplate.includes("auto-fill") || gridTemplate.includes("auto-fit")) {
      const minmaxMatch = gridTemplate.match(/minmax\((\d+)px/);
      if (minmaxMatch) {
        const minWidth = parseInt(minmaxMatch[1], 10);
        return Math.max(1, Math.floor(1200 / (minWidth + 16)));
      }
      return 3;
    }
    const normalized = gridTemplate.replace(/minmax\([^)]+\)/g, "1fr");
    const parts = normalized.split(/\s+/).filter((p) => p.trim() && p !== "");
    if (parts.length > 0) {
      return parts.length;
    }
    return 1;
  }
  function parseGridTemplateAreas(areasString) {
    if (!areasString) return null;
    const rowMatches = areasString.match(/"([^"]+)"/g);
    if (!rowMatches || rowMatches.length === 0) return null;
    const areaMap = {};
    for (let rowIndex = 0; rowIndex < rowMatches.length; rowIndex++) {
      const rowContent = rowMatches[rowIndex].replace(/"/g, "").trim();
      const columns = rowContent.split(/\s+/);
      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const areaName = columns[colIndex];
        if (areaName === ".") continue;
        if (!areaMap[areaName]) {
          areaMap[areaName] = {
            rowStart: rowIndex,
            rowEnd: rowIndex + 1,
            colStart: colIndex,
            colEnd: colIndex + 1
          };
        } else {
          areaMap[areaName].rowEnd = Math.max(areaMap[areaName].rowEnd, rowIndex + 1);
          areaMap[areaName].colEnd = Math.max(areaMap[areaName].colEnd, colIndex + 1);
          areaMap[areaName].rowStart = Math.min(areaMap[areaName].rowStart, rowIndex);
          areaMap[areaName].colStart = Math.min(areaMap[areaName].colStart, colIndex);
        }
      }
    }
    return Object.keys(areaMap).length > 0 ? areaMap : null;
  }
  function getGridRowCount(areasString) {
    if (!areasString) return 1;
    const rowMatches = areasString.match(/"([^"]+)"/g);
    return rowMatches ? rowMatches.length : 1;
  }
  function getGridColCount(areasString) {
    if (!areasString) return 1;
    const rowMatches = areasString.match(/"([^"]+)"/g);
    if (!rowMatches || rowMatches.length === 0) return 1;
    const firstRow = rowMatches[0].replace(/"/g, "").trim();
    return firstRow.split(/\s+/).length;
  }
  async function createGridLayoutWithAreas(children, parentFrame, areaMap, numRows, numCols, gap, inheritedStyles) {
    var _a;
    const hasMultiRowSpans = Object.values(areaMap).some((bounds) => bounds.rowEnd - bounds.rowStart > 1);
    const grid = [];
    for (let r = 0; r < numRows; r++) {
      grid[r] = new Array(numCols).fill(null);
    }
    const rowFrames = [];
    for (let r = 0; r < numRows; r++) {
      const rowFrame = figma.createFrame();
      rowFrame.name = `Grid Row ${r + 1}`;
      rowFrame.fills = [];
      rowFrame.layoutMode = "HORIZONTAL";
      rowFrame.primaryAxisSizingMode = "AUTO";
      rowFrame.counterAxisSizingMode = "AUTO";
      rowFrame.itemSpacing = gap;
      parentFrame.appendChild(rowFrame);
      if (parentFrame.layoutMode !== "NONE") {
        try {
          rowFrame.layoutSizingHorizontal = "FILL";
        } catch (error) {
        }
      }
      rowFrames.push(rowFrame);
    }
    const childrenByArea = {};
    for (const child of children) {
      const gridArea = (_a = child.styles) == null ? void 0 : _a["grid-area"];
      if (gridArea && areaMap[gridArea]) {
        childrenByArea[gridArea] = child;
      }
    }
    const processedAreas = /* @__PURE__ */ new Set();
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        let cellArea = null;
        for (const [areaName, bounds2] of Object.entries(areaMap)) {
          if (r >= bounds2.rowStart && r < bounds2.rowEnd && c >= bounds2.colStart && c < bounds2.colEnd) {
            cellArea = areaName;
            break;
          }
        }
        if (!cellArea) {
          const placeholder = figma.createFrame();
          placeholder.name = `Empty Cell ${r}-${c}`;
          placeholder.fills = [];
          placeholder.resize(10, 10);
          rowFrames[r].appendChild(placeholder);
          try {
            placeholder.layoutGrow = 1;
            placeholder.layoutSizingHorizontal = "FILL";
            placeholder.layoutSizingVertical = "HUG";
          } catch (error) {
          }
          continue;
        }
        const bounds = areaMap[cellArea];
        const isFirstCellOfArea = r === bounds.rowStart && c === bounds.colStart;
        if (isFirstCellOfArea && !processedAreas.has(cellArea)) {
          processedAreas.add(cellArea);
          const child = childrenByArea[cellArea];
          if (child) {
            const colSpan = bounds.colEnd - bounds.colStart;
            const rowSpan = bounds.rowEnd - bounds.rowStart;
            if (rowSpan > 1) {
              const wrapper = figma.createFrame();
              wrapper.name = `${cellArea} (spans ${rowSpan} rows, ${colSpan} cols)`;
              wrapper.fills = [];
              wrapper.layoutMode = "VERTICAL";
              wrapper.primaryAxisSizingMode = "AUTO";
              wrapper.counterAxisSizingMode = "AUTO";
              rowFrames[r].appendChild(wrapper);
              try {
                wrapper.layoutGrow = 1;
                wrapper.layoutSizingHorizontal = "FILL";
              } catch (error) {
              }
              const gridInheritedStyles = __spreadProps(__spreadValues({}, inheritedStyles), { "_hasConstrainedWidth": true });
              await createFigmaNodesFromStructure([child], wrapper, 0, 0, gridInheritedStyles);
              for (let cc = 1; cc < colSpan; cc++) {
                const placeholder = figma.createFrame();
                placeholder.name = `${cellArea} span ${cc}`;
                placeholder.fills = [];
                placeholder.resize(1, 1);
                placeholder.visible = false;
                rowFrames[r].appendChild(placeholder);
                try {
                  placeholder.layoutGrow = 1;
                  placeholder.layoutSizingHorizontal = "FILL";
                } catch (error) {
                }
              }
            } else {
              const wrapper = figma.createFrame();
              wrapper.name = `${cellArea} (${colSpan} cols)`;
              wrapper.fills = [];
              wrapper.layoutMode = "VERTICAL";
              wrapper.primaryAxisSizingMode = "AUTO";
              wrapper.counterAxisSizingMode = "AUTO";
              rowFrames[r].appendChild(wrapper);
              try {
                wrapper.layoutGrow = 1;
                wrapper.layoutSizingHorizontal = "FILL";
                if (hasMultiRowSpans) {
                  wrapper.layoutSizingVertical = "FILL";
                }
              } catch (error) {
              }
              const gridInheritedStyles = __spreadProps(__spreadValues({}, inheritedStyles), {
                "_hasConstrainedWidth": true,
                "_shouldFillVertical": hasMultiRowSpans
              });
              await createFigmaNodesFromStructure([child], wrapper, 0, 0, gridInheritedStyles);
              for (let cc = 1; cc < colSpan; cc++) {
                const placeholder = figma.createFrame();
                placeholder.name = `${cellArea} span ${cc}`;
                placeholder.fills = [];
                placeholder.resize(1, 1);
                placeholder.visible = false;
                rowFrames[r].appendChild(placeholder);
                try {
                  placeholder.layoutGrow = 1;
                  placeholder.layoutSizingHorizontal = "FILL";
                } catch (error) {
                }
              }
            }
          } else {
            const placeholder = figma.createFrame();
            placeholder.name = `${cellArea} (empty)`;
            placeholder.fills = [];
            placeholder.resize(10, 10);
            rowFrames[r].appendChild(placeholder);
            try {
              placeholder.layoutGrow = 1;
              placeholder.layoutSizingHorizontal = "FILL";
              placeholder.layoutSizingVertical = "HUG";
            } catch (error) {
            }
          }
        } else if (!isFirstCellOfArea) {
          if (r > bounds.rowStart && c === bounds.colStart) {
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
                placeholder.layoutSizingHorizontal = "FILL";
              } catch (error) {
              }
            }
          }
        }
      }
    }
  }
  async function createGridLayout(children, parentFrame, columns, gap, inheritedStyles) {
    console.log("[GRID] createGridLayout called with", children.length, "children,", columns, "columns");
    if (!children || children.length === 0) {
      console.log("[GRID] No children to process!");
      return;
    }
    for (let i = 0; i < children.length; i += columns) {
      const rowFrame = figma.createFrame();
      rowFrame.name = `Grid Row (${columns} cols)`;
      rowFrame.fills = [];
      rowFrame.layoutMode = "HORIZONTAL";
      rowFrame.primaryAxisSizingMode = "AUTO";
      rowFrame.counterAxisSizingMode = "AUTO";
      rowFrame.itemSpacing = gap;
      parentFrame.appendChild(rowFrame);
      if (parentFrame.layoutMode !== "NONE") {
        try {
          rowFrame.layoutSizingHorizontal = "FILL";
          rowFrame.setPluginData("hasExplicitWidth", "true");
        } catch (error) {
          rowFrame.resize(Math.max(400, rowFrame.width), rowFrame.height);
        }
      }
      for (let j = 0; j < columns; j++) {
        if (children[i + j]) {
          const gridInheritedStyles = __spreadProps(__spreadValues({}, inheritedStyles), { "_hasConstrainedWidth": true });
          await createFigmaNodesFromStructure([children[i + j]], rowFrame, 0, 0, gridInheritedStyles);
        }
      }
      for (let k = 0; k < rowFrame.children.length; k++) {
        try {
          const child = rowFrame.children[k];
          child.layoutGrow = 1;
          child.layoutSizingHorizontal = "FILL";
          child.setPluginData("hasExplicitWidth", "true");
        } catch (error) {
        }
      }
    }
  }
  async function createFigmaNodesFromStructure(structure, parentFrame, startX = 0, startY = 0, inheritedStyles) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da, _ea, _fa, _ga, _ha, _ia, _ja, _ka, _la, _ma, _na, _oa, _pa, _qa, _ra, _sa, _ta, _ua, _va, _wa, _xa, _ya, _za, _Aa, _Ba, _Ca, _Da, _Ea, _Fa, _Ga, _Ha, _Ia, _Ja, _Ka, _La, _Ma, _Na, _Oa, _Pa, _Qa, _Ra, _Sa, _Ta, _Ua, _Va, _Wa, _Xa, _Ya, _Za, __a, _$a, _ab, _bb, _cb, _db, _eb, _fb, _gb, _hb, _ib, _jb, _kb, _lb, _mb, _nb, _ob, _pb, _qb, _rb, _sb, _tb, _ub, _vb, _wb, _xb, _yb, _zb, _Ab, _Bb, _Cb, _Db, _Eb, _Fb, _Gb, _Hb, _Ib, _Jb, _Kb, _Lb, _Mb, _Nb, _Ob, _Pb, _Qb, _Rb, _Sb, _Tb, _Ub, _Vb, _Wb, _Xb, _Yb, _Zb, __b, _$b, _ac, _bc, _cc, _dc, _ec, _fc, _gc, _hc, _ic, _jc, _kc, _lc, _mc, _nc, _oc, _pc, _qc;
    debugLog("[NODE CREATION] Starting createFigmaNodesFromStructure");
    debugLog("[NODE CREATION] Structure:", structure);
    debugLog("[NODE CREATION] ParentFrame:", (parentFrame == null ? void 0 : parentFrame.name) || "none");
    debugLog("[NODE CREATION] Structure length:", (structure == null ? void 0 : structure.length) || 0);
    for (const node of structure) {
      debugLog("[NODE CREATION] Processing node:", node.tagName, node.type);
      if (node.type === "element") {
        if (["script", "style", "meta", "link", "title"].includes(node.tagName)) {
          continue;
        }
        if (((_a = node.styles) == null ? void 0 : _a.display) === "none") {
          continue;
        }
        if (((_b = node.styles) == null ? void 0 : _b.position) === "sticky" || ((_c = node.styles) == null ? void 0 : _c.position) === "fixed") {
          node.styles.position = "relative";
        }
        const nodeStyles = __spreadValues(__spreadValues({}, inheritedStyles), node.styles);
        node.styles = nodeStyles;
        if (["body", "div", "section", "article", "nav", "header", "footer", "main", "aside", "blockquote", "figure", "figcaption", "address", "details", "summary"].includes(node.tagName)) {
          const frame = figma.createFrame();
          frame.name = node.tagName.toUpperCase() + " Frame";
          let layoutMode = "VERTICAL";
          if (((_d = node.styles) == null ? void 0 : _d.display) === "flex" || ((_e = node.styles) == null ? void 0 : _e.display) === "inline-flex") {
            layoutMode = ((_f = node.styles) == null ? void 0 : _f["flex-direction"]) === "column" ? "VERTICAL" : "HORIZONTAL";
          } else if (((_g = node.styles) == null ? void 0 : _g.display) === "grid") {
            layoutMode = "VERTICAL";
          } else if (((_h = node.styles) == null ? void 0 : _h.display) === "inline" || ((_i = node.styles) == null ? void 0 : _i.display) === "inline-block") {
            layoutMode = "HORIZONTAL";
          }
          if (layoutMode === "VERTICAL" && node.children && node.children.length >= 2) {
            const hasSidebar = node.children.some((child) => {
              var _a2, _b2;
              const pos = (_a2 = child.styles) == null ? void 0 : _a2.position;
              const width = (_b2 = child.styles) == null ? void 0 : _b2.width;
              return (pos === "fixed" || pos === "absolute") && width && !width.includes("%");
            });
            const hasMainContent = node.children.some((child) => {
              var _a2;
              const ml = (_a2 = child.styles) == null ? void 0 : _a2["margin-left"];
              return ml && parseSize(ml) && parseSize(ml) > 50;
            });
            if (hasSidebar && hasMainContent) {
              layoutMode = "HORIZONTAL";
            }
          }
          frame.layoutMode = layoutMode;
          if (((_j = node.styles) == null ? void 0 : _j["flex-wrap"]) === "wrap" || ((_k = node.styles) == null ? void 0 : _k["flex-wrap"]) === "wrap-reverse") {
            frame.layoutWrap = "WRAP";
          }
          frame.primaryAxisSizingMode = "AUTO";
          frame.counterAxisSizingMode = "AUTO";
          frame.layoutSizingVertical = "HUG";
          frame.layoutSizingHorizontal = "HUG";
          frame.minHeight = 20;
          frame.minWidth = 20;
          if (node.styles) {
            applyStylesToFrame(frame, node.styles);
          }
          if (((_l = node.styles) == null ? void 0 : _l.className) === "detail-label" || ((_m = node.styles) == null ? void 0 : _m.className) === "detail-value") {
          }
          if (parentFrame && parentFrame.getPluginData("textAlign") === "center") {
            if (!((_n = node.styles) == null ? void 0 : _n["text-align"])) {
              if (frame.layoutMode === "VERTICAL") {
                frame.primaryAxisAlignItems = "CENTER";
                frame.counterAxisAlignItems = "CENTER";
              } else if (frame.layoutMode === "HORIZONTAL") {
                frame.counterAxisAlignItems = "CENTER";
                frame.primaryAxisAlignItems = "CENTER";
              }
              frame.setPluginData("textAlign", "center");
              if ((_p = (_o = node.styles) == null ? void 0 : _o.className) == null ? void 0 : _p.includes("detail")) {
              }
            }
          }
          if (((_q = node.styles) == null ? void 0 : _q["max-width"]) && !((_r = node.styles) == null ? void 0 : _r.height) && !(inheritedStyles == null ? void 0 : inheritedStyles["_shouldFillVertical"])) {
            frame.layoutSizingVertical = "HUG";
          }
          const display = ((_s = node.styles) == null ? void 0 : _s.display) || "block";
          const isInlineElement = display === "inline" || display === "inline-block" || display === "inline-flex";
          const needsFullWidth = !isInlineElement;
          const hasBackground = frame.fills && frame.fills.length > 0;
          const isInsideGradientContainer = inheritedStyles == null ? void 0 : inheritedStyles["parent-has-gradient"];
          if (!hasBackground && !isInsideGradientContainer) {
            const cssBackgroundColor = ((_t = node.styles) == null ? void 0 : _t["background-color"]) || ((_u = node.styles) == null ? void 0 : _u["background"]);
            if (cssBackgroundColor && cssBackgroundColor !== "transparent") {
              const bgColor = hexToRgb(cssBackgroundColor);
              if (bgColor) {
                frame.fills = [{ type: "SOLID", color: bgColor }];
              }
            } else {
              frame.fills = [];
            }
          }
          const basePadding = parseSize((_v = node.styles) == null ? void 0 : _v.padding);
          const cssTopPadding = (_y = (_x = parseSize((_w = node.styles) == null ? void 0 : _w["padding-top"])) != null ? _x : basePadding) != null ? _y : 0;
          const cssRightPadding = (_B = (_A = parseSize((_z = node.styles) == null ? void 0 : _z["padding-right"])) != null ? _A : basePadding) != null ? _B : 0;
          const cssBottomPadding = (_E = (_D = parseSize((_C = node.styles) == null ? void 0 : _C["padding-bottom"])) != null ? _D : basePadding) != null ? _E : 0;
          const cssLeftPadding = (_H = (_G = parseSize((_F = node.styles) == null ? void 0 : _F["padding-left"])) != null ? _G : basePadding) != null ? _H : 0;
          frame.paddingTop = cssTopPadding;
          frame.paddingRight = cssRightPadding;
          frame.paddingBottom = cssBottomPadding;
          frame.paddingLeft = cssLeftPadding;
          let gap;
          if (((_I = node.styles) == null ? void 0 : _I.gap) !== void 0) {
            gap = (_J = parseSize(node.styles.gap)) != null ? _J : 0;
          } else {
            gap = layoutMode === "HORIZONTAL" ? 16 : 12;
          }
          frame.itemSpacing = gap;
          if (((_K = node.styles) == null ? void 0 : _K.display) === "grid") {
            frame.setPluginData("gridGap", gap.toString());
          }
          if (!parentFrame) {
            frame.x = startX;
            frame.y = startY;
            figma.currentPage.appendChild(frame);
          } else {
            parentFrame.appendChild(frame);
            if ((inheritedStyles == null ? void 0 : inheritedStyles["_shouldFillVertical"]) && parentFrame.layoutMode !== "NONE") {
              try {
                frame.layoutSizingVertical = "FILL";
              } catch (e) {
              }
            }
          }
          if (((_L = node.styles) == null ? void 0 : _L.position) === "absolute" && parentFrame) {
            try {
              frame.layoutPositioning = "ABSOLUTE";
              const top = parseSize((_M = node.styles) == null ? void 0 : _M.top);
              const left = parseSize((_N = node.styles) == null ? void 0 : _N.left);
              const right = parseSize((_O = node.styles) == null ? void 0 : _O.right);
              const bottom = parseSize((_P = node.styles) == null ? void 0 : _P.bottom);
              if (top !== null) frame.y = top;
              if (left !== null) frame.x = left;
              if (top !== null && bottom !== null) {
                frame.constraints = { vertical: "STRETCH", horizontal: ((_Q = frame.constraints) == null ? void 0 : _Q.horizontal) || "MIN" };
              } else if (bottom !== null) {
                frame.constraints = { vertical: "MAX", horizontal: ((_R = frame.constraints) == null ? void 0 : _R.horizontal) || "MIN" };
              } else if (top !== null) {
                frame.constraints = { vertical: "MIN", horizontal: ((_S = frame.constraints) == null ? void 0 : _S.horizontal) || "MIN" };
              }
              if (left !== null && right !== null) {
                frame.constraints = { vertical: ((_T = frame.constraints) == null ? void 0 : _T.vertical) || "MIN", horizontal: "STRETCH" };
              } else if (right !== null) {
                frame.constraints = { vertical: ((_U = frame.constraints) == null ? void 0 : _U.vertical) || "MIN", horizontal: "MAX" };
              } else if (left !== null) {
                frame.constraints = { vertical: ((_V = frame.constraints) == null ? void 0 : _V.vertical) || "MIN", horizontal: "MIN" };
              }
            } catch (error) {
              console.error("Absolute positioning error:", error);
            }
          }
          const widthValue = (_W = node.styles) == null ? void 0 : _W.width;
          const heightValue = (_X = node.styles) == null ? void 0 : _X.height;
          const hasExplicitPixelWidth = widthValue && parseSize(widthValue) !== null;
          const hasPercentageWidth = widthValue && parsePercentage(widthValue) !== null;
          const hasExplicitDimensions = hasExplicitPixelWidth || heightValue;
          if (hasPercentageWidth && parentFrame) {
            const percentage = parsePercentage(widthValue);
            if (percentage === 100 && parentFrame.layoutMode !== "NONE") {
              try {
                frame.layoutSizingHorizontal = "FILL";
              } catch (e) {
                const calculatedWidth = calculatePercentageWidth(widthValue, parentFrame);
                if (calculatedWidth && calculatedWidth > 0) {
                  frame.resize(calculatedWidth, frame.height);
                }
              }
            } else {
              const calculatedWidth = calculatePercentageWidth(widthValue, parentFrame);
              if (calculatedWidth && calculatedWidth > 0) {
                frame.resize(calculatedWidth, frame.height);
                frame.layoutSizingHorizontal = "FIXED";
              }
            }
          } else if (!hasExplicitDimensions && needsFullWidth && parentFrame && parentFrame.layoutMode !== "NONE") {
            try {
              const hasFlex = ((_Y = node.styles) == null ? void 0 : _Y.flex) || ((_Z = node.styles) == null ? void 0 : _Z["flex-grow"]);
              const flexValue = (__ = node.styles) == null ? void 0 : __.flex;
              const flexGrowValue = (_$ = node.styles) == null ? void 0 : _$["flex-grow"];
              const shouldFillHorizontal = parentFrame.layoutMode === "VERTICAL" || hasFlex === "1" || flexValue === "1" || flexGrowValue === "1" || ((_aa = node.styles) == null ? void 0 : _aa["margin-right"]) === "auto";
              if (shouldFillHorizontal) {
                frame.layoutSizingHorizontal = "FILL";
              } else if (parentFrame.layoutMode === "HORIZONTAL") {
                frame.layoutSizingHorizontal = "HUG";
              } else {
                frame.layoutSizingHorizontal = "FILL";
              }
              if (!((_ba = node.styles) == null ? void 0 : _ba.height)) {
                frame.layoutSizingVertical = "HUG";
              }
            } catch (error) {
              console.error("Layout error:", error);
              frame.resize(Math.max(480, frame.width), frame.height);
            }
          } else if (!hasExplicitDimensions && needsFullWidth) {
            frame.resize(Math.max(frame.width, 300), frame.height);
            if (!((_ca = node.styles) == null ? void 0 : _ca.height)) {
              frame.layoutSizingVertical = "HUG";
            }
          } else if (hasExplicitDimensions) {
          }
          if (parentFrame && parentFrame.layoutMode === "HORIZONTAL" && !((_da = node.styles) == null ? void 0 : _da.height)) {
            try {
              frame.layoutSizingVertical = "FILL";
              if (((_ea = node.styles) == null ? void 0 : _ea.className) === "sidebar") {
              }
            } catch (error) {
              console.error("Height fill error for", ((_fa = node.styles) == null ? void 0 : _fa.className) || "element", error);
            }
          }
          const maxWidthValue = parseSize((_ga = node.styles) == null ? void 0 : _ga["max-width"]);
          const minWidthValue = parseSize((_ha = node.styles) == null ? void 0 : _ha["min-width"]);
          const maxHeightValue = parseSize((_ia = node.styles) == null ? void 0 : _ia["max-height"]);
          const minHeightValue = parseSize((_ja = node.styles) == null ? void 0 : _ja["min-height"]);
          if (maxWidthValue !== null && maxWidthValue > 0) {
            try {
              frame.maxWidth = maxWidthValue;
            } catch (error) {
              if (frame.width > maxWidthValue) {
                frame.resize(maxWidthValue, frame.height);
              }
            }
          }
          if (minWidthValue !== null && minWidthValue > 0) {
            try {
              frame.minWidth = minWidthValue;
            } catch (error) {
              if (frame.width < minWidthValue) {
                frame.resize(minWidthValue, frame.height);
              }
            }
          }
          if (maxHeightValue !== null && maxHeightValue > 0) {
            try {
              frame.maxHeight = maxHeightValue;
            } catch (error) {
              if (frame.height > maxHeightValue) {
                frame.resize(frame.width, maxHeightValue);
              }
            }
          }
          if (minHeightValue !== null && minHeightValue > 0) {
            try {
              frame.minHeight = minHeightValue;
            } catch (error) {
              if (frame.height < minHeightValue) {
                frame.resize(frame.width, minHeightValue);
              }
            }
          }
          if (frame.getPluginData("centerHorizontally") === "true" && parentFrame) {
            if (parentFrame.layoutMode === "VERTICAL") {
              parentFrame.primaryAxisAlignItems = "CENTER";
            }
          }
          const thisHasWidth = Boolean((_ka = node.styles) == null ? void 0 : _ka.width);
          const parentHadWidth = (inheritedStyles == null ? void 0 : inheritedStyles["_hasConstrainedWidth"]) === true;
          const isHorizontalFlex = frame.layoutMode === "HORIZONTAL";
          const shouldPropagateWidthConstraint = isHorizontalFlex ? thisHasWidth : thisHasWidth || parentHadWidth;
          const inheritableStyles = __spreadProps(__spreadValues({}, inheritedStyles), {
            // CRITICAL: Propagate width constraint - but not through horizontal flex containers
            "_hasConstrainedWidth": shouldPropagateWidthConstraint,
            // CRITICAL: Propagate FILL vertical for grid rows with multi-row spans
            "_shouldFillVertical": inheritedStyles == null ? void 0 : inheritedStyles["_shouldFillVertical"],
            // TEXT PROPERTIES - CSS inherited properties
            color: ((_la = node.styles) == null ? void 0 : _la.color) || (inheritedStyles == null ? void 0 : inheritedStyles.color),
            "font-family": ((_ma = node.styles) == null ? void 0 : _ma["font-family"]) || (inheritedStyles == null ? void 0 : inheritedStyles["font-family"]),
            "font-size": ((_na = node.styles) == null ? void 0 : _na["font-size"]) || (inheritedStyles == null ? void 0 : inheritedStyles["font-size"]),
            "font-weight": ((_oa = node.styles) == null ? void 0 : _oa["font-weight"]) || (inheritedStyles == null ? void 0 : inheritedStyles["font-weight"]),
            "font-style": ((_pa = node.styles) == null ? void 0 : _pa["font-style"]) || (inheritedStyles == null ? void 0 : inheritedStyles["font-style"]),
            "line-height": ((_qa = node.styles) == null ? void 0 : _qa["line-height"]) || (inheritedStyles == null ? void 0 : inheritedStyles["line-height"]),
            "text-align": ((_ra = node.styles) == null ? void 0 : _ra["text-align"]) || (inheritedStyles == null ? void 0 : inheritedStyles["text-align"]),
            "letter-spacing": ((_sa = node.styles) == null ? void 0 : _sa["letter-spacing"]) || (inheritedStyles == null ? void 0 : inheritedStyles["letter-spacing"]),
            "word-spacing": ((_ta = node.styles) == null ? void 0 : _ta["word-spacing"]) || (inheritedStyles == null ? void 0 : inheritedStyles["word-spacing"]),
            "text-transform": ((_ua = node.styles) == null ? void 0 : _ua["text-transform"]) || (inheritedStyles == null ? void 0 : inheritedStyles["text-transform"]),
            // FIXED: Don't inherit background/background-color - only pass info for gradient container detection
            "parent-has-gradient": ((_va = node.styles) == null ? void 0 : _va["background"]) && node.styles["background"].includes("linear-gradient") || (inheritedStyles == null ? void 0 : inheritedStyles["parent-has-gradient"]),
            // Pass parent class name to help with styling decisions
            "parent-class": ((_wa = node.styles) == null ? void 0 : _wa.className) || (inheritedStyles == null ? void 0 : inheritedStyles["parent-class"])
          });
          if (node.mixedContent && node.mixedContent.length > 0) {
            await figma.loadFontAsync({ family: "Inter", style: "Regular" });
            for (const item of node.mixedContent) {
              if (item.type === "text" && item.text && item.text.trim()) {
                const textNode = figma.createText();
                textNode.characters = item.text.trim();
                textNode.name = "Inline Text";
                applyStylesToText(textNode, __spreadValues(__spreadValues({}, inheritableStyles), node.styles));
                frame.appendChild(textNode);
                if (frame.layoutMode === "HORIZONTAL") {
                  textNode.layoutSizingHorizontal = "HUG";
                  textNode.textAutoResize = "WIDTH_AND_HEIGHT";
                } else if (frame.layoutMode === "VERTICAL") {
                  textNode.layoutSizingHorizontal = "FILL";
                  textNode.textAutoResize = "HEIGHT";
                } else {
                  textNode.textAutoResize = "WIDTH_AND_HEIGHT";
                }
              } else if (item.type === "element" && item.node) {
                await createFigmaNodesFromStructure([item.node], frame, 0, 0, inheritableStyles);
              }
            }
          } else {
            if (node.text && node.text.trim()) {
              await figma.loadFontAsync({ family: "Inter", style: "Regular" });
              const textNode = figma.createText();
              textNode.characters = node.text.trim();
              textNode.name = "DIV Text";
              applyStylesToText(textNode, __spreadValues(__spreadValues({}, inheritableStyles), node.styles));
              frame.appendChild(textNode);
              const parentIsHorizontal = parentFrame && parentFrame.layoutMode === "HORIZONTAL";
              const frameHasNoExplicitWidth = !((_xa = node.styles) == null ? void 0 : _xa.width);
              const frameWillHugHorizontal = parentIsHorizontal && frameHasNoExplicitWidth && !((_ya = node.styles) == null ? void 0 : _ya.flex) && !((_za = node.styles) == null ? void 0 : _za["flex-grow"]);
              if (frameWillHugHorizontal) {
                textNode.textAutoResize = "WIDTH_AND_HEIGHT";
              } else if (frame.layoutMode === "HORIZONTAL" || frame.layoutMode === "VERTICAL") {
                textNode.layoutSizingHorizontal = "FILL";
                textNode.textAutoResize = "HEIGHT";
              } else {
                textNode.textAutoResize = "WIDTH_AND_HEIGHT";
              }
            }
            if (node.children && node.children.length > 0) {
              if (((_Aa = node.styles) == null ? void 0 : _Aa.display) === "grid") {
                console.log("[GRID] Grid detected! Children:", node.children.length);
                const gridTemplateAreas = (_Ba = node.styles) == null ? void 0 : _Ba["grid-template-areas"];
                const gridTemplateColumns = (_Ca = node.styles) == null ? void 0 : _Ca["grid-template-columns"];
                console.log("[GRID] template-areas:", gridTemplateAreas);
                console.log("[GRID] template-columns:", gridTemplateColumns);
                const gap2 = parseSize((_Da = node.styles) == null ? void 0 : _Da.gap) || parseSize((parentFrame == null ? void 0 : parentFrame.getPluginData("gridGap")) || "") || 12;
                const areaMap = parseGridTemplateAreas(gridTemplateAreas);
                if (areaMap) {
                  const numRows = getGridRowCount(gridTemplateAreas);
                  const numCols = getGridColCount(gridTemplateAreas);
                  await createGridLayoutWithAreas(node.children, frame, areaMap, numRows, numCols, gap2, inheritableStyles);
                } else {
                  const columns = parseGridColumns(gridTemplateColumns);
                  const finalColumns = columns > 0 ? columns : 2;
                  await createGridLayout(node.children, frame, finalColumns, gap2, inheritableStyles);
                }
              } else {
                await createFigmaNodesFromStructure(node.children, frame, 0, 0, inheritableStyles);
              }
              reorderChildrenByZIndex(frame);
            }
          }
          if ((_Ea = node.styles) == null ? void 0 : _Ea["z-index"]) {
            const zIndex = parseInt(node.styles["z-index"], 10);
            if (!isNaN(zIndex)) {
              frame.setPluginData("zIndex", zIndex.toString());
            }
          }
          if ((((_Fa = node.styles) == null ? void 0 : _Fa.flex) === "1" || ((_Ga = node.styles) == null ? void 0 : _Ga["flex-grow"]) === "1") && parentFrame) {
            if (parentFrame.layoutMode === "HORIZONTAL" || parentFrame.layoutMode === "VERTICAL") {
              try {
                frame.layoutGrow = 1;
                frame.layoutSizingHorizontal = "FILL";
                frame.layoutSizingVertical = "HUG";
              } catch (error) {
                console.error("Error applying flex grow:", error);
                try {
                  frame.layoutGrow = 1;
                } catch (fallbackError) {
                  console.error("Fallback error:", fallbackError);
                }
              }
            }
          }
          if (((_Ha = node.styles) == null ? void 0 : _Ha["align-self"]) && parentFrame) {
            try {
              const alignSelf = node.styles["align-self"];
              if (alignSelf === "center") {
                frame.layoutAlign = "CENTER";
              } else if (alignSelf === "flex-start" || alignSelf === "start") {
                frame.layoutAlign = "MIN";
              } else if (alignSelf === "flex-end" || alignSelf === "end") {
                frame.layoutAlign = "MAX";
              } else if (alignSelf === "stretch") {
                frame.layoutAlign = "STRETCH";
              }
            } catch (error) {
              console.error("Error applying align-self:", error);
            }
          }
        } else if (node.tagName === "form") {
          const form = figma.createFrame();
          form.name = "FORM";
          form.fills = [];
          form.layoutMode = "VERTICAL";
          form.primaryAxisSizingMode = "AUTO";
          form.counterAxisSizingMode = "AUTO";
          const basePadding = parseSize((_Ia = node.styles) == null ? void 0 : _Ia.padding);
          form.paddingLeft = (_La = (_Ka = parseSize((_Ja = node.styles) == null ? void 0 : _Ja["padding-left"])) != null ? _Ka : basePadding) != null ? _La : 0;
          form.paddingRight = (_Oa = (_Na = parseSize((_Ma = node.styles) == null ? void 0 : _Ma["padding-right"])) != null ? _Na : basePadding) != null ? _Oa : 0;
          form.paddingTop = (_Ra = (_Qa = parseSize((_Pa = node.styles) == null ? void 0 : _Pa["padding-top"])) != null ? _Qa : basePadding) != null ? _Ra : 0;
          form.paddingBottom = (_Ua = (_Ta = parseSize((_Sa = node.styles) == null ? void 0 : _Sa["padding-bottom"])) != null ? _Ta : basePadding) != null ? _Ua : 0;
          form.itemSpacing = (_Wa = parseSize((_Va = node.styles) == null ? void 0 : _Va.gap)) != null ? _Wa : 0;
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
        } else if (["input", "textarea", "select"].includes(node.tagName)) {
          let inputWidth = parseSize((_Xa = node.styles) == null ? void 0 : _Xa.width);
          const inputHeight = node.tagName === "textarea" ? (parseSize((_Ya = node.attributes) == null ? void 0 : _Ya.rows) || 3) * 20 + 20 : parseSize((_Za = node.styles) == null ? void 0 : _Za.height) || 40;
          const input = figma.createFrame();
          let bgColor = { r: 1, g: 1, b: 1 };
          if (((__a = node.styles) == null ? void 0 : __a["background"]) && node.styles["background"] !== "transparent") {
            const bgParsed = hexToRgb(node.styles["background"]);
            if (bgParsed) bgColor = bgParsed;
          } else if (((_$a = node.styles) == null ? void 0 : _$a["background-color"]) && node.styles["background-color"] !== "transparent") {
            const bgParsed = hexToRgb(node.styles["background-color"]);
            if (bgParsed) bgColor = bgParsed;
          }
          input.fills = [{ type: "SOLID", color: bgColor }];
          let borderColor = { r: 0.8, g: 0.8, b: 0.8 };
          if (((_ab = node.styles) == null ? void 0 : _ab["border"]) || ((_bb = node.styles) == null ? void 0 : _bb["border-color"])) {
            const borderParsed = hexToRgb(node.styles["border-color"] || extractBorderColor(node.styles["border"]));
            if (borderParsed) borderColor = borderParsed;
          }
          input.strokes = [{ type: "SOLID", color: borderColor }];
          input.strokeWeight = parseSize((_cb = node.styles) == null ? void 0 : _cb["border-width"]) || 1;
          input.cornerRadius = parseSize((_db = node.styles) == null ? void 0 : _db["border-radius"]) || 4;
          input.name = node.tagName.toUpperCase();
          input.layoutMode = "HORIZONTAL";
          if (((_eb = node.styles) == null ? void 0 : _eb["text-align"]) === "center") {
            input.primaryAxisAlignItems = "CENTER";
            input.counterAxisAlignItems = "CENTER";
          } else {
            input.primaryAxisAlignItems = "MIN";
            input.counterAxisAlignItems = "CENTER";
          }
          input.paddingLeft = parseSize((_fb = node.styles) == null ? void 0 : _fb["padding-left"]) || 12;
          input.paddingRight = parseSize((_gb = node.styles) == null ? void 0 : _gb["padding-right"]) || 12;
          const parentIsAutoLayout = parentFrame && parentFrame.type === "FRAME" && parentFrame.layoutMode && parentFrame.layoutMode !== "NONE";
          let useFill = false;
          if (((_hb = node.styles) == null ? void 0 : _hb.width) === "100%") {
            if (parentIsAutoLayout) {
              useFill = true;
            } else {
              inputWidth = parentFrame && "width" in parentFrame ? Math.max(parentFrame.width, 300) : 300;
            }
          }
          if (!useFill) {
            input.resize(inputWidth || 300, inputHeight);
          } else {
            input.resize(input.width, inputHeight);
          }
          if (node.styles) {
            applyStylesToFrame(input, node.styles);
          }
          await figma.loadFontAsync({ family: "Inter", style: "Regular" });
          const inputText = figma.createText();
          const displayText = ((_ib = node.attributes) == null ? void 0 : _ib.value) || ((_jb = node.attributes) == null ? void 0 : _jb.placeholder) || (node.tagName === "select" ? "Select option \u25BC" : "Input field");
          inputText.characters = displayText;
          let textColor = { r: 0.2, g: 0.2, b: 0.2 };
          if ((_kb = node.styles) == null ? void 0 : _kb.color) {
            const colorParsed = hexToRgb(node.styles.color);
            if (colorParsed) textColor = colorParsed;
          } else if (!((_lb = node.attributes) == null ? void 0 : _lb.value)) {
            textColor = { r: 0.6, g: 0.6, b: 0.6 };
          }
          inputText.fills = [{ type: "SOLID", color: textColor }];
          input.appendChild(inputText);
          if (!parentFrame) {
            input.x = startX;
            input.y = startY;
            figma.currentPage.appendChild(input);
          } else {
            parentFrame.appendChild(input);
          }
          if (useFill) {
            try {
              input.layoutSizingHorizontal = "FILL";
            } catch (e) {
              if (parentFrame && "width" in parentFrame) {
                input.resize(Math.max(parentFrame.width, 300), input.height);
              } else {
                input.resize(300, input.height);
              }
            }
          }
        } else if (node.tagName === "table") {
          const tableWidth = parseSize((_mb = node.styles) == null ? void 0 : _mb.width) || 500;
          let tableHeight = 60;
          const bodyRows = node.children.filter(
            (c) => c.tagName === "tbody" || c.tagName === "tr"
          );
          const totalRows = bodyRows.reduce((count, section) => {
            if (section.tagName === "tbody") {
              return count + section.children.filter((c) => c.tagName === "tr").length;
            }
            return count + 1;
          }, 0);
          tableHeight += totalRows * 55;
          const table = figma.createFrame();
          table.resize(tableWidth, tableHeight);
          table.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
          table.strokes = [{ type: "SOLID", color: { r: 0.8, g: 0.8, b: 0.8 } }];
          table.strokeWeight = 1;
          table.name = "TABLE";
          table.layoutMode = "VERTICAL";
          table.primaryAxisSizingMode = "AUTO";
          table.counterAxisSizingMode = "AUTO";
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
        } else if (["tr", "thead", "tbody"].includes(node.tagName)) {
          if (node.tagName === "thead" || node.tagName === "tbody") {
            await createFigmaNodesFromStructure(node.children, parentFrame, 0, 0, inheritedStyles);
          } else {
            const row = figma.createFrame();
            row.resize(450, 55);
            const isHeaderRow = node.children.some((c) => c.tagName === "th");
            row.fills = isHeaderRow ? [{ type: "SOLID", color: { r: 0.97, g: 0.97, b: 0.98 } }] : [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
            row.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
            row.strokeWeight = 1;
            row.name = "TABLE ROW";
            row.layoutMode = "HORIZONTAL";
            row.primaryAxisSizingMode = "AUTO";
            row.counterAxisSizingMode = "AUTO";
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
        } else if (["td", "th"].includes(node.tagName)) {
          const cell = figma.createFrame();
          const cellWidth = parseSize((_nb = node.styles) == null ? void 0 : _nb.width) || 100;
          const cellHeight = parseSize((_ob = node.styles) == null ? void 0 : _ob.height) || 40;
          cell.resize(cellWidth, cellHeight);
          const bgColor = ((_pb = node.styles) == null ? void 0 : _pb["background-color"]) || ((_qb = node.styles) == null ? void 0 : _qb.background);
          if (bgColor && bgColor !== "transparent") {
            const parsedBg = hexToRgb(bgColor);
            cell.fills = parsedBg ? [{ type: "SOLID", color: parsedBg }] : [];
          } else {
            cell.fills = [];
          }
          const borderColor = (_rb = node.styles) == null ? void 0 : _rb["border-color"];
          if (borderColor) {
            const parsedBorder = hexToRgb(borderColor);
            cell.strokes = parsedBorder ? [{ type: "SOLID", color: parsedBorder }] : [];
          } else {
            cell.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
          }
          cell.strokeWeight = (_tb = parseSize((_sb = node.styles) == null ? void 0 : _sb["border-width"])) != null ? _tb : 0.5;
          cell.name = node.tagName.toUpperCase();
          cell.layoutMode = "HORIZONTAL";
          cell.primaryAxisAlignItems = "CENTER";
          cell.counterAxisAlignItems = "CENTER";
          const basePadding = parseSize((_ub = node.styles) == null ? void 0 : _ub.padding);
          cell.paddingLeft = (_xb = (_wb = parseSize((_vb = node.styles) == null ? void 0 : _vb["padding-left"])) != null ? _wb : basePadding) != null ? _xb : 8;
          cell.paddingRight = (_Ab = (_zb = parseSize((_yb = node.styles) == null ? void 0 : _yb["padding-right"])) != null ? _zb : basePadding) != null ? _Ab : 8;
          cell.paddingTop = (_Db = (_Cb = parseSize((_Bb = node.styles) == null ? void 0 : _Bb["padding-top"])) != null ? _Cb : basePadding) != null ? _Db : 4;
          cell.paddingBottom = (_Gb = (_Fb = parseSize((_Eb = node.styles) == null ? void 0 : _Eb["padding-bottom"])) != null ? _Fb : basePadding) != null ? _Gb : 4;
          await figma.loadFontAsync({ family: "Inter", style: "Regular" });
          const cellText = figma.createText();
          let textContent = "";
          if (node.text && node.text.trim()) {
            textContent = node.text.trim();
          } else if (node.children && node.children.length > 0) {
            textContent = node.children.map((child) => {
              if (child.type === "text") return child.text;
              if (child.type === "element" && child.tagName === "button") {
                return child.text || "Button";
              }
              return child.text || "";
            }).filter((text) => text.trim()).join(" ");
          }
          cellText.characters = textContent || "";
          const textColor = (_Hb = node.styles) == null ? void 0 : _Hb.color;
          if (textColor) {
            const parsedColor = hexToRgb(textColor);
            cellText.fills = parsedColor ? [{ type: "SOLID", color: parsedColor }] : [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
          } else {
            cellText.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
          }
          if (node.tagName === "th") {
            figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
              cellText.fontName = { family: "Inter", style: "Bold" };
            }).catch(() => {
            });
          }
          cell.appendChild(cellText);
          if (node.styles) {
            applyStylesToText(cellText, node.styles);
          }
          if (parentFrame && parentFrame.getPluginData("textAlign") === "center") {
            if (!((_Ib = node.styles) == null ? void 0 : _Ib["text-align"])) {
              cellText.textAlignHorizontal = "CENTER";
            }
          }
          if ((_Kb = (_Jb = node.styles) == null ? void 0 : _Jb.className) == null ? void 0 : _Kb.includes("detail")) {
          }
          if (!parentFrame) {
            cell.x = startX;
            cell.y = startY;
            figma.currentPage.appendChild(cell);
          } else {
            parentFrame.appendChild(cell);
          }
        } else if (node.tagName === "button") {
          const buttonWidth = parseSize((_Lb = node.styles) == null ? void 0 : _Lb.width) || Math.max(120, (((_Mb = node.text) == null ? void 0 : _Mb.length) || 6) * 12);
          const buttonHeight = parseSize((_Nb = node.styles) == null ? void 0 : _Nb.height) || 44;
          const frame = figma.createFrame();
          frame.resize(buttonWidth, buttonHeight);
          const bgColor = ((_Ob = node.styles) == null ? void 0 : _Ob["background-color"]) || ((_Pb = node.styles) == null ? void 0 : _Pb.background);
          if (bgColor) {
            const parsedColor = hexToRgb(bgColor);
            if (parsedColor) {
              frame.fills = [{ type: "SOLID", color: parsedColor }];
            } else {
              frame.fills = [];
            }
          } else {
            frame.fills = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
          }
          const borderRadius = (_Rb = parseSize((_Qb = node.styles) == null ? void 0 : _Qb["border-radius"])) != null ? _Rb : 4;
          frame.cornerRadius = borderRadius;
          frame.name = "Button";
          frame.layoutMode = "HORIZONTAL";
          frame.primaryAxisAlignItems = "CENTER";
          frame.counterAxisAlignItems = "CENTER";
          const basePadding = parseSize((_Sb = node.styles) == null ? void 0 : _Sb.padding);
          frame.paddingLeft = (_Vb = (_Ub = parseSize((_Tb = node.styles) == null ? void 0 : _Tb["padding-left"])) != null ? _Ub : basePadding) != null ? _Vb : 16;
          frame.paddingRight = (_Yb = (_Xb = parseSize((_Wb = node.styles) == null ? void 0 : _Wb["padding-right"])) != null ? _Xb : basePadding) != null ? _Yb : 16;
          frame.paddingTop = (_$b = (__b = parseSize((_Zb = node.styles) == null ? void 0 : _Zb["padding-top"])) != null ? __b : basePadding) != null ? _$b : 8;
          frame.paddingBottom = (_cc = (_bc = parseSize((_ac = node.styles) == null ? void 0 : _ac["padding-bottom"])) != null ? _bc : basePadding) != null ? _cc : 8;
          if (node.styles) {
            applyStylesToFrame(frame, node.styles);
          }
          await figma.loadFontAsync({ family: "Inter", style: "Regular" });
          const buttonText = figma.createText();
          buttonText.characters = node.text || "Button";
          const textColor = (_dc = node.styles) == null ? void 0 : _dc.color;
          if (textColor) {
            const parsedTextColor = hexToRgb(textColor);
            if (parsedTextColor) {
              buttonText.fills = [{ type: "SOLID", color: parsedTextColor }];
            } else {
              buttonText.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
            }
          } else {
            buttonText.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
          }
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
        } else if (node.tagName === "img") {
          const width = parseSize((_ec = node.styles) == null ? void 0 : _ec.width) || 200;
          const height = parseSize((_fc = node.styles) == null ? void 0 : _fc.height) || 150;
          const frame = figma.createFrame();
          frame.resize(width, height);
          frame.fills = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
          frame.name = "Image: " + (((_gc = node.attributes) == null ? void 0 : _gc.alt) || "Unnamed");
          frame.layoutMode = "HORIZONTAL";
          frame.primaryAxisAlignItems = "CENTER";
          frame.counterAxisAlignItems = "CENTER";
          await figma.loadFontAsync({ family: "Inter", style: "Regular" });
          const placeholderText = figma.createText();
          placeholderText.characters = ((_hc = node.attributes) == null ? void 0 : _hc.alt) || "Image";
          placeholderText.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }];
          frame.appendChild(placeholderText);
          if (!parentFrame) {
            frame.x = startX;
            frame.y = startY;
            figma.currentPage.appendChild(frame);
          } else {
            parentFrame.appendChild(frame);
          }
        } else if (["ul", "ol"].includes(node.tagName)) {
          const listFrame = figma.createFrame();
          listFrame.fills = [];
          listFrame.name = node.tagName.toUpperCase() + " List";
          listFrame.layoutMode = "VERTICAL";
          listFrame.primaryAxisSizingMode = "AUTO";
          listFrame.counterAxisSizingMode = "AUTO";
          listFrame.itemSpacing = 6;
          listFrame.paddingLeft = 20;
          listFrame.paddingTop = 8;
          listFrame.paddingBottom = 8;
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
        } else if (node.tagName === "li") {
          await figma.loadFontAsync({ family: "Inter", style: "Regular" });
          const text = figma.createText();
          const parentList = ((_ic = parentFrame == null ? void 0 : parentFrame.name) == null ? void 0 : _ic.includes("OL")) ? "OL" : "UL";
          const bullet = parentList === "OL" ? "1. " : "\u2022 ";
          text.characters = bullet + (node.text || "List item");
          text.name = "List Item";
          if (node.styles) {
            applyStylesToText(text, node.styles);
          }
          if (parentFrame && parentFrame.getPluginData("textAlign") === "center") {
            if (!((_jc = node.styles) == null ? void 0 : _jc["text-align"])) {
              text.textAlignHorizontal = "CENTER";
            }
          }
          if ((_lc = (_kc = node.styles) == null ? void 0 : _kc.className) == null ? void 0 : _lc.includes("detail")) {
          }
          if (!parentFrame) {
            text.x = startX;
            text.y = startY;
            figma.currentPage.appendChild(text);
          } else {
            parentFrame.appendChild(text);
          }
        } else if (["p", "h1", "h2", "h3", "h4", "h5", "h6", "span", "a", "label", "strong", "b", "em", "i", "code", "small", "mark", "del", "ins", "sub", "sup", "cite", "q", "abbr", "time"].includes(node.tagName)) {
          const hasNoDirectText = !node.text || !node.text.trim();
          const hasChildren = node.children && node.children.length > 0;
          if (hasNoDirectText && hasChildren) {
            await createFigmaNodesFromStructure(node.children, parentFrame, startX, startY, inheritedStyles);
            continue;
          }
          const hasBackground = ((_mc = node.styles) == null ? void 0 : _mc["background"]) || ((_nc = node.styles) == null ? void 0 : _nc["background-color"]);
          const isSpanWithBackground = node.tagName === "span" && hasBackground && hasBackground !== "transparent";
          if (isSpanWithBackground) {
            const spanFrame = figma.createFrame();
            spanFrame.name = "BADGE Frame";
            spanFrame.layoutMode = "HORIZONTAL";
            spanFrame.primaryAxisSizingMode = "AUTO";
            spanFrame.counterAxisSizingMode = "AUTO";
            spanFrame.primaryAxisAlignItems = "CENTER";
            spanFrame.counterAxisAlignItems = "CENTER";
            if (node.styles) {
              applyStylesToFrame(spanFrame, node.styles);
            }
            await figma.loadFontAsync({ family: "Inter", style: "Regular" });
            const text = figma.createText();
            text.characters = node.text || "Badge text";
            text.name = "BADGE Text";
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
            await figma.loadFontAsync({ family: "Inter", style: "Regular" });
            const text = figma.createText();
            text.characters = node.text || "Empty text";
            text.name = node.tagName.toUpperCase() + " Text";
            if (node.tagName.startsWith("h")) {
              const level = parseInt(node.tagName.charAt(1));
              const headingSizes = { 1: 36, 2: 28, 3: 22, 4: 20, 5: 18, 6: 16 };
              text.fontSize = headingSizes[level] || 16;
            } else if (node.tagName === "p") {
              text.fontSize = 16;
            }
            if (node.tagName === "a") {
              text.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.5, b: 1 } }];
            }
            if (node.tagName === "strong" || node.tagName === "b") {
              try {
                await figma.loadFontAsync({ family: "Inter", style: "Bold" });
                text.fontName = { family: "Inter", style: "Bold" };
              } catch (e) {
              }
            }
            if (node.tagName === "em" || node.tagName === "i" || node.tagName === "cite") {
              try {
                await figma.loadFontAsync({ family: "Inter", style: "Italic" });
                text.fontName = { family: "Inter", style: "Italic" };
              } catch (e) {
              }
            }
            if (node.tagName === "code") {
              try {
                await figma.loadFontAsync({ family: "Roboto Mono", style: "Regular" });
                text.fontName = { family: "Roboto Mono", style: "Regular" };
              } catch (e) {
              }
            }
            if (node.tagName === "small") {
              text.fontSize = Math.max(10, text.fontSize * 0.85);
            }
            if (node.tagName === "del" || node.tagName === "s") {
              text.textDecoration = "STRIKETHROUGH";
            }
            if (node.tagName === "ins" || node.tagName === "u") {
              text.textDecoration = "UNDERLINE";
            }
            if (node.styles) {
              applyStylesToText(text, node.styles);
            }
            if (parentFrame && parentFrame.getPluginData("textAlign") === "center") {
              if (!((_oc = node.styles) == null ? void 0 : _oc["text-align"])) {
                text.textAlignHorizontal = "CENTER";
              }
            }
            if ((_qc = (_pc = node.styles) == null ? void 0 : _pc.className) == null ? void 0 : _qc.includes("detail")) {
            }
            if (!parentFrame) {
              text.x = startX;
              text.y = startY;
              figma.currentPage.appendChild(text);
            } else {
              parentFrame.appendChild(text);
              const parentHasAutoLayout = parentFrame.layoutMode === "HORIZONTAL" || parentFrame.layoutMode === "VERTICAL";
              const hasConstrainedWidth = (inheritedStyles == null ? void 0 : inheritedStyles["_hasConstrainedWidth"]) === true;
              if (parentHasAutoLayout) {
                if (hasConstrainedWidth) {
                  text.layoutSizingHorizontal = "FILL";
                  text.textAutoResize = "HEIGHT";
                } else {
                  text.textAutoResize = "WIDTH_AND_HEIGHT";
                }
              } else {
                text.textAutoResize = "WIDTH_AND_HEIGHT";
              }
            }
          }
        } else if (node.children && node.children.length > 0) {
          await createFigmaNodesFromStructure(node.children, parentFrame, 0, 0, inheritedStyles);
        }
      }
    }
  }
  var mcpMonitoringInterval = null;
  var sseConnected = false;
  var sseLastSuccessTimestamp = 0;
  var detailedLogsEnabled = false;
  function debugLog(...args) {
    if (detailedLogsEnabled) {
      console.log(...args);
    }
  }
  var processedRequestIDs = /* @__PURE__ */ new Set();
  var PROCESSED_IDS_MAX_SIZE = 1e3;
  function isRequestProcessed(requestId) {
    return processedRequestIDs.has(requestId);
  }
  function markRequestProcessed(requestId) {
    if (processedRequestIDs.size >= PROCESSED_IDS_MAX_SIZE) {
      const firstId = processedRequestIDs.values().next().value;
      if (firstId) {
        processedRequestIDs.delete(firstId);
      }
    }
    processedRequestIDs.add(requestId);
    console.log(`[DEDUP] Marked RequestID as processed: ${requestId}`);
  }
  async function readMCPSharedData() {
    try {
      debugLog("[MCP] Reading MCP data from file system...");
      return new Promise((resolve) => {
        const handleFileResponse = (msg) => {
          if (msg.type === "file-mcp-data-response") {
            figma.ui.off("message", handleFileResponse);
            if (msg.data) {
              debugLog("[MCP] Found data in file system:", msg.data);
              resolve(msg.data);
            } else {
              debugLog("[MCP] No data found in file system");
              resolve(null);
            }
          }
        };
        figma.ui.on("message", handleFileResponse);
        figma.ui.postMessage({ type: "request-file-mcp-data" });
        setTimeout(() => {
          figma.ui.off("message", handleFileResponse);
          resolve(null);
        }, 500);
      });
    } catch (error) {
      console.log("[MCP] Error reading MCP data:", error);
      return null;
    }
  }
  async function deleteMCPSharedData() {
    try {
      figma.ui.postMessage({ type: "delete-file-mcp-data" });
      debugLog("[MCP] Requested deletion of MCP data file");
      return true;
    } catch (error) {
      console.log("[MCP] Could not delete MCP data:", error);
      return false;
    }
  }
  function startMCPMonitoring() {
    console.log("[MCP] Starting SSE-based monitoring with intelligent fallback...");
    if (mcpMonitoringInterval) {
      clearInterval(mcpMonitoringInterval);
      mcpMonitoringInterval = null;
    }
    sseConnected = false;
    sseLastSuccessTimestamp = Date.now();
    figma.ui.postMessage({ type: "start-sse" });
    mcpMonitoringInterval = setInterval(async () => {
      const now = Date.now();
      const timeSinceLastSSE = now - sseLastSuccessTimestamp;
      if (!sseConnected || timeSinceLastSSE > 3e4) {
        console.log("[MCP] \u{1F504} SSE inactive, checking fallback...");
        try {
          const mcpData = await readMCPSharedData();
          if (mcpData) {
            const dataTimestamp = mcpData.timestamp ? new Date(mcpData.timestamp).getTime() : 0;
            if (dataTimestamp > sseLastSuccessTimestamp) {
              console.log("[MCP] \u{1F4BE} Fallback processing new data");
              figma.ui.postMessage({
                type: "parse-mcp-html",
                html: mcpData.content,
                name: mcpData.name || "Fallback Import",
                fromMCP: true,
                mcpSource: "fallback"
              });
              await deleteMCPSharedData();
            }
          }
        } catch (error) {
          console.log("[MCP] Fallback check failed:", error);
        }
      } else {
        debugLog("[MCP] \u{1F7E2} SSE active, fallback not needed");
      }
    }, 15e3);
    console.log("[MCP] \u2705 Intelligent fallback enabled (SSE-priority)");
  }
  function stopMCPMonitoring() {
    console.log("[MCP] Stopping SSE-based monitoring...");
    figma.ui.postMessage({ type: "stop-sse" });
    if (mcpMonitoringInterval) {
      clearInterval(mcpMonitoringInterval);
      mcpMonitoringInterval = null;
    }
  }
  async function testMCPConnection() {
    let results = [];
    try {
      const fileData = await readMCPSharedData();
      if (fileData !== null) {
        results.push("\u2705 MCP FileSystem: Working - data found");
        results.push(`\u2022 Source: ${fileData.source || "unknown"}`);
        results.push(`\u2022 Tool: ${fileData.tool || "unknown"}`);
        results.push(`\u2022 Environment: ${fileData.environment || "unknown"}`);
        results.push(`\u2022 Type: ${fileData.type || "unknown"}`);
        results.push(`\u2022 Function: ${fileData.function || "unknown"}`);
      } else {
        results.push("\u26A0\uFE0F MCP FileSystem: Ready - no data yet");
      }
    } catch (error) {
      results.push("\u274C MCP FileSystem: Error - " + error);
    }
    if (results.filter((r) => r.includes("data found")).length === 0) {
      results.push("");
      results.push("\u{1F4A1} To test:");
      results.push('\u2022 Run: node ai-to-figma.js "test" "Test"');
      results.push("\u2022 Or use browser console with test script");
    }
    const message = results.join("\n");
    figma.ui.postMessage({ type: "mcp-test-response", message });
  }
  figma.ui.onmessage = async (msg) => {
    var _a;
    debugLog("[MAIN HANDLER] Message received:", msg.type);
    if (msg.type === "mcp-test") {
      testMCPConnection();
      return;
    }
    if (msg.type === "resize-plugin") {
      if (msg.minimized) {
        figma.ui.resize(360, 40);
      } else {
        figma.ui.resize(360, 380);
      }
      return;
    }
    if (msg.type === "store-mcp-data") {
      debugLog("[MCP] Storing external MCP data in clientStorage");
      try {
        await figma.clientStorage.setAsync("mcp-shared-data", msg.data);
        debugLog("[MCP] Successfully stored MCP data in clientStorage");
        figma.ui.postMessage({
          type: "mcp-storage-response",
          success: true,
          message: "MCP data stored successfully"
        });
      } catch (error) {
        console.error("[MCP] Error storing MCP data:", error);
        figma.ui.postMessage({
          type: "mcp-storage-response",
          success: false,
          message: "Error storing MCP data: " + error.message
        });
      }
      return;
    }
    if (msg.type === "mcp-html") {
      debugLog("[MCP] Recibido HTML v\xEDa MCP");
      try {
        figma.notify("Procesando HTML recibido v\xEDa MCP...");
        figma.ui.postMessage({ type: "mcp-html-response", message: "\u2705 HTML recibido y procesado v\xEDa MCP." });
        debugLog("[MCP] HTML procesado correctamente.");
      } catch (error) {
        figma.ui.postMessage({ type: "mcp-html-response", message: "\u274C Error procesando HTML v\xEDa MCP: " + error.message });
        console.error("[MCP] Error procesando HTML v\xEDa MCP:", error);
      }
      return;
    }
    if (msg.type === "html-structure") {
      console.log(`[HTML] Processing: ${msg.name || "Unnamed"}`);
      debugLog("[MAIN HANDLER] Structure length:", ((_a = msg.structure) == null ? void 0 : _a.length) || 0);
      debugLog("[MAIN HANDLER] From MCP:", msg.fromMCP);
      const requestId = msg.requestId || msg.timestamp || `fallback-${Date.now()}`;
      if (isRequestProcessed(requestId)) {
        console.log(`[DEDUP] \u{1F6AB} RequestID already processed, skipping: ${requestId}`);
        return;
      }
      markRequestProcessed(requestId);
      console.log(`[HTML] \u2705 Passed dedup check, proceeding with requestId: ${requestId}`);
      const detectedDesignWidth = msg.detectedWidth || null;
      if (detectedDesignWidth) {
        CSS_CONFIG.viewportWidth = detectedDesignWidth;
        console.log("[WIDTH] Using detected width from UI:", detectedDesignWidth);
        console.log("[WIDTH] Updated CSS_CONFIG.viewportWidth to:", detectedDesignWidth);
      }
      const detectFullPageLayout = (structure) => {
        if (!structure || structure.length === 0) return false;
        const checkNode = (node) => {
          var _a2, _b, _c, _d, _e, _f, _g;
          if (((_a2 = node.styles) == null ? void 0 : _a2.display) === "grid" && ((_b = node.styles) == null ? void 0 : _b["grid-template-areas"])) {
            return true;
          }
          if (((_c = node.styles) == null ? void 0 : _c.display) === "grid" && ((_d = node.styles) == null ? void 0 : _d["grid-template-columns"])) {
            const cols = parseGridColumns(node.styles["grid-template-columns"]);
            if (cols >= 3) return true;
          }
          if ((node.tagName === "body" || node.tagName === "html") && ((_e = node.styles) == null ? void 0 : _e.padding)) {
            const padding = parseSize(node.styles.padding);
            if (padding && padding >= 16) return true;
          }
          if (!node.children || node.children.length < 2) {
            if (node.children) {
              for (const child of node.children) {
                if (checkNode(child)) return true;
              }
            }
            return false;
          }
          const hasSidebar = node.children.some((child) => {
            var _a3, _b2;
            const pos = (_a3 = child.styles) == null ? void 0 : _a3.position;
            const width = (_b2 = child.styles) == null ? void 0 : _b2.width;
            return (pos === "fixed" || pos === "absolute") && width && !width.includes("%");
          });
          const hasMainContent = node.children.some((child) => {
            var _a3;
            const ml = (_a3 = child.styles) == null ? void 0 : _a3["margin-left"];
            return ml && parseSize(ml) && parseSize(ml) > 50;
          });
          const hasFullHeight = ((_f = node.styles) == null ? void 0 : _f.height) === "100vh" || ((_g = node.styles) == null ? void 0 : _g["min-height"]) === "100vh";
          if (hasSidebar && hasMainContent) return true;
          if (hasFullHeight) return true;
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
      const DEFAULT_PAGE_WIDTH = 1440;
      const calculateDynamicWidth = (structure) => {
        if (!structure || structure.length === 0) return null;
        let sidebarWidth = 0;
        let mainContentMargin = 0;
        let explicitWidth = null;
        const analyzeNode = (node, depth = 0) => {
          var _a2, _b, _c, _d, _e, _f;
          if (depth <= 1 && ((_a2 = node.styles) == null ? void 0 : _a2.width)) {
            const width = parseSize(node.styles.width);
            if (width && width > 0 && !((_c = (_b = node.styles) == null ? void 0 : _b.position) == null ? void 0 : _c.includes("fixed"))) {
              console.log("[WIDTH] Found explicit width:", width, "on", node.tagName);
              explicitWidth = width;
            }
          }
          if (((_d = node.styles) == null ? void 0 : _d.position) === "fixed" && ((_e = node.styles) == null ? void 0 : _e.width)) {
            const width = parseSize(node.styles.width);
            if (width && width > 0) {
              sidebarWidth = Math.max(sidebarWidth, width);
              console.log("[WIDTH] Detected fixed sidebar width:", width);
            }
          }
          if ((_f = node.styles) == null ? void 0 : _f["margin-left"]) {
            const margin = parseSize(node.styles["margin-left"]);
            if (margin && margin > 0) {
              mainContentMargin = Math.max(mainContentMargin, margin);
              console.log("[WIDTH] Detected main content margin-left:", margin);
            }
          }
          if (node.children) {
            for (const child of node.children) {
              analyzeNode(child, depth + 1);
            }
          }
        };
        for (const node of structure) {
          analyzeNode(node, 0);
        }
        if (explicitWidth) return explicitWidth;
        if (sidebarWidth > 0 && mainContentMargin > 0) {
          const calculatedWidth = sidebarWidth + 1200;
          console.log("[WIDTH] Calculated width from sidebar pattern:", calculatedWidth);
          return calculatedWidth;
        }
        return null;
      };
      const structureWidth = calculateDynamicWidth(msg.structure);
      debugLog("[MAIN HANDLER] Full page layout detected:", isFullPageLayout);
      debugLog("[MAIN HANDLER] Detected design width (meta/CSS):", detectedDesignWidth);
      debugLog("[MAIN HANDLER] Structure-based width:", structureWidth);
      const mainContainer = figma.createFrame();
      const containerName = msg.fromMCP ? `${msg.name || "MCP Import"}` : "HTML Import Container";
      mainContainer.name = containerName;
      mainContainer.fills = [];
      mainContainer.layoutMode = "VERTICAL";
      mainContainer.primaryAxisSizingMode = "AUTO";
      const containerWidth = detectedDesignWidth || structureWidth || (isFullPageLayout ? DEFAULT_PAGE_WIDTH : null);
      if (containerWidth) {
        mainContainer.counterAxisSizingMode = "FIXED";
        mainContainer.resize(containerWidth, mainContainer.height);
        debugLog("[MAIN HANDLER] Set container width to:", containerWidth);
      } else {
        mainContainer.counterAxisSizingMode = "AUTO";
      }
      mainContainer.paddingLeft = 0;
      mainContainer.paddingRight = 0;
      mainContainer.paddingTop = 0;
      mainContainer.paddingBottom = 0;
      mainContainer.itemSpacing = 0;
      const viewport = figma.viewport.center;
      mainContainer.x = viewport.x - (containerWidth ? containerWidth / 2 : 200);
      mainContainer.y = viewport.y - 200;
      figma.currentPage.appendChild(mainContainer);
      debugLog("[MAIN HANDLER] Created main container, calling createFigmaNodesFromStructure...");
      await createFigmaNodesFromStructure(msg.structure, mainContainer, 0, 0, void 0);
      console.log("[HTML] \u2705 Conversion completed");
      figma.currentPage.selection = [mainContainer];
      figma.viewport.scrollAndZoomIntoView([mainContainer]);
      figma.notify("\u2705 HTML converted successfully!");
    }
    if (msg.type === "start-mcp-monitoring") {
      console.log("[MCP] Starting MCP monitoring...");
      startMCPMonitoring();
      figma.notify("\u{1F504} MCP Monitoring iniciado");
    }
    if (msg.type === "stop-mcp-monitoring") {
      console.log("[MCP] Stopping MCP monitoring...");
      stopMCPMonitoring();
      figma.notify("\u23F9\uFE0F MCP Monitoring detenido");
    }
    if (msg.type === "sse-connected") {
      sseConnected = true;
      sseLastSuccessTimestamp = Date.now();
      console.log("[SSE] \u{1F7E2} Connected");
    }
    if (msg.type === "sse-disconnected") {
      sseConnected = false;
      console.log("[SSE] \u{1F534} Disconnected");
    }
    if (msg.type === "sse-message-processed") {
      sseLastSuccessTimestamp = msg.timestamp || Date.now();
      debugLog("[MCP] \u{1F4E1} SSE message processed, timestamp updated");
    }
    if (msg.type === "sse-processing-timestamp") {
      sseLastSuccessTimestamp = msg.timestamp;
      debugLog("[MCP] \u{1F3AF} SSE processing timestamp - fallback blocked");
    }
    if (msg.type === "start-sse") {
      debugLog("[SSE] Starting SSE connection from UI...");
      figma.ui.postMessage({
        type: "start-sse-connection"
      });
    }
    if (msg.type === "stop-sse") {
      debugLog("[SSE] Stopping SSE connection from UI...");
      figma.ui.postMessage({
        type: "stop-sse-connection"
      });
    }
    if (msg.type === "test-broadcast") {
      debugLog("[SSE] Connection test requested from UI...");
      figma.notify("\u{1F517} Connection test sent");
      setTimeout(() => {
        figma.ui.postMessage({ type: "test-broadcast-complete" });
      }, 1e3);
    }
  };
})();
