import axios from 'axios';

// Test script to examine Odoo session structure
async function testOdooSessionStructure() {
  console.log('Testing Odoo Session Structure...\n');

  const loginPayload = {
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "db": "ngml_corp",
      "login": "test@example.com", // placeholder - would use real credentials
      "password": "testpassword",
      "context": {}
    }
  };

  try {
    console.log('Login payload:', JSON.stringify(loginPayload, null, 2));
    
    // Test through development server proxy
    const response = await axios.post('http://localhost:8080/web/session/authenticate', loginPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000,
      withCredentials: true // Important for session-based auth
    });

    console.log('\n✅ Login Response Structure:');
    console.log('Status:', response.status);
    console.log('Headers:', Object.keys(response.headers));
    console.log('Response keys:', Object.keys(response.data));
    
    if (response.data.result) {
      console.log('Result keys:', Object.keys(response.data.result));
      console.log('Session ID:', response.data.result.session_id || 'Not found');
      console.log('User ID:', response.data.result.uid || 'Not found');
      console.log('Database:', response.data.result.db || 'Not found');
    }

    // Check cookies for session information
    const cookies = response.headers['set-cookie'];
    if (cookies) {
      console.log('\n🍪 Session Cookies:');
      cookies.forEach(cookie => {
        if (cookie.includes('session_id')) {
          console.log('Session cookie found:', cookie.split(';')[0]);
        }
      });
    }

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Connection refused - make sure the development server is running');
      console.log('This test requires: npm run dev');
    } else if (error.response) {
      console.log('❌ Login failed (expected with test credentials)');
      console.log('Status:', error.response.status);
      console.log('Response structure for error case:');
      console.log('Keys:', Object.keys(error.response.data || {}));
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

// Show expected session structure based on Odoo documentation
function showExpectedSessionStructure() {
  console.log('\n📋 Expected Odoo Session Structure:');
  console.log(`
Successful login response typically contains:
{
  "jsonrpc": "2.0",
  "id": null,
  "result": {
    "session_id": "session_id_string",
    "uid": user_id_number,
    "is_system": false,
    "is_admin": false,
    "user_context": {...},
    "db": "database_name",
    "server_version": "...",
    "server_version_info": [...],
    "name": "User Name",
    "username": "username",
    "partner_id": partner_id_number,
    "company_id": company_id_number,
    "user_companies": {...}
  }
}

Session is typically maintained via:
1. session_id in response
2. HTTP cookies (session_id cookie)
3. Both should be sent with subsequent requests
  `);
}

// Run tests
async function runSessionTests() {
  console.log('🔍 Odoo Session Structure Analysis\n');
  console.log('=' .repeat(50));
  
  showExpectedSessionStructure();
  await testOdooSessionStructure();
  
  console.log('\n' + '='.repeat(50));
  console.log('Session analysis completed');
}

runSessionTests();