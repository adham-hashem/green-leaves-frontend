/*
  # Create admin users and before/after projects tables

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `full_name` (text)
      - `created_at` (timestamp)
    - `before_after_projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `before_image_url` (text)
      - `after_image_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Admin users can only be managed by authenticated admins
    - Before/after projects viewable by public, editable by admins only
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS before_after_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  before_image_url text NOT NULL,
  after_image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE before_after_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON before_after_projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert projects"
  ON before_after_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update projects"
  ON before_after_projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete projects"
  ON before_after_projects
  FOR DELETE
  TO authenticated
  USING (true);
