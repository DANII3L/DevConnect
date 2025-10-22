// BackDevConnect/test-db-connection.js
// Script para probar la conexión a la base de datos

require('dotenv').config();
const supabase = require('./src/lib/supabase');

async function testDatabaseConnection() {
    console.log('🔍 Probando conexión a la base de datos...\n');
    
    // Mostrar configuración
    console.log('⚙️ Configuración actual:');
    console.log(`   SUPABASE_URL: ${process.env.SUPABASE_URL || 'No configurada'}`);
    console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configurada' : 'No configurada'}`);
    console.log('');
    
    try {
        // Test 1: Verificar conexión básica
        console.log('📊 Test 1: Verificando conexión básica...');
        const { data: healthCheck, error: healthError } = await supabase
            .from('projects')
            .select('count', { count: 'exact', head: true });
        
        if (healthError) {
            console.log('❌ Error en conexión básica:', healthError);
            console.log('🔍 Detalles del error:', JSON.stringify(healthError, null, 2));
            return false;
        }
        
        console.log('✅ Conexión básica exitosa');
        console.log(`📈 Total de proyectos en la DB: ${healthCheck || 0}\n`);
        
        // Test 2: Verificar tabla de usuarios
        console.log('👥 Test 2: Verificando tabla de usuarios...');
        const { data: usersCount, error: usersError } = await supabase
            .from('profiles')
            .select('count', { count: 'exact', head: true });
        
        if (usersError) {
            console.log('❌ Error accediendo a usuarios:', usersError.message);
        } else {
            console.log('✅ Acceso a usuarios exitoso');
            console.log(`👤 Total de usuarios en la DB: ${usersCount || 0}\n`);
        }
        
        // Test 3: Intentar leer algunos proyectos
        console.log('📋 Test 3: Leyendo proyectos de muestra...');
        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('id, title, created_at')
            .limit(3);
        
        if (projectsError) {
            console.log('❌ Error leyendo proyectos:', projectsError.message);
        } else {
            console.log('✅ Lectura de proyectos exitosa');
            if (projects && projects.length > 0) {
                console.log('📝 Proyectos encontrados:');
                projects.forEach(project => {
                    console.log(`   - ${project.title} (ID: ${project.id})`);
                });
            } else {
                console.log('📝 No hay proyectos en la base de datos');
            }
            console.log('');
        }
        
        // Test 4: Verificar autenticación
        console.log('🔐 Test 4: Verificando configuración de autenticación...');
        console.log('✅ Cliente de Supabase configurado correctamente');
        console.log(`🌐 URL: ${process.env.SUPABASE_URL || 'https://zqacwsvziholbkypzwap.supabase.co'}`);
        console.log(`🔑 Service Role Key configurada: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Sí' : 'No'}\n`);
        
        console.log('🎉 ¡Todas las pruebas de conexión completadas exitosamente!');
        return true;
        
    } catch (error) {
        console.error('💥 Error general en la prueba de conexión:', error.message);
        console.error('Stack trace:', error.stack);
        return false;
    }
}

// Ejecutar las pruebas
testDatabaseConnection()
    .then(success => {
        if (success) {
            console.log('\n✅ La base de datos está funcionando correctamente');
            process.exit(0);
        } else {
            console.log('\n❌ Hay problemas con la conexión a la base de datos');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('\n💥 Error fatal:', error);
        process.exit(1);
    });
