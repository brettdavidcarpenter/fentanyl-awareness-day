
import { Resend } from "npm:resend@2.0.0";
import { ReminderType, EmailSignup } from './types.ts';
import { getTwoMonthReminderTemplate } from './templates/two-month-reminder.ts';
import { get45DayReminderTemplate } from './templates/45-day-reminder.ts';
import { getOneWeekReminderTemplate } from './templates/one-week-reminder.ts';
import { getDayOfReminderTemplate } from './templates/day-of-reminder.ts';

export class EmailService {
  private resend: Resend;

  constructor() {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }
    this.resend = new Resend(resendApiKey);
  }

  async sendReminderEmail(reminderType: ReminderType, signup: EmailSignup): Promise<boolean> {
    try {
      const { subject, html } = this.getEmailContent(reminderType, signup.unsubscribe_token);
      
      await this.resend.emails.send({
        from: "Facing Fentanyl <noreply@mail.aware-share.com>",
        to: [signup.email],
        subject,
        html,
      });

      console.log(`${reminderType} reminder sent successfully to:`, signup.email);
      return true;
    } catch (error) {
      console.error(`Error sending ${reminderType} reminder to ${signup.email}:`, error);
      return false;
    }
  }

  private getEmailContent(reminderType: ReminderType, unsubscribeToken: string): { subject: string; html: string } {
    switch (reminderType) {
      case 'two-month':
        return {
          subject: "🕯 2 Months Until Fentanyl Awareness Day",
          html: getTwoMonthReminderTemplate(unsubscribeToken)
        };
      case '45-day':
        return {
          subject: "🕯 45 Days Until Fentanyl Awareness Day",
          html: get45DayReminderTemplate(unsubscribeToken)
        };
      case 'one-week':
        return {
          subject: "🕯 One Week Until Fentanyl Awareness Day",
          html: getOneWeekReminderTemplate(unsubscribeToken)
        };
      case 'day-of':
        return {
          subject: "🕯 TODAY is National Fentanyl Prevention & Awareness Day!",
          html: getDayOfReminderTemplate(unsubscribeToken)
        };
      default:
        throw new Error(`Unknown reminder type: ${reminderType}`);
    }
  }
}
