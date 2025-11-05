/**
 * Constantes de la aplicación
 * Centraliza valores hardcodeados para facilitar mantenimiento
 */

// ==================== CONFIGURACIÓN DE ANIMACIONES ====================
export const ANIMATION_CONFIG = {
  FLIP_DURATION: 600, // ms
  FLIP_DELAY: 100, // ms
  TRANSITION_DEFAULT: 200, // ms
  TRANSITION_SLOW: 500, // ms
} as const;

// ==================== CONFIGURACIÓN DE VALIDACIÓN ====================
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  USERNAME_REGEX: /^[a-zA-Z0-9_]+$/,
} as const;

// ==================== CONFIGURACIÓN DE PAGINACIÓN ====================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  COMMENTS_PER_PAGE: 10,
} as const;

// ==================== CONFIGURACIÓN DE CACHE ====================
export const CACHE_CONFIG = {
  STALE_TIME: 10 * 60 * 1000, // 10 minutos
  GC_TIME: 30 * 60 * 1000, // 30 minutos
  PROJECTS_CACHE_TTL: 5 * 60 * 1000, // 5 minutos
} as const;

// ==================== RUTAS DE LA APLICACIÓN ====================
export const ROUTES = {
  HOME: '/',
  PROJECTS: '/projects',
  PROFILE: '/profile',
  AUTH: '/auth',
  ADMIN: {
    BASE: '/admin',
    USER_EDIT: (userId: string) => `/admin/user/${userId}`,
  },
  NOT_FOUND: '/404',
} as const;

// ==================== MENSAJES DE USUARIO ====================
export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Sesión iniciada correctamente',
    REGISTER_SUCCESS: 'Cuenta creada exitosamente',
    LOGOUT_SUCCESS: 'Sesión cerrada',
    LOGIN_ERROR: 'Error al iniciar sesión',
    REGISTER_ERROR: 'Error al crear cuenta',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    PASSWORD_TOO_SHORT: `La contraseña debe tener al menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`,
  },
  PROJECTS: {
    CREATE_SUCCESS: 'Proyecto creado exitosamente',
    UPDATE_SUCCESS: 'Proyecto actualizado exitosamente',
    DELETE_SUCCESS: 'Proyecto eliminado exitosamente',
    CREATE_ERROR: 'Error al crear proyecto',
    UPDATE_ERROR: 'Error al actualizar proyecto',
    DELETE_ERROR: 'Error al eliminar proyecto',
    LOAD_ERROR: 'Error al cargar proyectos',
    NOT_FOUND: 'Proyecto no encontrado',
  },
  COMMENTS: {
    CREATE_SUCCESS: 'Comentario publicado',
    UPDATE_SUCCESS: 'Comentario actualizado',
    DELETE_SUCCESS: 'Comentario eliminado',
    CREATE_ERROR: 'Error al publicar comentario',
    UPDATE_ERROR: 'Error al actualizar comentario',
    DELETE_ERROR: 'Error al eliminar comentario',
  },
  PROFILE: {
    UPDATE_SUCCESS: 'Perfil actualizado exitosamente',
    UPDATE_ERROR: 'Error al actualizar perfil',
    LOAD_ERROR: 'Error al cargar el perfil',
  },
  COMMON: {
    LOADING: 'Cargando...',
    PROCESSING: 'Procesando...',
    ERROR: 'Ha ocurrido un error',
    SUCCESS: 'Operación exitosa',
    CONFIRM_DELETE: '¿Estás seguro de eliminar este elemento?',
    NO_DATA: 'No hay datos disponibles',
  },
} as const;

// ==================== CONFIGURACIÓN DE FORMULARIOS ====================
export const FORM_CONFIG = {
  PLACEHOLDERS: {
    EMAIL: 'you@example.com',
    PASSWORD: '••••••••',
    USERNAME: 'tu_usuario',
    FULL_NAME: 'Tu nombre completo',
    PROJECT_TITLE: 'Nombre del proyecto',
    PROJECT_DESCRIPTION: 'Describe tu proyecto...',
    TECH_STACK: 'React, Node.js, TypeScript...',
    BIO: 'Cuéntanos sobre ti...',
    WEBSITE: 'https://tusitio.com',
  },
  LABELS: {
    EMAIL: 'Correo Electrónico',
    PASSWORD: 'Contraseña',
    USERNAME: 'Nombre de Usuario',
    FULL_NAME: 'Nombre Completo',
    PROJECT_TITLE: 'Título',
    PROJECT_DESCRIPTION: 'Descripción',
    TECH_STACK: 'Tecnologías',
    BIO: 'Biografía',
    WEBSITE: 'Sitio Web',
    AVATAR_URL: 'Foto de perfil (URL)',
  },
} as const;

// ==================== CONFIGURACIÓN DE ESTILOS ====================
export const THEME = {
  COLORS: {
    PRIMARY: {
      LOGIN: 'from-blue-600 to-cyan-600',
      REGISTER: 'from-purple-600 to-pink-600',
      LOGIN_HOVER: 'from-blue-700 to-cyan-700',
      REGISTER_HOVER: 'from-purple-700 to-pink-700',
    },
    ICONS: {
      LOGIN: 'from-blue-500 to-cyan-500',
      REGISTER: 'from-purple-500 to-pink-500',
    },
    TEXT: {
      PRIMARY: 'text-white',
      SECONDARY: 'text-slate-300',
      MUTED: 'text-slate-400',
      LINK_LOGIN: 'text-blue-400',
      LINK_REGISTER: 'text-purple-400',
    },
  },
  SPACING: {
    MODAL_PADDING: 'p-8',
    INPUT_PADDING: 'px-4 py-3',
    BUTTON_PADDING: 'px-4 py-2',
  },
} as const;

// ==================== CONFIGURACIÓN DE ROLES ====================
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// ==================== CONFIGURACIÓN DE ORDENAMIENTO ====================
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  POPULAR: 'popular',
} as const;

export type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];

// ==================== EVENTOS PERSONALIZADOS ====================
export const CUSTOM_EVENTS = {
  OPEN_NEW_PROJECT_FORM: 'openNewProjectForm',
} as const;

// ==================== CONFIGURACIÓN DE API ====================
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 1,
  RETRY_DELAY: 1000, // 1 segundo
} as const;

