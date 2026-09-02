import axios from 'axios';

// Test authentication failure scenario
async function testAuthFailure() {
  console.log('Testing authentication failure scenario...');
  
  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      db: "ngml_corp",
      login: "invalid@email.com", // Invalid credentials
      password: "wrongpassword",
      context: {}
    }
  };

  try {
    const response = await axios.post('http://41.78.157.36:8069/web/session/authenticate', payload, {
      withCredentials: true,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    // Check if authentication was successful
    if (response.data && response.data.result && response.data.result.uid) {
      console.log('❌ Authentication should have failed but succeeded');
    } else {
      console.log('✅ Authentication failed as expected');
      console.log('Issue: Current code would still redirect to dashboard');
    }
    
  } catch (error) {
    console.log('✅ Authentication failed with error (expected):');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message || error.message);
  }
}

testAuthFailure();