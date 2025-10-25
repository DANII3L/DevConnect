// BackDevConnect/src/middleware/auth.js
// Middleware para autenticación y autorización

const { supabase } = require('../lib/supabase');

/**
 * Middleware para verificar autenticación
 * Verifica que el usuario esté autenticado y agrega la información del usuario a req.user
 */
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Token de acceso requerido'
            });
        }

        // Verificar token con Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                error: 'Token inválido o expirado'
            });
        }

        // Agregar información del usuario a la request
        req.user = {
            id: user.id,
            email: user.email,
            ...user.user_metadata
        };

        next();
    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

/**
 * Middleware opcional para autenticación
 * No falla si no hay token, pero agrega la información del usuario si existe
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const { data: { user }, error } = await supabase.auth.getUser(token);
            
            if (!error && user) {
                req.user = {
                    id: user.id,
                    email: user.email,
                    ...user.user_metadata
                };
            }
        }

        next();
    } catch (error) {
        console.error('Error en middleware opcional de autenticación:', error);
        next();
    }
};

/**
 * Middleware para verificar que el usuario sea el propietario del recurso
 * Debe usarse después de authenticateToken
 */
const requireOwnership = (resourceType) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const resourceId = req.params.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Usuario no autenticado'
                });
            }

            // Verificar propiedad del recurso
            let query;
            switch (resourceType) {
                case 'project':
                    query = supabase
                        .from('projects')
                        .select('user_id')
                        .eq('id', resourceId)
                        .single();
                    break;
                case 'profile':
                    query = supabase
                        .from('profiles')
                        .select('id')
                        .eq('id', resourceId)
                        .single();
                    break;
                default:
                    return res.status(500).json({
                        success: false,
                        error: 'Tipo de recurso no válido'
                    });
            }

            const { data, error } = await query;

            if (error) {
                if (error.code === 'PGRST116') {
                    return res.status(404).json({
                        success: false,
                        error: `${resourceType} no encontrado`
                    });
                }
                throw error;
            }

            // Verificar que el usuario sea el propietario
            const ownerId = resourceType === 'project' ? data.user_id : data.id;
            if (ownerId !== userId) {
                return res.status(403).json({
                    success: false,
                    error: 'No tienes permisos para realizar esta acción'
                });
            }

            next();
        } catch (error) {
            console.error('Error en middleware de propiedad:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    };
};

/**
 * Middleware para verificar roles de usuario
 * @param {string[]} allowedRoles - Roles permitidos
 */
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const userRole = req.user?.role || 'user';

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    error: 'No tienes permisos suficientes para realizar esta acción'
                });
            }

            next();
        } catch (error) {
            console.error('Error en middleware de roles:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    };
};

/**
 * Middleware para validar datos de entrada
 * @param {Object} schema - Esquema de validación
 */
const validateInput = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req.body);
            
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: error.details[0].message
                });
            }

            next();
        } catch (error) {
            console.error('Error en middleware de validación:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    };
};

/**
 * Middleware para manejar errores de CORS
 */
const corsOptions = {
    origin: function (origin, callback) {
        // Permitir requests sin origin (como mobile apps)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:4173',
            'https://yourdomain.com'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = {
    authenticateToken,
    optionalAuth,
    requireOwnership,
    requireRole,
    validateInput,
    corsOptions
};
