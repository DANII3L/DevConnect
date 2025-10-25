-- Políticas de seguridad para la tabla profiles
-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 1. Los usuarios pueden leer todos los perfiles (público)
CREATE POLICY "profiles_select_public" ON profiles
    FOR SELECT
    USING (true);

-- 2. Los usuarios autenticados pueden insertar su propio perfil
CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 3. Los usuarios pueden actualizar solo su propio perfil
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 4. Los usuarios pueden eliminar solo su propio perfil
CREATE POLICY "profiles_delete_own" ON profiles
    FOR DELETE
    USING (auth.uid() = id);

-- 5. Política para actualizar el perfil después del registro
CREATE POLICY "profiles_update_after_signup" ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
