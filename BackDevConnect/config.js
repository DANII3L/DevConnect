// BackDevConnect/config.js
// Configuración de la aplicación

module.exports = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || 'v1',
    
    // Configuración de Supabase
    supabase: {
        url: process.env.SUPABASE_URL,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        anonKey: process.env.SUPABASE_ANON_KEY
    },
    
    // Configuración de la base de datos (para futuras implementaciones)
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        name: process.env.DB_NAME || 'backdevconnect',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || ''
    },
    
    // Configuración de CORS
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true
    }
};