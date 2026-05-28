let rawApiUrl = import.meta.env.VITE_API_URL 
  || (typeof window !== 'undefined' 
      ? (window.location.hostname.endsWith('.vercel.app') 
          ? 'https://green-leaves.runasp.net' 
          : (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
              ? window.location.origin 
              : 'http://localhost:5032'))
      : 'http://localhost:5032');

// Auto-correct domain-only URLs (e.g., green-leaves.runasp.net) to use https://
if (rawApiUrl && !rawApiUrl.startsWith('http://') && !rawApiUrl.startsWith('https://')) {
  rawApiUrl = `https://${rawApiUrl}`;
}

export const API_URL = rawApiUrl;

export const getMediaUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  
  // Normalize path with leading slash
  let formattedUrl = url.startsWith('/') ? url : `/${url}`;
  
  // Support mapping existing plural paths to singular if required by backend, but here we can keep the exact path returned
  return `${API_URL}${formattedUrl}`;
};

// Entity Interfaces
export interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Booking {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  address: string;
  service: string;
  budget: string;
  notes?: string;
  image_url?: string | null;
  status: 'pending' | 'contacted' | 'completed';
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  before_image_url: string;
  after_image_url: string;
  before_video_url?: string;
  after_video_url?: string;
  media_type: string;
  created_at: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  booking_id?: string | null;
  is_read: boolean;
  created_at: string;
}

interface ApiResponse<T> {
  data: T | null;
  error: { message: string } | null;
}

// Helpers to get headers
function getHeaders(includeContentType = true): HeadersInit {
  const headers: HeadersInit = {};
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('cam_auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        data: null, 
        error: { message: errorData.message || `API error with status ${response.status}` } 
      };
    }

    if (response.status === 204) {
      return { data: {} as T, error: null };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: { message: err.message || 'Unknown network error' } };
  }
}

export const api = {
  // Authentication services
  auth: {
    async getSession() {
      const token = localStorage.getItem('cam_auth_token');
      const email = localStorage.getItem('cam_auth_email');
      if (token && email) {
        const session = { user: { email }, token };
        return { data: { session }, error: null };
      }
      return { data: { session: null }, error: null };
    },

    async signInWithPassword({ email, password }: any) {
      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return { data: null, error: { message: errorData.message || 'Login failed.' } };
        }

        const data = await response.json();
        
        localStorage.setItem('cam_auth_token', data.token);
        localStorage.setItem('cam_auth_email', data.email);

        const session = { user: { email: data.email }, token: data.token };
        return { data: { user: session.user, session }, error: null };
      } catch (error: any) {
        return { data: null, error: { message: error.message } };
      }
    },

    async signOut() {
      localStorage.removeItem('cam_auth_token');
      localStorage.removeItem('cam_auth_email');
      return { error: null };
    }
  },

  // Services CRUD
  services: {
    async getAll(activeOnly = false): Promise<ApiResponse<Service[]>> {
      const endpoint = `${API_URL}/api/services${activeOnly ? '?activeOnly=true' : ''}`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse<Service[]>(response);
    },

    async create(service: Partial<Service>): Promise<ApiResponse<Service>> {
      const response = await fetch(`${API_URL}/api/services`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(service)
      });
      return handleResponse<Service>(response);
    },

    async update(id: string, service: Partial<Service>): Promise<ApiResponse<Service>> {
      const response = await fetch(`${API_URL}/api/services/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(service)
      });
      return handleResponse<Service>(response);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
      const response = await fetch(`${API_URL}/api/services/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse<void>(response);
    }
  },

  // Bookings CRUD
  bookings: {
    async getAll(page?: number, pageSize?: number): Promise<ApiResponse<any>> {
      const url = page && pageSize
        ? `${API_URL}/api/bookings?page=${page}&pageSize=${pageSize}`
        : `${API_URL}/api/bookings`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse<any>(response);
    },

    async getById(id: string): Promise<ApiResponse<Booking>> {
      const response = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse<Booking>(response);
    },

    async create(booking: Partial<Booking>): Promise<ApiResponse<Booking>> {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(booking)
      });
      return handleResponse<Booking>(response);
    },

    async update(id: string, booking: Partial<Booking>): Promise<ApiResponse<Booking>> {
      const response = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(booking)
      });
      return handleResponse<Booking>(response);
    },

    async updateStatus(id: string, status: string): Promise<ApiResponse<void>> {
      const response = await fetch(`${API_URL}/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(status)
      });
      return handleResponse<void>(response);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
      const response = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse<void>(response);
    }
  },

  // Before & After Projects CRUD
  projects: {
    async getAll(page?: number, pageSize?: number): Promise<ApiResponse<any>> {
      const url = page && pageSize
        ? `${API_URL}/api/beforeafterprojects?page=${page}&pageSize=${pageSize}`
        : `${API_URL}/api/beforeafterprojects`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse<any>(response);
    },

    async create(project: Partial<Project>): Promise<ApiResponse<Project>> {
      const response = await fetch(`${API_URL}/api/beforeafterprojects`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(project)
      });
      return handleResponse<Project>(response);
    },

    async update(id: string, project: Partial<Project>): Promise<ApiResponse<Project>> {
      const response = await fetch(`${API_URL}/api/beforeafterprojects/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(project)
      });
      return handleResponse<Project>(response);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
      const response = await fetch(`${API_URL}/api/beforeafterprojects/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse<void>(response);
    }
  },

  // Notifications CRUD
  notifications: {
    async getAll(limit = 20, page?: number, pageSize?: number): Promise<ApiResponse<any>> {
      const url = page && pageSize
        ? `${API_URL}/api/notifications?page=${page}&pageSize=${pageSize}`
        : `${API_URL}/api/notifications?limit=${limit}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse<any>(response);
    },

    async markRead(id: string): Promise<ApiResponse<void>> {
      const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getHeaders()
      });
      return handleResponse<void>(response);
    },

    async markAllRead(): Promise<ApiResponse<void>> {
      const response = await fetch(`${API_URL}/api/notifications/read-all`, {
        method: 'POST',
        headers: getHeaders()
      });
      return handleResponse<void>(response);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
      const response = await fetch(`${API_URL}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse<void>(response);
    }
  },

  // File uploads
  storage: {
    async upload(bucket: string, file: File, filePath?: string): Promise<ApiResponse<{ path: string }>> {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', bucket);
        if (filePath) {
          formData.append('path', filePath);
        }

        const headers = getHeaders(false) as Record<string, string>;

        const response = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers,
          body: formData
        });

        if (!response.ok) {
          const errorText = await response.text();
          return { data: null, error: { message: errorText || `Upload failed with status: ${response.status}` } };
        }

        const result = await response.json();
        return { data: { path: result.public_url || result.publicUrl }, error: null };
      } catch (error: any) {
        return { data: null, error: { message: error.message } };
      }
    },

    getPublicUrl(bucket: string, filePath: string): string {
      if (!filePath) return '';
      if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;
      
      const formattedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
      if (formattedPath.startsWith('/uploads/') || formattedPath.startsWith('/upload/')) {
        return `${API_URL}${formattedPath}`;
      }
      return `${API_URL}/upload/${bucket}${formattedPath}`;
    }
  }
};
