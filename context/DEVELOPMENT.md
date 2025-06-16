# Development Guide - HTML-Figma Bridge Plugin

## 🚨 CRITICAL: Where to Make Code Changes

### ⚠️ NEVER edit `code.js` directly!

**WRONG:** ❌ Editing `code.js`
**CORRECT:** ✅ Edit `src/code.ts` then run `npm run build`

### Why?
- `code.js` is **auto-generated** from `src/code.ts` 
- Any changes to `code.js` will be **overwritten** when you compile
- Always edit the TypeScript source file: `src/code.ts`

---

## 📁 File Structure for Development

```
space-to-figma-001/
├── src/
│   └── code.ts          ← EDIT THIS FILE
├── code.js              ← AUTO-GENERATED (don't edit)
├── tsconfig.json        ← TypeScript config
└── package.json         ← Build scripts
```

---

## 🔧 Development Workflow

1. **Edit source:** Modify `src/code.ts`
2. **Compile:** Run `npm run build`
3. **Test:** Plugin uses the generated `code.js`

### Build Commands
```bash
# One-time build
npm run build

# Watch mode (auto-build on changes)
npm run watch
```

---

## 🐛 Common Issues & Solutions

### Issue: Changes don't appear in plugin
**Cause:** You edited `code.js` instead of `src/code.ts`  
**Solution:** 
1. Edit `src/code.ts`
2. Run `npm run build`
3. Reload plugin in Figma

### Issue: Line-height shows as "1.5%" instead of normal spacing
**Cause:** Hardcoded `lineHeight` values in multiple places  
**Solution:** Only apply `lineHeight` in `applyStylesToText()` function  
**Files to check:**
- `src/code.ts` line ~580 (applyStylesToText function)
- `src/code.ts` line ~1130+ (check for hardcoded lineHeight values)

### Issue: Box-shadow not rendering (appears as hardcoded shadow)
**Cause:** `applyStylesToFrame()` used hardcoded shadow instead of parsing CSS  
**Solution:** Use `parseBoxShadow()` function to parse actual CSS values  
**Fixed:** Line ~497 in `src/code.ts`

### Issue: Box-shadow validation errors (effects property failed)
**Cause:** `parseBoxShadow()` returned wrong format (offsetX/offsetY vs offset.x/y)  
**Solution:** Return correct Figma effect format with `type`, `offset`, `radius`, `color.a`, `blendMode`, `visible`  
**Fixed:** Line ~269 in `src/code.ts` - parseBoxShadow function

### Issue: Color inheritance fails (text appears black instead of inherited color)
**Cause:** `applyStylesToText()` only applied color if explicitly set  
**Solution:** Always apply a color (inherited or black default)  
**Fixed:** Line ~551 in `src/code.ts`

### Issue: Flex elements don't expand (flex: 1 ignored)
**Cause:** `flex: 1` only set `primaryAxisSizingMode = 'AUTO'`  
**Solution:** Also set `layoutGrow = 1` for proper flex behavior  
**Fixed:** Line ~450 in `src/code.ts`

---

## 📍 Key Functions to Modify

### Text Styling
**Function:** `applyStylesToText()`  
**Location:** `src/code.ts` ~line 556  
**Purpose:** Apply CSS text properties to Figma text nodes

### Frame Styling  
**Function:** `applyStylesToFrame()`  
**Location:** `src/code.ts` ~line 413  
**Purpose:** Apply CSS frame properties to Figma frames

### HTML Structure Processing
**Function:** `createFigmaNodesFromStructure()`  
**Location:** `src/code.ts` ~line 719  
**Purpose:** Convert HTML nodes to Figma nodes

---

## ⚡ Quick Fix Checklist

Before making changes:
- [ ] Am I editing `src/code.ts`? (not `code.js`)
- [ ] Did I run `npm run build` after changes?
- [ ] Did I test in Figma after building?

Common fixes:
- [ ] Check for hardcoded `lineHeight` values
- [ ] Verify CSS property parsing in `applyStylesToText`
- [ ] Check for conflicting style applications

---

## 🔍 Debugging CSS Properties

### Line-height Issues
```typescript
// ✅ CORRECT: Only apply if has units
if (value.match(/^[0-9.]+px$/)) {
  text.lineHeight = { value: px, unit: 'PIXELS' };
} else if (!isNaN(Number(value))) {
  // ✅ CORRECT: Ignore unitless values
  console.log('IGNORED unitless line-height:', value);
}

// ❌ WRONG: Don't hardcode lineHeight
text.lineHeight = { value: 1.5, unit: 'PERCENT' };
```

### General CSS Property Flow
1. CSS parsed in UI (DOMParser)
2. Styles passed to `applyStylesToText()` or `applyStylesToFrame()`
3. Properties applied to Figma nodes
4. **No hardcoded values should override CSS**

---

**Remember:** Always edit `src/code.ts`, never `code.js`! 