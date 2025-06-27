
export const getOneWeekReminderTemplate = (unsubscribeToken: string) => `
  <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white;">
      <h1 style="margin: 0; font-size: 28px;">🕯 One Week to Go</h1>
      <p style="margin: 10px 0 0 0; font-size: 18px;">Fentanyl Awareness Day - August 21, 2025</p>
    </div>
    
    <div style="text-align: center; padding: 20px;">
      <img src="https://jexczwnpirrgvywdmjeg.supabase.co/storage/v1/object/public/uploads/facing-fentanyl-email-banner.png" alt="Facing Fentanyl Awareness" style="max-width: 100%; height: auto; border-radius: 8px;" />
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
        <a href="https://facingfentanylnow.org/unsubscribe?token=${unsubscribeToken}" style="color: #3b82f6;">Unsubscribe</a>
      </p>
    </div>
  </div>
`;
