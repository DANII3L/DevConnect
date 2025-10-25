-- Políticas de seguridad para la tabla comment_likes
-- Habilitar RLS
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- 1. Los usuarios pueden ver sus propios likes
CREATE POLICY "comment_likes_select_own" ON comment_likes
    FOR SELECT
    USING (auth.uid() = user_id);

-- 2. Solo usuarios autenticados pueden dar likes
CREATE POLICY "comment_likes_insert_authenticated" ON comment_likes
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- 3. Los usuarios pueden eliminar solo sus propios likes
CREATE POLICY "comment_likes_delete_own" ON comment_likes
    FOR DELETE
    USING (auth.uid() = user_id);

-- 4. Política para evitar likes duplicados
CREATE POLICY "comment_likes_unique" ON comment_likes
    FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' 
        AND auth.uid() = user_id
        AND NOT EXISTS (
            SELECT 1 FROM comment_likes 
            WHERE comment_id = comment_likes.comment_id 
            AND user_id = auth.uid()
        )
    );
