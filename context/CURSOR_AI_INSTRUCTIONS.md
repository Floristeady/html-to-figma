# Cursor AI Instructions

**Last Updated**: June 24, 2025  
**Status**: ✅ **FULLY OPERATIONAL MCP INTEGRATION**

## 🎯 Overview

This document provides specific instructions for using the HTML-to-Figma plugin with **Cursor IDE**. The system is **100% functional** and ready for production use with complete MCP (Model Context Protocol) integration.

## ✅ Current Status: FULLY WORKING

- ✅ **MCP Server**: Fully operational stdio communication
- ✅ **SSE Server**: Stable real-time broadcasting  
- ✅ **Figma Plugin**: Complete visual node creation
- ✅ **TypeScript Compilation**: Automated build process
- ✅ **End-to-End Workflow**: All components working perfectly

## 🚀 Setup for Cursor IDE

### 1. Install the Plugin System
```bash
# Clone and setup
git clone <repository-url>
cd html-to-figma
npm install
npm run build
```

### 2. Start the Servers
```bash
# Start both MCP and SSE servers
node start-servers.js

# You should see:
# MCP Server listening on stdio...
# SSE Server started on port 3003
```

### 3. Load Plugin in Figma
1. Open Figma Desktop
2. Go to **Plugins** → **Development** → **Import plugin from manifest**
3. Select `manifest.json` from the project directory
4. Plugin should show **🟢 Connected**

### 4. Configure Cursor MCP Tool (Required)
Add this to your Cursor settings and restart Cursor:

```json
{
  "mcp.servers": {
    "figma-html-bridge": {
      "command": "node",
      "args": ["/Users/yourusername/path/to/html-to-figma/mcp-server.js"],
      "cwd": "/Users/yourusername/path/to/html-to-figma"
    }
  }
}
```

**Important**: Replace `/Users/yourusername/path/to/html-to-figma` with your actual project path.

## 🎯 Using the MCP Tool in Cursor

### Primary Tool: `import_html`

Once configured, you can use the MCP tool directly in Cursor:

```typescript
// Basic usage
import_html({
  html: "<div style='background:#007bff;color:white;padding:20px;border-radius:8px;text-align:center'><h2>Hello Figma!</h2><p>This HTML will become a visual design in Figma</p></div>",
  name: "Welcome Component"
})
```

### Advanced Examples

#### 1. Card Component
```typescript
import_html({
  html: `<div style="background:white;padding:24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);max-width:400px;font-family:system-ui">
    <div style="display:flex;align-items:center;margin-bottom:16px">
      <div style="width:48px;height:48px;background:#007bff;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;margin-right:16px">JD</div>
      <div>
        <h3 style="margin:0;color:#333;font-size:18px">John Doe</h3>
        <p style="margin:0;color:#666;font-size:14px">Product Designer</p>
      </div>
    </div>
    <p style="color:#666;line-height:1.5;margin:0 0 20px 0">Creating beautiful and functional user interfaces with attention to detail and user experience.</p>
    <button style="background:#007bff;color:white;border:none;padding:12px 24px;border-radius:8px;font-weight:bold;cursor:pointer">View Profile</button>
  </div>`,
  name: "User Profile Card"
})
```

#### 2. Dashboard Widget
```typescript
import_html({
  html: `<div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:32px;border-radius:16px;min-width:300px">
    <h2 style="margin:0 0 8px 0;font-size:24px;font-weight:bold">Monthly Revenue</h2>
    <p style="margin:0 0 24px 0;opacity:0.9;font-size:14px">Last 30 days performance</p>
    <div style="display:flex;align-items:baseline;margin-bottom:20px">
      <span style="font-size:48px;font-weight:bold">$12,345</span>
      <span style="margin-left:12px;background:rgba(255,255,255,0.2);padding:4px 8px;border-radius:12px;font-size:12px">+23%</span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div style="background:rgba(255,255,255,0.15);padding:16px;border-radius:8px;text-align:center">
        <div style="font-size:20px;font-weight:bold">156</div>
        <div style="opacity:0.8;font-size:12px">New Customers</div>
      </div>
      <div style="background:rgba(255,255,255,0.15);padding:16px;border-radius:8px;text-align:center">
        <div style="font-size:20px;font-weight:bold">89%</div>
        <div style="opacity:0.8;font-size:12px">Satisfaction</div>
      </div>
    </div>
  </div>`,
  name: "Revenue Dashboard Widget"
})
```

#### 3. Form Layout
```typescript
import_html({
  html: `<form style="background:#f8f9fa;padding:32px;border-radius:16px;max-width:500px;font-family:system-ui">
    <h2 style="margin:0 0 24px 0;color:#333;text-align:center">Contact Us</h2>
    <div style="margin-bottom:20px">
      <label style="display:block;margin-bottom:8px;color:#555;font-weight:500">Full Name</label>
      <input style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px;box-sizing:border-box" type="text" placeholder="Enter your full name">
    </div>
    <div style="margin-bottom:20px">
      <label style="display:block;margin-bottom:8px;color:#555;font-weight:500">Email Address</label>
      <input style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px;box-sizing:border-box" type="email" placeholder="Enter your email">
    </div>
    <div style="margin-bottom:24px">
      <label style="display:block;margin-bottom:8px;color:#555;font-weight:500">Message</label>
      <textarea style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px;resize:vertical;box-sizing:border-box" rows="5" placeholder="Your message here..."></textarea>
    </div>
    <button style="background:#28a745;color:white;border:none;padding:14px 28px;border-radius:8px;font-weight:bold;width:100%;font-size:16px;cursor:pointer">Send Message</button>
  </form>`,
  name: "Contact Form"
})
```

