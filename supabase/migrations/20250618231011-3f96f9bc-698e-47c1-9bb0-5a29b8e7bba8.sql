
-- Add columns to support welcome email tracking and test mode timing
ALTER TABLE public.email_signups 
ADD COLUMN welcome_email_sent boolean DEFAULT false,
ADD COLUMN test_mode boolean DEFAULT false,
ADD COLUMN reminder_offset_minutes integer DEFAULT NULL;

-- Update existing rows to have welcome_email_sent = false if null
UPDATE public.email_signups 
SET welcome_email_sent = false 
WHERE welcome_email_sent IS NULL;

-- Add indexes for performance on the new columns
CREATE INDEX IF NOT EXISTS idx_email_signups_welcome_email_sent ON public.email_signups(welcome_email_sent);
CREATE INDEX IF NOT EXISTS idx_email_signups_test_mode ON public.email_signups(test_mode);
