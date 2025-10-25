const API_BASE_URL = 'http://localhost:3000/api';

interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
}

interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

class HttpService {
  private static getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Incluir token de autenticación si está disponible
    const token = localStorage.getItem('access_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    return { ...defaultHeaders, ...customHeaders };
  }

  private static async handleResponse<T>(response: Response): Promise<HttpResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  static async get<T = any>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(options?.headers),
    });

    return this.handleResponse<T>(response);
  }

  static async post<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<HttpResponse<T>> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(options?.headers),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  static async put<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<HttpResponse<T>> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(options?.headers),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  static async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(options?.headers),
    });

    return this.handleResponse<T>(response);
  }

  static async patch<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<HttpResponse<T>> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(options?.headers),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }
}

export default HttpService;
