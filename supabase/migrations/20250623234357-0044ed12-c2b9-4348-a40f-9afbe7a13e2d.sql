
-- Create storage bucket for user uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('day-of-experience-uploads', 'day-of-experience-uploads', true);

-- Create RLS policy for the bucket to allow public uploads
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'day-of-experience-uploads');

-- Create RLS policy to allow public access to uploaded files
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'day-of-experience-uploads');

-- Simple analytics tracking table
CREATE TABLE day_of_experience_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_type TEXT, -- 'family', 'law_enforcement', 'recovery'
  post_type TEXT, -- 'prepopulated', 'custom'
  template_used TEXT, -- template identifier if prepopulated
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on the analytics table
ALTER TABLE day_of_experience_posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert analytics data
CREATE POLICY "Allow public inserts" ON day_of_experience_posts
FOR INSERT WITH CHECK (true);
