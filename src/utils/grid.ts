// ============================================
// Grid Layout Utilities
// ============================================
// Functions for parsing CSS Grid properties

export interface GridAreaPosition {
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
}

export interface GridAreaMap {
  [areaName: string]: GridAreaPosition;
}

/**
 * Parse number of columns from grid-template-columns
 * Supports: repeat(N, ...), auto-fill, auto-fit, explicit values
 */
export function parseGridColumns(gridTemplate: string | undefined): number {
  if (!gridTemplate) return 1;

  // 1. repeat(N, ...) - any repeat with explicit count
  const repeatMatch = gridTemplate.match(/repeat\((\d+),/);
  if (repeatMatch) {
    return parseInt(repeatMatch[1], 10);
  }

  // 2. auto-fill / auto-fit - estimate based on common patterns
  if (gridTemplate.includes('auto-fill') || gridTemplate.includes('auto-fit')) {
    // Try to extract minmax min value to estimate columns
    const minmaxMatch = gridTemplate.match(/minmax\((\d+)px/);
    if (minmaxMatch) {
      const minWidth = parseInt(minmaxMatch[1], 10);
      // Estimate columns based on typical container width (1200px)
      return Math.max(1, Math.floor(1200 / (minWidth + 16))); // 16px gap estimate
    }
    return 3; // Default for auto-fill/auto-fit
  }

  // 3. Count column definitions (handles: "200px 1fr 100px", "1fr 1fr 1fr", etc.)
  // Split by space but handle minmax() as single unit
  const normalized = gridTemplate.replace(/minmax\([^)]+\)/g, '1fr'); // Treat minmax as 1fr
  const parts = normalized.split(/\s+/).filter(p => p.trim() && p !== '');

  if (parts.length > 0) {
    return parts.length;
  }

  return 1;
}

/**
 * Parse grid-template-areas to map area names to positions
 * Example: '"header header" "sidebar main"' -> { header: {rowStart:0, rowEnd:1, colStart:0, colEnd:2}, ... }
 */
export function parseGridTemplateAreas(areasString: string | undefined): GridAreaMap | null {
  if (!areasString) return null;

  // Parse the areas string: "header header header" "sidebar main main" "footer footer footer"
  // Each quoted string is a row, each word is a column
  const rowMatches = areasString.match(/"([^"]+)"/g);
  if (!rowMatches || rowMatches.length === 0) return null;

  const areaMap: GridAreaMap = {};

  for (let rowIndex = 0; rowIndex < rowMatches.length; rowIndex++) {
    const rowContent = rowMatches[rowIndex].replace(/"/g, '').trim();
    const columns = rowContent.split(/\s+/);

    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const areaName = columns[colIndex];
      if (areaName === '.') continue; // Skip empty cells

      if (!areaMap[areaName]) {
        // First occurrence of this area
        areaMap[areaName] = {
          rowStart: rowIndex,
          rowEnd: rowIndex + 1,
          colStart: colIndex,
          colEnd: colIndex + 1
        };
      } else {
        // Extend the area
        areaMap[areaName].rowEnd = Math.max(areaMap[areaName].rowEnd, rowIndex + 1);
        areaMap[areaName].colEnd = Math.max(areaMap[areaName].colEnd, colIndex + 1);
        areaMap[areaName].rowStart = Math.min(areaMap[areaName].rowStart, rowIndex);
        areaMap[areaName].colStart = Math.min(areaMap[areaName].colStart, colIndex);
      }
    }
  }

  return Object.keys(areaMap).length > 0 ? areaMap : null;
}

/**
 * Get the number of rows from grid-template-areas
 */
export function getGridRowCount(areasString: string | undefined): number {
  if (!areasString) return 1;
  const rowMatches = areasString.match(/"([^"]+)"/g);
  return rowMatches ? rowMatches.length : 1;
}

/**
 * Get the number of columns from grid-template-areas
 */
export function getGridColCount(areasString: string | undefined): number {
  if (!areasString) return 1;
  const rowMatches = areasString.match(/"([^"]+)"/g);
  if (!rowMatches || rowMatches.length === 0) return 1;
  const firstRow = rowMatches[0].replace(/"/g, '').trim();
  return firstRow.split(/\s+/).length;
}

/**
 * Parse grid-template-columns and calculate actual pixel widths for each column
 * Supports: fr units (including decimals), px, minmax(), repeat()
 *
 * @param gridTemplate - CSS grid-template-columns value (e.g., "1.3fr 2.7fr", "200px 1fr", "repeat(3, 1fr)")
 * @param availableWidth - Total available width in pixels
 * @param gap - Gap between columns in pixels
 * @returns Array of column widths in pixels
 */
export function parseGridColumnWidths(
  gridTemplate: string | undefined,
  availableWidth: number,
  gap: number = 0
): number[] {
  if (!gridTemplate) return [availableWidth];

  // Expand repeat() notation
  let expanded = gridTemplate;
  const repeatMatch = gridTemplate.match(/repeat\((\d+),\s*([^)]+)\)/);
  if (repeatMatch) {
    const count = parseInt(repeatMatch[1], 10);
    const value = repeatMatch[2].trim();
    expanded = Array(count).fill(value).join(' ');
  }

  // Parse column definitions
  // Handle minmax() by treating it as the max value or 1fr
  expanded = expanded.replace(/minmax\([^,]+,\s*([^)]+)\)/g, '$1');

  // Split by whitespace, preserving values
  const parts = expanded.split(/\s+/).filter(p => p.trim());

  if (parts.length === 0) return [availableWidth];

  // Calculate total gaps
  const totalGaps = (parts.length - 1) * gap;
  const widthForColumns = availableWidth - totalGaps;

  // Parse each column definition
  const columnDefs: { type: 'fr' | 'px' | 'auto'; value: number }[] = [];
  let totalFr = 0;
  let fixedWidth = 0;

  for (const part of parts) {
    if (part.endsWith('fr')) {
      const frValue = parseFloat(part) || 1;
      columnDefs.push({ type: 'fr', value: frValue });
      totalFr += frValue;
    } else if (part.endsWith('px')) {
      const pxValue = parseFloat(part) || 0;
      columnDefs.push({ type: 'px', value: pxValue });
      fixedWidth += pxValue;
    } else if (part === 'auto' || part.endsWith('%')) {
      // Treat auto and % as 1fr for simplicity
      columnDefs.push({ type: 'fr', value: 1 });
      totalFr += 1;
    } else {
      // Unknown unit, treat as 1fr
      const numValue = parseFloat(part);
      if (!isNaN(numValue) && numValue > 0) {
        // Could be just a number (treated as px) or fr without unit
        if (numValue < 10) {
          // Likely fr value
          columnDefs.push({ type: 'fr', value: numValue });
          totalFr += numValue;
        } else {
          // Likely px value
          columnDefs.push({ type: 'px', value: numValue });
          fixedWidth += numValue;
        }
      } else {
        columnDefs.push({ type: 'fr', value: 1 });
        totalFr += 1;
      }
    }
  }

  // Calculate available width for fr units (ensure non-negative)
  const frWidth = Math.max(0, widthForColumns - fixedWidth);
  const frUnit = totalFr > 0 ? frWidth / totalFr : 0;

  // Calculate final widths (ensure minimum of 1px to avoid Figma errors)
  return columnDefs.map(col => {
    if (col.type === 'px') {
      return Math.max(1, col.value);
    } else {
      return Math.max(1, Math.round(col.value * frUnit));
    }
  });
}
