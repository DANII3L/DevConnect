-- Políticas de seguridad para la tabla comments
-- Habilitar RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 1. Todos pueden leer comentarios (público)
CREATE POLICY "comments_select_public" ON comments
    FOR SELECT
    USING (true);

-- 2. Solo usuarios autenticados pueden crear comentarios
CREATE POLICY "comments_insert_authenticated" ON comments
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

-- 3. Los usuarios pueden actualizar solo sus propios comentarios
CREATE POLICY "comments_update_own" ON comments
    FOR UPDATE
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- 4. Los usuarios pueden eliminar solo sus propios comentarios
CREATE POLICY "comments_delete_own" ON comments
    FOR DELETE
    USING (auth.uid() = author_id);

-- 5. Política para respuestas (comentarios anidados)
CREATE POLICY "comments_replies_public" ON comments
    FOR SELECT
    USING (true);
