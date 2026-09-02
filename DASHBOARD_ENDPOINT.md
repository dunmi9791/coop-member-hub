# Dashboard Endpoint Implementation

This document describes the implementation of the `/api/portal/dashboard` endpoint for the Cooperative Member Hub project.

## Overview

The dashboard endpoint provides member dashboard data in JSON-RPC 2.0 format, including:
- Member information
- Savings account details
- Loan information
- Investment data
- Recent transaction activities

## Endpoint Details

- **URL**: `/api/portal/dashboard`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Port**: 3001 (backend server)
- **Proxy**: Available through Vite dev server at port 8080

## Request Format

The endpoint accepts JSON-RPC 2.0 requests:

```json
{
  "jsonrpc": "2.0",
  "method": "call",
  "id": 1,
  "params": {}
}
```

## Response Format

The endpoint returns JSON-RPC 2.0 responses with the following structure:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "member": {
      "id": 3,
      "name": "Administrator",
      "member_id": "New",
      "member_since": false
    },
    "savings": {
      "total_balance": 134000.0,
      "primary_account_number": "CSA2500001",
      "primary_account_id": 1
    },
    "loans": {
      "outstanding_loans": 0,
      "items": []
    },
    "investments": {
      "total_investment": 0.0
    },
    "recent_activities": [
      {
        "type": "withdrawal",
        "date": "2026-01-28",
        "amount": 1000.0,
        "description": "Withdrawal - CSA2500001",
        "reference": "CST26000008"
      },
      {
        "type": "contribution",
        "date": "2025-09-09",
        "amount": 50000.0,
        "description": "Contribution - CSA2500001",
        "reference": "CST25000002"
      }
    ]
  }
}
```

## Implementation Files

### Backend Server
- **File**: `server.js`
- **Description**: Node.js HTTP server implementing the dashboard endpoint
- **Features**:
  - JSON-RPC 2.0 validation
  - CORS support
  - Error handling
  - Health check endpoint (`/health`)

### Frontend Integration
- **File**: `src/services/dashboardApi.ts`
- **Description**: TypeScript service for calling the dashboard endpoint
- **Features**:
  - Type-safe interfaces
  - Error handling with fallback to mock data
  - Axios integration

### Dashboard Page
- **File**: `src/pages/Index.tsx`
- **Description**: Main dashboard page that consumes the API
- **Features**:
  - Real-time data fetching
  - Fallback to mock data on API failure
  - Responsive UI components

## Configuration

### Vite Proxy Configuration
The `vite.config.ts` includes proxy configuration to route dashboard requests:

```typescript
proxy: {
  '/api/portal/dashboard': {
    target: 'http://localhost:3001', 
    changeOrigin: true,
    secure: false,
  },
  // ... other proxy configurations
}
```

### Package.json Scripts
New scripts have been added to `package.json`:

```json
{
  "scripts": {
    "server": "node server.js",
    "dev:full": "concurrently \"npm run server\" \"npm run dev\""
  }
}
```

## Usage Instructions

### 1. Start the Backend Server
```bash
npm run server
```
This starts the dashboard API server on port 3001.

### 2. Start the Frontend Development Server
```bash
npm run dev
```
This starts the Vite development server on port 8080 with proxy configuration.

### 3. Start Both Servers Simultaneously
```bash
npm run dev:full
```
This starts both the backend server and frontend development server concurrently.

### 4. Access the Dashboard
Navigate to `http://localhost:8080/dashboard` to view the dashboard with real data.

## Testing

### Direct Server Testing
Use the provided test script to test the server directly:

```bash
node test-server-direct.js
```

This tests:
- Health endpoint (`/health`)
- Dashboard endpoint (`/api/portal/dashboard`)
- JSON-RPC format validation
- Response data structure

### Frontend Integration Testing
Use the existing test script to test through the Vite proxy:

```bash
node test-dashboard-endpoint.js
```

## Error Handling

The implementation includes comprehensive error handling:

### Backend Server
- Invalid JSON-RPC requests return proper error responses
- Network errors are logged and handled gracefully
- CORS preflight requests are supported

### Frontend Service
- API failures automatically fall back to mock data
- Network timeouts are handled (10-second timeout)
- Error logging for debugging

## Data Structure

### Member Information
- `id`: Unique member identifier
- `name`: Member's full name
- `member_id`: Member identification number
- `member_since`: Membership status/date

### Savings Information
- `total_balance`: Current savings balance
- `primary_account_number`: Primary savings account number
- `primary_account_id`: Account identifier

### Loans Information
- `outstanding_loans`: Number of active loans
- `items`: Array of loan details (currently empty in sample data)

### Investments Information
- `total_investment`: Total investment amount

### Recent Activities
Array of transaction objects with:
- `type`: Transaction type (withdrawal, contribution, etc.)
- `date`: Transaction date (YYYY-MM-DD format)
- `amount`: Transaction amount
- `description`: Transaction description
- `reference`: Transaction reference number

## Security Considerations

- CORS is enabled for development (should be restricted in production)
- No authentication is currently implemented (add as needed)
- Input validation is performed on JSON-RPC requests
- Error responses don't expose sensitive information

## Future Enhancements

1. **Authentication**: Add user authentication and session management
2. **Real Data Integration**: Connect to actual Odoo backend for live data
3. **Caching**: Implement response caching for better performance
4. **Rate Limiting**: Add rate limiting for production use
5. **Logging**: Enhanced logging for monitoring and debugging
6. **HTTPS**: SSL/TLS support for production deployment

## Troubleshooting

### Common Issues

1. **Connection Refused Error**
   - Ensure the backend server is running (`npm run server`)
   - Check that port 3001 is not blocked

2. **CORS Errors**
   - Verify Vite proxy configuration
   - Ensure CORS headers are properly set in server.js

3. **404 Not Found**
   - Confirm the endpoint URL is correct
   - Check server routing configuration

4. **JSON-RPC Validation Errors**
   - Verify request format matches specification
   - Check that all required fields are present

### Debug Mode
Enable debug logging by adding console.log statements in:
- `server.js` for backend debugging
- `src/services/dashboardApi.ts` for frontend API debugging
- `src/pages/Index.tsx` for UI debugging