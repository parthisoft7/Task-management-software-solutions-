export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  dueDate: string; // YYYY-MM-DD format
  status: TaskStatus;
  priority: TaskPriority;
  recurrenceDetails: {
    type: RecurrenceType;
    day?: SundayOfMonth; // Only applicable for MONTHLY_NTH_SUNDAY
  };
}

export enum TaskCategory {
  OFFICE = 'Office Work',
  HOUSE = 'House Maintenance',
  GARDENING = 'Gardening Maintenance',
  BUILDING = 'Building Maintenance',
}

export enum TaskStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum SundayOfMonth {
  FIRST = 'first',
  SECOND = 'second',
  THIRD = 'third',
}

export enum RecurrenceType {
  ONE_TIME = 'one-time',
  WEEKLY_SUNDAY = 'weekly-sunday',
  MONTHLY_NTH_SUNDAY = 'monthly-nth-sunday',
}