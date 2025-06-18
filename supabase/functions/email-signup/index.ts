
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Email signup function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    console.log('Received email signup request for:', email);

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

    // Insert new email signup
    const { data, error } = await supabase
      .from('email_signups')
      .insert([{ 
        email: email.toLowerCase().trim(),
        source: 'website'
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

    return new Response(
      JSON.stringify({ 
        message: 'Successfully registered for reminders',
        data: { id: data.id, email: data.email }
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
