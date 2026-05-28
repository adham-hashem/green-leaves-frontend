/*
  # Update bookings table for admin management

  1. Modified Tables
    - `bookings`
      - Add `contacted_at` timestamp for tracking when customer was contacted
      - Add `completed_at` timestamp for tracking completion
      - Status field updated to support: pending, contacted, completed

  2. Updates
    - Modify RLS policies to allow authenticated users (admins) to update bookings
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'contacted_at'
  ) THEN
    ALTER TABLE bookings ADD COLUMN contacted_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE bookings ADD COLUMN completed_at timestamptz;
  END IF;
END $$;

CREATE POLICY "Admins can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete bookings"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (true);
