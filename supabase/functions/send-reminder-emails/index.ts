
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

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
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!resendApiKey || !supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const resend = new Resend(resendApiKey);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    console.log('Checking for reminder emails to send at:', now.toISOString());

    // For test mode: check emails that should get reminders based on custom timing
    const { data: testModeEmails, error: testError } = await supabase
      .from('email_signups')
      .select('*')
      .eq('test_mode', true)
      .eq('reminder_sent_week_before', false)
      .not('reminder_offset_minutes', 'is', null);

    if (testError) {
      console.error('Error fetching test mode emails:', testError);
    } else if (testModeEmails && testModeEmails.length > 0) {
      console.log('Found', testModeEmails.length, 'test mode emails to check');

      for (const signup of testModeEmails) {
        const signupTime = new Date(signup.created_at);
        const reminderTime = new Date(signupTime.getTime() + (signup.reminder_offset_minutes * 60 * 1000));
        
        console.log(`Signup: ${signup.email}, created: ${signupTime.toISOString()}, reminder due: ${reminderTime.toISOString()}`);

        if (now >= reminderTime) {
          console.log('Sending test reminder to:', signup.email);
          
          try {
            await resend.emails.send({
              from: "Facing Fentanyl <noreply@facingfentanylnow.org>",
              to: [signup.email],
              subject: "🕯 Test Reminder: Fentanyl Awareness Day (Aug 21)",
              html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white;">
                    <h1 style="margin: 0; font-size: 28px;">🕯 Test Reminder</h1>
                    <p style="margin: 10px 0 0 0; font-size: 18px;">Fentanyl Awareness Day - August 21, 2025</p>
                  </div>
                  
                  <div style="padding: 30px 20px;">
                    <p style="font-size: 18px; margin-bottom: 20px;">Hello,</p>
                    
                    <p><strong>This is a test reminder</strong> for National Fentanyl Awareness Day on <strong>August 21, 2025</strong>.</p>
                    
                    <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                      <h3 style="color: #92400e; margin-top: 0;">📝 Ready to Post?</h3>
                      <p style="margin-bottom: 0;">Our post generator and tribute tools will help you create meaningful content to share on social media.</p>
                    </div>
                    
                    <p>Every post, every share, every conversation can help save a life.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="https://facingfentanylnow.org" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Create Your Post</a>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 30px;">
                      <a href="https://facingfentanylnow.org/unsubscribe?token=${signup.unsubscribe_token}" style="color: #3b82f6;">Unsubscribe</a>
                    </p>
                  </div>
                </div>
              `,
            });

            // Mark as sent
            await supabase
              .from('email_signups')
              .update({ reminder_sent_week_before: true })
              .eq('id', signup.id);

            console.log('Test reminder sent successfully to:', signup.email);
          } catch (emailError) {
            console.error('Error sending test reminder to', signup.email, ':', emailError);
          }
        }
      }
    }

    // For production mode: check normal timing (weeks before Aug 21, 2025)
    const targetDate = new Date('2025-08-21T00:00:00Z');
    const oneWeekBefore = new Date(targetDate.getTime() - (7 * 24 * 60 * 60 * 1000));
    const threeDaysBefore = new Date(targetDate.getTime() - (3 * 24 * 60 * 60 * 1000));

    // Check for week-before reminders (production mode)
    if (now >= oneWeekBefore && now < targetDate) {
      const { data: weekBeforeEmails, error: weekError } = await supabase
        .from('email_signups')
        .select('*')
        .eq('test_mode', false)
        .eq('reminder_sent_week_before', false);

      if (weekError) {
        console.error('Error fetching week-before emails:', weekError);
      } else if (weekBeforeEmails && weekBeforeEmails.length > 0) {
        console.log('Sending week-before reminders to', weekBeforeEmails.length, 'users');

        for (const signup of weekBeforeEmails) {
          try {
            await resend.emails.send({
              from: "Facing Fentanyl <noreply@facingfentanylnow.org>",
              to: [signup.email],
              subject: "🕯 One Week Until Fentanyl Awareness Day",
              html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white;">
                    <h1 style="margin: 0; font-size: 28px;">🕯 One Week to Go</h1>
                    <p style="margin: 10px 0 0 0; font-size: 18px;">Fentanyl Awareness Day - August 21, 2025</p>
                  </div>
                  
                  <div style="padding: 30px 20px;">
                    <p style="font-size: 18px; margin-bottom: 20px;">Hello,</p>
                    
                    <p>National Fentanyl Awareness Day is just <strong>one week away</strong> (August 21, 2025).</p>
                    
                    <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                      <h3 style="color: #92400e; margin-top: 0;">📝 Ready to Make an Impact?</h3>
                      <p style="margin-bottom: 0;">Start preparing your posts and tributes. Every share helps spread awareness and can save lives.</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="https://facingfentanylnow.org" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Create Your Post</a>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 30px;">
                      <a href="https://facingfentanylnow.org/unsubscribe?token=${signup.unsubscribe_token}" style="color: #3b82f6;">Unsubscribe</a>
                    </p>
                  </div>
                </div>
              `,
            });

            await supabase
              .from('email_signups')
              .update({ reminder_sent_week_before: true })
              .eq('id', signup.id);

            console.log('Week-before reminder sent to:', signup.email);
          } catch (emailError) {
            console.error('Error sending week-before reminder to', signup.email, ':', emailError);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Reminder check completed',
        timestamp: now.toISOString()
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
