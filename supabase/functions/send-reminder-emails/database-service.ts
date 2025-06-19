
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { EmailSignup, ReminderType } from './types.ts';

export class DatabaseService {
  private supabase;

  constructor() {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  async getTestModeSignups(): Promise<EmailSignup[]> {
    const { data, error } = await this.supabase
      .from('email_signups')
      .select('*')
      .eq('test_mode', true)
      .not('test_target_date', 'is', null);

    if (error) {
      throw new Error(`Error fetching test mode emails: ${error.message}`);
    }

    return data || [];
  }

  async getProductionSignups(): Promise<EmailSignup[]> {
    const { data, error } = await this.supabase
      .from('email_signups')
      .select('*')
      .eq('test_mode', false);

    if (error) {
      throw new Error(`Error fetching production emails: ${error.message}`);
    }

    return data || [];
  }

  async markReminderSent(signupId: string, reminderType: ReminderType): Promise<void> {
    const columnMap = {
      'two-month': 'reminder_sent_2_months_before',
      'one-week': 'reminder_sent_week_before',
      'day-of': 'reminder_sent_day_of'
    };

    const column = columnMap[reminderType];
    if (!column) {
      throw new Error(`Unknown reminder type: ${reminderType}`);
    }

    const { error } = await this.supabase
      .from('email_signups')
      .update({ [column]: true })
      .eq('id', signupId);

    if (error) {
      throw new Error(`Error updating reminder status: ${error.message}`);
    }
  }
}
