
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { ReminderProcessor } from './reminder-processor.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Reminder emails function called with method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for immediate test mode parameter
    let forceTestMode = false;
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        forceTestMode = body?.forceTestMode === true;
        if (forceTestMode) {
          console.log('Force test mode enabled - sending all eligible emails immediately');
        }
      } catch {
        // Ignore JSON parsing errors for GET requests or invalid JSON
      }
    }

    const processor = new ReminderProcessor();
    const result = await processor.processAllReminders(forceTestMode);

    return new Response(
      JSON.stringify({ 
        success: result.success, 
        message: `Processed ${result.processed} signups${forceTestMode ? ' (immediate test mode)' : ''}`,
        errors: result.errors,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in send-reminder-emails function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process reminder emails' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
