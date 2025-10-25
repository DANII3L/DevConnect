// BackDevConnect/src/config/swagger/index.js
// Configuración principal de Swagger/OpenAPI que importa todos los módulos

const swaggerJsdoc = require('swagger-jsdoc');

// Importar todos los módulos separados
const definition = require('./definition');
const tags = require('./tags');
const schemas = require('./schemas');
const securitySchemes = require('./security');
const parameters = require('./parameters');
const responses = require('./responses');

// Configuración completa de Swagger
const options = {
    definition: {
        ...definition,
        components: {
            securitySchemes,
            schemas,
            parameters,
            responses
        },
        tags
    },
    apis: [
        './src/index.js',
        './src/routes/*.js',
        './src/controllers/*.js'
    ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
