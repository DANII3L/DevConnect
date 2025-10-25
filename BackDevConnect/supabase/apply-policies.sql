-- Script para aplicar todas las políticas de seguridad
-- Ejecutar en el SQL Editor de Supabase

-- 1. Aplicar políticas de profiles
\i supabase/policies/profiles.sql

-- 2. Aplicar políticas de projects
\i supabase/policies/projects.sql

-- 3. Aplicar políticas de comments
\i supabase/policies/comments.sql

-- 4. Aplicar políticas de comment_likes
\i supabase/policies/comment_likes.sql

-- 5. Aplicar políticas de project_likes (si existe)
\i supabase/policies/project_likes.sql

-- 6. Verificar que RLS está habilitado en todas las tablas
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'projects', 'comments', 'comment_likes', 'project_likes')
ORDER BY tablename;
