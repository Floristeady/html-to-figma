// 🚀 QUICK MCP TEST - Phase 1
// Copy and paste into Figma console (F12)

console.log('🚀 === QUICK MCP TEST ===');

// Step 1: Start monitoring 
console.log('📡 Step 1: Starting MCP monitoring...');
parent.postMessage({
  pluginMessage: { type: 'start-mcp-monitoring' }
}, '*');

// Step 2: Send test data after 1 second
setTimeout(() => {
  console.log('📦 Step 2: Sending test data...');
  
  const testData = {
    timestamp: Date.now(),
    type: 'mcp-request',
    function: 'mcp_html_to_design_import-html',
    arguments: {
      html: '<div style="background:linear-gradient(45deg,#ff6b6b,#4ecdc4);padding:30px;border-radius:12px;color:white;font-family:Inter;text-align:center;"><h2>🎉 MCP Test Success!</h2><p>Quick test working perfectly!</p></div>',
      name: 'Quick Test'
    },
    requestId: Date.now().toString()
  };

  parent.postMessage({
    pluginMessage: {
      type: 'store-mcp-data',
      data: testData
    }
  }, '*');
  
  console.log('✅ Test data sent! Watch for:', testData.timestamp);
  
  // Step 3: Watch for results
  console.log('👀 Step 3: Watch console for MCP processing...');
  console.log('Expected: [MCP] Found data in clientStorage...');
  
}, 1000);

console.log('⏰ Test will complete in 5 seconds...'); 