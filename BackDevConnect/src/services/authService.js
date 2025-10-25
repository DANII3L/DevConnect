const { supabase } = require('../lib/supabase');

class AuthService {
    static async signUp(userData) {
        try {
            const { email, password, full_name, username } = userData;

            if (!email || !password) {
                throw new Error('Email y contraseña son requeridos');
            }

            if (password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: full_name || email.split('@')[0],
                        username: username || email.split('@')[0]
                    }
                }
            });

            if (authError) {
                if (authError.message.includes('already registered')) {
                    throw new Error('El usuario ya está registrado');
                }
                throw authError;
            }

            return {
                success: true,
                user: {
                    id: authData.user?.id,
                    email: authData.user?.email,
                    email_confirmed: authData.user?.email_confirmed_at ? true : false
                },
                session: authData.session
            };

        } catch (error) {
            console.error('AuthService.signUp error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async signIn(credentials) {
        try {
            const { email, password } = credentials;

            if (!email || !password) {
                throw new Error('Email y contraseña son requeridos');
            }

            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) {
                throw new Error('Credenciales inválidas');
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            return {
                success: true,
                user: {
                    id: authData.user.id,
                    email: authData.user.email,
                    profile: profile || null
                },
                session: {
                    access_token: authData.session?.access_token,
                    refresh_token: authData.session?.refresh_token,
                    expires_at: authData.session?.expires_at
                }
            };

        } catch (error) {
            console.error('AuthService.signIn error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async signOut() {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) throw error;

            return {
                success: true,
                message: 'Sesión cerrada exitosamente'
            };

        } catch (error) {
            console.error('AuthService.signOut error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async getCurrentUser(token) {
        try {
            if (!token) {
                throw new Error('Token de autorización requerido');
            }

            const { data: { user }, error } = await supabase.auth.getUser(token);

            if (error || !user) {
                throw new Error('Token inválido');
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            return {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    profile: profile || null
                }
            };

        } catch (error) {
            console.error('AuthService.getCurrentUser error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async refreshToken(refreshToken) {
        try {
            if (!refreshToken) {
                throw new Error('Refresh token requerido');
            }

            const { data, error } = await supabase.auth.refreshSession({
                refresh_token: refreshToken
            });

            if (error) {
                throw new Error('Refresh token inválido');
            }

            return {
                success: true,
                session: {
                    access_token: data.session?.access_token,
                    refresh_token: data.session?.refresh_token,
                    expires_at: data.session?.expires_at
                }
            };

        } catch (error) {
            console.error('AuthService.refreshToken error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async verifyToken(token) {
        try {
            if (!token) {
                return {
                    success: false,
                    error: 'Token requerido'
                };
            }

            const { data: { user }, error } = await supabase.auth.getUser(token);

            if (error || !user) {
                return {
                    success: false,
                    error: 'Token inválido'
                };
            }

            return {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    ...user.user_metadata
                }
            };

        } catch (error) {
            console.error('AuthService.verifyToken error:', error);
            return {
                success: false,
                error: 'Error verificando token'
            };
        }
    }

    static async getSession() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) throw error;

            return {
                success: true,
                session: session
            };

        } catch (error) {
            console.error('AuthService.getSession error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = AuthService;
