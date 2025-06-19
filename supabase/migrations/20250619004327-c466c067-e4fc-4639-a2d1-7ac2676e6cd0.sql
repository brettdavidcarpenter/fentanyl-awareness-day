
-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job that runs the send-reminder-emails function every 5 minutes for testing
-- This mirrors how production would work with scheduled execution
SELECT cron.schedule(
    'send-reminder-emails-test',
    '*/5 * * * *', -- Every 5 minutes
    $$
    SELECT
        net.http_post(
            url := 'https://jexczwnpirrgvywdmjeg.supabase.co/functions/v1/send-reminder-emails',
            headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpleGN6d25waXJyZ3Z5d2RtamVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzgyODcsImV4cCI6MjA2NTg1NDI4N30.2v10eSRNduYrMt76D_Q4Z9596pi6KAIXUTLrl4sKSpA"}'::jsonb,
            body := '{"source": "cron"}'::jsonb
        ) as request_id;
    $$
);

-- Add a new column to store custom target dates for test mode
ALTER TABLE public.email_signups 
ADD COLUMN test_target_date timestamp with time zone DEFAULT NULL;

-- Create an index for performance on the new column
CREATE INDEX IF NOT EXISTS idx_email_signups_test_target_date ON public.email_signups(test_target_date);
