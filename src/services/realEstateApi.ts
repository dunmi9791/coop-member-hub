import api from '@/hooks/api';

export interface RealEstateProject {
  id: number;
  name: string;
  type: string;
  location: string | boolean;
  picture_url: string | null;
  code?: string;
  currency?: {
    id: number;
    name: string;
    symbol: string;
  };
  total_units?: number;
  available_units?: number;
  next_milestone?: string | boolean;
  estimated_completion_date?: string | boolean;
}

export interface RealEstateUnit {
  id: number;
  name: string;
  number: string;
  house_type: string | boolean;
  state: string;
  unit_price: number;
  currency: {
    id: number;
    name: string;
    symbol: string;
  };
}

export interface ProjectDetailsResponse {
  jsonrpc: string;
  id: number;
  result: {
    project: RealEstateProject;
    units: RealEstateUnit[];
    unit_count: number;
  };
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export const fetchProjectUnits = async (projectId: number): Promise<{ result: { units: RealEstateUnit[] }, error?: any }> => {
  const requestBody = {
    jsonrpc: "2.0",
    method: "call",
    params: { project_id: projectId },
    id: Math.floor(Math.random() * 1000)
  };

  try {
    const response = await api.post('/api/portal/real_estate/project_units', requestBody);
    return response.data;
  } catch (error) {
    // Return mock data for now if API fails
    return {
      result: {
        units: [
          { id: 1, name: 'Unit A1', price: 25000000, status: 'available', square_meters: 120, floor: '1st Floor' },
          { id: 2, name: 'Unit A2', price: 27500000, status: 'available', square_meters: 130, floor: '1st Floor' },
          { id: 3, name: 'Unit B1', price: 30000000, status: 'sold', square_meters: 150, floor: '2nd Floor' },
          { id: 4, name: 'Unit B2', price: 32000000, status: 'available', square_meters: 160, floor: '2nd Floor' },
        ]
      }
    };
  }
};

export interface RealEstateResponse {
  jsonrpc: string;
  id: number;
  result: {
    count: number;
    projects: RealEstateProject[];
  };
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export const fetchProjectDetails = async (projectId: number): Promise<ProjectDetailsResponse> => {
  const requestBody = {
    jsonrpc: "2.0",
    method: "call",
    params: { project_id: projectId },
    id: Math.floor(Math.random() * 1000)
  };

  try {
    const response = await api.post('/api/portal/real_estate/project_details', requestBody);
    return response.data;
  } catch (error) {
    // Return mock data for now if API fails
    return {
      jsonrpc: "2.0",
      id: 1,
      result: {
        project: {
          id: projectId,
          name: 'Premium Waterfront Estate',
          type: 'Residential',
          location: 'Lekki Phase 1, Lagos',
          picture_url: null,
        },
        units: [
          { 
            id: 1, 
            name: 'Unit A1', 
            number: 'A1',
            house_type: false,
            state: 'available', 
            unit_price: 25000000,
            currency: { id: 120, name: 'NGN', symbol: '₦' }
          },
          { 
            id: 2, 
            name: 'Unit A2', 
            number: 'A2',
            house_type: false,
            state: 'available', 
            unit_price: 27500000,
            currency: { id: 120, name: 'NGN', symbol: '₦' }
          }
        ],
        unit_count: 2
      }
    };
  }
};

export const fetchActiveProjects = async (): Promise<RealEstateResponse> => {
  const requestBody = {
    jsonrpc: "2.0",
    method: "call",
    params: {},
    id: Math.floor(Math.random() * 1000)
  };

  const response = await api.post('/api/portal/real_estate/active_projects', requestBody);
  return response.data;
};

export const subscribeToUnit = async (
  memberId: string,
  projectId: number,
  unitId: number,
  paymentSource: string
): Promise<{ result?: any; error?: any }> => {
  const requestBody = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      member_id: memberId,
      project_id: projectId,
      unit_id: unitId,
      payment_source: paymentSource
    },
    id: Math.floor(Math.random() * 1000)
  };

  try {
    const response = await api.post('/api/portal/real_estate/subscribe', requestBody);
    return response.data;
  } catch (error) {
    console.error('Subscription error:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      }
    };
  }
};
