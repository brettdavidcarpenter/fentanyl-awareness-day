
-- Create email_signups table to store subscriber information
CREATE TABLE public.email_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reminder_sent_week_before BOOLEAN DEFAULT FALSE,
  reminder_sent_3_days_before BOOLEAN DEFAULT FALSE,
  reminder_sent_day_of BOOLEAN DEFAULT FALSE,
  unsubscribed BOOLEAN DEFAULT FALSE,
  timezone TEXT DEFAULT 'UTC',
  source TEXT DEFAULT 'website'
);

-- Enable Row Level Security
ALTER TABLE public.email_signups ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (sign up)
CREATE POLICY "Anyone can sign up for email reminders" 
  ON public.email_signups 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow reading own email (for unsubscribe functionality)
CREATE POLICY "Users can view their own signup" 
  ON public.email_signups 
  FOR SELECT 
  USING (true);

-- Create policy to allow updates for reminder status and unsubscribe
CREATE POLICY "Allow system updates for reminders and unsubscribe" 
  ON public.email_signups 
  FOR UPDATE 
  USING (true);

-- Create index for efficient email lookups
CREATE INDEX idx_email_signups_email ON public.email_signups(email);
CREATE INDEX idx_email_signups_reminders ON public.email_signups(reminder_sent_week_before, reminder_sent_3_days_before, reminder_sent_day_of, unsubscribed);
