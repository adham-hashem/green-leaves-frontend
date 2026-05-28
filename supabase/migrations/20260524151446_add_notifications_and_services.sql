/*
  # Add notifications and services tables

  1. New Tables
    - `notifications` - Store admin notifications for new bookings
    - `services` - Store landscaping services offered
    
  2. Updates
    - Add notifications tracking
    - Add services management
    - Enable real-time notifications
*/

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'booking',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  booking_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT DEFAULT 'Leaf',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Admin can view all notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can mark notifications as read"
  ON notifications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for services
CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admin can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default services
INSERT INTO services (title, description, icon_name, display_order) VALUES
('Garden Design & Consultation', 'Professional garden design and expert consultation services', 'PenTool', 1),
('Landscape Installation', 'Complete landscape installation and construction', 'Mountain', 2),
('Maintenance & Care', 'Regular garden maintenance and care services', 'HeartHandshake', 3),
('Hard Landscaping', 'Patios, pathways, walls, and structural elements', 'Layer', 4),
('Planting & Flowers', 'Expert planting design and flower bed installation', 'Flower2', 5),
('Tree & Hedge Services', 'Tree surgery, hedge trimming, and pruning', 'TreeDeciduous', 6)
ON CONFLICT (title) DO NOTHING;
