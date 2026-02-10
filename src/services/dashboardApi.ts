import api from '@/hooks/api';

export interface DashboardRequest {
  jsonrpc: string;
  method: string;
  id: number;
  params: {};
}

export interface DashboardResponse {
  jsonrpc: string;
  id: number;
  result: {
    member: {
      id: number;
      name: string;
      member_id: string;
      member_since: boolean;
    };
    savings: {
      total_balance: number;
      primary_account_number: string;
      primary_account_id: number;
    };
    loans: {
      outstanding_loans: number;
      items: any[];
    };
    investments: {
      total_investment: number;
    };
    recent_activities: Array<{
      type: string;
      date: string;
      amount: number;
      description: string;
      reference: string;
    }>;
  };
}

// Mock dashboard data - in a real implementation, this would come from the backend
const mockDashboardData: DashboardResponse['result'] = {
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
};

export const fetchDashboardData = async (request: DashboardRequest): Promise<DashboardResponse> => {
  // For now, we'll return mock data
  // In a real implementation, this would make an API call to the backend
  
  // Validate the request format
  if (request.jsonrpc !== "2.0" || request.method !== "call") {
    throw new Error("Invalid JSON-RPC request format");
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    jsonrpc: "2.0",
    id: request.id,
    result: mockDashboardData
  };
};

// Function to call the actual API endpoint
export const callDashboardEndpoint = async (request: DashboardRequest): Promise<DashboardResponse> => {
  try {
    // Make the actual API call to the Odoo backend
    const response = await api.post('/api/portal/dashboard', request);
    return response.data;
  } catch (error) {
    console.error('Dashboard API call failed:', error);
    // If the API call fails, fall back to mock data for development
    console.warn('Falling back to mock data due to API error');
    return await fetchDashboardData(request);
  }
};