
export type ReminderType = 'two-month' | '45-day' | 'one-week' | 'day-of';

export interface EmailSignup {
  id: string;
  email: string;
  created_at: string;
  test_mode: boolean;
  test_target_date?: string;
  unsubscribe_token: string;
  reminder_sent_2_months_before: boolean;
  reminder_sent_45_days_before: boolean;
  reminder_sent_week_before: boolean;
  reminder_sent_day_of: boolean;
}

export interface ProcessingResult {
  success: boolean;
  processed: number;
  errors: string[];
}

export interface SignupResult {
  signupId: string;
  email: string;
  success: boolean;
  remindersSent: ReminderType[];
  errors: string[];
}
