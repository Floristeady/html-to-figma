// ✨ SIMPLE PHASE 1 TEST - Copy and paste into Figma console (F12)

// Test data
const testData = {
    timestamp: Date.now(),
    type: 'mcp-request',
    function: 'mcp_html_to_design_import-html',
    arguments: {
        html: '<div style="background:linear-gradient(45deg,#667eea,#764ba2);padding:30px;border-radius:12px;color:white;font-family:Inter"><h2>✅ Phase 1 Working!</h2><p>Storage-based MCP is working perfectly!</p></div>',
        name: 'Phase 1 Test'
    },
    requestId: Date.now().toString()
};

// Send to plugin
parent.postMessage({
    pluginMessage: {
        type: 'store-mcp-data',
        data: testData
    }
}, '*');

console.log('✅ Test sent! Start MCP monitoring in plugin to see the magic ✨'); 