
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Email signup function called with method:', req.method);
  // Force redeployment - 2025-06-19 22:00 - Fixing test target date calculation
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, testMode = false, testTargetDate, testDateOffsetDays } = await req.json();
    console.log('Received email signup request for:', email, 'testMode:', testMode, 'testDateOffsetDays:', testDateOffsetDays);

    if (!email) {
      console.error('No email provided');
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Not set');
    console.log('Service key:', supabaseServiceKey ? 'Set' : 'Not set');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Validate email using the database function
    const { data: isValidData, error: validationError } = await supabase
      .rpc('is_valid_email', { email });

    if (validationError) {
      console.error('Email validation error:', validationError);
      return new Response(
        JSON.stringify({ error: 'Email validation failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!isValidData) {
      console.log('Invalid email format:', email);
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if email already exists
    const { data: existingEmail, error: checkError } = await supabase
      .from('email_signups')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing email:', checkError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (existingEmail) {
      console.log('Email already exists:', email);
      return new Response(
        JSON.stringify({ message: 'Email already registered for reminders' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Calculate test target date if in test mode
    let calculatedTestTargetDate = null;
    let reminderOffsetMinutes = null;
    
    if (testMode) {
      const now = new Date();
      const offsetDays = testDateOffsetDays !== undefined ? testDateOffsetDays : 1;
      calculatedTestTargetDate = new Date(now.getTime() + (offsetDays * 24 * 60 * 60 * 1000));
      reminderOffsetMinutes = 10; // Keep for backwards compatibility
      
      console.log('Test mode calculated target date:', calculatedTestTargetDate.toISOString(), 'for offset days:', offsetDays);
    }

    // Insert new email signup with test mode settings
    const { data, error } = await supabase
      .from('email_signups')
      .insert([{ 
        email: email.toLowerCase().trim(),
        source: 'website',
        test_mode: testMode,
        reminder_offset_minutes: reminderOffsetMinutes,
        test_target_date: calculatedTestTargetDate?.toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error inserting email:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to register email' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Email signup successful:', data);

    // Send welcome email in the background
    try {
      console.log('Sending welcome email to:', data.email);
      const welcomeResponse = await supabase.functions.invoke('send-welcome-email', {
        body: { 
          email: data.email, 
          signupId: data.id 
        }
      });

      if (welcomeResponse.error) {
        console.error('Error sending welcome email:', welcomeResponse.error);
      } else {
        console.log('Welcome email sent successfully');
      }
    } catch (welcomeError) {
      console.error('Failed to send welcome email:', welcomeError);
      // Don't fail the signup if welcome email fails
    }

    return new Response(
      JSON.stringify({ 
        message: 'Successfully registered for reminders',
        data: { 
          id: data.id, 
          email: data.email,
          testMode: data.test_mode,
          testTargetDate: data.test_target_date,
          reminderOffset: data.reminder_offset_minutes
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in email-signup function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
