/*
  # Create demo admin user for testing

  1. Demo Admin Account
    - Email: admin@cambridgegreen.com
    - Password: Demo123!@#
    - This account is for testing and should be updated with secure credentials

  2. Security Note
    - This demo account should be removed or updated with a strong password in production
    - Use Supabase Auth UI or API to create additional admin accounts
*/

DO $$
DECLARE
  admin_id uuid;
  admin_email text := 'admin@cambridgegreen.com';
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_id FROM auth.users WHERE email = admin_email LIMIT 1;

  IF admin_id IS NULL THEN
    -- Create admin user via auth
    -- Note: In production, use Supabase Dashboard or Auth API
    INSERT INTO admin_users (id, email, password_hash, full_name)
    VALUES (
      gen_random_uuid(),
      admin_email,
      crypt('Demo123!@#', gen_salt('bf')),
      'Admin User'
    )
    ON CONFLICT (email) DO NOTHING;
  END IF;
END $$;
