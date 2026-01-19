# Product Requirements Document (PRD)

## HTML-Figma Bridge: MCP Integration Plugin

**Version:** 0.1 (Proof of Concept)  
**Date:** June 4, 2025  

---

## 1. Executive Summary

HTML-Figma Bridge is a lightweight Figma plugin that enables bidirectional communication between code editors (initially Cursor) and Figma using the Model Control Protocol (MCP). The initial proof of concept will focus on converting HTML to Figma designs with minimal configuration options.

## 2. Problem Statement

Designers and developers face challenges when translating between code and design:
- Developers need to manually recreate designs from HTML/CSS
- Vibe coding projects that need to redesign in Figma
- Designers struggle to visualize how code will render without development environment setup
- Workflow inefficiencies occur when moving between design and development phases

## 3. Product Vision

Create a streamlined bridge between code and design environments that allows for seamless conversion of HTML to Figma designs through a simple MCP integration, enabling more efficient workflows between developers and designers.

## 4. Target Users

**Primary:**
- Front-end developers using Cursor who need to visualize HTML in Figma
- UI/UX designers who receive HTML mockups and need to convert them to editable designs

**Secondary:**
- Design teams working with development teams
- Individual developers who handle both coding and design

## 5. Scope

### 5.1 In Scope (MVP)

- Figma plugin with MCP endpoint configuration
- Basic HTML to Figma conversion functionality
- Cursor integration via MCP
- Support for standard HTML elements and CSS properties
- Simple command interface in Cursor
- Basic error handling

### 5.2 Out of Scope (Future Versions)

- Bidirectional conversion (Figma to HTML)
- Advanced configuration options
- Support for CSS variables
- Component mapping
- Design system integration
- Multiple AI tool integrations beyond Cursor

## 6. Functional Requirements

### 6.1 Core Functionality

1. **MCP Endpoint Configuration**
   - Enable/disable MCP endpoint
   - Display connection status (connected/disconnected)
   - Generate configuration code for Cursor

2. **HTML Processing**
   - Parse HTML structure
   - Extract CSS styles
   - Convert HTML elements to Figma frames, text, and shapes
   - Apply styles to Figma elements

3. **Cursor Integration**
   - Provide command for sending HTML to Figma
   - Accept HTML input from Cursor
   - Return status and node information to Cursor

### 6.2 User Interface

1. **Plugin UI**
   - Simple toggle for MCP endpoint
   - Connection status indicator
   - Copy-to-clipboard button for configuration code
   - Minimal settings interface

2. **Cursor Command**
   - Simple command: `Send to Figma`
   - Status feedback in Cursor console

## 7. Technical Requirements

### 7.1 Architecture

```
[Cursor] <--MCP Protocol--> [Figma Plugin]
    |                             |
    v                             v
[HTML/CSS Code] ---------> [Figma Design Elements]
```

### 7.2 Components

1. **MCP Server**
   - HTTP endpoint in Figma plugin
   - Request/response handling
   - Authentication (basic)

2. **HTML Parser**
   - DOM structure analysis
   - CSS property extraction
   - Element mapping logic

3. **Figma Element Generator**
   - Create frames, text, rectangles, etc.
   - Apply styles (colors, typography, spacing)
   - Position elements correctly

### 7.3 APIs and Integrations

1. **Figma Plugin API**
   - Node creation and manipulation
   - Style application
   - User interface rendering

2. **MCP Protocol**
   - Standard MCP request/response format
   - Error handling
   - Status reporting

## 8. User Flow

1. User installs HTML-Figma Bridge plugin in Figma
2. User enables MCP endpoint in plugin settings
3. User copies configuration code from plugin
4. User pastes configuration code in Cursor's MCP settings
5. User writes or opens HTML/CSS in Cursor
6. User executes "Send to Figma" command in Cursor
7. HTML is sent to Figma plugin via MCP
8. Plugin processes HTML and creates Figma elements
9. Plugin returns success status and node ID to Cursor
10. User sees the converted design in Figma

## 9. Technical Implementation Details

### 9.1 MCP Configuration Format

```json
{
  "name": "html-figma-bridge",
  "endpoint": "https://www.figma.com/figma/plugin/[plugin-id]/html-figma-bridge",
  "description": "Convert HTML to Figma designs",
  "auth": {
    "type": "none"
  }
}
```

### 9.2 Request Format

```json
{
  "name": "Design Name",
  "html": "<!DOCTYPE html>...[full HTML content]..."
}
```

### 9.3 Response Format

```json
{
  "node": {
    "id": "node-id",
    "name": "Design Name",
    "type": "SECTION"
  },
  "status": "success"
}
```

### 9.4 HTML Element Mapping

| HTML Element | Figma Element |
|--------------|---------------|
| `<div>` | Frame |
| `<p>`, `<h1-h6>` | Text |
| `<img>` | Image |
| `<button>` | Component/Frame |
| `<input>` | Component/Frame |
| `<a>` | Text with link property |

## 10. Development Milestones

### Phase 1: Proof of Concept (Current Focus)
- Set up basic plugin structure
- Implement MCP endpoint
- Create simple HTML parser
- Develop basic element conversion
- Test with simple HTML structures

### Phase 2: MVP Release
- Improve HTML parsing accuracy
- Add support for more CSS properties
- Enhance error handling
- Create basic documentation
- Release to early testers

### Phase 3: Refinement
- Add configuration options
- Improve conversion quality
- Support more complex HTML structures
- Add bidirectional conversion (Figma to HTML)

## 11. Success Metrics

- **Technical:** Successful conversion of basic HTML structures to Figma
- **User:** Time saved compared to manual recreation of designs
- **Adoption:** Number of active users and frequency of use

## 12. Limitations and Constraints

- Limited support for complex CSS properties in initial version
- No support for CSS variables in proof of concept
- Limited handling of responsive designs
- No support for JavaScript functionality
- Basic styling only for initial version

## 13. Testing Requirements

- Test with various HTML structures (simple to moderately complex)
- Verify correct element positioning and styling
- Test connection stability between Cursor and Figma
- Validate error handling for malformed HTML

## 14. Future Considerations

- Bidirectional conversion (Figma to HTML)
- Support for design systems
- Component mapping and reuse
- Integration with other code editors
- Advanced configuration options
- CSS variable support
- Responsive design handling

