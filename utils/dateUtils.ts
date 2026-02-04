import { SundayOfMonth, RecurrenceType } from '../types';

/**
 * Pads a single digit number with a leading zero.
 */
function padZero(num: number): string {
  return num < 10 ? '0' + num : String(num);
}

/**
 * Calculates the date of the Nth Sunday in a given month and year.
 * Returns the date in YYYY-MM-DD format.
 */
export function getNthSundayOfMonth(year: number, month: number, n: SundayOfMonth): string {
  const date = new Date(year, month - 1, 1); // Month is 0-indexed in Date object
  let sundayCount = 0;
  let day = 1;
  let targetDate = '';

  while (day <= new Date(year, month, 0).getDate()) { // Loop through days of the month
    date.setDate(day);
    if (date.getDay() === 0) { // Sunday is 0
      sundayCount++;
      if (
        (n === SundayOfMonth.FIRST && sundayCount === 1) ||
        (n === SundayOfMonth.SECOND && sundayCount === 2) ||
        (n === SundayOfMonth.THIRD && sundayCount === 3)
      ) {
        targetDate = `${year}-${padZero(month)}-${padZero(day)}`;
        break;
      }
    }
    day++;
  }
  return targetDate;
}

/**
 * Calculates the next upcoming Sunday from a given date.
 * If no date is provided, it uses the current date.
 * Returns the date in YYYY-MM-DD format.
 */
export function getNextSunday(from?: Date): string {
  const start = from ? new Date(from.getTime()) : new Date();
  start.setHours(0, 0, 0, 0); // Normalize to start of day

  const dayOfWeek = start.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const daysUntilNextSunday = (7 - dayOfWeek) % 7; // If today is Sunday, this is 0. We want next Sunday, so adjust.

  const nextSunday = new Date(start.getTime());
  nextSunday.setDate(start.getDate() + daysUntilNextSunday);

  // If the calculated next Sunday is today, but we want the *next* occurrence (e.g., after completing a task),
  // we should advance to the following Sunday.
  // This logic is primarily for when an existing task's due date is exactly 'today' and we need the *next* occurrence.
  if (from && nextSunday.getTime() === start.getTime() && (from.getDay() === 0)) {
     nextSunday.setDate(start.getDate() + 7);
  } else if (!from && nextSunday.getTime() === start.getTime()) {
    // If getting next Sunday from 'now' and 'now' is Sunday, return today's Sunday.
    // Otherwise, it correctly gives the next upcoming one.
  }


  return `${nextSunday.getFullYear()}-${padZero(nextSunday.getMonth() + 1)}-${padZero(nextSunday.getDate())}`;
}


/**
 * Calculates the next upcoming occurrence of a recurring task based on its recurrence type.
 * If currentDateStr is provided, it calculates the next occurrence *after* that date.
 * Otherwise, it calculates the next occurrence from today.
 */
export function calculateNextRecurrenceDueDate(
  recurrenceType: RecurrenceType,
  recurrenceDay?: SundayOfMonth,
  currentDateStr?: string | null,
): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let year: number;
  let month: number;
  let startDate: Date;

  if (currentDateStr) {
    startDate = new Date(currentDateStr);
    startDate.setHours(0, 0, 0, 0);
  } else {
    startDate = now;
  }

  if (recurrenceType === RecurrenceType.WEEKLY_SUNDAY) {
    // For weekly tasks, find the next Sunday.
    // If `currentDateStr` is provided (e.g., from a completed task), we want the Sunday *after* this date.
    // If not, we want the *first* upcoming Sunday including today if it's Sunday.
    let targetDate = getNextSunday(currentDateStr ? new Date(new Date(currentDateStr).setDate(new Date(currentDateStr).getDate() + 1)) : undefined); // Get Sunday after current
    let parsedTargetDate = new Date(targetDate);
    parsedTargetDate.setHours(0,0,0,0);

    // If the targetDate is in the past compared to 'now', advance it.
    while (parsedTargetDate < now) {
      const tempDate = new Date(targetDate);
      tempDate.setDate(tempDate.getDate() + 7);
      targetDate = `${tempDate.getFullYear()}-${padZero(tempDate.getMonth() + 1)}-${padZero(tempDate.getDate())}`;
      parsedTargetDate = new Date(targetDate);
      parsedTargetDate.setHours(0,0,0,0);
    }
    return targetDate;

  } else if (recurrenceType === RecurrenceType.MONTHLY_NTH_SUNDAY && recurrenceDay) {
    year = startDate.getFullYear();
    month = startDate.getMonth() + 1;

    let targetDateStr = getNthSundayOfMonth(year, month, recurrenceDay);
    let targetDate = targetDateStr ? new Date(targetDateStr) : null;
    if (targetDate) {
      targetDate.setHours(0,0,0,0);
    }

    // If target date is in the past relative to 'now', or if we are rescheduling and the current target is not future enough
    if (!targetDate || targetDate < now || (currentDateStr && targetDate.getTime() === startDate.getTime())) {
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
      targetDateStr = getNthSundayOfMonth(year, month, recurrenceDay);
      targetDate = new Date(targetDateStr);
      targetDate.setHours(0,0,0,0);

      // Edge case: if after incrementing month, it's still in the past (unlikely but robust)
      while (targetDate < now) {
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
        targetDateStr = getNthSundayOfMonth(year, month, recurrenceDay);
        targetDate = new Date(targetDateStr);
        targetDate.setHours(0,0,0,0);
      }
    }
    return targetDateStr;
  }

  // Should not reach here for recurring types
  return '';
}