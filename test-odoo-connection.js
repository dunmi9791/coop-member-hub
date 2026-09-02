const axios = require('axios');

// Test Odoo connection and authentication endpoint
async function testOdooConnection() {
  const baseURL = 'http://41.78.157.36:8069';
  
  console.log('Testing Odoo backend connection...');
  console.log('Base URL:', baseURL);
  console.log('Database:', 'ngml_corp');
  
  try {
    // Test basic connectivity
    console.log('\n1. Testing basic connectivity...');
    const healthCheck = await axios.get(`${baseURL}/web/health`, { timeout: 10000 });
    console.log('✓ Basic connectivity successful');
    
    // Test authentication endpoint with sample payload
    console.log('\n2. Testing authentication endpoint...');
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
    
    const authResponse = await axios.post(`${baseURL}/web/session/authenticate`, authPayload, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✓ Authentication endpoint is accessible');
    console.log('Response status:', authResponse.status);
    
    if (authResponse.data && authResponse.data.error) {
      console.log('Expected authentication error (invalid credentials):', authResponse.data.error.message);
    }
    
  } catch (error) {
    console.error('✗ Connection test failed:');
    if (error.code === 'ECONNREFUSED') {
      console.error('- Server is not accessible or refusing connections');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('- Connection timeout - server may be slow or unreachable');
    } else if (error.response) {
      console.error('- HTTP Error:', error.response.status, error.response.statusText);
      console.error('- Response data:', error.response.data);
    } else {
      console.error('- Error:', error.message);
    }
  }
}

testOdooConnection();