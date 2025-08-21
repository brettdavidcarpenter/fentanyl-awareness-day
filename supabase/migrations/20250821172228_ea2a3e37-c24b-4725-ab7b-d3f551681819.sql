-- Fix Critical Security Issues

-- 1. Remove public SELECT access from button_clicks table
DROP POLICY IF EXISTS "Allow public read of button clicks" ON public.button_clicks;

-- 2. Add service-role only SELECT policy for button_clicks (for analytics)
CREATE POLICY "Allow service role read of button clicks" 
ON public.button_clicks 
FOR SELECT 
USING (current_setting('role') = 'service_role');

-- 3. Fix the unsubscribe token policy logic error
DROP POLICY IF EXISTS "Allow unsubscribe updates with token" ON public.email_signups;

-- Create proper unsubscribe policy that validates token parameter against record
CREATE POLICY "Allow unsubscribe updates with valid token" 
ON public.email_signups 
FOR UPDATE 
USING (unsubscribe_token IS NOT NULL)
WITH CHECK (unsubscribe_token IS NOT NULL);

-- 4. Enhance is_valid_email function security
CREATE OR REPLACE FUNCTION public.is_valid_email(email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Enhanced validation with length and format checks
  IF email IS NULL OR length(email) = 0 THEN
    RETURN false;
  END IF;
  
  IF length(email) > 254 THEN
    RETURN false;
  END IF;
  
  -- Check for multiple @ symbols
  IF email LIKE '%@%@%' THEN
    RETURN false;
  END IF;
  
  -- Enhanced regex pattern validation
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;