
-- Add column for 45-day reminder tracking
ALTER TABLE public.email_signups 
ADD COLUMN reminder_sent_45_days_before boolean DEFAULT false;
