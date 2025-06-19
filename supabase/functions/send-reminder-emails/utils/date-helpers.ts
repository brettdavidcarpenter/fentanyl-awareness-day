
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
  
  const timeDiff = targetDate.getTime() - now.getTime();
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  
  switch (reminderType) {
    case 'two-month':
      return daysDiff <= 60 && daysDiff > 0;
    case 'one-week':
      return daysDiff <= 7 && daysDiff > 0;
    case 'day-of':
      return daysDiff <= 1 && daysDiff > -1; // Day of event (24-hour window)
    default:
      return false;
  }
}
