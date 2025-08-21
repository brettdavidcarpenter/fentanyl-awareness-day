-- Fix security vulnerability: Remove public access to email_signups table
-- and implement proper Row Level Security policies

-- Drop the overly permissive policy that allows public SELECT
DROP POLICY IF EXISTS "Allow unsubscribe token lookup" ON email_signups;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Allow service role updates for reminders" ON email_signups;
DROP POLICY IF EXISTS "Allow anonymous email signup" ON email_signups;
DROP POLICY IF EXISTS "Anyone can sign up for email reminders" ON email_signups;

-- Create new restrictive policy for service role read access only
CREATE POLICY "Allow service role read access for reminders" 
ON email_signups 
FOR SELECT 
USING (current_setting('role') = 'service_role');

-- Create policy for unsubscribe updates with token
CREATE POLICY "Allow unsubscribe updates with token" 
ON email_signups 
FOR UPDATE 
USING (unsubscribe_token IS NOT NULL AND unsubscribe_token = unsubscribe_token);

-- Recreate anonymous signup policy
CREATE POLICY "Allow anonymous email signup" 
ON email_signups 
FOR INSERT 
WITH CHECK (true);