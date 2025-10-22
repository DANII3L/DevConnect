// BackDevConnect/src/config/swagger-enhanced.js
// Configuración mejorada de Swagger/OpenAPI para documentación de la API

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BackDevConnect API',
            version: '1.0.0',
            description: `
API Backend para conectar desarrolladores y gestionar proyectos de software.
            `,
            contact: {
                name: 'DevConnect',
                email: 'devconnect@example.com',
                url: 'https://github.com/devconnect/backdevconnect'
            },
            termsOfService: 'https://devconnect.com/terms'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo local'
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT obtenido del endpoint /api/auth/login'
                },
                apiKey: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-API-Key',
                    description: 'API Key para acceso a endpoints públicos (opcional)'
                }
            },
            schemas: {
                // Esquemas base reutilizables
                BaseResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            description: 'Indica si la operación fue exitosa'
                        },
                        message: {
                            type: 'string',
                            description: 'Mensaje descriptivo de la respuesta'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Timestamp de la respuesta'
                        }
                    },
                    required: ['success']
                },
                ErrorResponse: {
                    allOf: [
                        { $ref: '#/components/schemas/BaseResponse' },
                        {
                            type: 'object',
                            properties: {
                                success: {
                                    type: 'boolean',
                                    example: false
                                },
                                error: {
                                    type: 'string',
                                    description: 'Mensaje de error específico'
                                },
                                details: {
                                    type: 'object',
                                    description: 'Detalles adicionales del error',
                                    properties: {
                                        code: {
                                            type: 'string',
                                            description: 'Código de error específico'
                                        },
                                        field: {
                                            type: 'string',
                                            description: 'Campo que causó el error (si aplica)'
                                        },
                                        validation_errors: {
                                            type: 'object',
                                            description: 'Errores de validación específicos'
                                        }
                                    }
                                }
                            },
                            required: ['error']
                        }
                    ]
                },
                PaginationParams: {
                    type: 'object',
                    properties: {
                        page: {
                            type: 'integer',
                            minimum: 1,
                            default: 1,
                            description: 'Número de página'
                        },
                        limit: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 100,
                            default: 10,
                            description: 'Número de elementos por página'
                        }
                    }
                },
                PaginationResponse: {
                    type: 'object',
                    properties: {
                        pagination: {
                            type: 'object',
                            properties: {
                                page: {
                                    type: 'integer',
                                    description: 'Página actual'
                                },
                                limit: {
                                    type: 'integer',
                                    description: 'Elementos por página'
                                },
                                total: {
                                    type: 'integer',
                                    description: 'Total de elementos'
                                },
                                total_pages: {
                                    type: 'integer',
                                    description: 'Total de páginas'
                                },
                                has_next: {
                                    type: 'boolean',
                                    description: 'Indica si hay página siguiente'
                                },
                                has_prev: {
                                    type: 'boolean',
                                    description: 'Indica si hay página anterior'
                                }
                            }
                        }
                    }
                },
                // Esquemas específicos
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID único del usuario',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        },
                        full_name: {
                            type: 'string',
                            description: 'Nombre completo del usuario',
                            example: 'Juan Pérez'
                        },
                        username: {
                            type: 'string',
                            description: 'Nombre de usuario único',
                            example: 'juanperez'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Correo electrónico del usuario',
                            example: 'juan@example.com'
                        },
                        avatar_url: {
                            type: 'string',
                            format: 'uri',
                            description: 'URL del avatar del usuario',
                            nullable: true,
                            example: 'https://ejemplo.com/avatar.jpg'
                        },
                        website: {
                            type: 'string',
                            format: 'uri',
                            description: 'Sitio web personal',
                            nullable: true,
                            example: 'https://juanperez.dev'
                        },
                        bio: {
                            type: 'string',
                            description: 'Biografía del usuario',
                            maxLength: 500,
                            nullable: true,
                            example: 'Desarrollador Full Stack con 5 años de experiencia'
                        },
                        github_url: {
                            type: 'string',
                            format: 'uri',
                            description: 'URL del perfil de GitHub',
                            nullable: true,
                            example: 'https://github.com/juanperez'
                        },
                        linkedin_url: {
                            type: 'string',
                            format: 'uri',
                            description: 'URL del perfil de LinkedIn',
                            nullable: true,
                            example: 'https://linkedin.com/in/juanperez'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de registro',
                            example: '2024-01-15T10:30:00Z'
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de última actualización',
                            example: '2024-01-20T14:45:00Z'
                        }
                    }
                },
                Project: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID único del proyecto',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        },
                        title: {
                            type: 'string',
                            description: 'Título del proyecto',
                            example: 'E-commerce con React'
                        },
                        description: {
                            type: 'string',
                            description: 'Descripción detallada del proyecto',
                            example: 'Plataforma de comercio electrónico desarrollada con React, Node.js y PostgreSQL'
                        },
                        demo_url: {
                            type: 'string',
                            format: 'uri',
                            description: 'URL del demo en vivo',
                            nullable: true,
                            example: 'https://mi-proyecto-demo.vercel.app'
                        },
                        github_url: {
                            type: 'string',
                            format: 'uri',
                            description: 'URL del repositorio en GitHub',
                            nullable: true,
                            example: 'https://github.com/usuario/mi-proyecto'
                        },
                        tech_stack: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Tecnologías utilizadas en el proyecto',
                            example: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS']
                        },
                        image_url: {
                            type: 'string',
                            format: 'uri',
                            description: 'URL de la imagen del proyecto',
                            nullable: true,
                            example: 'https://ejemplo.com/imagen-proyecto.jpg'
                        },
                        author_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID del autor del proyecto',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de creación',
                            example: '2024-01-15T10:30:00Z'
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de última actualización',
                            example: '2024-01-20T14:45:00Z'
                        }
                    }
                }
            },
            parameters: {
                // Parámetros reutilizables
                PageParam: {
                    name: 'page',
                    in: 'query',
                    description: 'Número de página',
                    required: false,
                    schema: {
                        type: 'integer',
                        minimum: 1,
                        default: 1
                    }
                },
                LimitParam: {
                    name: 'limit',
                    in: 'query',
                    description: 'Número de elementos por página',
                    required: false,
                    schema: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 100,
                        default: 10
                    }
                },
                SearchParam: {
                    name: 'search',
                    in: 'query',
                    description: 'Término de búsqueda',
                    required: false,
                    schema: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 100
                    }
                },
                IdParam: {
                    name: 'id',
                    in: 'path',
                    description: 'ID único del recurso',
                    required: true,
                    schema: {
                        type: 'string',
                        format: 'uuid'
                    }
                }
            },
            responses: {
                // Respuestas reutilizables
                BadRequest: {
                    description: 'Error en la solicitud - Datos inválidos',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            },
                            examples: {
                                validation_error: {
                                    summary: 'Error de validación',
                                    value: {
                                        success: false,
                                        error: 'Los datos de entrada son inválidos',
                                        details: {
                                            code: 'VALIDATION_ERROR',
                                            validation_errors: {
                                                email: 'El email es requerido',
                                                password: 'La contraseña debe tener al menos 8 caracteres'
                                            }
                                        },
                                        timestamp: '2024-01-15T10:30:00Z'
                                    }
                                }
                            }
                        }
                    }
                },
                Unauthorized: {
                    description: 'No autorizado - Token inválido o faltante',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            },
                            example: {
                                success: false,
                                error: 'Token de autenticación requerido',
                                details: {
                                    code: 'MISSING_TOKEN'
                                },
                                timestamp: '2024-01-15T10:30:00Z'
                            }
                        }
                    }
                },
                Forbidden: {
                    description: 'Prohibido - Sin permisos para realizar la acción',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            },
                            example: {
                                success: false,
                                error: 'No tienes permisos para realizar esta acción',
                                details: {
                                    code: 'INSUFFICIENT_PERMISSIONS'
                                },
                                timestamp: '2024-01-15T10:30:00Z'
                            }
                        }
                    }
                },
                NotFound: {
                    description: 'Recurso no encontrado',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            },
                            example: {
                                success: false,
                                error: 'El recurso solicitado no fue encontrado',
                                details: {
                                    code: 'RESOURCE_NOT_FOUND'
                                },
                                timestamp: '2024-01-15T10:30:00Z'
                            }
                        }
                    }
                },
                Conflict: {
                    description: 'Conflicto - El recurso ya existe',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            },
                            example: {
                                success: false,
                                error: 'El recurso ya existe',
                                details: {
                                    code: 'RESOURCE_ALREADY_EXISTS'
                                },
                                timestamp: '2024-01-15T10:30:00Z'
                            }
                        }
                    }
                },
                TooManyRequests: {
                    description: 'Demasiadas solicitudes - Rate limit excedido',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            },
                            example: {
                                success: false,
                                error: 'Demasiadas solicitudes. Intenta nuevamente en unos minutos',
                                details: {
                                    code: 'RATE_LIMIT_EXCEEDED',
                                    retry_after: 300
                                },
                                timestamp: '2024-01-15T10:30:00Z'
                            }
                        }
                    }
                },
                InternalServerError: {
                    description: 'Error interno del servidor',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            },
                            example: {
                                success: false,
                                error: 'Error interno del servidor',
                                details: {
                                    code: 'INTERNAL_SERVER_ERROR'
                                },
                                timestamp: '2024-01-15T10:30:00Z'
                            }
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Autenticación',
                description: 'Operaciones de autenticación y gestión de sesiones',
                externalDocs: {
                    description: 'Más información sobre autenticación',
                    url: 'https://docs.backdevconnect.com/auth'
                }
            },
            {
                name: 'Desarrolladores',
                description: 'Gestión de desarrolladores y perfiles de usuario',
                externalDocs: {
                    description: 'Guía de desarrolladores',
                    url: 'https://docs.backdevconnect.com/developers'
                }
            },
            {
                name: 'Proyectos',
                description: 'Gestión de proyectos y portafolios',
                externalDocs: {
                    description: 'Guía de proyectos',
                    url: 'https://docs.backdevconnect.com/projects'
                }
            }
        ],
        externalDocs: {
            description: 'Documentación completa de BackDevConnect API',
            url: 'https://docs.backdevconnect.com'
        }
    },
    apis: [
        './src/index.js',
        './src/routes/*.js',
        './src/docs/*.js'
    ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
