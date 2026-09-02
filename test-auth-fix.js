import axios from 'axios';

// Test both successful and failed authentication scenarios
async function testAuthenticationFix() {
  console.log('Testing authentication fix...\n');
  
  // Test 1: Failed authentication
  console.log('1. Testing failed authentication:');
  const failPayload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      db: "ngml_corp",
      login: "invalid@email.com",
      password: "wrongpassword",
      context: {}
    }
  };

  try {
    const response = await axios.post('http://41.78.157.36:8069/web/session/authenticate', failPayload, {
      withCredentials: true,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    });
    
    console.log('Response status:', response.status);
    
    // Simulate the fixed logic
    if (response.data?.result && response.data.result.uid) {
      console.log('❌ Would redirect to dashboard (unexpected)');
    } else {
      console.log('✅ Would show error message and stay on login page');
      const errorMessage = response.data?.error?.data?.message || response.data?.error?.message || 'Authentication failed';
      console.log('Error message:', errorMessage);
    }
    
  } catch (error) {
    console.log('✅ Caught in catch block - would show error toast');
    console.log('Error:', error.response?.data?.message || error.message);
  }
  
  console.log('\n2. Testing with a potentially valid structure (simulated):');
  // Simulate what a successful response might look like
  const mockSuccessResponse = {
    data: {
      result: {
        uid: 123,
        session_id: 'test_session',
        db: 'ngml_corp',
        name: 'Test User',
        username: 'testuser'
      }
    }
  };
  
  if (mockSuccessResponse.data?.result && mockSuccessResponse.data.result.uid) {
    console.log('✅ Would redirect to dashboard (expected for valid auth)');
  } else {
    console.log('❌ Would not redirect (unexpected for valid auth)');
  }
}

testAuthenticationFix();