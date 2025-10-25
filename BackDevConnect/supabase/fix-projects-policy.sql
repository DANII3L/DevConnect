-- Script para corregir la política de inserción de proyectos
-- Ejecutar en el SQL Editor de Supabase

-- Eliminar la política existente
DROP POLICY IF EXISTS "projects_insert_authenticated" ON projects;

-- Crear la política corregida
CREATE POLICY "projects_insert_authenticated" ON projects
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Verificar que la política se aplicó correctamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'projects' 
AND policyname = 'projects_insert_authenticated';
