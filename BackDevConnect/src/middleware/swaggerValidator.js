// BackDevConnect/src/middleware/swaggerValidator.js
// Middleware para validación automática basada en esquemas Swagger

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { RequestError } = require('../utils/errors');

class SwaggerValidator {
    constructor() {
        this.ajv = new Ajv({ allErrors: true, verbose: true });
        addFormats(this.ajv);
        this.schemas = new Map();
    }

    /**
     * Registra un esquema para validación
     * @param {string} name - Nombre del esquema
     * @param {object} schema - Esquema JSON Schema
     */
    registerSchema(name, schema) {
        this.schemas.set(name, schema);
        this.ajv.addSchema(schema, name);
    }

    /**
     * Valida datos contra un esquema registrado
     * @param {string} schemaName - Nombre del esquema
     * @param {object} data - Datos a validar
     * @returns {object} Resultado de la validación
     */
    validate(schemaName, data) {
        const schema = this.schemas.get(schemaName);
        if (!schema) {
            throw new Error(`Schema '${schemaName}' not found`);
        }

        const validate = this.ajv.getSchema(schemaName);
        const isValid = validate(data);

        return {
            isValid,
            errors: validate.errors || [],
            data: isValid ? data : null
        };
    }

    /**
     * Middleware para validar request body
     * @param {string} schemaName - Nombre del esquema
     * @returns {function} Middleware function
     */
    validateBody(schemaName) {
        return (req, res, next) => {
            try {
                const result = this.validate(schemaName, req.body);
                
                if (!result.isValid) {
                    const validationErrors = {};
                    result.errors.forEach(error => {
                        const field = error.instancePath.replace('/', '') || error.schemaPath.split('/').pop();
                        validationErrors[field] = error.message;
                    });

                    return res.status(400).json({
                        success: false,
                        error: 'Datos de entrada inválidos',
                        details: {
                            code: 'VALIDATION_ERROR',
                            validation_errors: validationErrors
                        },
                        timestamp: new Date().toISOString()
                    });
                }

                req.validatedBody = result.data;
                next();
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    error: 'Error interno de validación',
                    details: {
                        code: 'VALIDATION_INTERNAL_ERROR'
                    },
                    timestamp: new Date().toISOString()
                });
            }
        };
    }

    /**
     * Middleware para validar query parameters
     * @param {string} schemaName - Nombre del esquema
     * @returns {function} Middleware function
     */
    validateQuery(schemaName) {
        return (req, res, next) => {
            try {
                // Convertir strings numéricos a números para validación
                const queryData = { ...req.query };
                Object.keys(queryData).forEach(key => {
                    if (!isNaN(queryData[key]) && queryData[key] !== '') {
                        queryData[key] = parseInt(queryData[key]);
                    }
                });

                const result = this.validate(schemaName, queryData);
                
                if (!result.isValid) {
                    const validationErrors = {};
                    result.errors.forEach(error => {
                        const field = error.instancePath.replace('/', '') || error.schemaPath.split('/').pop();
                        validationErrors[field] = error.message;
                    });

                    return res.status(400).json({
                        success: false,
                        error: 'Parámetros de consulta inválidos',
                        details: {
                            code: 'QUERY_VALIDATION_ERROR',
                            validation_errors: validationErrors
                        },
                        timestamp: new Date().toISOString()
                    });
                }

                req.validatedQuery = result.data;
                next();
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    error: 'Error interno de validación',
                    details: {
                        code: 'VALIDATION_INTERNAL_ERROR'
                    },
                    timestamp: new Date().toISOString()
                });
            }
        };
    }

    /**
     * Middleware para validar path parameters
     * @param {string} schemaName - Nombre del esquema
     * @returns {function} Middleware function
     */
    validateParams(schemaName) {
        return (req, res, next) => {
            try {
                const result = this.validate(schemaName, req.params);
                
                if (!result.isValid) {
                    const validationErrors = {};
                    result.errors.forEach(error => {
                        const field = error.instancePath.replace('/', '') || error.schemaPath.split('/').pop();
                        validationErrors[field] = error.message;
                    });

                    return res.status(400).json({
                        success: false,
                        error: 'Parámetros de ruta inválidos',
                        details: {
                            code: 'PARAMS_VALIDATION_ERROR',
                            validation_errors: validationErrors
                        },
                        timestamp: new Date().toISOString()
                    });
                }

                req.validatedParams = result.data;
                next();
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    error: 'Error interno de validación',
                    details: {
                        code: 'VALIDATION_INTERNAL_ERROR'
                    },
                    timestamp: new Date().toISOString()
                });
            }
        };
    }

    /**
     * Genera documentación automática para validación
     * @param {string} schemaName - Nombre del esquema
     * @param {string} type - Tipo de validación (body, query, params)
     * @returns {object} Documentación Swagger
     */
    generateValidationDocs(schemaName, type) {
        const schema = this.schemas.get(schemaName);
        if (!schema) {
            throw new Error(`Schema '${schemaName}' not found`);
        }

        const validationDocs = {
            type: 'object',
            properties: {},
            required: []
        };

        if (type === 'body') {
            return {
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: schema,
                            examples: this.generateExamples(schema)
                        }
                    }
                }
            };
        } else if (type === 'query') {
            return {
                parameters: Object.keys(schema.properties || {}).map(key => ({
                    name: key,
                    in: 'query',
                    required: schema.required?.includes(key) || false,
                    schema: schema.properties[key],
                    description: schema.properties[key].description || `Parámetro ${key}`
                }))
            };
        } else if (type === 'params') {
            return {
                parameters: Object.keys(schema.properties || {}).map(key => ({
                    name: key,
                    in: 'path',
                    required: true,
                    schema: schema.properties[key],
                    description: schema.properties[key].description || `Parámetro ${key}`
                }))
            };
        }

        return validationDocs;
    }

    /**
     * Genera ejemplos basados en el esquema
     * @param {object} schema - Esquema JSON Schema
     * @returns {object} Ejemplos generados
     */
    generateExamples(schema) {
        const examples = {};
        
        if (schema.example) {
            examples.default = {
                summary: 'Ejemplo por defecto',
                value: schema.example
            };
        } else {
            // Generar ejemplo basado en las propiedades del esquema
            const example = {};
            Object.keys(schema.properties || {}).forEach(key => {
                const prop = schema.properties[key];
                if (prop.example) {
                    example[key] = prop.example;
                } else if (prop.type === 'string') {
                    example[key] = `ejemplo_${key}`;
                } else if (prop.type === 'integer') {
                    example[key] = 1;
                } else if (prop.type === 'boolean') {
                    example[key] = true;
                } else if (prop.type === 'array') {
                    example[key] = ['item1', 'item2'];
                }
            });
            
            if (Object.keys(example).length > 0) {
                examples.default = {
                    summary: 'Ejemplo generado',
                    value: example
                };
            }
        }

        return examples;
    }
}

