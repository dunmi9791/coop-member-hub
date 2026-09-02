import axios from 'axios';

// Test the new savings overview endpoint
async function testSavingsOverview() {
  console.log('Testing /api/portal/savings_overview endpoint...\n');

  const requestData = {
    "jsonrpc": "2.0",
    "method": "call",
    "id": 1,
    "params": {}
  };

  try {
    // Test directly against the Odoo backend
    const response = await axios.post('http://41.78.157.36:8069/api/portal/savings_overview', requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Savings Overview API Response:');
    console.log('Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));

    // Validate response structure
    const result = response.data.result;
    if (result) {
      console.log('\n📊 Parsed Data:');
      console.log('Member:', result.member?.name);
      console.log('Currency:', result.currency?.symbol, result.currency?.name);
      console.log('Total Balance:', result.total_balance);
      console.log('Number of Accounts:', result.accounts?.length || 0);
      
      if (result.accounts && result.accounts.length > 0) {
        console.log('\n💰 Account Details:');
        result.accounts.forEach((account, index) => {
          console.log(`Account ${index + 1}:`);
          console.log(`  - ID: ${account.id}`);
          console.log(`  - Number: ${account.account_number}`);
          console.log(`  - Display Name: ${account.display_name}`);
          console.log(`  - Balance: ${account.balance}`);
          console.log(`  - Monthly Contribution: ${account.monthly_contribution}`);
          console.log(`  - Next Due Date: ${account.next_due_date}`);
          console.log(`  - Product: ${account.product?.name} (${account.product?.code})`);
        });
      }

      if (result.recent_transactions && result.recent_transactions.length > 0) {
        console.log('\n📋 Recent Transactions:', result.recent_transactions.length);
      }
    }

  } catch (error) {
    console.error('❌ Error testing savings overview endpoint:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.message);
      console.error('Make sure the development server is running (npm run dev)');
    } else {
      console.error('Request setup error:', error.message);
    }
  }
}

// Run the test
testSavingsOverview();