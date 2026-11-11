import axios from 'axios';

// Test different authentication failure scenarios to understand error message structure
async function testErrorMessages() {
  console.log('Testing Odoo authentication error message structure...\n');
  
  const testCases = [
    {
      name: "Invalid email and password",
      payload: {
        jsonrpc: "2.0",
        method: "call",
        params: {
          db: "ngml_corp",
          login: "invalid@email.com",
          password: "wrongpassword",
          context: {}
        }
      }
    },
    {
      name: "Empty credentials",
      payload: {
        jsonrpc: "2.0",
        method: "call",
        params: {
          db: "ngml_corp",
          login: "",
          password: "",
          context: {}
        }
      }
    },
    {
      name: "Valid email format but wrong credentials",
      payload: {
        jsonrpc: "2.0",
        method: "call",
        params: {
          db: "ngml_corp",
          login: "test@ngml.com",
          password: "wrongpass123",
          context: {}
        }
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n--- Testing: ${testCase.name} ---`);
    
    try {
      const response = await axios.post('http://41.78.157.36:8069/web/session/authenticate', testCase.payload, {
        withCredentials: true,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response structure:');
      console.log('- result exists:', !!response.data?.result);
      console.log('- result.uid exists:', !!response.data?.result?.uid);
      console.log('- error exists:', !!response.data?.error);
      
      if (response.data?.error) {
        console.log('Error details:');
        console.log('- error.message:', response.data.error.message);
        console.log('- error.data:', response.data.error.data);
        console.log('- error.data.message:', response.data.error.data?.message);
        console.log('- error.data.name:', response.data.error.data?.name);
        console.log('- error.data.debug:', response.data.error.data?.debug);
      }
      
      console.log('Full response data:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log('Caught in catch block:');
      console.log('- Status:', error.response?.status);
      console.log('- Status text:', error.response?.statusText);
      console.log('- Response data:', error.response?.data);
      console.log('- Error message:', error.message);
    }
  }
}

testErrorMessages();