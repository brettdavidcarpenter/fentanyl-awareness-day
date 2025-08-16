
import { EmailSignup, ReminderType, SignupResult, ProcessingResult } from './types.ts';
import { DatabaseService } from './database-service.ts';
import { EmailService } from './email-service.ts';
import { calculateTargetDate, getEligibleReminders, shouldSendReminder } from './utils/date-helpers.ts';

export class ReminderProcessor {
  private dbService: DatabaseService;
  private emailService: EmailService;

  constructor() {
    this.dbService = new DatabaseService();
    this.emailService = new EmailService();
  }

  async processAllReminders(forceTestMode = false): Promise<ProcessingResult> {
    const now = new Date();
    console.log('Processing reminder emails at:', now.toISOString());

    const results: SignupResult[] = [];
    const errors: string[] = [];

    try {
      // Process test mode signups
      const testSignups = await this.dbService.getTestModeSignups();
      console.log('Found', testSignups.length, 'test mode emails to check');
      
      for (const signup of testSignups) {
        const result = await this.processSignup(signup, now, true, forceTestMode);
        results.push(result);
        if (!result.success) {
          errors.push(...result.errors);
        }
      }

      // Process production signups (never force immediate for production)
      const productionSignups = await this.dbService.getProductionSignups();
      console.log('Found', productionSignups.length, 'production emails to check');
      
      for (const signup of productionSignups) {
        const result = await this.processSignup(signup, now, false, false);
        results.push(result);
        if (!result.success) {
          errors.push(...result.errors);
        }
      }

      const successfulResults = results.filter(r => r.success);
      
      return {
        success: true,
        processed: successfulResults.length,
        errors
      };

    } catch (error) {
      console.error('Error in processAllReminders:', error);
      return {
        success: false,
        processed: 0,
        errors: [error.message]
      };
    }
  }

  private async processSignup(signup: EmailSignup, now: Date, isTestMode: boolean, forceImmediate = false): Promise<SignupResult> {
    const result: SignupResult = {
      signupId: signup.id,
      email: signup.email,
      success: true,
      remindersSent: [],
      errors: []
    };

    try {
      const targetDate = calculateTargetDate(isTestMode, signup.test_target_date);
      const signupDate = new Date(signup.created_at);
      
      // Get reminders this user is eligible for based on when they signed up
      const eligibleReminders = getEligibleReminders(signupDate, targetDate);
      
      console.log(`Processing ${signup.email} - eligible for:`, eligibleReminders);
      if (forceImmediate && isTestMode) {
        console.log(`Force immediate mode enabled for test signup: ${signup.email}`);
      }

      // Check each reminder type
      for (const reminderType of eligibleReminders) {
        const alreadySent = this.getReminderSentStatus(signup, reminderType);
        
        if (shouldSendReminder(reminderType, now, targetDate, alreadySent, forceImmediate && isTestMode)) {
          console.log(`Sending ${reminderType} reminder to:`, signup.email);
          
          const emailSent = await this.emailService.sendReminderEmail(reminderType, signup);
          
          if (emailSent) {
            await this.dbService.markReminderSent(signup.id, reminderType);
            result.remindersSent.push(reminderType);
          } else {
            result.errors.push(`Failed to send ${reminderType} reminder`);
          }
        }
      }

      if (result.errors.length > 0) {
        result.success = false;
      }

    } catch (error) {
      console.error(`Error processing signup ${signup.email}:`, error);
      result.success = false;
      result.errors.push(error.message);
    }

    return result;
  }

  private getReminderSentStatus(signup: EmailSignup, reminderType: ReminderType): boolean {
    switch (reminderType) {
      case 'two-month':
        return signup.reminder_sent_2_months_before || false;
      case '45-day':
        return signup.reminder_sent_45_days_before || false;
      case 'one-week':
        return signup.reminder_sent_week_before || false;
      case 'day-of':
        return signup.reminder_sent_day_of || false;
      default:
        return false;
    }
  }
}
