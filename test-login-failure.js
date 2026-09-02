import axios from 'axios';

// Test authentication failure scenarios
async function testAuthenticationFailure() {
    console.log('Testing authentication failure scenarios...\n');
    
    const baseURL = 'http://localhost:5173'; // Vite dev server
    const authEndpoint = '/web/session/authenticate';
    
    // Test cases for authentication failure
    const testCases = [
        {
            name: 'Invalid credentials',
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
            name: 'Empty credentials',
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
            name: 'Wrong database',
            payload: {
                jsonrpc: "2.0",
                method: "call",
                params: {
                    db: "wrong_db",
                    login: "test@email.com",
                    password: "password",
                    context: {}
                }
            }
        }
    ];
    
    for (const testCase of testCases) {
        console.log(`\n--- Testing: ${testCase.name} ---`);
        
        try {
            const response = await axios.post(
                `${baseURL}${authEndpoint}`,
                testCase.payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 10000,
                    withCredentials: true
                }
            );
            
            console.log('Status:', response.status);
            console.log('Response:', JSON.stringify(response.data, null, 2));
            
            // Check if authentication failed
            if (!response.data?.result?.uid) {
                console.log('✓ Authentication failed as expected');
                if (response.data?.error) {
                    console.log('Error details:', response.data.error);
                }
            } else {
                console.log('✗ Authentication unexpectedly succeeded');
            }
            
        } catch (error) {
            console.log('Request failed with error:');
            console.log('Status:', error.response?.status);
            console.log('Message:', error.message);
            if (error.response?.data) {
                console.log('Response data:', JSON.stringify(error.response.data, null, 2));
            }
        }
    }
}

// Run the test
testAuthenticationFailure().catch(console.error);