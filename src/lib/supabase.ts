export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5032';

interface ApiResponse<T> {
  data: T | null;
  error: any | null;
}

// Helper to get headers
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('cam_auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

class QueryBuilder {
  private table: string;
  private eqFilters: { [key: string]: any } = {};
  private neqFilters: { [key: string]: any } = {};
  private orderByField: string | null = null;
  private orderAscending: boolean = true;
  private limitCount: number | null = null;

  constructor(table: string) {
    this.table = table;
  }

  select(fields: string = '*') {
    return this;
  }

  eq(field: string, value: any) {
    this.eqFilters[field] = value;
    return this;
  }

  neq(field: string, value: any) {
    this.neqFilters[field] = value;
    return this;
  }

  order(field: string, { ascending = true } = {}) {
    this.orderByField = field;
    this.orderAscending = ascending;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  // To support then() in async/await
  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      const res = await this.execute();
      if (onfulfilled) return onfulfilled(res);
      return res;
    } catch (err) {
      if (onrejected) return onrejected(err);
      throw err;
    }
  }

  private async execute(): Promise<ApiResponse<any>> {
    try {
      let endpoint = `${API_URL}/api`;
      if (this.table === 'services') endpoint += '/services';
      else if (this.table === 'bookings') endpoint += '/bookings';
      else if (this.table === 'before_after_projects') endpoint += '/beforeafterprojects';
      else if (this.table === 'notifications') endpoint += '/notifications';
      else endpoint += `/${this.table}`;

      const queryParams: string[] = [];
      if (this.table === 'services' && this.eqFilters['is_active'] === true) {
        queryParams.push('activeOnly=true');
      }
      if (this.limitCount !== null) {
        queryParams.push(`limit=${this.limitCount}`);
      }

      if (queryParams.length > 0) {
        endpoint += `?${queryParams.join('&')}`;
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error fetching table ${this.table}:`, error);
      return { data: null, error: { message: error.message } };
    }
  }

  async insert(records: any[]) {
    try {
      if (this.table === 'notifications') {
        // The backend automatically creates booking notifications upon booking creation,
        // so we bypass client-side notification inserts to prevent duplicate records or endpoint errors.
        return { data: records, error: null };
      }

      let endpoint = `${API_URL}/api`;
      if (this.table === 'services') endpoint += '/services';
      else if (this.table === 'bookings') endpoint += '/bookings';
      else if (this.table === 'before_after_projects') endpoint += '/beforeafterprojects';
      else endpoint += `/${this.table}`;

      const record = records[0];

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data: [data], error: null };
    } catch (error: any) {
      console.error(`Error inserting into ${this.table}:`, error);
      return { data: null, error: { message: error.message } };
    }
  }

  async update(record: any) {
    try {
      const id = this.eqFilters['id'] || record.id;
      
      let endpoint = `${API_URL}/api`;
      if (this.table === 'services') endpoint += `/services/${id}`;
      else if (this.table === 'bookings') {
        const keys = Object.keys(record);
        if (keys.length === 1 && keys[0] === 'status') {
          endpoint += `/bookings/${id}/status`;
          const response = await fetch(endpoint, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(record.status),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return { data: [record], error: null };
        } else {
          endpoint += `/bookings/${id}`;
        }
      }
      else if (this.table === 'notifications') {
        if (this.neqFilters['id'] === '00000000-0000-0000-0000-000000000000') {
          endpoint += `/notifications/read-all`;
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: getHeaders(),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return { data: [record], error: null };
        } else {
          endpoint += `/notifications/${id}/read`;
          const response = await fetch(endpoint, {
            method: 'PATCH',
            headers: getHeaders(),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return { data: [record], error: null };
        }
      }
      else if (this.table === 'before_after_projects') endpoint += `/beforeafterprojects/${id}`;
      else endpoint += `/${this.table}/${id}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { data: [record], error: null };
    } catch (error: any) {
      console.error(`Error updating table ${this.table}:`, error);
      return { data: null, error: { message: error.message } };
    }
  }

  async delete() {
    try {
      const id = this.eqFilters['id'];
      if (!id) {
        throw new Error('ID filter is required for delete operations.');
      }

      let endpoint = `${API_URL}/api`;
      if (this.table === 'services') endpoint += `/services/${id}`;
      else if (this.table === 'bookings') endpoint += `/bookings/${id}`;
      else if (this.table === 'before_after_projects') endpoint += `/beforeafterprojects/${id}`;
      else if (this.table === 'notifications') endpoint += `/notifications/${id}`;
      else endpoint += `/${this.table}/${id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { data: [{ id }], error: null };
    } catch (error: any) {
      console.error(`Error deleting from ${this.table}:`, error);
      return { data: null, error: { message: error.message } };
    }
  }
}

// Global authorization state callbacks
let authStateCallbacks: ((event: string, session: any) => void)[] = [];

function triggerAuthStateChange(event: string, session: any) {
  authStateCallbacks.forEach(cb => cb(event, session));
}

export const supabase = {
  from(table: string) {
    return new QueryBuilder(table);
  },

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
          throw new Error(errorData.message || 'Login failed.');
        }

        const data = await response.json();
        
        localStorage.setItem('cam_auth_token', data.token);
        localStorage.setItem('cam_auth_email', data.email);

        const session = { user: { email: data.email }, token: data.token };
        triggerAuthStateChange('SIGNED_IN', session);

        return { data: { user: session.user, session }, error: null };
      } catch (error: any) {
        console.error('Auth login error:', error);
        return { data: { user: null, session: null }, error: { message: error.message } };
      }
    },

    async signUp({ email, password }: any) {
      try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Registration failed.');
        }

        const data = await response.json();
        
        localStorage.setItem('cam_auth_token', data.token);
        localStorage.setItem('cam_auth_email', data.email);

        const session = { user: { email: data.email }, token: data.token };
        triggerAuthStateChange('SIGNED_IN', session);

        return { data: { user: session.user, session }, error: null };
      } catch (error: any) {
        console.error('Auth register error:', error);
        return { data: { user: null, session: null }, error: { message: error.message } };
      }
    },

    async signOut() {
      localStorage.removeItem('cam_auth_token');
      localStorage.removeItem('cam_auth_email');
      triggerAuthStateChange('SIGNED_OUT', null);
      return { error: null };
    },

    onAuthStateChange(callback: (event: string, session: any) => void) {
      authStateCallbacks.push(callback);
      
      const token = localStorage.getItem('cam_auth_token');
      const email = localStorage.getItem('cam_auth_email');
      if (token && email) {
        const session = { user: { email }, token };
        callback('SIGNED_IN', session);
      } else {
        callback('SIGNED_OUT', null);
      }

      return {
        data: {
          subscription: {
            unsubscribe() {
              authStateCallbacks = authStateCallbacks.filter(cb => cb !== callback);
            }
          }
        }
      };
    }
  },

  storage: {
    from(bucket: string) {
      return {
        async upload(filePath: string, file: File) {
          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('bucket', bucket);
            formData.append('path', filePath);

            const response = await fetch(`${API_URL}/api/upload`, {
              method: 'POST',
              headers: {
                ...Object.fromEntries(
                  Object.entries(getHeaders()).filter(([k]) => k.toLowerCase() !== 'content-type')
                )
              },
              body: formData,
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(errorText || `Upload failed with status: ${response.status}`);
            }

            const result = await response.json();
            return { data: { path: result.publicUrl }, error: null };
          } catch (error: any) {
            console.error('Storage upload error:', error);
            return { data: null, error: { message: error.message } };
          }
        },
        getPublicUrl(filePath: string) {
          let publicUrl = filePath;
          if (filePath && !filePath.startsWith('http') && !filePath.startsWith('/uploads/')) {
            publicUrl = `${API_URL}/uploads/${bucket}/${filePath}`;
          } else if (filePath && filePath.startsWith('/uploads/')) {
            publicUrl = `${API_URL}${filePath}`;
          }
          return { data: { publicUrl } };
        }
      };
    }
  },

  channel(name: string) {
    return {
      on(event: string, filter: any, callback: (payload: any) => void) {
        return this;
      },
      subscribe() {
        return this;
      }
    };
  },

  removeChannel(channel: any) {
    // Mock no-op
  }
};
