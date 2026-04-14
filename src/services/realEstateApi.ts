import api from '@/hooks/api';

export interface RealEstateMilestone {
  id: number;
  name: string;
  sequence: number;
  percentage: number;
  description: string;
}

export interface RealEstateProject {
  id: number;
  name: string;
  type: string;
  location: string | boolean;
  picture_url: string | null;
  main_picture_url?: string | boolean;
  gallery_urls?: string[];
  photo_gallery?: {
    id: number;
    name: string;
    mimetype: string;
    url: string;
  }[];
  map_location_url?: string;
  code?: string;
  currency?: {
    id: number;
    name: string;
    symbol: string;
  };
  total_units?: number;
  available_units?: number;
  description?: string;
  next_milestone?: string | boolean;
  estimated_completion_date?: string | boolean;
  milestone_template?: RealEstateMilestone[];
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
          { id: 1, name: 'Unit A1', number: 'A1', house_type: false, state: 'available', unit_price: 25000000, currency: { id: 120, name: 'NGN', symbol: '₦' } },
          { id: 2, name: 'Unit A2', number: 'A2', house_type: false, state: 'available', unit_price: 27500000, currency: { id: 120, name: 'NGN', symbol: '₦' } },
          { id: 3, name: 'Unit B1', number: 'B1', house_type: false, state: 'sold', unit_price: 30000000, currency: { id: 120, name: 'NGN', symbol: '₦' } },
          { id: 4, name: 'Unit B2', number: 'B2', house_type: false, state: 'available', unit_price: 32000000, currency: { id: 120, name: 'NGN', symbol: '₦' } },
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
    
    // Normalize the response if it matches the structure where data is nested
    if (response.data?.result?.project) {
      return response.data;
    }

    if (response.data?.result?.data) {
      return {
        jsonrpc: response.data.jsonrpc,
        id: response.data.id,
        result: {
          project: response.data.result.data,
          units: response.data.result.units || [],
          unit_count: response.data.result.unit_count || (response.data.result.units ? response.data.result.units.length : 0)
        }
      };
    }
    
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
          gallery_urls: [
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
          ],
          map_location_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.728551469375!2d3.4354228!3d6.4353051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf5306d15e297%3A0xc3f83f2a832669e4!2sLekki%20Phase%201%2C%20Lagos!5e0!3m2!1sen!2sng!4v1711612345678!5m2!1sen!2sng',
          description: 'Experience luxury living at its finest in the Premium Waterfront Estate. Located in the heart of Lekki Phase 1, this project offers breathtaking waterfront views, state-of-the-art amenities, and unparalleled architectural design. Perfect for both investment and a dream home, this estate is where modern elegance meets serene coastal charm.',
          milestone_template: [
            { id: 1, name: "Foundations", sequence: 1, percentage: 20, description: "Laying the groundwork" },
            { id: 2, name: "Structural", sequence: 2, percentage: 30, description: "Building the frame" },
            { id: 3, name: "Finishing", sequence: 3, percentage: 50, description: "Final touches" }
          ]
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
