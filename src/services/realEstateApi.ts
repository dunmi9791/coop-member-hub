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
  // There is no dedicated units route; project_details returns the units.
  const details = await fetchProjectDetails(projectId);
  if (details.error) {
    return { result: { units: [] }, error: details.error };
  }
  return { result: { units: details.result?.units || [] } };
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

  // Errors propagate to the caller so the page shows an error state;
  // never substitute placeholder projects or units.
  const response = await api.post('/api/portal/real_estate/project_details', requestBody);
  const data = response.data;

  if (data?.error) {
    return { ...data, error: { code: data.error.code, message: data.error.data?.message || data.error.message, data: data.error.data } };
  }
  // The controller reports business errors as { result: { error: "..." } }
  if (typeof data?.result?.error === 'string') {
    return { jsonrpc: data.jsonrpc, id: data.id, result: undefined as any, error: { code: 404, message: data.result.error } };
  }

  // Normalize the response if it matches the structure where data is nested
  if (data?.result?.project) {
    return data;
  }

  if (data?.result?.data) {
    return {
      jsonrpc: data.jsonrpc,
      id: data.id,
      result: {
        project: data.result.data,
        units: data.result.units || [],
        unit_count: data.result.unit_count || (data.result.units ? data.result.units.length : 0)
      }
    };
  }

  return data;
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
  paymentSource: string,
  paymentProof?: string
): Promise<{ result?: any; error?: any }> => {
  const requestBody = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      member_id: memberId,
      project_id: projectId,
      unit_id: unitId,
      payment_source: paymentSource,
      payment_proof: paymentProof
    },
    id: Math.floor(Math.random() * 1000)
  };

  try {
    const response = await api.post('/api/portal/real_estate/subscribe', requestBody);
    const data = response.data;
    if (data?.error) {
      return { error: { message: data.error.data?.message || data.error.message } };
    }
    // Business errors (unit taken, bad proof, ...) come back as { result: { error: "..." } }
    if (typeof data?.result?.error === 'string') {
      return { error: { message: data.result.error } };
    }
    return data;
  } catch (error) {
    console.error('Subscription error:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      }
    };
  }
};
