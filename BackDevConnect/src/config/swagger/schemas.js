// BackDevConnect/src/config/swagger/schemas.js
// Esquemas de datos para la API

const schemas = {
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
    },
    Comment: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'ID único del comentario',
                example: '123e4567-e89b-12d3-a456-426614174000'
            },
            content: {
                type: 'string',
                description: 'Contenido del comentario',
                example: 'Excelente proyecto, muy bien estructurado'
            },
            author: {
                $ref: '#/components/schemas/User'
            },
            project_id: {
                type: 'string',
                format: 'uuid',
                description: 'ID del proyecto al que pertenece el comentario',
                example: '123e4567-e89b-12d3-a456-426614174000'
            },
            parent_id: {
                type: 'string',
                format: 'uuid',
                description: 'ID del comentario padre (para respuestas)',
                nullable: true,
                example: '123e4567-e89b-12d3-a456-426614174000'
            },
            replies_count: {
                type: 'integer',
                description: 'Número de respuestas al comentario',
                example: 3
            },
            likes_count: {
                type: 'integer',
                description: 'Número de likes del comentario',
                example: 5
            },
            is_liked: {
                type: 'boolean',
                description: 'Indica si el usuario actual ha dado like al comentario',
                example: false
            },
            created_at: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de creación del comentario',
                example: '2024-01-15T10:30:00Z'
            },
            updated_at: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de última actualización del comentario',
                example: '2024-01-20T14:45:00Z'
            }
        },
        required: ['id', 'content', 'author', 'project_id', 'created_at']
    },
    CreateCommentRequest: {
        type: 'object',
        properties: {
            content: {
                type: 'string',
                description: 'Contenido del comentario',
                minLength: 1,
                maxLength: 1000,
                example: 'Excelente proyecto, muy bien estructurado'
            }
        },
        required: ['content']
    }
};

module.exports = schemas;
