
// Utility functions for managing the event window
export const EVENT_START_DATE = new Date('2025-08-14T00:00:00Z');
export const EVENT_END_DATE = new Date('2025-08-28T23:59:59Z');
export const FENTANYL_AWARENESS_DAY = new Date('2025-08-21T00:00:00Z');

export const isEventWindowActive = (): boolean => {
  const now = new Date();
  return now >= EVENT_START_DATE && now <= EVENT_END_DATE;
};

export const getDaysUntilEvent = (): number => {
  const now = new Date();
  const diffTime = EVENT_START_DATE.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getDaysUntilAwarenessDay = (): number => {
  const now = new Date();
  const diffTime = FENTANYL_AWARENESS_DAY.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