## 🎨 CSS Support Guide

### Fully Supported Properties
```css
/* Layout */
display: flex | grid | block | inline-block
width, height, margin, padding
position: relative | absolute
top, left, right, bottom

/* Flexbox */
justify-content: center | flex-start | flex-end | space-between
align-items: center | flex-start | flex-end | stretch
gap: 16px

/* Grid */
grid-template-columns: repeat(3, 1fr) | 200px 1fr
grid-gap: 16px

/* Typography */
font-family: system-ui | Arial | sans-serif
font-size: 16px | 1.2rem
font-weight: normal | bold | 400-900
color: #333 | rgb(51,51,51) | blue
text-align: left | center | right

/* Visual */
background: #fff | linear-gradient(135deg, #667eea, #764ba2)
border: 1px solid #ddd
border-radius: 8px
box-shadow: 0 4px 12px rgba(0,0,0,0.1)
opacity: 0.8
```

### Best Practices for Figma Conversion
```typescript
// ✅ Good: Specific dimensions
"width:300px;height:200px"

// ✅ Good: Complete styling
"background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)"

// ✅ Good: Flexbox layouts
"display:flex;justify-content:center;align-items:center;gap:16px"

// ❌ Avoid: Relative units without context
"width:50%;height:auto"

// ❌ Avoid: Complex selectors
"div > p:nth-child(2)"
```

## 🔧 Workflow Integration

### Typical Development Flow
1. **Design in HTML/CSS** - Create or generate component markup
2. **Send to Figma** - Use `import_html` tool in Cursor
3. **Review in Figma** - Check visual output and layout
4. **Iterate** - Modify HTML and re-send for refinement

### AI-Assisted Design
```typescript
// Ask AI to create a component, then send to Figma
// Example prompt: "Create a modern pricing card with three tiers"

const pricingCard = `<div style="background:white;padding:32px;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.1);text-align:center;max-width:300px">
  <h3 style="margin:0 0 8px 0;color:#333;font-size:24px">Pro Plan</h3>
  <p style="margin:0 0 24px 0;color:#666">Perfect for growing businesses</p>
  <div style="margin-bottom:32px">
    <span style="font-size:48px;font-weight:bold;color:#007bff">$29</span>
    <span style="color:#666">/month</span>
  </div>
  <ul style="list-style:none;padding:0;margin:0 0 32px 0;text-align:left">
    <li style="padding:8px 0;color:#333">✓ 10 team members</li>
    <li style="padding:8px 0;color:#333">✓ Unlimited projects</li>
    <li style="padding:8px 0;color:#333">✓ Priority support</li>
    <li style="padding:8px 0;color:#333">✓ Advanced analytics</li>
  </ul>
  <button style="background:#007bff;color:white;border:none;padding:16px 32px;border-radius:8px;font-weight:bold;width:100%;font-size:16px">Get Started</button>
</div>`;

import_html({
  html: pricingCard,
  name: "Pro Plan Pricing Card"
});
```

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Tool Not Available
```bash
# 1. Verify MCP configuration in Cursor settings
# 2. Restart Cursor completely
# 3. Check that mcp-server.js path is correct
```

#### Plugin Shows 🔴 Not Connected
```bash
# Restart both servers
pkill -f "sse-server\|mcp-server"
node start-servers.js
```

#### HTML Not Converting to Visual Elements
```bash
# Check if servers are running
ps aux | grep "sse-server\|mcp-server"

# Test server connectivity
node test-mcp-status.js

# Verify plugin is loaded in Figma
```

#### TypeError or MCP Errors
```bash
# Verify HTML syntax is valid
# Check that all style properties have proper values
# Ensure quotes are properly escaped in nested HTML
```

### Verification Steps
1. **Servers running**: `node start-servers.js` shows both servers active
2. **Plugin connected**: Figma plugin shows 🟢 Connected
3. **MCP tool available**: `import_html` appears in Cursor autocomplete
4. **Visual output**: Components appear in Figma canvas

## 📊 Performance Tips

### Optimize for Conversion Speed
- Use specific pixel values instead of relative units
- Include all necessary styling inline or in `<style>` tags
- Avoid deeply nested structures when possible
- Test with simple components first

### Component Size Guidelines
- **Small components**: < 1KB HTML (buttons, badges, cards)
- **Medium layouts**: 1-5KB HTML (forms, dashboards)
- **Large designs**: 5-20KB HTML (complete pages)

## 🎯 Integration Examples

### With Claude/ChatGPT in Cursor
```typescript
// When AI suggests a component design:
const aiGeneratedHTML = `<!-- AI-generated component -->`;

import_html({
  html: aiGeneratedHTML,
  name: "AI Generated Component"
});
```

### Design System Workflow
```typescript
// Create design tokens
import_html({
  html: `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px;padding:24px">
    <div style="background:#007bff;height:80px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold">Primary</div>
    <div style="background:#28a745;height:80px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold">Success</div>
    <div style="background:#ffc107;height:80px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#212529;font-weight:bold">Warning</div>
    <div style="background:#dc3545;height:80px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold">Danger</div>
    <div style="background:#6c757d;height:80px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold">Secondary</div>
  </div>`,
  name: "Color Palette"
});
```

## 📝 Summary

The HTML-to-Figma plugin with Cursor integration is **fully operational** and provides:

- ✅ **Seamless MCP integration** with Cursor IDE
- ✅ **Real-time HTML to Figma conversion** 
- ✅ **Complete CSS support** for modern web styling
- ✅ **AI-friendly workflow** for automated design generation
- ✅ **Production-ready stability** with comprehensive error handling

**Ready for immediate use in your Cursor workflow!** 