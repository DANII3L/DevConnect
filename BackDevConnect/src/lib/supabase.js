// BackDevConnect/src/lib/supabase.js
// Configuración de Supabase para el backend

const { createClient } = require("@supabase/supabase-js");

// Configuración de Supabase
const supabaseUrl =
  process.env.SUPABASE_URL || "https://zqacwsvziholbkypzwap.supabase.co";
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxYWN3c3Z6aWhvbGJreXB6d2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNDA1NDcsImV4cCI6MjA3NjcxNjU0N30.1tYjvfg0aiZlFQXbGt-RyzHQVtzuySW7i5sscCeontU";

// Crear cliente de Supabase con anon key (para operaciones del backend)
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Función para crear cliente autenticado
const createAuthenticatedClient = (userToken) => {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        }
    });
};

module.exports = { supabase, createAuthenticatedClient };
