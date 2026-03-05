const http = require('http');
const url = require('url');
const PORT = 3001;

// Helper function to parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  
  // Dashboard endpoint
  if (req.method === 'POST' && parsedUrl.pathname === '/api/portal/dashboard') {
    try {
      const body = await parseBody(req);
      console.log('Dashboard endpoint called with:', body);
      
      // Validate JSON-RPC request
      if (!body.jsonrpc || body.jsonrpc !== '2.0' || body.method !== 'call') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          jsonrpc: '2.0',
          id: body.id || null,
          error: {
            code: -32600,
            message: 'Invalid Request'
          }
        }));
        return;
      }

      // Sample dashboard data as specified in the requirements
      const dashboardData = {
        jsonrpc: "2.0",
        id: body.id,
        result: {
          member: {
            id: 3,
            name: "Administrator",
            member_id: "New",
            member_since: false
          },
          savings: {
            total_balance: 134000.0,
            primary_account_number: "CSA2500001",
            primary_account_id: 1
          },
          loans: {
            outstanding_loans: 0,
            items: []
          },
          investments: {
            total_investment: 0.0
          },
          recent_activities: [
            {
              type: "withdrawal",
              date: "2026-01-28",
              amount: 1000.0,
              description: "Withdrawal - CSA2500001",
              reference: "CST26000008"
            },
            {
              type: "contribution",
              date: "2025-09-09",
              amount: 50000.0,
              description: "Contribution - CSA2500001",
              reference: "CST25000002"
            },
            {
              type: "contribution",
              date: "2025-09-01",
              amount: 60000.0,
              description: "Contribution - CSA2500001",
              reference: "CST25000001"
            },
            {
              type: "withdrawal",
              date: "2025-08-02",
              amount: 25000.0,
              description: "Withdrawal - CSA2500001",
              reference: "CST25000004"
            },
            {
              type: "contribution",
              date: "2025-08-01",
              amount: 50000.0,
              description: "Contribution - CSA2500001",
              reference: "CST25000003"
            }
          ]
        }
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(dashboardData));
    } catch (error) {
      console.error('Error processing dashboard request:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32603,
          message: 'Internal error'
        }
      }));
    }
    return;
  }

  // Health check endpoint
  if (req.method === 'GET' && parsedUrl.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'OK', 
      timestamp: new Date().toISOString() 
    }));
    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`Dashboard API server running on http://localhost:${PORT}`);
  console.log(`Dashboard endpoint available at: http://localhost:${PORT}/api/portal/dashboard`);
});