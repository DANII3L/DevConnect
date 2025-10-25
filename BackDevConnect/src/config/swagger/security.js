// BackDevConnect/src/config/swagger/security.js
// Esquemas de seguridad para la API

const securitySchemes = {
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
};

module.exports = securitySchemes;
