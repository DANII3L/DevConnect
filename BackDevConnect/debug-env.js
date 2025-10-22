// BackDevConnect/debug-env.js
// Script para debuggear las variables de entorno

require('dotenv').config();

console.log('🔍 Debug de variables de entorno:');
console.log('PORT:', process.env.PORT);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Configurada' : 'No configurada');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'No configurada');

// Intentar crear el cliente
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://zqacwsvziholbkypzwap.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('\n🔧 Configuración final:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'Presente' : 'Ausente');

if (supabaseAnonKey) {
    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        console.log('✅ Cliente de Supabase creado exitosamente');
    } catch (error) {
        console.log('❌ Error creando cliente:', error.message);
    }
} else {
    console.log('❌ No se pudo crear el cliente: falta la clave');
}
