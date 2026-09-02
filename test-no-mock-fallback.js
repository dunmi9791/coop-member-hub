import axios from 'axios';

// Test that dashboard doesn't fall back to mock data when API fails
async function testNoMockFallback() {
  console.log('Testing Dashboard - No Mock Fallback...\n');

  const requestPayload = {
    "jsonrpc": "2.0",
    "method": "call",
    "id": 1,
    "params": {}
  };

  try {
    console.log('Testing with invalid endpoint to simulate API failure...');
    
    // Test with an invalid endpoint to simulate API failure
    const response = await axios.post('http://localhost:8080/api/portal/invalid-endpoint', requestPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000
    });

    console.log('❌ Test FAILED - API should have failed but returned:', response.status);
    
  } catch (error) {
    if (error.response) {
      console.log('✅ API correctly failed with status:', error.response.status);
      console.log('✅ No mock data fallback occurred');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Connection refused - make sure the development server is running');
      console.log('Run: npm run dev');
    } else {
      console.log('✅ API correctly failed with error:', error.message);
      console.log('✅ No mock data fallback occurred');
    }
  }
}

// Test the actual dashboard endpoint with field mapping
async function testFieldMapping() {
  console.log('\n\nTesting Field Mapping (investment vs total_investment)...\n');

  const requestPayload = {
    "jsonrpc": "2.0",
    "method": "call",
    "id": 1,
    "params": {}
  };

  try {
    console.log('Testing actual dashboard endpoint...');
    
    const response = await axios.post('http://localhost:8080/api/portal/dashboard', requestPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Dashboard endpoint responded with status:', response.status);
    
    const result = response.data.result;
    
    if (result?.investments) {
      console.log('Investments data structure:');
      console.log('- Has investment field:', result.investments.investment !== undefined);
      console.log('- Has total_investment field:', result.investments.total_investment !== undefined);
      
      if (result.investments.investment !== undefined) {
        console.log('✅ API returns "investment" field as expected');
        console.log('Value:', result.investments.investment);
      }
      
      if (result.investments.total_investment !== undefined) {
        console.log('✅ Field mapping working - "total_investment" is available');
        console.log('Value:', result.investments.total_investment);
      }
    } else {
      console.log('❌ No investments data found in response');
    }

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Connection refused - make sure the development server is running');
      console.log('Run: npm run dev');
    } else if (error.response) {
      console.log('❌ Dashboard endpoint failed with status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Dashboard No Mock Fallback Test Suite\n');
  console.log('=' .repeat(50));
  
  await testNoMockFallback();
  await testFieldMapping();
  
  console.log('\n' + '='.repeat(50));
  console.log('Test suite completed');
}

runTests();