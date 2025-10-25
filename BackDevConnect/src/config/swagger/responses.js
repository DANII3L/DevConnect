// BackDevConnect/src/config/swagger/responses.js
// Respuestas reutilizables para la API

const responses = {
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
};

module.exports = responses;
