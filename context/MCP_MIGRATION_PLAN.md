# Plan de Migración: Solo MCP (Sin Localhost)

## 🎯 Objetivo Final
**Eliminar completamente localhost:3001** y usar únicamente el protocolo MCP para toda la comunicación.

## 📊 Estado Actual (Enero 2025)

### ✅ Lo que YA funciona:
- **Cursor MCP**: Conectado y funcionando (`~/.cursor/mcp.json`)
- **mcp-bridge.js**: Ejecutándose via Cursor MCP
- **Herramientas MCP**: Disponibles en Cursor
- **Plugin de Figma**: Cargado y funcionando
- **Parser HTML/CSS único**: Superior a otros MCP servers existentes

### ❌ Problema actual:
- **Plugin busca localhost:3001** en lugar de leer archivo directamente
- **Dependencia HTTP innecesaria**: mcp-http-server.js como intermediario
- **Arquitectura híbrida**: MCP → archivo → HTTP → Plugin

### 🎯 Arquitectura objetivo:
```
Cursor MCP → mcp-bridge.js → mcp-shared-data.json → Plugin (lectura directa)
```

### 🏆 **Ventajas únicas de nuestro sistema**:
- **🎨 Parser HTML/CSS inteligente**: Convierte estructuras completas, no nodos individuales
- **⚡ Conversión en una pasada**: Un HTML complejo → Diseño completo en Figma
- **🧠 Entendimiento semántico**: Reconoce patrones UI (botones, cards, badges)
- **🔧 Optimizado para web**: Mejor que sistemas genéricos como Talk to Figma MCP

## 🔧 Plan de Migración: 3 Fases

### Fase 1: Modificar Plugin para Lectura Directa ✅ COMPLETADA
**Duración**: ✅ 2 horas completadas
**Objetivo**: Plugin usa `figma.clientStorage` en lugar de HTTP

#### 1.1 Modificar src/code.ts ✅ COMPLETADO
- ✅ **🚨 IMPORTANTE**: NO se tocó la funcionalidad de pegar HTML y generar diseño
- ✅ **Implementar storage functions**: `readMCPSharedData()` y `deleteMCPSharedData()`
- ✅ **Híbrido polling**: Cambiar de HTTP-only a storage-first con HTTP fallback
- ✅ **Nuevo message handler**: `store-mcp-data` para inyección externa de datos
- ✅ **Mantener compatibilidad**: Misma funcionalidad HTML→Figma, fuente híbrida

#### 1.2 Implementación técnica
```typescript
// REMOVER (código actual HTTP):
const response = await fetch('http://localhost:3001/mcp-data');

// AGREGAR (lectura directa):
function readMCPSharedFile(): any | null {
  try {
    // Figma plugins pueden acceder a archivos en su directorio
    const data = figma.fileSystem.readFileSync('mcp-shared-data.json');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}
```

#### 1.3 Validación Fase 1 ✅ COMPLETADA
- ✅ **✅ Funcionalidad principal intacta**: Pegar HTML → Generar diseño sigue funcionando
- ✅ Compilar TypeScript: `npm run build` - sin errores
- ✅ Plugin funciona con storage-first para MCP (HTTP como fallback)
- ✅ **✅ Parser HTML/CSS sin cambios**: Toda la lógica de conversión preservada
- ✅ **Arquitectura híbrida**: Storage como primario, HTTP como fallback
- ✅ **Test infrastructure**: test-storage-mcp.js creado y funcionando

### Fase 2: Cleanup y Optimización 🧹
**Duración**: 30 minutos
**Objetivo**: Limpiar código legacy y optimizar

#### 2.1 Eliminar archivos HTTP
- [ ] **Deprecar**: `mcp-http-server.js` (mantener por compatibilidad)
- [ ] **Actualizar scripts**: `ai-to-figma.js` para usar solo archivos
- [ ] **Cleanup**: Remover referencias localhost del código

#### 2.2 Simplificar arquitectura
- [ ] **Un solo proceso**: Solo `mcp-bridge.js` via Cursor
- [ ] **Comunicación directa**: Sin intermediarios HTTP
- [ ] **Documentación**: Actualizar README

#### 2.3 Validación Fase 2
- [ ] Sistema funciona con un solo comando: "Abrir Cursor"
- [ ] No requiere ejecutar servidores manualmente
- [ ] Performance mejorado (sin HTTP overhead)

### Fase 3: Embedded MCP (Futuro) 🚀
**Duración**: Proyecto futuro
**Objetivo**: MCP server dentro del plugin

#### 3.1 Plugin autónomo
- [ ] **MCP integrado**: mcp-bridge.js embebido en plugin
- [ ] **Sin dependencias externas**: Plugin completamente autónomo
- [ ] **Auto-registro**: Plugin se registra en Cursor automáticamente

#### 3.2 Arquitectura ideal
```
Cursor ←→ Plugin Figma (MCP embebido)
```

## 🛠️ Implementación Detallada: Fase 1

### Cambios en src/code.ts

#### 1. Agregar función de lectura directa:
```typescript
// Nueva función para reemplazar HTTP
function readMCPData(): any | null {
  try {
    // En Figma plugins, usar __dirname o ruta relativa
    const filePath = './mcp-shared-data.json';
    
    // Verificar si el archivo existe
    if (!fileExists(filePath)) {
      return null;
    }
    
    // Leer y parsear archivo
    const data = readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(data);
    
    // Validar estructura MCP
    if (parsed.type === 'mcp-request') {
      return parsed;
    }
    
    return null;
  } catch (error) {
    console.error('Error reading MCP file:', error);
    return null;
  }
}
```

