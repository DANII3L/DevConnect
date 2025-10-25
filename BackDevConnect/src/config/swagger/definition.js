// BackDevConnect/src/config/swagger/definition.js
// Definiciones base de la API

const definition = {
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
    externalDocs: {
        description: 'Documentación completa de BackDevConnect API',
        url: 'https://docs.backdevconnect.com'
    }
};

module.exports = definition;
