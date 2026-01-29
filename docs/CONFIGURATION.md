# Guía de Configuración

## Para Usuarios del Equipo

Ver [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)

---

## Para Desarrollo

### Arquitectura de Configuración MCP (Claude Code)

Claude Code tiene 3 niveles de configuración MCP:

| Nivel | Archivo | Quién lo usa |
|-------|---------|--------------|
| **user** | `~/.claude.json` → `mcpServers` | Global, todos los proyectos |
| **project** | `.mcp.json` en el repo | Solo este proyecto |
| **local** | `~/.claude.json` → `projects[path].mcpServers` | Privado, sobrescribe project |

**Prioridad:** local > project > user

### Configuración del Proyecto

El proyecto usa `.mcp.json` para configuración de desarrollo.
Este archivo **NO va al repositorio** (está en .gitignore).

**Crear `.mcp.json` en la raíz del proyecto:**

```json
{
  "mcpServers": {
    "figma-html-bridge": {
      "command": "node",
      "args": ["./mcp-server.js"],
      "env": {
        "FIGMA_SERVER_URL": "http://localhost:3003",
        "FIGMA_SESSION_ID": "TU_SESSION_ID",
        "API_KEY": "dev-key"
      }
    }
  }
}
```

---

## Cambiar entre Desarrollo y Producción

### Desarrollo (localhost)

Edita `.mcp.json`:

```json
{
  "mcpServers": {
    "figma-html-bridge": {
      "command": "node",
      "args": ["./mcp-server.js"],
      "env": {
        "FIGMA_SERVER_URL": "http://localhost:3003",
        "FIGMA_SESSION_ID": "TU_SESSION_ID",
        "API_KEY": "dev-key"
      }
    }
  }
}
```

**Requiere:** `node sse-server.js` corriendo localmente.

### Producción (Render)

Edita `.mcp.json`:

```json
{
  "mcpServers": {
    "figma-html-bridge": {
      "command": "node",
      "args": ["./mcp-server.js"],
      "env": {
        "FIGMA_SERVER_URL": "https://html-to-figma.onrender.com",
        "FIGMA_SESSION_ID": "TU_SESSION_ID",
        "API_KEY": "figma-team-2026"
      }
    }
  }
}
```

**Importante:** Después de cambiar, reinicia Claude Code para que tome la nueva configuración.

---

## Configuración del Plugin

El plugin (`src/ui.html`) tiene auto-detección de servidor:

1. Intenta conectar a `localhost:3003`
2. Si falla (timeout 2s), usa `html-to-figma.onrender.com`

Esto permite que el mismo plugin funcione tanto en desarrollo como en producción sin cambios.

---

## Flujo de Trabajo

### Desarrollo Local

1. Abre Claude Code en el proyecto `html-to-figma`
2. Automáticamente usa `.mcp.json` del proyecto (localhost)
3. Corre `node sse-server.js` para el servidor local
4. Trabaja normalmente

### Probar Producción

1. Cambia `FIGMA_SERVER_URL` en `.mcp.json` a Render
2. Reinicia Claude Code
3. Prueba

### Equipo (usuarios finales)

1. Instalan plugin en Figma
2. Copian su Session ID
3. Agregan config en `~/.claude.json` (como dice Installation Guide)
4. Funciona automáticamente con Render
