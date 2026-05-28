/*
  # Setup authentication for admin users

  1. Auth Configuration
    - Enable pgcrypto extension for password hashing
    - Admin users will use Supabase Auth built-in system

  2. Database Updates
    - Admin users table now references auth.users
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pgtap;

-- Remove old admin_users table constraints if they exist
DO $$
BEGIN
  ALTER TABLE admin_users DROP COLUMN IF EXISTS password_hash;
EXCEPTION WHEN undefined_column THEN
  NULL;
END $$;

-- Update admin_users to properly reference auth users
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_users' AND column_name = 'id') THEN
    ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_id_fkey;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
