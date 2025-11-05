import HttpService from "./httpService";

class ApiService {
  private static getHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // ==================== AUTH ====================
  static async register(userData: {
    email: string;
    password: string;
    full_name?: string;
    username?: string;
  }) {
    const response = await HttpService.post("/auth/register", userData);
    return response.data;
  }

  static async login(credentials: { email: string; password: string }) {
    const response = await HttpService.post("/auth/login", credentials);
    return response.data;
  }

  static async logout(token: string) {
    const response = await HttpService.post("/auth/logout", undefined, {
      headers: this.getHeaders(token),
    });
    return response.data;
  }

  static async getCurrentUser(token: string) {
    const response = await HttpService.get("/auth/me", {
      headers: this.getHeaders(token),
    });
    return response.data;
  }

  static async refreshToken(refreshToken: string) {
    const response = await HttpService.post("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  }

  // ==================== PROJECTS ====================
  static async getAllProjects(params?: {
    page?: number;
    limit?: number;
    offset?: number;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.search) queryParams.append("search", params.search);

    const endpoint = `/projects${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await HttpService.get(endpoint);
    return response.data;
  }

  static async getProjectById(id: string) {
    const response = await HttpService.get(`/projects/${id}`);
    return response.data;
  }

  static async createProject(
    projectData: {
      title: string;
      description: string;
      demo_url?: string;
      github_url?: string;
      tech_stack: string[];
      image_url?: string;
    },
    token: string
  ) {
    const response = await HttpService.post("/projects", projectData, {
      headers: this.getHeaders(token),
    });
    return response.data;
  }

  static async updateProject(
    id: string,
    projectData: {
      title?: string;
      description?: string;
      demo_url?: string;
      github_url?: string;
      tech_stack?: string[];
      image_url?: string;
    },
    token: string
  ) {
    const response = await HttpService.put(`/projects/${id}`, projectData, {
      headers: this.getHeaders(token),
    });
    return response.data;
  }

  static async deleteProject(id: string, token: string) {
    const response = await HttpService.delete(`/projects/${id}`, {
      headers: this.getHeaders(token),
    });
    return response.data;
  }

  static async getUserProjects(userId: string) {
    const response = await HttpService.get(`/projects/user/${userId}`);
    return response.data;
  }

  // ==================== PROFILES ====================
  static async getAllProfiles(params?: {
    limit?: number;
    offset?: number;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.search) queryParams.append("search", params.search);

    const endpoint = `/profiles${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await HttpService.get(endpoint);
    return response.data;
  }

  static async getProfileById(id: string) {
    const response = await HttpService.get(`/profiles/${id}`);
    return response.data;
  }

  static async searchProfiles(query: string) {
    const response = await HttpService.get(
      `/profiles/search/${encodeURIComponent(query)}`
    );
    return response.data;
  }

  static async getProfileStats() {
    const response = await HttpService.get("/profiles/stats");
    return response.data;
  }

  static async getProfile(token: string) {
    const response = await HttpService.get("/profiles/me", {
      headers: this.getHeaders(token),
    });
    return response.data;
  }

  static async updateProfile(
    token: string,
    profileData: {
      full_name?: string;
      username?: string;
      bio?: string;
      avatar_url?: string;
      website?: string;
      github_url?: string;
      linkedin_url?: string;
    }
  ) {
    const response = await HttpService.put("/profiles/update", profileData, {
      headers: this.getHeaders(token),
    });
    return response.data;
  }

  // ==================== USERS (ADMIN) ====================
  
  /**
   * Obtener todos los usuarios (solo admin)
   */
  static async getAllUsers(token: string, params?: {
    limit?: number;
    offset?: number;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.search) queryParams.append("search", params.search);

    const endpoint = `/users${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await HttpService.get(endpoint, {
      headers: this.getHeaders(token),
    });
    return response.data;
  }

  /**
   * Obtener un usuario específico por ID (admin puede ver cualquiera)
   */
  static async getUserById(userId: string, token: string) {
    const response = await HttpService.get(`/users/${userId}`, {
      headers: this.getHeaders(token),
    });
    return response.data;
  }

  /**
   * Actualizar el rol de un usuario (solo admin)
   */
  static async updateUserRole(
    userId: string,
    role: 'user' | 'admin',
    token: string
  ) {
    const response = await HttpService.put(
      `/users/${userId}/role`,
      { role },
      {
        headers: this.getHeaders(token),
      }
    );
    return response.data;
  }

  /**
   * Actualizar perfil de otro usuario (solo admin)
   */
  static async updateUserProfile(
    userId: string,
    profileData: {
      full_name?: string;
      username?: string;
      bio?: string;
      avatar_url?: string;
      website?: string;
      github_url?: string;
      linkedin_url?: string;
      role?: 'user' | 'admin';
    },
    token: string
  ) {
    const response = await HttpService.put(
      `/users/${userId}`,
      profileData,
      {
        headers: this.getHeaders(token),
      }
    );
    return response.data;
  }

  /**
   * Eliminar usuario (solo admin)
   */
  static async deleteUser(userId: string, token: string) {
    const response = await HttpService.delete(`/users/${userId}`, {
      headers: this.getHeaders(token),
    });
    return response.data;
  }
}

export default ApiService;