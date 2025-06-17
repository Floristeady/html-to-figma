// Test HTTP Fallback - Run this if you want to test the hybrid system
// First start the HTTP server: node mcp-http-server.js
// Then run this script

console.log('🔄 Testing HTTP Fallback System...');

const testHTML = `
<div style="
    background: linear-gradient(45deg, #ff6b6b 0%, #ffa500 100%);
    padding: 30px;
    border-radius: 12px;
    color: white;
    font-family: Inter, sans-serif;
    max-width: 500px;
    margin: 20px;
">
    <h2 style="margin: 0 0 20px 0; font-size: 24px;">
        🔄 HTTP Fallback Test
    </h2>
    <p style="margin: 0 0 15px 0; opacity: 0.9; line-height: 1.5;">
        This HTML was sent via <strong>HTTP fallback</strong> system!
    </p>
    <div style="
        background: rgba(255, 255, 255, 0.2);
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
    ">
        <strong>🌐 Legacy HTTP System</strong><br>
        <small style="opacity: 0.8;">
            localhost:3001 → Plugin polling
        </small>
    </div>
</div>
`;

// Send via HTTP (traditional method)
fetch('http://localhost:3001/mcp-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        html: testHTML,
        name: 'HTTP Fallback Test'
    })
})
.then(response => response.json())
.then(data => {
    console.log('✅ HTTP fallback test sent successfully:', data);
    console.log('📋 Plugin should detect this via HTTP polling');
})
.catch(error => {
    console.log('❌ HTTP server not available:', error);
    console.log('💡 Start server with: node mcp-http-server.js');
}); 