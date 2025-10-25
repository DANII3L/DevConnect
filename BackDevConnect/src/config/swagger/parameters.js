// BackDevConnect/src/config/swagger/parameters.js
// Parámetros reutilizables para la API

const parameters = {
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
    },
    ProjectIdParam: {
        name: 'projectId',
        in: 'path',
        description: 'ID del proyecto',
        required: true,
        schema: {
            type: 'string',
            format: 'uuid',
            example: '8dd1eda7-6043-478f-b47b-2aede42502fc'
        }
    }
};

module.exports = parameters;
