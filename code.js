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
  function parseSize(value, referenceWidth) {
    if (!value || value === "auto" || value === "inherit" || value === "initial") return null;
    if (value.includes("calc(")) {
      return parseCalc(value, referenceWidth || CSS_CONFIG.viewportWidth);
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
  function parseCalc(value, referenceWidth = 100) {
    const match = value.match(/calc\((.+)\)$/);
    if (!match) return null;
    let expression = match[1].trim();
    const toPixels = (val) => {
      val = val.trim();
      if (val.endsWith("%")) {
        const pct = parseFloat(val);
        return isNaN(pct) ? null : pct / 100 * referenceWidth;
      }
      if (val.endsWith("px")) {
        const px = parseFloat(val);
        return isNaN(px) ? null : px;
      }
      if (val.endsWith("rem")) {
        const rem = parseFloat(val);
        return isNaN(rem) ? null : rem * CSS_CONFIG.remBase;
      }
      if (val.endsWith("em")) {
        const em = parseFloat(val);
        return isNaN(em) ? null : em * CSS_CONFIG.remBase;
      }
      if (val.endsWith("vw")) {
        const vw = parseFloat(val);
        return isNaN(vw) ? null : vw / 100 * CSS_CONFIG.viewportWidth;
      }
      if (val.endsWith("vh")) {
        const vh = parseFloat(val);
        return isNaN(vh) ? null : vh / 100 * CSS_CONFIG.viewportHeight;
      }
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    };
    const tokens = [];
    const tokenRegex = /([+-]?\d*\.?\d+(?:px|%|rem|em|vw|vh)?)|([+\-*/])/g;
    let tokenMatch;
    while ((tokenMatch = tokenRegex.exec(expression)) !== null) {
      const token = (tokenMatch[1] || tokenMatch[2]).trim();
      if (token) tokens.push(token);
    }
    if (tokens.length === 0) return null;
    const values = [];
    for (const token of tokens) {
      if (["+", "-", "*", "/"].includes(token)) {
        values.push(token);
      } else {
        const px = toPixels(token);
        if (px === null) return null;
        values.push(px);
      }
    }
    const afterMultDiv = [];
    let i = 0;
    while (i < values.length) {
      if (values[i] === "*" || values[i] === "/") {
        const left = afterMultDiv.pop();
        const right = values[i + 1];
        if (values[i] === "*") {
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
    let result = afterMultDiv[0];
    i = 1;
    while (i < afterMultDiv.length) {
      const op = afterMultDiv[i];
      const val = afterMultDiv[i + 1];
      if (op === "+") {
        result += val;
      } else if (op === "-") {
        result -= val;
      }
      i += 2;
    }
    return Math.round(result * 100) / 100;
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

  // src/utils/effects.ts
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
      result.rotation = parseFloat(rotateMatch[1]);
    }
    const scaleMatch = transformValue.match(/scale\((-?\d+(?:\.\d+)?)\s*(?:,\s*(-?\d+(?:\.\d+)?))?\)/);
    if (scaleMatch) {
      result.scaleX = parseFloat(scaleMatch[1]);
      result.scaleY = scaleMatch[2] ? parseFloat(scaleMatch[2]) : result.scaleX;
    }
    const scaleXMatch = transformValue.match(/scaleX\((-?\d+(?:\.\d+)?)\)/);
    if (scaleXMatch) {
      result.scaleX = parseFloat(scaleXMatch[1]);
    }
    const scaleYMatch = transformValue.match(/scaleY\((-?\d+(?:\.\d+)?)\)/);
    if (scaleYMatch) {
      result.scaleY = parseFloat(scaleYMatch[1]);
    }
    const translateMatch = transformValue.match(/translate\(([^,)]+)(?:,\s*([^)]+))?\)/);
    if (translateMatch) {
      result.translateX = parseSize(translateMatch[1]) || 0;
      result.translateY = translateMatch[2] ? parseSize(translateMatch[2]) || 0 : 0;
    }
    const translateXMatch = transformValue.match(/translateX\(([^)]+)\)/);
    if (translateXMatch) {
      result.translateX = parseSize(translateXMatch[1]) || 0;
    }
    const translateYMatch = transformValue.match(/translateY\(([^)]+)\)/);
    if (translateYMatch) {
      result.translateY = parseSize(translateYMatch[1]) || 0;
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
  function parseFilter(filterValue) {
    var _a;
    const result = {};
    if (!filterValue) return result;
    const blurMatch = filterValue.match(/blur\((\d+(?:\.\d+)?)(px)?\)/);
    if (blurMatch) {
      result.blur = parseFloat(blurMatch[1]);
    }
    const dropShadowMatch = filterValue.match(/drop-shadow\(([^)]+)\)/);
    if (dropShadowMatch) {
      const shadowParts = dropShadowMatch[1].trim();
      const values = shadowParts.match(/(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s+(\d+(?:\.\d+)?(?:px)?)\s*(.*)/);
      if (values) {
        const offsetX = parseSize(values[1]) || 0;
        const offsetY = parseSize(values[2]) || 0;
        const blurRadius = parseSize(values[3]) || 0;
        const colorPart = ((_a = values[4]) == null ? void 0 : _a.trim()) || "rgba(0,0,0,0.5)";
        let color = { r: 0, g: 0, b: 0, a: 0.5 };
        const rgba = hexToRgba(colorPart);
        if (rgba) {
          color = rgba;
        } else {
          const rgb = hexToRgb(colorPart);
          if (rgb) {
            color = __spreadProps(__spreadValues({}, rgb), { a: 1 });
          }
        }
        result.dropShadow = {
          type: "DROP_SHADOW",
          offset: { x: offsetX, y: offsetY },
          radius: blurRadius,
          color,
          blendMode: "NORMAL",
          visible: true
        };
      }
    }
    return result;
  }
  function parseBackdropFilter(filterValue) {
    const result = {};
    if (!filterValue) return result;
    const blurMatch = filterValue.match(/blur\((\d+(?:\.\d+)?)(px)?\)/);
    if (blurMatch) {
      result.blur = parseFloat(blurMatch[1]);
    }
    return result;
  }

  // src/utils/grid.ts
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
  function parseGridColumnWidths(gridTemplate, availableWidth, gap = 0) {
    if (!gridTemplate) return [availableWidth];
    let expanded = gridTemplate;
    const repeatMatch = gridTemplate.match(/repeat\((\d+),\s*([^)]+)\)/);
    if (repeatMatch) {
      const count = parseInt(repeatMatch[1], 10);
      const value = repeatMatch[2].trim();
      expanded = Array(count).fill(value).join(" ");
    }
    expanded = expanded.replace(/minmax\([^,]+,\s*([^)]+)\)/g, "$1");
    const parts = expanded.split(/\s+/).filter((p) => p.trim());
    if (parts.length === 0) return [availableWidth];
    const totalGaps = (parts.length - 1) * gap;
    const widthForColumns = availableWidth - totalGaps;
    const columnDefs = [];
    let totalFr = 0;
    let fixedWidth = 0;
    for (const part of parts) {
      if (part.endsWith("fr")) {
        const frValue = parseFloat(part) || 1;
        columnDefs.push({ type: "fr", value: frValue });
        totalFr += frValue;
      } else if (part.endsWith("px")) {
        const pxValue = parseFloat(part) || 0;
        columnDefs.push({ type: "px", value: pxValue });
        fixedWidth += pxValue;
      } else if (part === "auto" || part.endsWith("%")) {
        columnDefs.push({ type: "fr", value: 1 });
        totalFr += 1;
      } else {
        const numValue = parseFloat(part);
        if (!isNaN(numValue) && numValue > 0) {
          if (numValue < 10) {
            columnDefs.push({ type: "fr", value: numValue });
            totalFr += numValue;
          } else {
            columnDefs.push({ type: "px", value: numValue });
            fixedWidth += numValue;
          }
        } else {
          columnDefs.push({ type: "fr", value: 1 });
          totalFr += 1;
        }
      }
    }
    const frWidth = widthForColumns - fixedWidth;
    const frUnit = totalFr > 0 ? frWidth / totalFr : 0;
    return columnDefs.map((col) => {
      if (col.type === "px") {
        return col.value;
      } else {
        return Math.round(col.value * frUnit);
      }
    });
  }

  // src/code.ts
  figma.showUI(__html__, { width: 360, height: 380 });
  function generateSessionId() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "user_";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  async function initializeSessionId() {
    let sessionId = await figma.clientStorage.getAsync("figma-session-id");
    if (!sessionId) {
      sessionId = generateSessionId();
      await figma.clientStorage.setAsync("figma-session-id", sessionId);
      console.log("[Session] Generated new session ID:", sessionId);
    } else {
      console.log("[Session] Using existing session ID:", sessionId);
    }
    figma.ui.postMessage({
      type: "session-id",
      sessionId
    });
    return sessionId;
  }
  initializeSessionId();
  function calculatePercentageWidth(widthValue, parentFrame) {
    if (!parentFrame || !widthValue) return null;
    const percentage = parsePercentage(widthValue);
    if (percentage === null) return null;
    const availableWidth = parentFrame.width - (parentFrame.paddingLeft || 0) - (parentFrame.paddingRight || 0);
    return Math.round(percentage / 100 * availableWidth);
  }
  function applyStylesToFrame(frame, styles) {
    var _a, _b, _c, _d;
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
        try {
          frame.layoutSizingVertical = "FIXED";
        } catch (e) {
        }
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
      if (transform.scaleX !== void 0 || transform.scaleY !== void 0) {
        const scaleX = (_a = transform.scaleX) != null ? _a : 1;
        const scaleY = (_b = transform.scaleY) != null ? _b : 1;
        frame.resize(frame.width * scaleX, frame.height * scaleY);
      }
      if (transform.translateX !== void 0 || transform.translateY !== void 0) {
        frame.x += (_c = transform.translateX) != null ? _c : 0;
        frame.y += (_d = transform.translateY) != null ? _d : 0;
      }
    }
    if (styles.filter) {
      const filter = parseFilter(styles.filter);
      const effects = [...frame.effects || []];
      if (filter.blur !== void 0 && filter.blur > 0) {
        effects.push({
          type: "LAYER_BLUR",
          radius: filter.blur,
          visible: true
        });
      }
      if (filter.dropShadow) {
        effects.push({
          type: "DROP_SHADOW",
          color: filter.dropShadow.color,
          offset: filter.dropShadow.offset,
          radius: filter.dropShadow.radius,
          spread: 0,
          visible: true,
          blendMode: "NORMAL"
        });
      }
      if (effects.length > 0) {
        frame.effects = effects;
      }
    }
    if (styles["backdrop-filter"]) {
      const backdropFilter = parseBackdropFilter(styles["backdrop-filter"]);
      if (backdropFilter.blur !== void 0 && backdropFilter.blur > 0) {
        const effects = [...frame.effects || []];
        effects.push({
          type: "BACKGROUND_BLUR",
          radius: backdropFilter.blur,
          visible: true
        });
        frame.effects = effects;
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
    } else if (styles["_parentJustifyContent"]) {
      const justify = styles["_parentJustifyContent"];
      if (justify === "center") text.textAlignHorizontal = "CENTER";
      else if (justify === "flex-end" || justify === "end") text.textAlignHorizontal = "RIGHT";
      else if (justify === "flex-start" || justify === "start") text.textAlignHorizontal = "LEFT";
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
      if (parentFrame.layoutMode !== "NONE") {
        return;
      }
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
  async function createGridLayoutWithAreas(children, parentFrame, areaMap, numRows, numCols, gap, inheritedStyles) {
    await createGridLayoutWithAreasFallback(children, parentFrame, areaMap, numRows, numCols, gap, inheritedStyles);
  }
  async function createGridLayoutWithAreasFallback(children, parentFrame, areaMap, numRows, numCols, gap, inheritedStyles) {
    var _a;
    const parentWidth = parentFrame.width || 1200;
    const totalGaps = (numCols - 1) * gap;
    const columnWidth = Math.floor((parentWidth - totalGaps) / numCols);
    const childrenByArea = {};
    for (const child of children) {
      const gridArea = (_a = child.styles) == null ? void 0 : _a["grid-area"];
      if (gridArea && areaMap[gridArea]) {
        childrenByArea[gridArea] = child;
      }
    }
    const rowGroups = [];
    let currentGroup = [0];
    for (let r = 1; r < numRows; r++) {
      const prevRowCols = getColumnBoundaries(r - 1, areaMap, numCols);
      const currRowCols = getColumnBoundaries(r, areaMap, numCols);
      if (arraysEqual(prevRowCols, currRowCols)) {
        currentGroup.push(r);
      } else {
        rowGroups.push(currentGroup);
        currentGroup = [r];
      }
    }
    rowGroups.push(currentGroup);
    parentFrame.layoutMode = "VERTICAL";
    parentFrame.itemSpacing = gap;
    parentFrame.counterAxisSizingMode = "FIXED";
    parentFrame.primaryAxisSizingMode = "AUTO";
    const processedAreas = /* @__PURE__ */ new Set();
    for (const rowGroup of rowGroups) {
      const firstRow = rowGroup[0];
      const colBoundaries = getColumnBoundaries(firstRow, areaMap, numCols);
      const sectionFrame = figma.createFrame();
      sectionFrame.name = `Section (rows ${rowGroup[0] + 1}-${rowGroup[rowGroup.length - 1] + 1})`;
      sectionFrame.fills = [];
      sectionFrame.layoutMode = "HORIZONTAL";
      sectionFrame.primaryAxisSizingMode = "FIXED";
      sectionFrame.counterAxisSizingMode = "AUTO";
      sectionFrame.itemSpacing = gap;
      sectionFrame.resize(parentWidth, 100);
      parentFrame.appendChild(sectionFrame);
      try {
        sectionFrame.layoutSizingHorizontal = "FILL";
      } catch (e) {
      }
      for (let i = 0; i < colBoundaries.length - 1; i++) {
        const colStart = colBoundaries[i];
        const colEnd = colBoundaries[i + 1];
        const colSpan = colEnd - colStart;
        const colWidth = columnWidth * colSpan + gap * (colSpan - 1);
        const colFrame = figma.createFrame();
        colFrame.name = `Column ${colStart + 1}-${colEnd}`;
        colFrame.fills = [];
        colFrame.layoutMode = "VERTICAL";
        colFrame.primaryAxisSizingMode = "AUTO";
        colFrame.counterAxisSizingMode = "FIXED";
        colFrame.itemSpacing = gap;
        colFrame.resize(colWidth, 100);
        sectionFrame.appendChild(colFrame);
        try {
          colFrame.layoutGrow = colSpan;
          colFrame.layoutSizingHorizontal = "FILL";
        } catch (e) {
        }
        const areasInColumn = [];
        for (const row of rowGroup) {
          for (const [areaName, bounds] of Object.entries(areaMap)) {
            if (bounds.colStart === colStart && bounds.colEnd === colEnd && row >= bounds.rowStart && row < bounds.rowEnd && !areasInColumn.includes(areaName)) {
              areasInColumn.push(areaName);
            }
          }
        }
        areasInColumn.sort((a, b) => areaMap[a].rowStart - areaMap[b].rowStart);
        for (const areaName of areasInColumn) {
          if (processedAreas.has(areaName)) continue;
          processedAreas.add(areaName);
          const child = childrenByArea[areaName];
          const wrapper = figma.createFrame();
          wrapper.name = areaName;
          wrapper.fills = [];
          wrapper.layoutMode = "VERTICAL";
          wrapper.primaryAxisSizingMode = "AUTO";
          wrapper.counterAxisSizingMode = "AUTO";
          colFrame.appendChild(wrapper);
          try {
            wrapper.layoutSizingHorizontal = "FILL";
          } catch (e) {
          }
          if (child) {
            await createFigmaNodesFromStructure([child], wrapper, 0, 0, __spreadProps(__spreadValues({}, inheritedStyles), {
              "_hasConstrainedWidth": true,
              "_gridItemWidth": colWidth
            }));
          }
        }
      }
    }
  }
  function getColumnBoundaries(row, areaMap, numCols) {
    const boundaries = /* @__PURE__ */ new Set();
    boundaries.add(0);
    boundaries.add(numCols);
    for (const [_, bounds] of Object.entries(areaMap)) {
      if (row >= bounds.rowStart && row < bounds.rowEnd) {
        boundaries.add(bounds.colStart);
        boundaries.add(bounds.colEnd);
      }
    }
    return Array.from(boundaries).sort((a, b) => a - b);
  }
  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  function parseGridSpan(value) {
    if (!value) return 1;
    const match = value.match(/span\s+(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }
  function hasGridSpans(children) {
    var _a, _b;
    for (const child of children) {
      const colSpan = parseGridSpan((_a = child.styles) == null ? void 0 : _a["grid-column"]);
      const rowSpan = parseGridSpan((_b = child.styles) == null ? void 0 : _b["grid-row"]);
      if (colSpan > 1 || rowSpan > 1) return true;
    }
    return false;
  }
  async function createGridLayoutWithSpans(children, parentFrame, columns, gap, inheritedStyles, gridTemplateColumns) {
    var _a, _b, _c;
    if (!children || children.length === 0) return;
    const grid = [];
    const childPositions = [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const colSpan = parseGridSpan((_a = child.styles) == null ? void 0 : _a["grid-column"]);
      const rowSpan = parseGridSpan((_b = child.styles) == null ? void 0 : _b["grid-row"]);
      let placed = false;
      let row = 0;
      while (!placed) {
        while (grid.length <= row + rowSpan - 1) {
          grid.push(new Array(columns).fill(null));
        }
        for (let col = 0; col <= columns - colSpan; col++) {
          let canPlace = true;
          for (let r = 0; r < rowSpan && canPlace; r++) {
            for (let c = 0; c < colSpan && canPlace; c++) {
              if (grid[row + r][col + c] !== null) {
                canPlace = false;
              }
            }
          }
          if (canPlace) {
            for (let r = 0; r < rowSpan; r++) {
              for (let c = 0; c < colSpan; c++) {
                grid[row + r][col + c] = i;
              }
            }
            childPositions[i] = { row, col, rowSpan, colSpan };
            placed = true;
            break;
          }
        }
        if (!placed) row++;
      }
    }
    const numRows = grid.length;
    let useNativeGrid = false;
    const testParent = figma.createFrame();
    testParent.name = "__grid_test_parent__";
    try {
      testParent.layoutMode = "GRID";
      if (typeof testParent.gridColumnCount === "undefined") {
        throw new Error("Grid properties not available");
      }
      testParent.gridColumnCount = 2;
      testParent.gridRowCount = 1;
      const testChild = figma.createFrame();
      testChild.name = "__grid_test_child__";
      testParent.appendChild(testChild);
      if (typeof testChild.gridColumnAnchorIndex === "undefined") {
        throw new Error("Grid child positioning not available");
      }
      testChild.gridColumnAnchorIndex = 0;
      testChild.remove();
      testParent.remove();
      useNativeGrid = true;
    } catch (error) {
      testParent.remove();
      await createGridLayoutWithSpansFallback(children, parentFrame, columns, gap, inheritedStyles, gridTemplateColumns);
      return;
    }
    try {
      parentFrame.layoutMode = "GRID";
      parentFrame.gridColumnCount = columns;
      parentFrame.gridRowCount = numRows;
      parentFrame.gridColumnGap = gap;
      parentFrame.gridRowGap = gap;
      for (let i = 0; i < parentFrame.gridColumnSizes.length; i++) {
        parentFrame.gridColumnSizes[i].type = "FLEX";
      }
      for (let i = 0; i < parentFrame.gridRowSizes.length; i++) {
        parentFrame.gridRowSizes[i].type = "FLEX";
      }
    } catch (error) {
      console.error("[GRID-NATIVE] Error configuring grid after test passed:", error);
      parentFrame.layoutMode = "VERTICAL";
      await createGridLayoutWithSpansFallback(children, parentFrame, columns, gap, inheritedStyles, gridTemplateColumns);
      return;
    }
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const pos = childPositions[i];
      const wrapper = figma.createFrame();
      wrapper.name = ((_c = child.styles) == null ? void 0 : _c["class"]) ? `Grid Item: ${child.styles["class"].split(" ")[0]}` : `Grid Item ${i + 1}`;
      wrapper.fills = [];
      wrapper.layoutMode = "VERTICAL";
      wrapper.primaryAxisSizingMode = "AUTO";
      wrapper.counterAxisSizingMode = "AUTO";
      parentFrame.appendChild(wrapper);
      try {
        wrapper.gridColumnAnchorIndex = pos.col;
        wrapper.gridRowAnchorIndex = pos.row;
        wrapper.gridColumnSpan = pos.colSpan;
        wrapper.gridRowSpan = pos.rowSpan;
        wrapper.layoutSizingHorizontal = "FILL";
        wrapper.layoutSizingVertical = "FILL";
      } catch (error) {
        console.error(`[GRID-NATIVE] Error positioning item ${i}:`, error);
      }
      const gridInheritedStyles = __spreadProps(__spreadValues({}, inheritedStyles), {
        "_hasConstrainedWidth": true,
        "_isGridChild": true
      });
      await createFigmaNodesFromStructure([child], wrapper, 0, 0, gridInheritedStyles);
    }
  }
  async function createGridLayoutWithSpansFallback(children, parentFrame, columns, gap, inheritedStyles, gridTemplateColumns) {
    var _a, _b;
    const parentWidth = parentFrame.width || 1200;
    const paddingH = (parentFrame.paddingLeft || 0) + (parentFrame.paddingRight || 0);
    const availableWidth = parentWidth - paddingH;
    const columnWidths = parseGridColumnWidths(gridTemplateColumns, availableWidth, gap);
    const getSpanWidth = (startCol, colSpan) => {
      let width = 0;
      for (let i = startCol; i < startCol + colSpan && i < columnWidths.length; i++) {
        width += columnWidths[i];
      }
      width += gap * (colSpan - 1);
      return width;
    };
    parentFrame.layoutMode = "VERTICAL";
    parentFrame.itemSpacing = gap;
    parentFrame.counterAxisSizingMode = "FIXED";
    parentFrame.primaryAxisSizingMode = "AUTO";
    const grid = [];
    const childPositions = [];
    for (let i = 0; i < children.length; i++) {
      const colSpan = parseGridSpan((_a = children[i].styles) == null ? void 0 : _a["grid-column"]);
      const rowSpan = parseGridSpan((_b = children[i].styles) == null ? void 0 : _b["grid-row"]);
      let placed = false;
      let row = 0;
      while (!placed) {
        while (grid.length <= row + rowSpan - 1) {
          grid.push(new Array(columns).fill(null));
        }
        for (let col = 0; col <= columns - colSpan; col++) {
          let canPlace = true;
          for (let r = 0; r < rowSpan && canPlace; r++) {
            for (let c = 0; c < colSpan && canPlace; c++) {
              if (grid[row + r][col + c] !== null) canPlace = false;
            }
          }
          if (canPlace) {
            for (let r = 0; r < rowSpan; r++) {
              for (let c = 0; c < colSpan; c++) {
                grid[row + r][col + c] = i;
              }
            }
            childPositions[i] = { row, col, rowSpan, colSpan };
            placed = true;
            break;
          }
        }
        if (!placed) row++;
      }
    }
    const numRows = grid.length;
    const rowFrames = [];
    for (let r = 0; r < numRows; r++) {
      const rowFrame = figma.createFrame();
      rowFrame.name = `Grid Row ${r + 1}`;
      rowFrame.fills = [];
      rowFrame.layoutMode = "HORIZONTAL";
      rowFrame.primaryAxisSizingMode = "FIXED";
      rowFrame.counterAxisSizingMode = "AUTO";
      rowFrame.itemSpacing = gap;
      rowFrame.resize(parentWidth, 100);
      parentFrame.appendChild(rowFrame);
      try {
        rowFrame.layoutSizingHorizontal = "FILL";
      } catch (e) {
      }
      rowFrames.push(rowFrame);
    }
    for (let r = 0; r < numRows; r++) {
      let c = 0;
      while (c < columns) {
        const childIndex = grid[r][c];
        if (childIndex === null) {
          const placeholder = figma.createFrame();
          placeholder.name = `Empty`;
          placeholder.fills = [];
          const colWidth = columnWidths[c] || 100;
          placeholder.resize(colWidth, 10);
          rowFrames[r].appendChild(placeholder);
          try {
            placeholder.layoutSizingHorizontal = "FIXED";
          } catch (e) {
          }
          c++;
        } else {
          const pos = childPositions[childIndex];
          if (r === pos.row) {
            const itemWidth = getSpanWidth(pos.col, pos.colSpan);
            const wrapper = figma.createFrame();
            wrapper.name = `Grid Item (${pos.colSpan} cols)`;
            wrapper.fills = [];
            wrapper.layoutMode = "VERTICAL";
            wrapper.primaryAxisSizingMode = "AUTO";
            wrapper.counterAxisSizingMode = "FIXED";
            wrapper.resize(itemWidth, 100);
            rowFrames[r].appendChild(wrapper);
            try {
              wrapper.layoutSizingHorizontal = "FIXED";
            } catch (e) {
            }
            await createFigmaNodesFromStructure([children[childIndex]], wrapper, 0, 0, __spreadProps(__spreadValues({}, inheritedStyles), {
              "_hasConstrainedWidth": true,
              "_gridItemWidth": itemWidth
            }));
          } else {
            const itemWidth = getSpanWidth(pos.col, pos.colSpan);
            const placeholder = figma.createFrame();
            placeholder.name = `RowSpan placeholder (${pos.colSpan} cols)`;
            placeholder.fills = [];
            placeholder.resize(itemWidth, 1);
            rowFrames[r].appendChild(placeholder);
            try {
              placeholder.layoutSizingHorizontal = "FIXED";
            } catch (e) {
            }
          }
          c += pos.colSpan;
        }
      }
    }
  }
  async function createGridLayout(children, parentFrame, columns, gap, inheritedStyles, gridTemplateColumns) {
    if (!children || children.length === 0) {
      return;
    }
    await createGridLayoutFallback(children, parentFrame, columns, gap, inheritedStyles, gridTemplateColumns);
  }
  async function createGridLayoutFallback(children, parentFrame, columns, gap, inheritedStyles, gridTemplateColumns) {
    parentFrame.layoutMode = "VERTICAL";
    parentFrame.itemSpacing = gap;
    const parentWidth = parentFrame.width || 1200;
    const paddingH = (parentFrame.paddingLeft || 0) + (parentFrame.paddingRight || 0);
    const availableWidth = parentWidth - paddingH;
    const columnWidths = parseGridColumnWidths(gridTemplateColumns, availableWidth, gap);
    for (let i = 0; i < children.length; i += columns) {
      const rowFrame = figma.createFrame();
      rowFrame.name = `Grid Row`;
      rowFrame.fills = [];
      rowFrame.layoutMode = "HORIZONTAL";
      rowFrame.primaryAxisSizingMode = "AUTO";
      rowFrame.counterAxisSizingMode = "AUTO";
      rowFrame.itemSpacing = gap;
      parentFrame.appendChild(rowFrame);
      try {
        rowFrame.layoutSizingHorizontal = "FILL";
      } catch (e) {
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
          const colIndex = k % columns;
          const targetWidth = columnWidths[colIndex] || 100;
          child.layoutSizingHorizontal = "FIXED";
          child.resize(targetWidth, child.height);
        } catch (e) {
        }
      }
    }
  }
  async function createFigmaNodesFromStructure(structure, parentFrame, startX = 0, startY = 0, inheritedStyles) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da, _ea, _fa, _ga, _ha, _ia, _ja, _ka, _la, _ma, _na, _oa, _pa, _qa, _ra, _sa, _ta, _ua, _va, _wa, _xa, _ya, _za, _Aa, _Ba, _Ca, _Da, _Ea, _Fa, _Ga, _Ha, _Ia, _Ja, _Ka, _La, _Ma, _Na, _Oa, _Pa, _Qa, _Ra, _Sa, _Ta, _Ua, _Va, _Wa, _Xa, _Ya, _Za, __a, _$a, _ab, _bb, _cb, _db, _eb, _fb, _gb, _hb, _ib, _jb, _kb, _lb, _mb, _nb, _ob, _pb, _qb, _rb, _sb, _tb, _ub, _vb, _wb, _xb, _yb, _zb, _Ab, _Bb, _Cb, _Db, _Eb, _Fb, _Gb, _Hb, _Ib, _Jb, _Kb, _Lb, _Mb, _Nb, _Ob, _Pb, _Qb, _Rb, _Sb, _Tb, _Ub, _Vb, _Wb, _Xb, _Yb, _Zb, __b, _$b, _ac, _bc, _cc, _dc, _ec, _fc, _gc, _hc, _ic, _jc, _kc, _lc, _mc, _nc, _oc, _pc, _qc, _rc, _sc, _tc, _uc, _vc, _wc, _xc, _yc, _zc, _Ac, _Bc, _Cc, _Dc, _Ec, _Fc;
    debugLog("[NODE CREATION] Starting createFigmaNodesFromStructure");
    debugLog("[NODE CREATION] Structure:", structure);
    debugLog("[NODE CREATION] ParentFrame:", (parentFrame == null ? void 0 : parentFrame.name) || "none");
    debugLog("[NODE CREATION] Structure length:", (structure == null ? void 0 : structure.length) || 0);
    for (const node of structure) {
      debugLog("[NODE CREATION] Processing node:", node.tagName, node.type);
      console.log("[NODE DEBUG] Tag:", node.tagName, "Text:", (_a = node.text) == null ? void 0 : _a.substring(0, 20), "mixedContent:", (_b = node.mixedContent) == null ? void 0 : _b.length, "children:", (_c = node.children) == null ? void 0 : _c.length);
      if (node.type === "element") {
        if (["script", "style", "meta", "link", "title"].includes(node.tagName)) {
          continue;
        }
        if (((_d = node.styles) == null ? void 0 : _d.display) === "none") {
          continue;
        }
        const originalPosition = (_e = node.styles) == null ? void 0 : _e.position;
        if (((_f = node.styles) == null ? void 0 : _f.position) === "sticky" || ((_g = node.styles) == null ? void 0 : _g.position) === "fixed") {
          node.styles._originalPosition = originalPosition;
          node.styles.position = "relative";
          if (((_h = node.styles) == null ? void 0 : _h.width) === "100%") {
            node.styles._shouldFillWidth = true;
          }
          if (node.children) {
            for (const child of node.children) {
              if (child.styles) {
                child.styles._shouldFillWidth = true;
              }
            }
          }
        }
        const hasMarginLeft = ((_i = node.styles) == null ? void 0 : _i["margin-left"]) && parseSize(node.styles["margin-left"]) > 50;
        if (hasMarginLeft) {
          node.styles._isMainContent = true;
          delete node.styles["margin-left"];
        }
        const nodeStyles = __spreadValues(__spreadValues({}, inheritedStyles), node.styles);
        node.styles = nodeStyles;
        if (["body", "div", "section", "article", "nav", "header", "footer", "main", "aside", "blockquote", "figure", "figcaption", "address", "details", "summary"].includes(node.tagName)) {
          const frame = figma.createFrame();
          frame.name = node.tagName.toUpperCase() + " Frame";
          let layoutMode = "VERTICAL";
          if (((_j = node.styles) == null ? void 0 : _j.display) === "flex" || ((_k = node.styles) == null ? void 0 : _k.display) === "inline-flex") {
            layoutMode = ((_l = node.styles) == null ? void 0 : _l["flex-direction"]) === "column" ? "VERTICAL" : "HORIZONTAL";
          } else if (((_m = node.styles) == null ? void 0 : _m.display) === "grid") {
            layoutMode = "VERTICAL";
          } else if (((_n = node.styles) == null ? void 0 : _n.display) === "inline" || ((_o = node.styles) == null ? void 0 : _o.display) === "inline-block") {
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
          if (((_p = node.styles) == null ? void 0 : _p["flex-wrap"]) === "wrap" || ((_q = node.styles) == null ? void 0 : _q["flex-wrap"]) === "wrap-reverse") {
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
          if (((_r = node.styles) == null ? void 0 : _r.className) === "detail-label" || ((_s = node.styles) == null ? void 0 : _s.className) === "detail-value") {
          }
          if (parentFrame && parentFrame.getPluginData("textAlign") === "center") {
            if (!((_t = node.styles) == null ? void 0 : _t["text-align"])) {
              if (frame.layoutMode === "VERTICAL") {
                frame.primaryAxisAlignItems = "CENTER";
                frame.counterAxisAlignItems = "CENTER";
              } else if (frame.layoutMode === "HORIZONTAL") {
                frame.counterAxisAlignItems = "CENTER";
                frame.primaryAxisAlignItems = "CENTER";
              }
              frame.setPluginData("textAlign", "center");
              if ((_v = (_u = node.styles) == null ? void 0 : _u.className) == null ? void 0 : _v.includes("detail")) {
              }
            }
          }
          if (((_w = node.styles) == null ? void 0 : _w["max-width"]) && !((_x = node.styles) == null ? void 0 : _x.height) && !(inheritedStyles == null ? void 0 : inheritedStyles["_shouldFillVertical"])) {
            frame.layoutSizingVertical = "HUG";
          }
          const display = ((_y = node.styles) == null ? void 0 : _y.display) || "block";
          const isInlineElement = display === "inline" || display === "inline-block" || display === "inline-flex";
          const needsFullWidth = !isInlineElement;
          const hasBackground = frame.fills && frame.fills.length > 0;
          const isInsideGradientContainer = inheritedStyles == null ? void 0 : inheritedStyles["parent-has-gradient"];
          if (!hasBackground && !isInsideGradientContainer) {
            const cssBackgroundColor = ((_z = node.styles) == null ? void 0 : _z["background-color"]) || ((_A = node.styles) == null ? void 0 : _A["background"]);
            if (cssBackgroundColor && cssBackgroundColor !== "transparent") {
              const bgColor = hexToRgb(cssBackgroundColor);
              if (bgColor) {
                frame.fills = [{ type: "SOLID", color: bgColor }];
              }
            } else {
              frame.fills = [];
            }
          }
          const basePadding = parseSize((_B = node.styles) == null ? void 0 : _B.padding);
          const cssTopPadding = (_E = (_D = parseSize((_C = node.styles) == null ? void 0 : _C["padding-top"])) != null ? _D : basePadding) != null ? _E : 0;
          const cssRightPadding = (_H = (_G = parseSize((_F = node.styles) == null ? void 0 : _F["padding-right"])) != null ? _G : basePadding) != null ? _H : 0;
          const cssBottomPadding = (_K = (_J = parseSize((_I = node.styles) == null ? void 0 : _I["padding-bottom"])) != null ? _J : basePadding) != null ? _K : 0;
          const cssLeftPadding = (_N = (_M = parseSize((_L = node.styles) == null ? void 0 : _L["padding-left"])) != null ? _M : basePadding) != null ? _N : 0;
          frame.paddingTop = cssTopPadding;
          frame.paddingRight = cssRightPadding;
          frame.paddingBottom = cssBottomPadding;
          frame.paddingLeft = cssLeftPadding;
          let gap;
          if (((_O = node.styles) == null ? void 0 : _O.gap) !== void 0) {
            gap = (_P = parseSize(node.styles.gap)) != null ? _P : 0;
          } else {
            gap = layoutMode === "HORIZONTAL" ? 16 : 12;
          }
          frame.itemSpacing = gap;
          if (((_Q = node.styles) == null ? void 0 : _Q.display) === "grid") {
            frame.setPluginData("gridGap", gap.toString());
          }
          if (!parentFrame) {
            frame.x = startX;
            frame.y = startY;
            figma.currentPage.appendChild(frame);
          } else {
            parentFrame.appendChild(frame);
            const nodeHeight = (_R = node.styles) == null ? void 0 : _R.height;
            const hasExplicitNodeHeight = nodeHeight && parseSize(nodeHeight) !== null;
            if ((inheritedStyles == null ? void 0 : inheritedStyles["_shouldFillVertical"]) && parentFrame.layoutMode !== "NONE" && !hasExplicitNodeHeight) {
              try {
                frame.layoutSizingVertical = "FILL";
              } catch (e) {
              }
            }
          }
          if (((_S = node.styles) == null ? void 0 : _S.position) === "absolute" && parentFrame) {
            const leftPercentage = parsePercentage((_T = node.styles) == null ? void 0 : _T.left);
            const isCenteringPattern = leftPercentage === 50;
            const isNavOrMenu = node.tagName === "nav" || (((_U = node.styles) == null ? void 0 : _U.class) || "").includes("nav") || (((_V = node.styles) == null ? void 0 : _V.class) || "").includes("menu");
            if (isCenteringPattern && isNavOrMenu) {
              try {
                frame.layoutPositioning = "AUTO";
              } catch (e) {
              }
            } else {
              try {
                frame.layoutPositioning = "ABSOLUTE";
                const top = parseSize((_W = node.styles) == null ? void 0 : _W.top);
                const right = parseSize((_X = node.styles) == null ? void 0 : _X.right);
                const bottom = parseSize((_Y = node.styles) == null ? void 0 : _Y.bottom);
                let left = parseSize((_Z = node.styles) == null ? void 0 : _Z.left);
                if (left === null && leftPercentage !== null && parentFrame.width) {
                  left = leftPercentage / 100 * parentFrame.width;
                }
                if (top !== null) frame.y = top;
                if (left !== null) frame.x = left;
                if (top !== null && bottom !== null) {
                  frame.constraints = { vertical: "STRETCH", horizontal: ((__ = frame.constraints) == null ? void 0 : __.horizontal) || "MIN" };
                } else if (bottom !== null) {
                  frame.constraints = { vertical: "MAX", horizontal: ((_$ = frame.constraints) == null ? void 0 : _$.horizontal) || "MIN" };
                } else if (top !== null) {
                  frame.constraints = { vertical: "MIN", horizontal: ((_aa = frame.constraints) == null ? void 0 : _aa.horizontal) || "MIN" };
                }
                if (left !== null && right !== null) {
                  frame.constraints = { vertical: ((_ba = frame.constraints) == null ? void 0 : _ba.vertical) || "MIN", horizontal: "STRETCH" };
                } else if (right !== null) {
                  frame.constraints = { vertical: ((_ca = frame.constraints) == null ? void 0 : _ca.vertical) || "MIN", horizontal: "MAX" };
                }
              } catch (error) {
              }
            }
          }
          const widthValue = (_da = node.styles) == null ? void 0 : _da.width;
          const heightValue = (_ea = node.styles) == null ? void 0 : _ea.height;
          const hasExplicitPixelWidth = widthValue && parseSize(widthValue) !== null;
          const hasPercentageWidth = widthValue && parsePercentage(widthValue) !== null;
          const hasExplicitDimensions = hasExplicitPixelWidth || heightValue;
          if (((_fa = node.styles) == null ? void 0 : _fa._shouldFillWidth) && parentFrame && parentFrame.layoutMode !== "NONE") {
            try {
              frame.layoutSizingHorizontal = "FILL";
            } catch (e) {
            }
          }
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
            const parsedHeight = parseSize(heightValue);
            if (heightValue && parsedHeight !== null) {
              try {
                frame.layoutSizingVertical = "FIXED";
              } catch (e) {
              }
            }
          } else if (!hasExplicitDimensions && needsFullWidth && parentFrame && parentFrame.layoutMode !== "NONE") {
            try {
              const isAbsolutePositioned2 = frame.layoutPositioning === "ABSOLUTE";
              if (isAbsolutePositioned2) {
              } else {
                const hasFlex = ((_ga = node.styles) == null ? void 0 : _ga.flex) || ((_ha = node.styles) == null ? void 0 : _ha["flex-grow"]);
                const flexValue = (_ia = node.styles) == null ? void 0 : _ia.flex;
                const flexGrowValue = (_ja = node.styles) == null ? void 0 : _ja["flex-grow"];
                const isMainContent = (_ka = node.styles) == null ? void 0 : _ka._isMainContent;
                const shouldFillHorizontal = parentFrame.layoutMode === "VERTICAL" || hasFlex === "1" || flexValue === "1" || flexGrowValue === "1" || ((_la = node.styles) == null ? void 0 : _la["margin-right"]) === "auto" || isMainContent;
                if (shouldFillHorizontal) {
                  frame.layoutSizingHorizontal = "FILL";
                } else if (parentFrame.layoutMode === "HORIZONTAL") {
                  frame.layoutSizingHorizontal = "HUG";
                } else {
                  frame.layoutSizingHorizontal = "FILL";
                }
              }
              if (!((_ma = node.styles) == null ? void 0 : _ma.height)) {
                frame.layoutSizingVertical = "HUG";
              }
            } catch (error) {
              console.error("Layout error:", error);
              frame.resize(Math.max(480, frame.width), frame.height);
            }
          } else if (!hasExplicitDimensions && needsFullWidth) {
            frame.resize(Math.max(frame.width, 300), frame.height);
            if (!((_na = node.styles) == null ? void 0 : _na.height)) {
              frame.layoutSizingVertical = "HUG";
            }
          } else if (hasExplicitDimensions) {
            try {
              if (heightValue && parseSize(heightValue) !== null) {
                frame.layoutSizingVertical = "FIXED";
              }
              if (hasExplicitPixelWidth) {
                frame.layoutSizingHorizontal = "FIXED";
              }
            } catch (e) {
            }
          }
          const isAbsolutePositioned = ((_oa = node.styles) == null ? void 0 : _oa.position) === "absolute" || ((_pa = node.styles) == null ? void 0 : _pa.position) === "fixed";
          const hasExplicitHeight = heightValue && parseSize(heightValue) !== null;
          if (parentFrame && parentFrame.layoutMode === "HORIZONTAL" && !hasExplicitHeight && !isAbsolutePositioned) {
            try {
              frame.layoutSizingVertical = "FILL";
            } catch (error) {
            }
          }
          const maxWidthValue = parseSize((_qa = node.styles) == null ? void 0 : _qa["max-width"]);
          const minWidthValue = parseSize((_ra = node.styles) == null ? void 0 : _ra["min-width"]);
          const maxHeightValue = parseSize((_sa = node.styles) == null ? void 0 : _sa["max-height"]);
          const minHeightValue = parseSize((_ta = node.styles) == null ? void 0 : _ta["min-height"]);
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
          const thisHasWidth = Boolean((_ua = node.styles) == null ? void 0 : _ua.width);
          const parentHadWidth = (inheritedStyles == null ? void 0 : inheritedStyles["_hasConstrainedWidth"]) === true;
          const isHorizontalFlex = frame.layoutMode === "HORIZONTAL";
          const shouldPropagateWidthConstraint = isHorizontalFlex ? thisHasWidth : thisHasWidth || parentHadWidth;
          const isFlex = display === "flex" || display === "inline-flex";
          const justifyContent = (_va = node.styles) == null ? void 0 : _va["justify-content"];
          const alignItems = (_wa = node.styles) == null ? void 0 : _wa["align-items"];
          const inheritableStyles = __spreadProps(__spreadValues({}, inheritedStyles), {
            // CRITICAL: Propagate width constraint - but not through horizontal flex containers
            "_hasConstrainedWidth": shouldPropagateWidthConstraint,
            // CRITICAL: Propagate FILL vertical for grid rows with multi-row spans
            "_shouldFillVertical": inheritedStyles == null ? void 0 : inheritedStyles["_shouldFillVertical"],
            // Pass flex alignment for text centering
            "_parentJustifyContent": isFlex ? justifyContent : inheritedStyles == null ? void 0 : inheritedStyles["_parentJustifyContent"],
            "_parentAlignItems": isFlex ? alignItems : inheritedStyles == null ? void 0 : inheritedStyles["_parentAlignItems"],
            // TEXT PROPERTIES - CSS inherited properties
            color: ((_xa = node.styles) == null ? void 0 : _xa.color) || (inheritedStyles == null ? void 0 : inheritedStyles.color),
            "font-family": ((_ya = node.styles) == null ? void 0 : _ya["font-family"]) || (inheritedStyles == null ? void 0 : inheritedStyles["font-family"]),
            "font-size": ((_za = node.styles) == null ? void 0 : _za["font-size"]) || (inheritedStyles == null ? void 0 : inheritedStyles["font-size"]),
            "font-weight": ((_Aa = node.styles) == null ? void 0 : _Aa["font-weight"]) || (inheritedStyles == null ? void 0 : inheritedStyles["font-weight"]),
            "font-style": ((_Ba = node.styles) == null ? void 0 : _Ba["font-style"]) || (inheritedStyles == null ? void 0 : inheritedStyles["font-style"]),
            "line-height": ((_Ca = node.styles) == null ? void 0 : _Ca["line-height"]) || (inheritedStyles == null ? void 0 : inheritedStyles["line-height"]),
            "text-align": ((_Da = node.styles) == null ? void 0 : _Da["text-align"]) || (inheritedStyles == null ? void 0 : inheritedStyles["text-align"]),
            "letter-spacing": ((_Ea = node.styles) == null ? void 0 : _Ea["letter-spacing"]) || (inheritedStyles == null ? void 0 : inheritedStyles["letter-spacing"]),
            "word-spacing": ((_Fa = node.styles) == null ? void 0 : _Fa["word-spacing"]) || (inheritedStyles == null ? void 0 : inheritedStyles["word-spacing"]),
            "text-transform": ((_Ga = node.styles) == null ? void 0 : _Ga["text-transform"]) || (inheritedStyles == null ? void 0 : inheritedStyles["text-transform"]),
            // FIXED: Don't inherit background/background-color - only pass info for gradient container detection
            "parent-has-gradient": ((_Ha = node.styles) == null ? void 0 : _Ha["background"]) && node.styles["background"].includes("linear-gradient") || (inheritedStyles == null ? void 0 : inheritedStyles["parent-has-gradient"]),
            // Pass parent class name to help with styling decisions
            "parent-class": ((_Ia = node.styles) == null ? void 0 : _Ia.className) || (inheritedStyles == null ? void 0 : inheritedStyles["parent-class"])
          });
          if (node.mixedContent && node.mixedContent.length > 0) {
            await figma.loadFontAsync({ family: "Inter", style: "Regular" });
            const hasOnlyText = node.mixedContent.every((item) => item.type === "text");
            const justifyContent2 = (_Ja = node.styles) == null ? void 0 : _Ja["justify-content"];
            const wantsCentering = justifyContent2 === "center" || justifyContent2 === "flex-end" || justifyContent2 === "end";
            console.log("[TEXT CENTER] hasOnlyText:", hasOnlyText);
            console.log("[TEXT CENTER] justifyContent:", justifyContent2);
            console.log("[TEXT CENTER] wantsCentering:", wantsCentering);
            console.log("[TEXT CENTER] frame.layoutMode:", frame.layoutMode);
            for (const item of node.mixedContent) {
              if (item.type === "text" && item.text && item.text.trim()) {
                const textNode = figma.createText();
                textNode.characters = item.text.trim();
                textNode.name = "Inline Text";
                const textStyles = __spreadValues(__spreadValues({}, inheritableStyles), node.styles);
                console.log("[TEXT CENTER] textStyles._parentJustifyContent:", textStyles["_parentJustifyContent"]);
                console.log("[TEXT CENTER] textStyles.justify-content:", textStyles["justify-content"]);
                applyStylesToText(textNode, textStyles);
                frame.appendChild(textNode);
                console.log("[TEXT CENTER] Condition check:", frame.layoutMode === "HORIZONTAL", hasOnlyText, wantsCentering);
                if (frame.layoutMode === "HORIZONTAL" && hasOnlyText && wantsCentering) {
                  console.log("[TEXT CENTER] Using FILL for centered text");
                  textNode.layoutSizingHorizontal = "FILL";
                  textNode.textAutoResize = "HEIGHT";
                } else if (frame.layoutMode === "HORIZONTAL") {
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
              const legacyJustifyContent = (_Ka = node.styles) == null ? void 0 : _Ka["justify-content"];
              const legacyWantsCentering = legacyJustifyContent === "center" || legacyJustifyContent === "flex-end" || legacyJustifyContent === "end";
              const parentIsHorizontal = parentFrame && parentFrame.layoutMode === "HORIZONTAL";
              const frameHasNoExplicitWidth = !((_La = node.styles) == null ? void 0 : _La.width);
              const frameWillHugHorizontal = parentIsHorizontal && frameHasNoExplicitWidth && !((_Ma = node.styles) == null ? void 0 : _Ma.flex) && !((_Na = node.styles) == null ? void 0 : _Na["flex-grow"]);
              if (frameWillHugHorizontal) {
                textNode.textAutoResize = "WIDTH_AND_HEIGHT";
              } else if (frame.layoutMode === "HORIZONTAL" && legacyWantsCentering) {
                textNode.layoutSizingHorizontal = "FILL";
                textNode.textAutoResize = "HEIGHT";
                textNode.textAlignHorizontal = "CENTER";
              } else if (frame.layoutMode === "HORIZONTAL" || frame.layoutMode === "VERTICAL") {
                textNode.layoutSizingHorizontal = "FILL";
                textNode.textAutoResize = "HEIGHT";
              } else {
                textNode.textAutoResize = "WIDTH_AND_HEIGHT";
              }
            }
            if (node.children && node.children.length > 0) {
              if (((_Oa = node.styles) == null ? void 0 : _Oa.display) === "grid") {
                const gridTemplateAreas = (_Pa = node.styles) == null ? void 0 : _Pa["grid-template-areas"];
                const gridTemplateColumns = (_Qa = node.styles) == null ? void 0 : _Qa["grid-template-columns"];
                const gap2 = parseSize((_Ra = node.styles) == null ? void 0 : _Ra.gap) || parseSize((parentFrame == null ? void 0 : parentFrame.getPluginData("gridGap")) || "") || 12;
                const areaMap = parseGridTemplateAreas(gridTemplateAreas);
                if (areaMap) {
                  const numRows = getGridRowCount(gridTemplateAreas);
                  const numCols = getGridColCount(gridTemplateAreas);
                  await createGridLayoutWithAreas(node.children, frame, areaMap, numRows, numCols, gap2, inheritableStyles);
                } else {
                  const columns = parseGridColumns(gridTemplateColumns);
                  const finalColumns = columns > 0 ? columns : 2;
                  if (hasGridSpans(node.children)) {
                    await createGridLayoutWithSpans(node.children, frame, finalColumns, gap2, inheritableStyles, gridTemplateColumns);
                  } else {
                    await createGridLayout(node.children, frame, finalColumns, gap2, inheritableStyles, gridTemplateColumns);
                  }
                }
              } else {
                await createFigmaNodesFromStructure(node.children, frame, 0, 0, inheritableStyles);
              }
              reorderChildrenByZIndex(frame);
            }
          }
          if ((_Sa = node.styles) == null ? void 0 : _Sa["z-index"]) {
            const zIndex = parseInt(node.styles["z-index"], 10);
            if (!isNaN(zIndex)) {
              frame.setPluginData("zIndex", zIndex.toString());
            }
          }
          if (parentFrame && (parentFrame.layoutMode === "HORIZONTAL" || parentFrame.layoutMode === "VERTICAL")) {
            const flexValue = (_Ta = node.styles) == null ? void 0 : _Ta.flex;
            const flexGrowValue = (_Ua = node.styles) == null ? void 0 : _Ua["flex-grow"];
            let shouldGrow = false;
            let shouldNotGrow = false;
            if (flexValue) {
              const flexParts = flexValue.toString().split(/\s+/);
              const growPart = parseFloat(flexParts[0]);
              if (growPart === 0) {
                shouldNotGrow = true;
              } else if (growPart > 0) {
                shouldGrow = true;
              }
            }
            if (flexGrowValue === "1" || flexValue === "1") {
              shouldGrow = true;
            }
            if (flexGrowValue === "0") {
              shouldNotGrow = true;
            }
            try {
              if (shouldGrow) {
                frame.layoutGrow = 1;
                frame.layoutSizingHorizontal = "FILL";
                frame.layoutSizingVertical = "HUG";
              } else if (shouldNotGrow) {
                frame.layoutGrow = 0;
                const minWidth = parseSize((_Va = node.styles) == null ? void 0 : _Va["min-width"]);
                if (minWidth && minWidth > 0) {
                  frame.layoutSizingHorizontal = "FIXED";
                  frame.resize(Math.max(frame.width, minWidth), frame.height);
                } else {
                  frame.layoutSizingHorizontal = "HUG";
                }
              }
            } catch (error) {
            }
          }
          if (((_Wa = node.styles) == null ? void 0 : _Wa["align-self"]) && parentFrame) {
            try {
              const alignSelf = node.styles["align-self"];
              if (alignSelf === "center") {
                frame.layoutAlign = "CENTER";
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
          const basePadding = parseSize((_Xa = node.styles) == null ? void 0 : _Xa.padding);
          form.paddingLeft = (__a = (_Za = parseSize((_Ya = node.styles) == null ? void 0 : _Ya["padding-left"])) != null ? _Za : basePadding) != null ? __a : 0;
          form.paddingRight = (_bb = (_ab = parseSize((_$a = node.styles) == null ? void 0 : _$a["padding-right"])) != null ? _ab : basePadding) != null ? _bb : 0;
          form.paddingTop = (_eb = (_db = parseSize((_cb = node.styles) == null ? void 0 : _cb["padding-top"])) != null ? _db : basePadding) != null ? _eb : 0;
          form.paddingBottom = (_hb = (_gb = parseSize((_fb = node.styles) == null ? void 0 : _fb["padding-bottom"])) != null ? _gb : basePadding) != null ? _hb : 0;
          form.itemSpacing = (_jb = parseSize((_ib = node.styles) == null ? void 0 : _ib.gap)) != null ? _jb : 0;
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
          let inputWidth = parseSize((_kb = node.styles) == null ? void 0 : _kb.width);
          const inputHeight = node.tagName === "textarea" ? (parseSize((_lb = node.attributes) == null ? void 0 : _lb.rows) || 3) * 20 + 20 : parseSize((_mb = node.styles) == null ? void 0 : _mb.height) || 40;
          const input = figma.createFrame();
          let bgColor = { r: 1, g: 1, b: 1 };
          if (((_nb = node.styles) == null ? void 0 : _nb["background"]) && node.styles["background"] !== "transparent") {
            const bgParsed = hexToRgb(node.styles["background"]);
            if (bgParsed) bgColor = bgParsed;
          } else if (((_ob = node.styles) == null ? void 0 : _ob["background-color"]) && node.styles["background-color"] !== "transparent") {
            const bgParsed = hexToRgb(node.styles["background-color"]);
            if (bgParsed) bgColor = bgParsed;
          }
          input.fills = [{ type: "SOLID", color: bgColor }];
          let borderColor = { r: 0.8, g: 0.8, b: 0.8 };
          if (((_pb = node.styles) == null ? void 0 : _pb["border"]) || ((_qb = node.styles) == null ? void 0 : _qb["border-color"])) {
            const borderParsed = hexToRgb(node.styles["border-color"] || extractBorderColor(node.styles["border"]));
            if (borderParsed) borderColor = borderParsed;
          }
          input.strokes = [{ type: "SOLID", color: borderColor }];
          input.strokeWeight = parseSize((_rb = node.styles) == null ? void 0 : _rb["border-width"]) || 1;
          input.cornerRadius = parseSize((_sb = node.styles) == null ? void 0 : _sb["border-radius"]) || 4;
          input.name = node.tagName.toUpperCase();
          input.layoutMode = "HORIZONTAL";
          if (((_tb = node.styles) == null ? void 0 : _tb["text-align"]) === "center") {
            input.primaryAxisAlignItems = "CENTER";
            input.counterAxisAlignItems = "CENTER";
          } else {
            input.primaryAxisAlignItems = "MIN";
            input.counterAxisAlignItems = "CENTER";
          }
          input.paddingLeft = parseSize((_ub = node.styles) == null ? void 0 : _ub["padding-left"]) || 12;
          input.paddingRight = parseSize((_vb = node.styles) == null ? void 0 : _vb["padding-right"]) || 12;
          const parentIsAutoLayout = parentFrame && parentFrame.type === "FRAME" && parentFrame.layoutMode && parentFrame.layoutMode !== "NONE";
          let useFill = false;
          if (((_wb = node.styles) == null ? void 0 : _wb.width) === "100%") {
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
          const displayText = ((_xb = node.attributes) == null ? void 0 : _xb.value) || ((_yb = node.attributes) == null ? void 0 : _yb.placeholder) || (node.tagName === "select" ? "Select option \u25BC" : "Input field");
          inputText.characters = displayText;
          let textColor = { r: 0.2, g: 0.2, b: 0.2 };
          if ((_zb = node.styles) == null ? void 0 : _zb.color) {
            const colorParsed = hexToRgb(node.styles.color);
            if (colorParsed) textColor = colorParsed;
          } else if (!((_Ab = node.attributes) == null ? void 0 : _Ab.value)) {
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
          const tableWidth = parseSize((_Bb = node.styles) == null ? void 0 : _Bb.width) || 500;
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
          const cellWidth = parseSize((_Cb = node.styles) == null ? void 0 : _Cb.width) || 100;
          const cellHeight = parseSize((_Db = node.styles) == null ? void 0 : _Db.height) || 40;
          cell.resize(cellWidth, cellHeight);
          const bgColor = ((_Eb = node.styles) == null ? void 0 : _Eb["background-color"]) || ((_Fb = node.styles) == null ? void 0 : _Fb.background);
          if (bgColor && bgColor !== "transparent") {
            const parsedBg = hexToRgb(bgColor);
            cell.fills = parsedBg ? [{ type: "SOLID", color: parsedBg }] : [];
          } else {
            cell.fills = [];
          }
          const borderColor = (_Gb = node.styles) == null ? void 0 : _Gb["border-color"];
          if (borderColor) {
            const parsedBorder = hexToRgb(borderColor);
            cell.strokes = parsedBorder ? [{ type: "SOLID", color: parsedBorder }] : [];
          } else {
            cell.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
          }
          cell.strokeWeight = (_Ib = parseSize((_Hb = node.styles) == null ? void 0 : _Hb["border-width"])) != null ? _Ib : 0.5;
          cell.name = node.tagName.toUpperCase();
          cell.layoutMode = "HORIZONTAL";
          cell.primaryAxisAlignItems = "CENTER";
          cell.counterAxisAlignItems = "CENTER";
          const basePadding = parseSize((_Jb = node.styles) == null ? void 0 : _Jb.padding);
          cell.paddingLeft = (_Mb = (_Lb = parseSize((_Kb = node.styles) == null ? void 0 : _Kb["padding-left"])) != null ? _Lb : basePadding) != null ? _Mb : 8;
          cell.paddingRight = (_Pb = (_Ob = parseSize((_Nb = node.styles) == null ? void 0 : _Nb["padding-right"])) != null ? _Ob : basePadding) != null ? _Pb : 8;
          cell.paddingTop = (_Sb = (_Rb = parseSize((_Qb = node.styles) == null ? void 0 : _Qb["padding-top"])) != null ? _Rb : basePadding) != null ? _Sb : 4;
          cell.paddingBottom = (_Vb = (_Ub = parseSize((_Tb = node.styles) == null ? void 0 : _Tb["padding-bottom"])) != null ? _Ub : basePadding) != null ? _Vb : 4;
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
          const textColor = (_Wb = node.styles) == null ? void 0 : _Wb.color;
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
            if (!((_Xb = node.styles) == null ? void 0 : _Xb["text-align"])) {
              cellText.textAlignHorizontal = "CENTER";
            }
          }
          if ((_Zb = (_Yb = node.styles) == null ? void 0 : _Yb.className) == null ? void 0 : _Zb.includes("detail")) {
          }
          if (!parentFrame) {
            cell.x = startX;
            cell.y = startY;
            figma.currentPage.appendChild(cell);
          } else {
            parentFrame.appendChild(cell);
          }
        } else if (node.tagName === "button") {
          const buttonWidth = parseSize((__b = node.styles) == null ? void 0 : __b.width) || Math.max(120, (((_$b = node.text) == null ? void 0 : _$b.length) || 6) * 12);
          const buttonHeight = parseSize((_ac = node.styles) == null ? void 0 : _ac.height) || 44;
          const frame = figma.createFrame();
          frame.resize(buttonWidth, buttonHeight);
          const bgColor = ((_bc = node.styles) == null ? void 0 : _bc["background-color"]) || ((_cc = node.styles) == null ? void 0 : _cc.background);
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
          const borderRadius = (_ec = parseSize((_dc = node.styles) == null ? void 0 : _dc["border-radius"])) != null ? _ec : 4;
          frame.cornerRadius = borderRadius;
          frame.name = "Button";
          frame.layoutMode = "HORIZONTAL";
          frame.primaryAxisAlignItems = "CENTER";
          frame.counterAxisAlignItems = "CENTER";
          const basePadding = parseSize((_fc = node.styles) == null ? void 0 : _fc.padding);
          frame.paddingLeft = (_ic = (_hc = parseSize((_gc = node.styles) == null ? void 0 : _gc["padding-left"])) != null ? _hc : basePadding) != null ? _ic : 16;
          frame.paddingRight = (_lc = (_kc = parseSize((_jc = node.styles) == null ? void 0 : _jc["padding-right"])) != null ? _kc : basePadding) != null ? _lc : 16;
          frame.paddingTop = (_oc = (_nc = parseSize((_mc = node.styles) == null ? void 0 : _mc["padding-top"])) != null ? _nc : basePadding) != null ? _oc : 8;
          frame.paddingBottom = (_rc = (_qc = parseSize((_pc = node.styles) == null ? void 0 : _pc["padding-bottom"])) != null ? _qc : basePadding) != null ? _rc : 8;
          if (node.styles) {
            applyStylesToFrame(frame, node.styles);
          }
          await figma.loadFontAsync({ family: "Inter", style: "Regular" });
          const buttonText = figma.createText();
          buttonText.characters = node.text || "Button";
          const textColor = (_sc = node.styles) == null ? void 0 : _sc.color;
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
          const width = parseSize((_tc = node.styles) == null ? void 0 : _tc.width) || 200;
          const height = parseSize((_uc = node.styles) == null ? void 0 : _uc.height) || 150;
          const frame = figma.createFrame();
          frame.resize(width, height);
          frame.fills = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
          frame.name = "Image: " + (((_vc = node.attributes) == null ? void 0 : _vc.alt) || "Unnamed");
          frame.layoutMode = "HORIZONTAL";
          frame.primaryAxisAlignItems = "CENTER";
          frame.counterAxisAlignItems = "CENTER";
          await figma.loadFontAsync({ family: "Inter", style: "Regular" });
          const placeholderText = figma.createText();
          placeholderText.characters = ((_wc = node.attributes) == null ? void 0 : _wc.alt) || "Image";
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
          const parentList = ((_xc = parentFrame == null ? void 0 : parentFrame.name) == null ? void 0 : _xc.includes("OL")) ? "OL" : "UL";
          const bullet = parentList === "OL" ? "1. " : "\u2022 ";
          text.characters = bullet + (node.text || "List item");
          text.name = "List Item";
          if (node.styles) {
            applyStylesToText(text, node.styles);
          }
          if (parentFrame && parentFrame.getPluginData("textAlign") === "center") {
            if (!((_yc = node.styles) == null ? void 0 : _yc["text-align"])) {
              text.textAlignHorizontal = "CENTER";
            }
          }
          if ((_Ac = (_zc = node.styles) == null ? void 0 : _zc.className) == null ? void 0 : _Ac.includes("detail")) {
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
          const hasBackground = ((_Bc = node.styles) == null ? void 0 : _Bc["background"]) || ((_Cc = node.styles) == null ? void 0 : _Cc["background-color"]);
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
              if (!((_Dc = node.styles) == null ? void 0 : _Dc["text-align"])) {
                text.textAlignHorizontal = "CENTER";
              }
            }
            if ((_Fc = (_Ec = node.styles) == null ? void 0 : _Ec.className) == null ? void 0 : _Fc.includes("detail")) {
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
      return null;
    }
  }
  async function deleteMCPSharedData() {
    try {
      figma.ui.postMessage({ type: "delete-file-mcp-data" });
      debugLog("[MCP] Requested deletion of MCP data file");
      return true;
    } catch (error) {
      return false;
    }
  }
  function startMCPMonitoring() {
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
        try {
          const mcpData = await readMCPSharedData();
          if (mcpData) {
            const dataTimestamp = mcpData.timestamp ? new Date(mcpData.timestamp).getTime() : 0;
            if (dataTimestamp > sseLastSuccessTimestamp) {
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
        }
      } else {
        debugLog("[MCP] \u{1F7E2} SSE active, fallback not needed");
      }
    }, 15e3);
  }
  function stopMCPMonitoring() {
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
        return;
      }
      markRequestProcessed(requestId);
      const detectedDesignWidth = msg.detectedWidth || null;
      if (detectedDesignWidth) {
        CSS_CONFIG.viewportWidth = detectedDesignWidth;
      }
      const detectedRemBase = msg.detectedRemBase || null;
      if (detectedRemBase && detectedRemBase > 0) {
        CSS_CONFIG.remBase = detectedRemBase;
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
              explicitWidth = width;
            }
          }
          if (((_d = node.styles) == null ? void 0 : _d.position) === "fixed" && ((_e = node.styles) == null ? void 0 : _e.width)) {
            const width = parseSize(node.styles.width);
            if (width && width > 0) {
              sidebarWidth = Math.max(sidebarWidth, width);
            }
          }
          if ((_f = node.styles) == null ? void 0 : _f["margin-left"]) {
            const margin = parseSize(node.styles["margin-left"]);
            if (margin && margin > 0) {
              mainContentMargin = Math.max(mainContentMargin, margin);
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
      const detectWideLayout = (structure) => {
        const checkNode = (node) => {
          var _a2;
          if (!node) return false;
          const gridCols = (_a2 = node.styles) == null ? void 0 : _a2["grid-template-columns"];
          if (gridCols) {
            const repeatMatch = gridCols.match(/repeat\((\d+)/);
            if (repeatMatch && parseInt(repeatMatch[1]) >= 8) return true;
            const colCount = gridCols.split(/\s+/).filter((c) => c && c !== "").length;
            if (colCount >= 8) return true;
          }
          if (node.children) {
            for (const child of node.children) {
              if (checkNode(child)) return true;
            }
          }
          return false;
        };
        for (const node of structure) {
          if (checkNode(node)) return true;
        }
        return false;
      };
      const needsWideLayout = detectWideLayout(msg.structure);
      let containerWidth = detectedDesignWidth || structureWidth || (isFullPageLayout ? DEFAULT_PAGE_WIDTH : null);
      if (needsWideLayout && (containerWidth === null || containerWidth < 1920)) {
        containerWidth = 1920;
      }
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
      startMCPMonitoring();
      figma.notify("\u{1F504} MCP Monitoring iniciado");
    }
    if (msg.type === "stop-mcp-monitoring") {
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
