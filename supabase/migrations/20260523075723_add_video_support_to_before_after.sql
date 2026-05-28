/*
  # Add video support to before/after projects

  1. New Columns
    - `before_video_url` (text, optional) - URL to before video
    - `after_video_url` (text, optional) - URL to after video
    - `media_type` (text) - 'image' or 'video' or 'both'

  2. Updates
    - Update before_after_projects table to support videos
    - Maintain backward compatibility with existing image-only projects

  3. Storage
    - Configure public storage bucket for before/after media
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'before_after_projects' AND column_name = 'before_video_url'
  ) THEN
    ALTER TABLE before_after_projects ADD COLUMN before_video_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'before_after_projects' AND column_name = 'after_video_url'
  ) THEN
    ALTER TABLE before_after_projects ADD COLUMN after_video_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'before_after_projects' AND column_name = 'media_type'
  ) THEN
    ALTER TABLE before_after_projects ADD COLUMN media_type text DEFAULT 'image';
  END IF;
END $$;