// Esquemas predefinidos
const predefinedSchemas = {
    // Esquemas de autenticación
    AuthLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'Correo electrónico del usuario',
                example: 'juan@example.com'
            },
            password: {
                type: 'string',
                minLength: 8,
                format: 'password',
                description: 'Contraseña del usuario',
                example: 'miPassword123'
            }
        }
    },

    AuthRegister: {
        type: 'object',
        required: ['full_name', 'username', 'email', 'password'],
        properties: {
            full_name: {
                type: 'string',
                minLength: 2,
                maxLength: 100,
                description: 'Nombre completo del usuario',
                example: 'Juan Pérez'
            },
            username: {
                type: 'string',
                minLength: 3,
                maxLength: 30,
                pattern: '^[a-zA-Z0-9_]+$',
                description: 'Nombre de usuario único',
                example: 'juanperez'
            },
            email: {
                type: 'string',
                format: 'email',
                description: 'Correo electrónico del usuario',
                example: 'juan@example.com'
            },
            password: {
                type: 'string',
                minLength: 8,
                format: 'password',
                description: 'Contraseña del usuario',
                example: 'miPassword123'
            }
        }
    },

    // Esquemas de paginación
    PaginationQuery: {
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
            },
            search: {
                type: 'string',
                minLength: 2,
                maxLength: 100,
                description: 'Término de búsqueda'
            }
        }
    },

    // Esquemas de parámetros de ruta
    IdParam: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'ID único del recurso'
            }
        }
    },

    // Esquemas de proyecto
    ProjectCreate: {
        type: 'object',
        required: ['title', 'description', 'tech_stack'],
        properties: {
            title: {
                type: 'string',
                minLength: 3,
                maxLength: 100,
                description: 'Título del proyecto',
                example: 'E-commerce con React'
            },
            description: {
                type: 'string',
                minLength: 10,
                maxLength: 1000,
                description: 'Descripción detallada del proyecto',
                example: 'Plataforma de comercio electrónico desarrollada con React, Node.js y PostgreSQL'
            },
            demo_url: {
                type: 'string',
                format: 'uri',
                description: 'URL del demo en vivo',
                example: 'https://mi-proyecto-demo.vercel.app'
            },
            github_url: {
                type: 'string',
                format: 'uri',
                description: 'URL del repositorio en GitHub',
                example: 'https://github.com/usuario/mi-proyecto'
            },
            tech_stack: {
                type: 'array',
                items: {
                    type: 'string'
                },
                minItems: 1,
                description: 'Tecnologías utilizadas en el proyecto',
                example: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS']
            },
            image_url: {
                type: 'string',
                format: 'uri',
                description: 'URL de la imagen del proyecto',
                example: 'https://ejemplo.com/imagen-proyecto.jpg'
            }
        }
    }
};

// Crear instancia global del validador
const swaggerValidator = new SwaggerValidator();

// Registrar esquemas predefinidos
Object.keys(predefinedSchemas).forEach(schemaName => {
    swaggerValidator.registerSchema(schemaName, predefinedSchemas[schemaName]);
});

module.exports = {
    SwaggerValidator,
    swaggerValidator,
    predefinedSchemas
};
