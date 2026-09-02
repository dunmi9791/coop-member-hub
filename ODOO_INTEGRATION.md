# Odoo Backend Integration

This document describes the Odoo backend integration implemented for the Cooperative Member Hub project.

## Configuration

### Backend URL
- **Odoo Server**: http://41.78.157.36:8069/
- **Database**: ngml_corp

### Environment Configuration
The Odoo backend URL is configured in the `.env` file:
```
VITE_API_BASE_URL = 
```

### CORS Solution - Proxy Configuration
To resolve CORS (Cross-Origin Resource Sharing) issues when connecting to the Odoo backend from the local development environment, a proxy is configured in `vite.config.ts`:

```
proxy: {
  '/web': {
    target: 'http://41.78.157.36:8069', 
    changeOrigin: true,
    secure: false,
  },
}
```

This configuration:
- Routes all requests starting with `/web` through the Vite development server
- Proxies them to the Odoo backend at `http://41.78.157.36:8069`
- Eliminates CORS issues by making requests appear to come from the same origin
- Uses `changeOrigin: true` to modify the host header for proper routing

## Implementation Details

### Authentication
The login functionality is implemented in `src/pages/Login.tsx` with the following features:

1. **Odoo JSON-RPC Authentication**: Uses the standard Odoo authentication endpoint `/web/session/authenticate`
2. **Payload Structure**:
   ```json
   {
     "jsonrpc": "2.0",
     "method": "call",
     "params": {
       "db": "ngml_corp",
       "login": "user_email",
       "password": "user_password",
       "context": {}
     }
   }
   ```

3. **Session Management**: 
   - Successful authentication stores user data in `sessionStorage`
   - Uses React Context (`AuthContext`) for state management
   - Automatic redirect to dashboard on successful login

### API Configuration
- **File**: `src/hooks/api.ts`
- **HTTP Client**: Axios with 10-second timeout
- **Headers**: JSON content-type and accept headers
- **Interceptors**: Request/response interceptors for token handling and error management

## Files Modified

1. **`.env`**: Updated VITE_API_BASE_URL to point to Odoo backend
2. **`src/pages/Login.tsx`**: Fixed authentication endpoint (removed '/odoo' prefix)

## Existing Components

The project already had the following authentication infrastructure:
- `src/hooks/AuthContext.tsx`: React Context for user state management
- `src/pages/Login.tsx`: Complete login form with Odoo integration
- `src/hooks/api.ts`: Axios configuration with interceptors

## Usage

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the login page**: The application will show the login form

3. **Login with Odoo credentials**: Enter valid Odoo user credentials for the `ngml_corp` database

4. **Authentication Flow**:
   - Form submission sends JSON-RPC request to Odoo
   - Successful authentication stores session data
   - User is redirected to the dashboard
   - Failed authentication shows error toast notification

## Error Handling

The login implementation includes comprehensive error handling:
- Network connectivity issues
- Invalid credentials (400 status)
- Server errors
- Timeout handling (10-second timeout)

## Testing

Two test scripts are available:

1. **`test-odoo-connection.js`** - Tests direct connection to Odoo server:
   - Basic connectivity to the Odoo server
   - Authentication endpoint accessibility
   - Proper error handling for invalid credentials

2. **`test-proxy.js`** - Tests the proxy configuration:
   - Verifies that the Vite proxy correctly routes requests
   - Tests CORS resolution through the development server
   - Requires the development server to be running (`npm run dev`)

## Security Considerations

- Credentials are transmitted over HTTP (consider HTTPS for production)
- Session data is stored in sessionStorage (cleared on browser close)
- CORS issues are resolved through Vite proxy configuration (no server-side CORS setup needed)
- The proxy configuration is only active during development (production deployments may need different CORS handling)

## Next Steps

1. Test with actual Odoo user credentials
2. Implement logout functionality
3. Add session refresh mechanism
4. Consider implementing HTTPS for production
5. Add proper error messages for different authentication failure scenarios