import { TaskCategory, TaskStatus, TaskPriority, SundayOfMonth, RecurrenceType } from './types';

export const LOCAL_STORAGE_KEY = 'personalAssistantTasks';

export const TASK_CATEGORIES: TaskCategory[] = [
  TaskCategory.OFFICE,
  TaskCategory.HOUSE,
  TaskCategory.GARDENING,
  TaskCategory.BUILDING,
];

export const TASK_STATUSES: TaskStatus[] = [
  TaskStatus.PENDING,
  TaskStatus.COMPLETED,
];

export const TASK_PRIORITIES: TaskPriority[] = [
  TaskPriority.LOW,
  TaskPriority.MEDIUM,
  TaskPriority.HIGH,
];

export const SUNDAY_OF_MONTH_OPTIONS: { value: SundayOfMonth; label: string }[] = [
  { value: SundayOfMonth.FIRST, label: 'First Sunday' },
  { value: SundayOfMonth.SECOND, label: 'Second Sunday' },
  { value: SundayOfMonth.THIRD, label: 'Third Sunday' },
];

export const RECURRENCE_TYPE_OPTIONS: { value: RecurrenceType; label: string }[] = [
  { value: RecurrenceType.ONE_TIME, label: 'One-time' },
  { value: RecurrenceType.WEEKLY_SUNDAY, label: 'Every Sunday' },
  { value: RecurrenceType.MONTHLY_NTH_SUNDAY, label: 'Nth Sunday of Month' },
];