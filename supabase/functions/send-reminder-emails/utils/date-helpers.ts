
import { ReminderType } from '../types.ts';

export function calculateTargetDate(isTestMode: boolean, testTargetDate?: string): Date {
  if (isTestMode && testTargetDate) {
    return new Date(testTargetDate);
  }
  return new Date('2025-08-21T00:00:00Z');
}

export function getEligibleReminders(signupDate: Date, targetDate: Date): ReminderType[] {
  const daysBetween = Math.floor((targetDate.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const eligible: ReminderType[] = [];
  
  // Only add reminders if the user signed up early enough to receive them
  if (daysBetween >= 60) {
    eligible.push('two-month');
  }
  if (daysBetween >= 45) {
    eligible.push('45-day');
  }
  if (daysBetween >= 7) {
    eligible.push('one-week');
  }
  
  // Everyone is eligible for day-of reminder regardless of when they signed up
  eligible.push('day-of');
  
  return eligible;
}

export function shouldSendReminder(
  reminderType: ReminderType,
  now: Date,
  targetDate: Date,
  alreadySent: boolean
): boolean {
  if (alreadySent) return false;
  
  // Convert current time to ET for 9am check
  const nowET = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
  const currentHourET = nowET.getHours();
  
  // Only send emails at 9am ET (allow 9:00-9:59am window)
  if (currentHourET !== 9) return false;
  
  const timeDiff = targetDate.getTime() - now.getTime();
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  
  switch (reminderType) {
    case 'two-month':
      return daysDiff <= 60 && daysDiff > 45;
    case '45-day':
      return daysDiff <= 45 && daysDiff > 7;
    case 'one-week':
      return daysDiff <= 7 && daysDiff > 0;
    case 'day-of':
      return daysDiff <= 1 && daysDiff > -1; // Day of event (24-hour window)
    default:
      return false;
  }
}
