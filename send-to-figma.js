#!/usr/bin/env node

/**
 * Send HTML to Figma through the MCP server
 * 
 * This script reads an HTML file and sends it to the Figma plugin
 * through the MCP HTTP server that must be running.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// HTML file to send
const HTML_FILE = path.join(__dirname, 'examples/match-details-no-vars.html');
const MCP_SERVER = 'http://localhost:3001/mcp-data';

// Read the HTML file
try {
  const htmlContent = fs.readFileSync(HTML_FILE, 'utf8');
  console.log(`HTML file read: ${HTML_FILE} (${htmlContent.length} bytes)`);
  
  // Prepare data to send
  const postData = JSON.stringify({
    html: htmlContent,
    name: 'Match Details'
  });
  
  // Options for the HTTP request
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  // Send HTTP request
  const req = http.request(MCP_SERVER, options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(responseData);
        console.log('Response from MCP server:');
        console.log(JSON.stringify(response, null, 2));
        
        if (res.statusCode === 200) {
          console.log('\n✅ HTML successfully sent to Figma');
          console.log('\nFor this to work:');
          console.log('1. The "HTML-Figma Bridge 002" plugin must be open in Figma');
          console.log('2. The MCP server must be running (node mcp-http-server.js)');
          console.log('3. MCP monitoring must be activated in the plugin');
        } else {
          console.error('\n❌ Error sending HTML to Figma');
        }
      } catch (error) {
        console.error('Error processing response:', error);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error(`❌ Connection error: ${error.message}`);
    console.error('\nMake sure the MCP server is running:');
    console.error('  node mcp-http-server.js');
  });
  
  // Send the data
  req.write(postData);
  req.end();
  
} catch (error) {
  console.error(`❌ Error reading HTML file: ${error.message}`);
  process.exit(1);
} 