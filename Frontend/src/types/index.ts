// Tipos base para la aplicación
export interface User {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Author {
  id: string;
  username: string;
  avatar_url?: string;
  full_name?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: Author;
  created_at: string;
  updated_at: string;
  replies_count: number;
  likes_count: number;
  is_liked: boolean;
  project_id?: string;
  parent_id?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  demo_url?: string;
  github_url?: string;
  tech_stack: string[];
  image_url?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  author: Author;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
  has_more?: boolean;
  hasMore?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
  hasMore: boolean;
}

export interface CommentFilters {
  sortBy: 'newest' | 'oldest' | 'popular';
  page?: number;
  limit?: number;
}

export interface ProjectFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest' | 'popular';
}

// Tipos para formularios
export interface ProjectFormData {
  title: string;
  description: string;
  demo_url?: string;
  github_url?: string;
  tech_stack: string[];
  image_url?: string;
}

export interface CommentFormData {
  content: string;
  project_id: string;
  parent_id?: string;
}

// Tipos para hooks
export interface UseCommentsProps {
  projectId: string;
  sortBy: 'newest' | 'oldest' | 'popular';
  initialComments?: Comment[];
}

export interface UseProjectsProps {
  filters?: ProjectFilters;
  initialProjects?: Project[];
}

// Tipos para componentes
export interface CommentCardProps {
  comment: Comment;
  onToggleReplies: () => void;
  onLike: () => void;
}

export interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onView?: (project: Project) => void;
}

export interface ProjectFormProps {
  onClose: () => void;
  onSuccess: () => void;
  project?: Project;
}

// Tipos para servicios
export interface HttpServiceConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface CacheServiceConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
}

// Tipos para contextos
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Tipos para errores
export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
  details?: Record<string, unknown>;
}

// Tipos para validación
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Tipos para utilidades
export type SortOrder = 'asc' | 'desc';
export type SortField = 'created_at' | 'updated_at' | 'likes_count' | 'title';

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

// Tipos para paginación
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}