
-- Add column to track 2-month reminder status
ALTER TABLE public.email_signups 
ADD COLUMN reminder_sent_2_months_before boolean DEFAULT false;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_email_signups_reminder_2_months ON public.email_signups(reminder_sent_2_months_before);

-- Update existing rows to have reminder_sent_2_months_before = false if null
UPDATE public.email_signups 
SET reminder_sent_2_months_before = false 
WHERE reminder_sent_2_months_before IS NULL;
