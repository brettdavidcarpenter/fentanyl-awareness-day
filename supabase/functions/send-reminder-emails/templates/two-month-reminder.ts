
export const getTwoMonthReminderTemplate = (unsubscribeToken: string) => `
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
        <a href="https://facingfentanylnow.org/unsubscribe?token=${unsubscribeToken}" style="color: #3b82f6;">Unsubscribe</a>
      </p>
    </div>
  </div>
`;
