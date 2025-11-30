import { toZonedTime } from 'date-fns-tz';

export const getSimulatedDate = () => {
  if (typeof window === 'undefined') return new Date();
  const params = new URLSearchParams(window.location.search);
  const dateParam = params.get('date');
  if (dateParam) return new Date(dateParam);
  return new Date();
};

export const isDoorOpenable = (day, currentDate = new Date()) => {
  const timeZone = 'Europe/Helsinki';
  const now = toZonedTime(currentDate, timeZone);
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const isDecember2025 = currentMonth === 12 && currentYear === 2025;
  const isDevOverride = typeof window !== 'undefined' && window.location.search.includes('date=');

  return (isDecember2025 && day <= currentDay) || isDevOverride;
};
