
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
    const processor = new ReminderProcessor();
    const result = await processor.processAllReminders();

    return new Response(
      JSON.stringify({ 
        success: result.success, 
        message: `Processed ${result.processed} signups`,
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
