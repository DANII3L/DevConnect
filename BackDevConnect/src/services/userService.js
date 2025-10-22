const supabase = require('../lib/supabase');

class UserService {
    static async getAllUsers() {
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
            console.error('UserService.getAllUsers error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async getUserById(userId) {
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
                    created_at,
                    updated_at
                `)
                .eq('id', userId)
                .single();

            if (error) throw error;

            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('UserService.getUserById error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async getUserStats() {
        try {
            const { count: totalUsers, error: usersError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            if (usersError) throw usersError;

            const { data: topUsers, error: topUsersError } = await supabase
                .from('profiles')
                .select(`
                    id,
                    full_name,
                    username,
                    avatar_url,
                    projects(count)
                `)
                .order('projects.count', { ascending: false })
                .limit(5);

            if (topUsersError) throw topUsersError;

            return {
                success: true,
                data: {
                    totalUsers,
                    topUsers: topUsers || []
                }
            };
        } catch (error) {
            console.error('UserService.getUserStats error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async searchUsers(query) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    id,
                    full_name,
                    username,
                    avatar_url,
                    bio
                `)
                .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
                .order('full_name', { ascending: true });

            if (error) throw error;

            return {
                success: true,
                data: data,
                total: data.length
            };
        } catch (error) {
            console.error('UserService.searchUsers error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = UserService;
