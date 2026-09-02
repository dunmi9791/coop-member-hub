const http = require('http');

// Test the dashboard endpoint directly
async function testDashboardEndpoint() {
  console.log('🧪 Testing Dashboard Server Directly...\n');

  const requestPayload = JSON.stringify({
    "jsonrpc": "2.0",
    "method": "call",
    "id": 1,
    "params": {}
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/portal/dashboard',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestPayload)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Dashboard endpoint test PASSED');
          console.log('Status:', res.statusCode);
          console.log('Response structure:');
          console.log('- jsonrpc:', response.jsonrpc);
          console.log('- id:', response.id);
          console.log('- result keys:', Object.keys(response.result || {}));
          
          // Validate response structure
          const result = response.result;
          
          console.log('\n📊 Dashboard Data:');
          console.log('Member:', result?.member?.name, '(ID:', result?.member?.id + ')');
          console.log('Savings Balance:', result?.savings?.total_balance);
          console.log('Account Number:', result?.savings?.primary_account_number);
          console.log('Outstanding Loans:', result?.loans?.outstanding_loans);
          console.log('Total Investment:', result?.investments?.total_investment);
          console.log('Recent Activities:', result?.recent_activities?.length, 'items');
          
          // Validate JSON-RPC format
          if (response.jsonrpc === "2.0" && response.id === 1 && response.result) {
            console.log('\n✅ JSON-RPC format validation PASSED');
          } else {
            console.log('\n❌ JSON-RPC format validation FAILED');
          }

          resolve(response);
        } catch (error) {
          console.log('❌ Failed to parse response:', error.message);
          console.log('Raw response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Connection refused - server is not running');
        console.log('Start the server with: node server.js');
      } else {
        console.log('❌ Request error:', error.message);
      }
      reject(error);
    });

    req.write(requestPayload);
    req.end();
  });
}

// Test health endpoint
async function testHealthEndpoint() {
  console.log('\n🏥 Testing Health Endpoint...\n');

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/health',
    method: 'GET'
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Health endpoint test PASSED');
          console.log('Status:', res.statusCode);
          console.log('Response:', response);
          resolve(response);
        } catch (error) {
          console.log('❌ Failed to parse health response:', error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Health endpoint error:', error.message);
      reject(error);
    });

    req.end();
  });
}

// Run tests
async function runTests() {
  console.log('🧪 Direct Server Test Suite\n');
  console.log('=' .repeat(50));
  
  try {
    await testHealthEndpoint();
    await testDashboardEndpoint();
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.log('\n❌ Test suite failed');
  }
  
  console.log('\n' + '='.repeat(50));
}

runTests();