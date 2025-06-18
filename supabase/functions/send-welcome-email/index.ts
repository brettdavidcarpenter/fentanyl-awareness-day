
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Welcome email function called with method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, signupId } = await req.json();
    console.log('Sending welcome email to:', email, 'for signup ID:', signupId);

    if (!email || !signupId) {
      console.error('Missing email or signupId');
      return new Response(
        JSON.stringify({ error: 'Email and signupId are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize services
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase environment variables missing');
      return new Response(
        JSON.stringify({ error: 'Database service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const resend = new Resend(resendApiKey);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Send welcome email
    const emailResponse = await resend.emails.send({
      from: "Facing Fentanyl <noreply@facingfentanylnow.org>",
      to: [email],
      subject: "Thank you for joining Fentanyl Awareness Day 2025",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white;">
            <h1 style="margin: 0; font-size: 28px;">Thank You for Joining Us</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Fentanyl Awareness Day 2025</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <p style="font-size: 18px; margin-bottom: 20px;">Hello,</p>
            
            <p>Thank you for signing up to participate in <strong>National Fentanyl Awareness Day on August 21, 2025</strong>. Your commitment to spreading awareness can truly save lives.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e3a8a; margin-top: 0;">What happens next?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>We'll send you reminder emails leading up to August 21st</li>
                <li>Our post generator and tribute tools will be available soon</li>
                <li>You'll receive easy-to-use content for social media sharing</li>
              </ul>
            </div>
            
            <p><strong>Mark your calendar:</strong> August 21, 2025</p>
            <p>Together, we can make a difference and raise awareness about fentanyl prevention.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://facingfentanylnow.org" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Visit Facing Fentanyl Now</a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If you no longer wish to receive these emails, you can 
              <a href="https://facingfentanylnow.org/unsubscribe?token={{unsubscribe_token}}" style="color: #3b82f6;">unsubscribe here</a>.
            </p>
          </div>
        </div>
      `,
    });

    console.log('Welcome email sent successfully:', emailResponse);

    // Update database to mark welcome email as sent
    const { error: updateError } = await supabase
      .from('email_signups')
      .update({ welcome_email_sent: true })
      .eq('id', signupId);

    if (updateError) {
      console.error('Error updating welcome_email_sent status:', updateError);
      // Don't fail the request if we can't update the status
    } else {
      console.log('Successfully marked welcome email as sent for signup:', signupId);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Welcome email sent successfully',
        emailId: emailResponse.data?.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in send-welcome-email function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send welcome email' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
