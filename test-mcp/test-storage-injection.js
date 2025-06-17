// Phase 1 Test - Storage MCP Injection
// Copy and paste this entire script into Figma's browser console (F12)

console.log('🧪 Phase 1 MCP Test - Starting...');

// Read the test HTML file content
const testHTML = `
<div style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 30px;
    border-radius: 12px;
    color: white;
    font-family: Inter, sans-serif;
    max-width: 500px;
    margin: 20px;
">
    <h2 style="margin: 0 0 20px 0; font-size: 24px;">
        ✅ Phase 1 MCP Test
    </h2>
    <p style="margin: 0 0 15px 0; opacity: 0.9; line-height: 1.5;">
        This HTML was sent via the new <strong>figma.clientStorage</strong> mechanism!
    </p>
    <div style="
        background: rgba(255, 255, 255, 0.2);
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
    ">
        <strong>🎯 Pure MCP Architecture Working</strong><br>
        <small style="opacity: 0.8;">
            No localhost:3001 dependency for this test!
        </small>
    </div>
    <div style="
        margin-top: 15px;
        padding: 10px;
        background: rgba(0, 255, 0, 0.2);
        border-radius: 6px;
        font-size: 14px;
    ">
        <strong>Storage-first with HTTP fallback</strong> ✨
    </div>
</div>
`;

// Create MCP data structure
const mcpData = {
    timestamp: Date.now(),
    type: 'mcp-request',
    function: 'mcp_html_to_design_import-html',
    arguments: {
        html: testHTML,
        name: 'Phase 1 Storage Test'
    },
    requestId: Date.now().toString()
};

console.log('📦 MCP Data prepared:', mcpData);

// Send to plugin via the new storage mechanism
console.log('📤 Sending to plugin storage...');

parent.postMessage({
    pluginMessage: {
        type: 'store-mcp-data',
        data: mcpData
    }
}, '*');

console.log('✅ Phase 1 Test data sent!');
console.log('');
console.log('📋 Next steps:');
console.log('1. Start MCP monitoring in the plugin (click the monitoring button)');
console.log('2. Wait 1-2 seconds for automatic detection');
console.log('3. Check Figma canvas for the gradient card design');
console.log('4. Look at plugin console for "Using clientStorage data source" message');
console.log('');
console.log('🎯 Expected result: Beautiful gradient card with Phase 1 success message'); 