/*
  # Create bookings table for Cambridge Green Leaves

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `full_name` (text, required)
      - `phone_number` (text, required)
      - `email` (text, required)
      - `address` (text, required)
      - `service` (text, required)
      - `budget` (text, required)
      - `notes` (text, optional)
      - `image_url` (text, optional - for uploaded garden photos)
      - `created_at` (timestamp)
      - `status` (text - 'pending', 'confirmed', 'completed')

  2. Security
    - Enable RLS on `bookings` table
    - Add policy to allow anyone to insert bookings (public submissions)
    - Add policy to allow viewing own bookings (public read access for now)
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone_number text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  service text NOT NULL,
  budget text NOT NULL,
  notes text DEFAULT '',
  image_url text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit bookings"
  ON bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view bookings"
  ON bookings
  FOR SELECT
  TO anon, authenticated
  USING (true);
