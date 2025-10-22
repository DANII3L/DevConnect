// BackDevConnect/src/utils/errors.js
// Utilidades para manejo de errores estandarizados

class ApiError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = {}) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            success: false,
            error: this.message,
            details: {
                code: this.code,
                ...this.details
            },
            timestamp: this.timestamp
        };
    }
}

class ValidationError extends ApiError {
    constructor(message, validationErrors = {}) {
        super(message, 400, 'VALIDATION_ERROR', { validation_errors: validationErrors });
        this.name = 'ValidationError';
    }
}

class AuthenticationError extends ApiError {
    constructor(message = 'Token de autenticación requerido') {
        super(message, 401, 'AUTHENTICATION_ERROR');
        this.name = 'AuthenticationError';
    }
}

class AuthorizationError extends ApiError {
    constructor(message = 'No tienes permisos para realizar esta acción') {
        super(message, 403, 'AUTHORIZATION_ERROR');
        this.name = 'AuthorizationError';
    }
}

class NotFoundError extends ApiError {
    constructor(resource = 'Recurso') {
        super(`${resource} no encontrado`, 404, 'NOT_FOUND_ERROR');
        this.name = 'NotFoundError';
    }
}

class ConflictError extends ApiError {
    constructor(message = 'El recurso ya existe') {
        super(message, 409, 'CONFLICT_ERROR');
        this.name = 'ConflictError';
    }
}

class RateLimitError extends ApiError {
    constructor(message = 'Demasiadas solicitudes', retryAfter = 300) {
        super(message, 429, 'RATE_LIMIT_ERROR', { retry_after: retryAfter });
        this.name = 'RateLimitError';
    }
}

class RequestError extends ApiError {
    constructor(message = 'Error en la solicitud') {
        super(message, 400, 'REQUEST_ERROR');
        this.name = 'RequestError';
    }
}

class DatabaseError extends ApiError {
    constructor(message = 'Error en la base de datos', details = {}) {
        super(message, 500, 'DATABASE_ERROR', details);
        this.name = 'DatabaseError';
    }
}

class ExternalServiceError extends ApiError {
    constructor(service, message = 'Error en servicio externo', details = {}) {
        super(`${service}: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR', { service, ...details });
        this.name = 'ExternalServiceError';
    }
}

// Middleware para manejo de errores
const errorHandler = (err, req, res, next) => {
    let error = err;

    // Si no es una instancia de ApiError, convertir a ApiError
    if (!(err instanceof ApiError)) {
        // Errores de validación de Joi
        if (err.isJoi) {
            const validationErrors = {};
            err.details.forEach(detail => {
                validationErrors[detail.path.join('.')] = detail.message;
            });
            error = new ValidationError('Datos de entrada inválidos', validationErrors);
        }
        // Errores de base de datos
        else if (err.code === '23505') { // PostgreSQL unique violation
            error = new ConflictError('El recurso ya existe');
        }
        else if (err.code === '23503') { // PostgreSQL foreign key violation
            error = new ValidationError('Referencia inválida');
        }
        else if (err.code === '23502') { // PostgreSQL not null violation
            error = new ValidationError('Campo requerido faltante');
        }
        // Errores de JSON
        else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
            error = new RequestError('JSON inválido en el cuerpo de la solicitud');
        }
        // Errores de JWT
        else if (err.name === 'JsonWebTokenError') {
            error = new AuthenticationError('Token inválido');
        }
        else if (err.name === 'TokenExpiredError') {
            error = new AuthenticationError('Token expirado');
        }
        else if (err.name === 'NotBeforeError') {
            error = new AuthenticationError('Token no válido aún');
        }
        // Error genérico
        else {
            error = new ApiError(
                err.message || 'Error interno del servidor',
                500,
                'INTERNAL_SERVER_ERROR'
            );
        }
    }

    // Log del error
    console.error('Error:', {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
        code: error.code,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: error.timestamp
    });

    // Enviar respuesta de error
    res.status(error.statusCode).json(error.toJSON());
};

// Middleware para manejar rutas no encontradas
const notFoundHandler = (req, res, next) => {
    const error = new NotFoundError(`Ruta ${req.method} ${req.originalUrl}`);
    next(error);
};

// Función para crear respuestas exitosas estandarizadas
const createSuccessResponse = (data, message = 'Operación exitosa', statusCode = 200) => {
    const response = {
        success: true,
        message,
        timestamp: new Date().toISOString()
    };

    if (data) {
        if (Array.isArray(data)) {
            response.data = data;
            response.total = data.length;
        } else if (typeof data === 'object') {
            Object.assign(response, data);
        } else {
            response.data = data;
        }
    }

    return { response, statusCode };
};

// Función para crear respuestas paginadas
const createPaginatedResponse = (data, page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
        success: true,
        data,
        pagination: {
            page,
            limit,
            total,
            total_pages: totalPages,
            has_next: hasNext,
            has_prev: hasPrev
        },
        timestamp: new Date().toISOString()
    };
};

module.exports = {
    ApiError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    RateLimitError,
    RequestError,
    DatabaseError,
    ExternalServiceError,
    errorHandler,
    notFoundHandler,
    createSuccessResponse,
    createPaginatedResponse
};
