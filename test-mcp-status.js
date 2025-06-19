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

let mcpWorking = false;
let mcpErrors = [];

mcpChild.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('MCP server ready')) {
    mcpWorking = true;
    console.log('✅ MCP Server se inicia correctamente');
  }
});

mcpChild.stderr.on('data', (data) => {
  const output = data.toString();
  if (output.includes('[MCP-SERVER]')) {
    mcpWorking = true;
    console.log('✅ MCP Server produce logs correctos');
  }
  mcpErrors.push(output);
});

// 4. Test de SSE Server
console.log('\n4. Probando SSE Server...');
const sseChild = spawn('node', ['sse-server.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let sseWorking = false;
let sseErrors = [];

sseChild.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('SSE server listening on port 3003')) {
    sseWorking = true;
    console.log('✅ SSE Server se inicia en puerto 3003');
  }
});

sseChild.stderr.on('data', (data) => {
  sseErrors.push(data.toString());
});

// Dar tiempo a los servidores para iniciarse
setTimeout(() => {
  mcpChild.kill('SIGTERM');
  sseChild.kill('SIGTERM');
  
  console.log('\n📋 Resumen del diagnóstico:');
  
  if (mcpWorking) {
    console.log('✅ MCP Server: Funcionando');
  } else {
    console.log('❌ MCP Server: Problemas');
    if (mcpErrors.length > 0) {
      console.log('   Errores MCP:', mcpErrors.slice(0, 2).join(''));
    }
  }
  
  if (sseWorking) {
    console.log('✅ SSE Server: Funcionando');
  } else {
    console.log('❌ SSE Server: Problemas');
    if (sseErrors.length > 0) {
      console.log('   Errores SSE:', sseErrors.slice(0, 2).join(''));
    }
  }
  
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