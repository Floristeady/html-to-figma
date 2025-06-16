#!/usr/bin/env node

/**
 * AI-to-Figma: Script to send AI-generated HTML to Figma
 * 
 * This script is designed to be easy to use by AI models.
 * It allows sending HTML directly to Figma through the MCP server.
 * 
 * Usage:
 *   node ai-to-figma.js "<html-content>" "Design Name"
 *   
 * Example:
 *   node ai-to-figma.js "<div style='color:blue'>Hello</div>" "Blue Text"
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const MCP_SERVER = 'http://localhost:3001/mcp-data';
const DEFAULT_NAME = 'AI Generated Design';

// Get HTML and design name from command line arguments
const htmlContent = process.argv[2];
const designName = process.argv[3] || DEFAULT_NAME;

// Check if HTML was provided
if (!htmlContent) {
  console.error('\n❌ Error: No HTML content provided');
  console.error('\nUsage:');
  console.error('  node ai-to-figma.js "<html-content>" "Design Name"');
  console.error('\nExample:');
  console.error('  node ai-to-figma.js "<div style=\'color:blue\'>Hello</div>" "Blue Text"');
  process.exit(1);
}

// Function to check if the MCP server is running
function checkMCPServer() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3001/health', (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`MCP server responded with code ${res.statusCode}`));
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(new Error('Error parsing MCP server response'));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Could not connect to MCP server: ${error.message}`));
    });
  });
}

// Function to send HTML to the MCP server
function sendHTMLToFigma(html, name) {
  return new Promise((resolve, reject) => {
    // Prepare data to send
    const postData = JSON.stringify({
      html: html,
      name: name
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
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          if (res.statusCode === 200) {
            resolve(response);
          } else {
            reject(new Error(`Server error: ${res.statusCode}`));
          }
        } catch (error) {
          reject(new Error('Error processing response'));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    // Send the data
    req.write(postData);
    req.end();
  });
}

// Main flow
async function main() {
  console.log('\n🚀 AI-to-Figma: Sending HTML to Figma...');
  console.log(`\n📝 Design name: ${designName}`);
  console.log(`\n📄 HTML (first 100 characters): ${htmlContent.substring(0, 100)}${htmlContent.length > 100 ? '...' : ''}`);
  
  try {
    // Check if the MCP server is running
    console.log('\n🔍 Verifying MCP server...');
    await checkMCPServer();
    console.log('✅ MCP server is running');
    
    // Send HTML to Figma
    console.log('\n📤 Sending HTML to Figma...');
    const response = await sendHTMLToFigma(htmlContent, designName);
    console.log('✅ HTML successfully sent to Figma');
    
    // Instructions for the user
    console.log('\n📋 For this to work:');
    console.log('1. The "HTML-Figma Bridge" plugin must be open in Figma');
    console.log('2. MCP monitoring must be activated in the plugin');
    console.log('\n🎨 Check Figma to see your generated design!');
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    console.error('\n📋 Make sure that:');
    console.error('1. The MCP server is running: node mcp-http-server.js');
    console.error('2. The "HTML-Figma Bridge" plugin is open in Figma');
    console.error('3. MCP monitoring is activated in the plugin');
    process.exit(1);
  }
}

// Execute
main(); 