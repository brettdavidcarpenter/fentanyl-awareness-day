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
    console.log('Processing reminder emails at:', now.toISOString());

    // Process test mode emails with custom target dates
    const { data: testModeEmails, error: testError } = await supabase
      .from('email_signups')
      .select('*')
      .eq('test_mode', true)
      .not('test_target_date', 'is', null);

    if (testError) {
      console.error('Error fetching test mode emails:', testError);
    } else if (testModeEmails && testModeEmails.length > 0) {
      console.log('Found', testModeEmails.length, 'test mode emails to check');

      for (const signup of testModeEmails) {
        const targetDate = new Date(signup.test_target_date);
        const twoMonthsBefore = new Date(targetDate.getTime() - (60 * 24 * 60 * 60 * 1000));
        const oneWeekBefore = new Date(targetDate.getTime() - (7 * 24 * 60 * 60 * 1000));
        
        console.log(`Test signup: ${signup.email}, target: ${targetDate.toISOString()}`);
        console.log(`2-month trigger: ${twoMonthsBefore.toISOString()}, 1-week trigger: ${oneWeekBefore.toISOString()}`);

        // Check for 2-month reminders
        if (now >= twoMonthsBefore && now < targetDate && !signup.reminder_sent_2_months_before) {
          console.log('Sending test 2-month reminder to:', signup.email);
          
          await resend.emails.send({
            from: "Facing Fentanyl <noreply@facingfentanylnow.aware-share.com>",
            to: [signup.email],
            subject: "🕯 Test: 2 Months Until Fentanyl Awareness Day",
            html: `
              <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white;">
                  <h1 style="margin: 0; font-size: 28px;">🕯 2 Months Until Awareness Day</h1>
                  <p style="margin: 10px 0 0 0; font-size: 18px;">Test Target Date: ${targetDate.toLocaleDateString()}</p>
                </div>
                
                <div style="padding: 30px 20px;">
                  <p style="font-size: 18px; margin-bottom: 20px;">Hello,</p>
                  
                  <p><strong>This is a test 2-month reminder</strong> for your custom target date of <strong>${targetDate.toLocaleDateString()}</strong>.</p>
                  
                  <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0288d1;">
                    <h3 style="color: #01579b; margin-top: 0;">📅 Mark Your Calendar</h3>
                    <p style="margin-bottom: 0;">Start planning your awareness posts and tributes. We'll send you reminders as the date approaches.</p>
                  </div>
                  
                  <p>Together, we can make a difference and raise awareness about fentanyl prevention.</p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://facingfentanylnow.org" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Learn More</a>
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
            .update({ reminder_sent_2_months_before: true })
            .eq('id', signup.id);

          console.log('Test 2-month reminder sent successfully to:', signup.email);
        }

        // Check for 1-week reminders
        if (now >= oneWeekBefore && now < targetDate && !signup.reminder_sent_week_before) {
          console.log('Sending test 1-week reminder to:', signup.email);
          
          await resend.emails.send({
            from: "Facing Fentanyl <noreply@facingfentanylnow.aware-share.com>",
            to: [signup.email],
            subject: "🕯 Test: One Week Until Your Target Date",
            html: `
              <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white;">
                  <h1 style="margin: 0; font-size: 28px;">🕯 One Week to Go</h1>
                  <p style="margin: 10px 0 0 0; font-size: 18px;">Test Target Date: ${targetDate.toLocaleDateString()}</p>
                </div>
                
                <div style="padding: 30px 20px;">
                  <p style="font-size: 18px; margin-bottom: 20px;">Hello,</p>
                  
                  <p><strong>This is a test 1-week reminder.</strong> Your target date of <strong>${targetDate.toLocaleDateString()}</strong> is just one week away!</p>
                  
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

          console.log('Test 1-week reminder sent successfully to:', signup.email);
        }

        // Check for day-of reminders
        const dayOfStart = new Date(targetDate);
        const dayOfEnd = new Date(targetDate.getTime() + (24 * 60 * 60 * 1000));

        if (now >= dayOfStart && now < dayOfEnd && !signup.reminder_sent_day_of) {
          console.log('Sending test day-of reminder to:', signup.email);
          
          await resend.emails.send({
            from: "Facing Fentanyl <noreply@facingfentanylnow.aware-share.com>",
            to: [signup.email],
            subject: "🕯 Test: TODAY is Your Target Date!",
            html: `
              <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #dc2626, #ef4444); color: white;">
                  <h1 style="margin: 0; font-size: 32px;">🕯 TODAY IS THE DAY!</h1>
                  <p style="margin: 10px 0 0 0; font-size: 20px; font-weight: bold;">Test Target Date: ${targetDate.toLocaleDateString()}</p>
                </div>
                
                <div style="padding: 30px 20px;">
                  <p style="font-size: 18px; margin-bottom: 20px;">Hello,</p>
                  
                  <p style="font-size: 18px; font-weight: bold; color: #dc2626;"><strong>This is a test day-of reminder.</strong> TODAY is your target date!</p>
                  
                  <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                    <h3 style="color: #991b1b; margin-top: 0;">🚨 Time to Act NOW!</h3>
                    <ul style="margin: 10px 0; color: #991b1b;">
                      <li><strong>Post your awareness message</strong></li>
                      <li><strong>Share a tribute to loved ones</strong></li>
                      <li><strong>Tag friends to spread awareness</strong></li>
                      <li><strong>Use #FentanylAwarenessDay</strong></li>
                    </ul>
                  </div>
                  
                  <p style="font-size: 16px; font-weight: bold;">Every post can save a life. Your voice matters today!</p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://facingfentanylnow.org" style="display: inline-block; background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 18px;">POST NOW</a>
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
            .update({ reminder_sent_day_of: true })
            .eq('id', signup.id);

          console.log('Test day-of reminder sent successfully to:', signup.email);
        }
      }
    }

    // Process production mode emails (existing logic)
    const targetDate = new Date('2025-08-21T00:00:00Z');
    const twoMonthsBefore = new Date(targetDate.getTime() - (60 * 24 * 60 * 60 * 1000));
    const oneWeekBefore = new Date(targetDate.getTime() - (7 * 24 * 60 * 60 * 1000));

    // Check for 2-month reminders (production mode)
    if (now >= twoMonthsBefore && now < targetDate) {
      const { data: twoMonthEmails, error: twoMonthError } = await supabase
        .from('email_signups')
        .select('*')
        .eq('test_mode', false)
        .eq('reminder_sent_2_months_before', false);

      if (twoMonthError) {
        console.error('Error fetching 2-month emails:', twoMonthError);
      } else if (twoMonthEmails && twoMonthEmails.length > 0) {
        console.log('Sending 2-month reminders to', twoMonthEmails.length, 'users');

        for (const signup of twoMonthEmails) {
          try {
            await resend.emails.send({
              from: "Facing Fentanyl <noreply@facingfentanylnow.aware-share.com>",
              to: [signup.email],
              subject: "🕯 2 Months Until Fentanyl Awareness Day",
              html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white;">
                    <h1 style="margin: 0; font-size: 28px;">🕯 2 Months Until Awareness Day</h1>
                    <p style="margin: 10px 0 0 0; font-size: 18px;">Fentanyl Awareness Day - August 21, 2025</p>
                  </div>
                  
                  <div style="padding: 30px 20px;">
                    <p style="font-size: 18px; margin-bottom: 20px;">Hello,</p>
                    
                    <p>National Fentanyl Awareness Day is <strong>2 months away</strong> (August 21, 2025).</p>
                    
                    <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0288d1;">
                      <h3 style="color: #01579b; margin-top: 0;">📅 Start Planning</h3>
                      <p>Use this time to:</p>
                      <ul style="margin: 10px 0;">
                        <li>Think about your awareness message</li>
                        <li>Gather photos for tribute posts</li>
                        <li>Plan your social media strategy</li>
                        <li>Invite friends and family to participate</li>
                      </ul>
                    </div>
                    
                    <p>Together, we can make a difference and raise awareness about fentanyl prevention.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="https://facingfentanylnow.org" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Learn More</a>
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
              .update({ reminder_sent_2_months_before: true })
              .eq('id', signup.id);

            console.log('2-month reminder sent to:', signup.email);
          } catch (emailError) {
            console.error('Error sending 2-month reminder to', signup.email, ':', emailError);
          }
        }
      }
    }

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
              from: "Facing Fentanyl <noreply@facingfentanylnow.aware-share.com>",
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

    // Check for day-of reminders (production mode)
    const dayOfStart = new Date(targetDate);
    const dayOfEnd = new Date(targetDate.getTime() + (24 * 60 * 60 * 1000)); // End of August 21, 2025

    if (now >= dayOfStart && now < dayOfEnd) {
      const { data: dayOfEmails, error: dayOfError } = await supabase
        .from('email_signups')
        .select('*')
        .eq('test_mode', false)
        .eq('reminder_sent_day_of', false);

      if (dayOfError) {
        console.error('Error fetching day-of emails:', dayOfError);
      } else if (dayOfEmails && dayOfEmails.length > 0) {
        console.log('Sending day-of reminders to', dayOfEmails.length, 'users');

        for (const signup of dayOfEmails) {
          try {
            await resend.emails.send({
              from: "Facing Fentanyl <noreply@facingfentanylnow.aware-share.com>",
              to: [signup.email],
              subject: "🕯 TODAY is Fentanyl Awareness Day!",
              html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #dc2626, #ef4444); color: white;">
                    <h1 style="margin: 0; font-size: 32px;">🕯 TODAY IS THE DAY!</h1>
                    <p style="margin: 10px 0 0 0; font-size: 20px; font-weight: bold;">Fentanyl Awareness Day - August 21, 2025</p>
                  </div>
                  
                  <div style="padding: 30px 20px;">
                    <p style="font-size: 18px; margin-bottom: 20px;">Hello,</p>
                    
                    <p style="font-size: 18px; font-weight: bold; color: #dc2626;"><strong>This is a test day-of reminder.</strong> TODAY is National Fentanyl Awareness Day!</p>
                    
                    <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                      <h3 style="color: #991b1b; margin-top: 0;">🚨 Time to Act NOW!</h3>
                      <ul style="margin: 10px 0; color: #991b1b;">
                        <li><strong>Post your awareness message</strong></li>
                        <li><strong>Share a tribute to loved ones</strong></li>
                        <li><strong>Tag friends to spread awareness</strong></li>
                        <li><strong>Use #FentanylAwarenessDay</strong></li>
                      </ul>
                    </div>
                    
                    <p style="font-size: 16px; font-weight: bold;">Every post can save a life. Your voice matters today!</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="https://facingfentanylnow.org" style="display: inline-block; background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 18px;">POST NOW</a>
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
              .update({ reminder_sent_day_of: true })
              .eq('id', signup.id);

            console.log('Day-of reminder sent to:', signup.email);
          } catch (emailError) {
            console.error('Error sending day-of reminder to', signup.email, ':', emailError);
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
