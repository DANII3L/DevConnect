// BackDevConnect/config/supabase.js
// Configuración específica de Supabase

module.exports = {
    // Configuración de la base de datos
    database: {
        // URL de tu proyecto Supabase
        url: process.env.SUPABASE_URL,
        
        // Service Role Key (para operaciones del backend)
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        
        // Anon Key (para operaciones públicas)
        anonKey: process.env.SUPABASE_ANON_KEY
    },
    
    // Configuración de tablas
    tables: {
        projects: 'projects',
        profiles: 'profiles',
        auth: 'auth.users'
    },
    
    // Configuración de políticas RLS
    rls: {
        enabled: true,
        policies: {
            // Los proyectos son públicos para lectura
            projectsPublicRead: true,
            // Solo usuarios autenticados pueden crear/editar
            projectsAuthWrite: true
        }
    }
};
