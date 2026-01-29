# Plan: Estrategia de Configuración MCP

## Contexto

- **El equipo NO clona el repositorio** - solo usan el plugin + configuración MCP con `npx`
- El repositorio es solo para ti como desarrolladora
- Hay configuración en múltiples lugares que necesita organizarse

---

## Resumen de Configuraciones

### 1. Claude Code MCP (3 niveles)

| Nivel | Archivo | Quién lo usa |
|-------|---------|--------------|
| **user** | `~/.claude.json` → `mcpServers` | Global, todos los proyectos |
| **project** | `.mcp.json` en el repo | Solo este proyecto |
| **local** | `~/.claude.json` → `projects[path].mcpServers` | Privado, sobrescribe project |

**Prioridad:** local > project > user

### 2. Plugin de Figma (URLs de servidor)

| Archivo | Configuración | Estado |
|---------|---------------|--------|
| **ui.html** | Auto-detección (localhost → Render) | ✅ OK |
| **ui.js** | Hardcodeado localhost | ⚠️ Inconsistente |

---

## Cambios a Realizar

### Fase 1: Limpiar configuración MCP actual

```bash
# Remover config local duplicada
claude mcp remove figma-html-bridge -s local
```

### Fase 2: Configurar `.mcp.json` del proyecto

Para tu desarrollo local:

```json
{
  "mcpServers": {
    "figma-html-bridge": {
      "command": "node",
      "args": ["./mcp-server.js"],
      "env": {
        "FIGMA_SERVER_URL": "http://localhost:3003",
        "FIGMA_SESSION_ID": "user_jrfjvp60",
        "API_KEY": "dev-key"
      }
    }
  }
}
```

### Fase 3: Agregar `.mcp.json` al `.gitignore`

```
# MCP config (personal development)
.mcp.json
```

### Fase 4: Actualizar ui.js con auto-detección

Modificar `ui.js` líneas 6-11 para que sea consistente con `ui.html`:

```javascript
// CONFIGURATION - Auto-detect server
var UI_CONFIG = {
    LOCAL_SERVER: 'http://localhost:3003',
    PROD_SERVER: 'https://html-to-figma.onrender.com',
    SSE_ENDPOINT: '/mcp-stream',
    MAX_RECONNECT_ATTEMPTS: 5,
    RECONNECT_DELAY: 3000
};

// SSE_BASE_URL will be set after detection
var SSE_BASE_URL = null;
```

### Fase 5: Crear documentación en `docs/CONFIGURATION.md`

Documentar toda la arquitectura de configuración para referencia futura.

---

## Flujo Final

### Equipo (usuarios finales):
1. Instalan plugin en Figma
2. Copian su Session ID
3. Agregan config en `~/.claude/mcp.json` (como dice Installation Guide)
4. Funciona con Render

### Tú en desarrollo:
1. Abres Claude Code en el proyecto html-to-figma
2. Automáticamente usa `.mcp.json` del proyecto (localhost)
3. Corres `node sse-server.js` para el servidor local
4. Trabajas

### Tú probando producción:
1. Cambias `FIGMA_SERVER_URL` en `.mcp.json` a Render
2. Reinicias Claude Code
3. Pruebas

---

## Archivos a Modificar

1. `.mcp.json` - Config de desarrollo (localhost)
2. `.gitignore` - Agregar `.mcp.json`
3. `ui.js` - Agregar auto-detección de servidor
4. `docs/CONFIGURATION.md` - Nueva documentación completa
5. `~/.claude.json` - Limpiar config local duplicada

---

## Documentación a Crear: `docs/CONFIGURATION.md`

```markdown
# Guía de Configuración

## Para Usuarios del Equipo

Ver [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)

## Para Desarrollo

### Configuración MCP (Claude Code)

El proyecto usa `.mcp.json` para configuración de desarrollo.
Este archivo NO va al repositorio (está en .gitignore).

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

### Configuración del Plugin

El plugin (ui.html) auto-detecta el servidor:
1. Intenta conectar a localhost:3003
2. Si falla, usa html-to-figma.onrender.com

### Cambiar entre desarrollo y producción

**Desarrollo (localhost):**
- `FIGMA_SERVER_URL`: `http://localhost:3003`
- `API_KEY`: `dev-key`
- Requiere: `node sse-server.js` corriendo

**Producción (Render):**
- `FIGMA_SERVER_URL`: `https://html-to-figma.onrender.com`
- `API_KEY`: `figma-team-2026`
```

---

## Verificación

1. Limpiar config local actual
2. Crear `.mcp.json` con localhost
3. Agregar al `.gitignore`
4. Actualizar `ui.js` con auto-detección
5. Crear `docs/CONFIGURATION.md`
6. Reiniciar Claude Code
7. Correr `node sse-server.js`
8. Probar enviar HTML a Figma local
