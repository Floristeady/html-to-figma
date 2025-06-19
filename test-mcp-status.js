#!/usr/bin/env node

/**
 * Script de diagnóstico para el sistema MCP + SSE
 * Actualizado para arquitectura de servidores separados
 */

import fs from 'fs';
import { spawn } from 'child_process';

console.log('🔍 Diagnóstico HTML-to-Figma - Estado del Sistema\n');

// 1. Verificar archivos necesarios
console.log('1. Verificando archivos...');
const files = [
  'mcp-server.js',
  'sse-server.js', 
  'mcp-config.json',
  'src/code.ts',
  'code.js',
  'ui.js'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} NO existe`);
  }
});

// 2. Verificar configuración MCP
console.log('\n2. Verificando configuración MCP...');
try {
  const config = JSON.parse(fs.readFileSync('mcp-config.json', 'utf8'));
  if (config['figma-html-bridge']) {
    console.log('✅ Configuración MCP válida');
    const server = config['figma-html-bridge'];
    console.log(`   - Comando: ${server.command} ${server.args.join(' ')}`);
    console.log(`   - Directorio: ${server.cwd}`);
  } else {
    console.log('❌ Configuración MCP inválida');
  }
} catch (error) {
  console.log('❌ Error leyendo mcp-config.json:', error.message);
}

// 3. Test de MCP Server
console.log('\n3. Probando MCP Server...');
const mcpChild = spawn('node', ['mcp-server.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let mcpStatus = '❌ MCP Server: Problemas';

mcpChild.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('MCP server ready')) {
    mcpStatus = '✅ MCP Server: Funcionando';
    console.log('✅ MCP Server se inicia correctamente');
  }
});

mcpChild.stderr.on('data', (data) => {
  const output = data.toString();
  if (output.includes('[MCP-SERVER]')) {
    mcpStatus = '✅ MCP Server: Funcionando';
    console.log('✅ MCP Server produce logs correctos');
  }
});

// 4. Test de SSE Server con fetch
console.log('\n4. Probando SSE Server...');
let sseStatus = '❌ SSE Server: Problemas';

// Función para probar SSE Server
async function testSSEServer() {
  try {
    const sseResponse = await fetch('http://localhost:3003/mcp-status');
    if (sseResponse.ok) {
      const data = await sseResponse.json();
      console.log('✅ SSE Server: Funcionando');
      console.log(`   - Versión: ${data.version}`);
      console.log(`   - Conexiones activas: ${data.activeConnections}`);
      console.log(`   - Endpoint SSE: ${data.sseEndpoint}`);
      sseStatus = '✅ SSE Server: Funcionando';
    } else {
      console.log('❌ SSE Server: Respuesta no OK');
      sseStatus = '❌ SSE Server: Respuesta no OK';
    }
  } catch (error) {
    console.log('❌ SSE Server: No responde (posiblemente no iniciado)');
    console.log(`   Error: ${error.message}`);
    sseStatus = '❌ SSE Server: No disponible';
  }
}

// Dar tiempo a los servidores para iniciarse y luego probar SSE
setTimeout(async () => {
  await testSSEServer();
  
  mcpChild.kill('SIGTERM');
  
  console.log('\n📋 Resumen del diagnóstico:');
  console.log(mcpStatus);
  console.log(sseStatus);
  
  console.log('\n🚀 Para usar el sistema:');
  console.log('1. Inicia SSE Server: node sse-server.js');
  console.log('2. El MCP Server se inicia automáticamente con Cursor');
  console.log('3. Abre Figma y carga el plugin');
  console.log('4. En el plugin, conecta al SSE server');
  
  console.log('\n💡 Para verificar en Cursor:');
  console.log('- Ve a Cursor > Settings > MCP');
  console.log('- Debe aparecer: figma-html-bridge en VERDE');
  console.log('- Usa: @figma-html-bridge para enviar HTML');
  
}, 3000); 