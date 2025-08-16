
export const getDayOfReminderTemplate = (unsubscribeToken: string) => `
  <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #dc2626, #ef4444); color: white;">
      <h1 style="margin: 0; font-size: 32px;">🕯 TODAY IS THE DAY!</h1>
      <p style="margin: 10px 0 0 0; font-size: 20px; font-weight: bold;">National Fentanyl Prevention & Awareness Day - August 21, 2025</p>
    </div>
    
    <div style="padding: 30px 20px;">
      <p style="font-size: 18px; margin-bottom: 20px;">Hello,</p>
      
      <p style="font-size: 18px; font-weight: bold; color: #dc2626;">TODAY is National Fentanyl Prevention & Awareness Day!</p>
      
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
        <a href="https://facingfentanylnow.org/day-of-experience" style="display: inline-block; background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 18px;">CREATE YOUR POST</a>
      </div>
      
      <p style="font-size: 14px; color: #666; margin-top: 30px;">
        <a href="https://facingfentanylnow.org/unsubscribe?token=${unsubscribeToken}" style="color: #3b82f6;">Unsubscribe</a>
      </p>
    </div>
  </div>
`;
