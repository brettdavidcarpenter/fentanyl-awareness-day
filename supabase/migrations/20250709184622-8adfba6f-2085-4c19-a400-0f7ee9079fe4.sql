-- Create button_clicks table for tracking user interactions
CREATE TABLE public.button_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  button_name TEXT NOT NULL,
  page_location TEXT NOT NULL,
  button_category TEXT NOT NULL,
  user_session_id TEXT NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  additional_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.button_clicks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for anonymous tracking)
CREATE POLICY "Allow public button click tracking" 
ON public.button_clicks 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow public reads (for analytics)
CREATE POLICY "Allow public read of button clicks" 
ON public.button_clicks 
FOR SELECT 
USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_button_clicks_button_name ON public.button_clicks(button_name);
CREATE INDEX idx_button_clicks_page_location ON public.button_clicks(page_location);
CREATE INDEX idx_button_clicks_category ON public.button_clicks(button_category);
CREATE INDEX idx_button_clicks_clicked_at ON public.button_clicks(clicked_at);
CREATE INDEX idx_button_clicks_session_id ON public.button_clicks(user_session_id);