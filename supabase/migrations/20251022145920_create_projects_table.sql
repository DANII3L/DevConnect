/*
  # Dev Project Sharing Platform - Database Schema

  ## Overview
  Creates the core database structure for a project sharing platform where developers can showcase their work.

  ## New Tables
  
  ### `projects`
  Stores all shared development projects with the following fields:
  - `id` (uuid, primary key) - Unique identifier for each project
  - `user_id` (uuid, foreign key) - Links to auth.users table
  - `title` (text) - Project name
  - `description` (text) - Detailed project description
  - `demo_url` (text, optional) - Live demo URL
  - `github_url` (text, optional) - GitHub repository URL
  - `tech_stack` (text array) - Technologies used (e.g., React, Node.js)
  - `image_url` (text, optional) - Project screenshot/thumbnail
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on all tables
  - Public can view all projects (SELECT)
  - Only authenticated users can create projects (INSERT)
  - Only project owners can update their own projects (UPDATE)
  - Only project owners can delete their own projects (DELETE)

  ## Notes
  - All timestamps use timezone-aware types
  - Foreign key constraints ensure data integrity
  - Indexes are created for optimal query performance
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  demo_url text,
  github_url text,
  tech_stack text[] DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at DESC);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects table

-- Anyone can view projects (public access)
CREATE POLICY "Anyone can view projects"
  ON projects
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can create projects
CREATE POLICY "Authenticated users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


  CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  username text UNIQUE,
  avatar_url text,
  website text,
  bio text,
  raw_metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.sync_profile_from_auth()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Insert or update profile usando email como full_name
  INSERT INTO public.profiles (id, full_name, avatar_url, raw_metadata, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,                                  -- full_name = email
    (NEW.raw_user_meta_data ->> 'avatar_url'),  -- avatar_url desde metadata si existe
    NEW.raw_user_meta_data,
    COALESCE(NEW.created_at, now()),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    raw_metadata = EXCLUDED.raw_metadata,
    updated_at = now();

  RETURN NEW;
END;
$$;

CREATE TRIGGER auth_users_sync_profile
AFTER INSERT OR UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.sync_profile_from_auth();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles: public read" ON public.profiles
  FOR SELECT USING (true);
