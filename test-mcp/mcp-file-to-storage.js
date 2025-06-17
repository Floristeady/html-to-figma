#!/usr/bin/env node

/**
 * MCP File-to-Storage Bridge
 * Reads mcp-shared-data.json and helps inject it into Figma plugin storage
 * This completes Phase 1 of the MCP migration
 */

const fs = require('fs');
const path = require('path');

class MCPFileToStorage {
  constructor() {
    this.sharedDataPath = path.join(__dirname, '..', 'mcp-shared-data.json');
    this.lastProcessed = 0;
  }

  // Read the MCP shared file
  readMCPFile() {
    try {
      if (fs.existsSync(this.sharedDataPath)) {
        const data = fs.readFileSync(this.sharedDataPath, 'utf8');
        const parsed = JSON.parse(data);
        
        // Only return if it's newer than last processed
        if (parsed.timestamp > this.lastProcessed) {
          return parsed;
        }
      }
      return null;
    } catch (error) {
      console.error('[File-to-Storage] Error reading MCP file:', error);
      return null;
    }
  }

  // Generate browser-executable code
  generateBrowserCode(data) {
    return `
// MCP Data Injection - Generated at ${new Date().toISOString()}
console.log('🔄 Injecting MCP data into Figma storage...');

const mcpData = ${JSON.stringify(data, null, 2)};

parent.postMessage({
  pluginMessage: {
    type: 'store-mcp-data',
    data: mcpData
  }
}, '*');

console.log('✅ MCP data sent to plugin storage!');
console.log('Data:', mcpData);
`;
  }

  // Main monitoring function
  monitor() {
    console.log('🔄 Monitoring mcp-shared-data.json for changes...');
    console.log('📁 File path:', this.sharedDataPath);
    
    setInterval(() => {
      const data = this.readMCPFile();
      if (data) {
        console.log('\n🆕 New MCP data detected!');
        console.log('📊 Data:', {
          timestamp: data.timestamp,
          type: data.type,
          function: data.function,
          requestId: data.requestId
        });
        
        const browserCode = this.generateBrowserCode(data);
        console.log('\n📋 Copy this code into Figma console (F12):');
        console.log('─'.repeat(60));
        console.log(browserCode);
        console.log('─'.repeat(60));
        
        this.lastProcessed = data.timestamp;
        
        // Clean up the file after processing
        try {
          fs.unlinkSync(this.sharedDataPath);
          console.log('🗑️  Cleaned up processed file');
        } catch (error) {
          console.log('⚠️  Could not clean up file:', error.message);
        }
      }
    }, 1000); // Check every second
  }

  // One-time check and code generation
  checkOnce() {
    const data = this.readMCPFile();
    if (data) {
      console.log('📊 Found MCP data:');
      console.log(JSON.stringify(data, null, 2));
      
      const browserCode = this.generateBrowserCode(data);
      console.log('\n📋 Copy this code into Figma console:');
      console.log(browserCode);
      
      return true;
    } else {
      console.log('⚠️  No MCP data found in', this.sharedDataPath);
      return false;
    }
  }
}

// Command line interface
const args = process.argv.slice(2);
const bridge = new MCPFileToStorage();

if (args.includes('--monitor') || args.includes('-m')) {
  bridge.monitor();
} else if (args.includes('--check') || args.includes('-c')) {
  bridge.checkOnce();
} else {
  console.log('🚀 MCP File-to-Storage Bridge');
  console.log('');
  console.log('Usage:');
  console.log('  node mcp-file-to-storage.js --monitor    # Monitor for changes');
  console.log('  node mcp-file-to-storage.js --check      # Check once and exit');
  console.log('');
  console.log('This tool bridges the gap between MCP file output and Figma storage input.');
  console.log('Use --monitor to automatically detect MCP requests and generate injection code.');
} 