const supabase = require('../lib/supabase');

class ProfileService {
    static async getAllProfiles() {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    id,
                    full_name,
                    username,
                    avatar_url,
                    website,
                    bio,
                    linkedin_url,
                    github_url,
                    created_at,
                    updated_at
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return {
                success: true,
                data: data,
                total: data.length
            };
        } catch (error) {
            console.error('ProfileService.getAllProfiles error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async getProfileById(profileId) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    id,
                    full_name,
                    username,
                    avatar_url,
                    website,
                    bio,
                    github_url,
                    linkedin_url,
                    created_at,
                    updated_at
                `)
                .eq('id', profileId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return {
                        success: false,
                        error: 'Perfil no encontrado'
                    };
                }
                throw error;
            }

            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('ProfileService.getProfileById error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async searchProfiles(query) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    id,
                    full_name,
                    username,
                    avatar_url,
                    website,
                    bio,
                    github_url,
                    linkedin_url,
                    created_at,
                    updated_at
                `)
                .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return {
                success: true,
                data: data,
                total: data.length
            };
        } catch (error) {
            console.error('ProfileService.searchProfiles error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async getProfileStats() {
        try {
            // Obtener total de perfiles
            const { count: totalProfiles, error: totalError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            if (totalError) throw totalError;

            // Obtener perfiles activos (con actividad reciente)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { count: activeProfiles, error: activeError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gte('updated_at', thirtyDaysAgo.toISOString());

            if (activeError) throw activeError;

            // Obtener nuevos perfiles este mes
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const { count: newProfilesThisMonth, error: newError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', startOfMonth.toISOString());

            if (newError) throw newError;

            return {
                success: true,
                data: {
                    total_profiles: totalProfiles || 0,
                    active_profiles: activeProfiles || 0,
                    new_profiles_this_month: newProfilesThisMonth || 0
                }
            };
        } catch (error) {
            console.error('ProfileService.getProfileStats error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = ProfileService;
