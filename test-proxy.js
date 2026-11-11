const axios = require('axios');

// Test proxy configuration by making a request to localhost
async function testProxyConfiguration() {
  console.log('Testing proxy configuration...');
  console.log('This test assumes the dev server is running on localhost:8080');
  
  try {
    // Test the proxy endpoint
    const authPayload = {
      jsonrpc: "2.0",
      method: "call",
      params: {
        db: "ngml_corp",
        login: "test@example.com", 
        password: "testpassword",
        context: {}
      },
    };
    
    console.log('\nTesting proxy route: http://localhost:8080/web/session/authenticate');
    
    const response = await axios.post('http://localhost:8080/web/session/authenticate', authPayload, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✓ Proxy is working correctly');
    console.log('Response status:', response.status);
    
    if (response.data && response.data.error) {
      console.log('Expected authentication error (invalid credentials):', response.data.error.message);
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('⚠ Development server is not running. Start it with: npm run dev');
    } else if (error.response) {
      console.log('✓ Proxy is working (received response from backend)');
      console.log('Response status:', error.response.status);
      if (error.response.data) {
        console.log('Response data:', error.response.data);
      }
    } else {
      console.error('✗ Proxy test failed:', error.message);
    }
  }
}

console.log('Proxy Configuration Test');
console.log('========================');
console.log('This script tests if the Vite proxy is correctly configured.');
console.log('Make sure to run "npm run dev" first to start the development server.\n');

testProxyConfiguration();