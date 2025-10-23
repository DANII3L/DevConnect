export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  demo_url?: string;
  github_url?: string;
  tech_stack: string[];
  image_url?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Session {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user: User;
}
