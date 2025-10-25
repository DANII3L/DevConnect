-- Políticas de seguridad para la tabla projects
-- Habilitar RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 1. Todos pueden leer proyectos (público)
CREATE POLICY "projects_select_public" ON projects
    FOR SELECT
    USING (true);

-- 2. Solo usuarios autenticados pueden crear proyectos
CREATE POLICY "projects_insert_authenticated" ON projects
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 3. Los usuarios pueden actualizar solo sus propios proyectos
CREATE POLICY "projects_update_own" ON projects
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. Los usuarios pueden eliminar solo sus propios proyectos
CREATE POLICY "projects_delete_own" ON projects
    FOR DELETE
    USING (auth.uid() = user_id);

-- 5. Política para búsqueda de proyectos
CREATE POLICY "projects_search_public" ON projects
    FOR SELECT
    USING (true);