#### 2. Modificar función de polling:
```typescript
// ANTES (HTTP):
async function checkForMCPData() {
  try {
    const response = await fetch('http://localhost:3001/mcp-data');
    const data = await response.json();
    // ...
  } catch (error) {
    // ...
  }
}

// DESPUÉS (Archivo):
async function checkForMCPData() {
  try {
    const data = readMCPData();
    if (data && data.type === 'mcp-request') {
      // Procesar request MCP
      await processMCPRequest(data);
      
      // Eliminar archivo después de procesarlo
      deleteSharedFile();
    }
  } catch (error) {
    console.error('MCP data check failed:', error);
  }
}
```

#### 3. Eliminar funciones HTTP:
```typescript
// ELIMINAR todas las referencias a:
// - fetch('http://localhost:3001/...')
// - HTTP health checks
// - HTTP error handling
// - Botón "Test HTTP Server"
```

### Cambios en archivos de soporte

#### ai-to-figma.js (opcional - mantener compatibilidad):
```javascript
// Opción 1: Escribir directamente al archivo
const data = {
  type: 'mcp-request',
  function: 'mcp_html_to_design_import-html',
  arguments: { html: htmlContent, name: designName },
  requestId: Date.now().toString()
};

fs.writeFileSync('mcp-shared-data.json', JSON.stringify(data));

// Opción 2: Mantener HTTP como fallback (si está ejecutándose)
```

## 📋 Checklist de Migración

### Pre-migración
- [ ] **Backup**: Crear backup del código actual
- [ ] **🧪 Test funcionalidad principal**: Probar pegar HTML → generar diseño (debe funcionar)
- [ ] **Test baseline**: Verificar funcionamiento actual con HTTP para MCP
- [ ] **Compilar**: Asegurar que `npm run build` funciona

### Durante migración
- [ ] **Modificar src/code.ts**: Implementar lectura directa
- [ ] **Compilar y probar**: `npm run build` + test en Figma
- [ ] **Validar MCP**: Probar herramientas desde Cursor
- [ ] **Cleanup HTTP**: Remover código localhost

### Post-migración
- [ ] **🧪 Test funcionalidad principal**: Verificar que pegar HTML → generar diseño SIGUE funcionando
- [ ] **Documentar**: Actualizar README con nueva arquitectura
- [ ] **Performance**: Medir mejoras de rendimiento
- [ ] **Rollback plan**: Tener plan de vuelta atrás si es necesario

## 🎯 Beneficios Esperados

### Simplicidad operacional:
- ✅ **Un solo comando**: Abrir Cursor (automático)
- ✅ **Sin servidores**: No más `node mcp-http-server.js`
- ✅ **Sin puertos**: No depender de localhost:3001
- ✅ **Configuración mínima**: Solo Cursor MCP config

### Performance:
- ✅ **Menor latencia**: Sin HTTP overhead
- ✅ **Menos recursos**: Sin servidor HTTP
- ✅ **Más confiable**: Sin problemas de conectividad

### Mantenimiento:
- ✅ **Código más simple**: Menos capas de abstracción
- ✅ **Menos dependencias**: Sin express, cors, etc.
- ✅ **Debugging más fácil**: Comunicación directa

## 🚨 Riesgos y Mitigaciones

### Riesgo 1: Romper funcionalidad principal HTML→Figma
**Mitigación**: NO tocar código de parsing HTML/CSS durante migración
**Plan B**: Rollback inmediato si algo se rompe
**Validación**: Probar pegar HTML antes y después de cada cambio

### Riesgo 2: Figma plugins no pueden leer archivos
**Mitigación**: Investigar API de Figma para file system access
**Plan B**: Mantener HTTP como fallback solo para MCP

### Riesgo 3: Performance de polling de archivos
**Mitigación**: Optimizar frecuencia de polling
**Plan B**: File watching si está disponible

### Riesgo 4: Compatibilidad con scripts externos
**Mitigación**: Mantener `ai-to-figma.js` funcionando con archivos
**Plan B**: Dual support (archivo + HTTP)

## 📅 Timeline Sugerido

### Día 1: Investigación y diseño (2 horas)
- [ ] Investigar API de Figma para file access
- [ ] Diseñar nueva arquitectura de polling
- [ ] Preparar entorno de desarrollo

### Día 2: Implementación (3-4 horas)
- [ ] Modificar src/code.ts
- [ ] Compilar y probar
- [ ] Validar con herramientas MCP
- [ ] Cleanup código HTTP

### Día 3: Testing y documentación (1-2 horas)
- [ ] Test completo del sistema
- [ ] Actualizar documentación
- [ ] Preparar rollback si es necesario

## 🏁 Estado Final Esperado

### Arquitectura limpia:
```
Cursor MCP Tools → mcp-bridge.js → mcp-shared-data.json → Plugin Figma
     (automático)    (automático)        (archivo)         (lectura directa)
```

### Experiencia del usuario:
1. **Abrir Cursor** → MCP automáticamente disponible
2. **Usar herramienta MCP** → HTML aparece en Figma
3. **Fin** → Sin configuración manual

### Código limpio:
- ❌ Sin referencias a localhost
- ❌ Sin mcp-http-server.js en el flujo
- ❌ Sin dependencias HTTP innecesarias
- ✅ Solo MCP protocol estándar
- ✅ Comunicación directa por archivos
- ✅ Sistema autónomo y confiable 