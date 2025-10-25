// BackDevConnect/src/config/swagger/tags.js
// Definición de tags para organizar los endpoints

const tags = [
    {
        name: 'Autenticación',
        description: 'Operaciones de autenticación y gestión de sesiones',
        externalDocs: {
            description: 'Más información sobre autenticación',
            url: 'https://docs.backdevconnect.com/auth'
        }
    },
    {
        name: 'Perfiles',
        description: 'Gestión de perfiles de desarrolladores',
        externalDocs: {
            description: 'Guía de perfiles',
            url: 'https://docs.backdevconnect.com/profiles'
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
];

module.exports = tags;
