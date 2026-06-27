-- Create ENUM types for story properties
CREATE TYPE media_type_enum AS ENUM ('IMAGE', 'VIDEO');
CREATE TYPE story_status_enum AS ENUM ('PROCESSING', 'READY', 'FAILED', 'EXPIRED');

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    media_type media_type_enum NOT NULL,
    status story_status_enum NOT NULL DEFAULT 'PROCESSING',
    views_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ GENERATED ALWAYS AS (created_at + INTERVAL '24 hours') STORED
);

-- Create story_views table for tracking view analytics
CREATE TABLE IF NOT EXISTS story_views (
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    viewer_id UUID NOT NULL,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (story_id, viewer_id)
);

-- Add index on expires_at and status for cron cleanup job efficiency
CREATE INDEX IF NOT EXISTS idx_stories_expiry_cleanup 
ON stories (expires_at, status) 
WHERE status = 'READY';

-- Add index on user_id and status for retrieving active stories feed
CREATE INDEX IF NOT EXISTS idx_stories_user_active 
ON stories (user_id, status) 
WHERE status = 'READY';

-- Create database trigger/function to auto-increment views_count in stories on new view record
CREATE OR REPLACE FUNCTION increment_story_views()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE stories
    SET views_count = views_count + 1
    WHERE id = NEW.story_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_increment_story_views
AFTER INSERT ON story_views
FOR EACH ROW
EXECUTE FUNCTION increment_story_views();
