import React from 'react';
import { Task, TaskStatus, TaskPriority, RecurrenceType } from '../types';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const isCompleted = task.status === TaskStatus.COMPLETED;
  const isRecurring = task.recurrenceDetails.type !== RecurrenceType.ONE_TIME;

  const priorityColorClass = React.useMemo(() => {
    switch (task.priority) {
      case TaskPriority.HIGH:
        return 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100';
      case TaskPriority.MEDIUM:
        return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
      case TaskPriority.LOW:
        return 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100';
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  }, [task.priority]);

  const dueDateFormatted = React.useMemo(() => {
    const date = new Date(task.dueDate);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }, [task.dueDate]);

  const recurrenceTooltip = React.useMemo(() => {
    if (task.recurrenceDetails.type === RecurrenceType.WEEKLY_SUNDAY) {
      return 'Recurs every Sunday';
    } else if (task.recurrenceDetails.type === RecurrenceType.MONTHLY_NTH_SUNDAY && task.recurrenceDetails.day) {
      const dayLabel = task.recurrenceDetails.day.charAt(0).toUpperCase() + task.recurrenceDetails.day.slice(1);
      return `Recurs every ${dayLabel} Sunday of the month`;
    }
    return ''; // Should not happen for recurring tasks
  }, [task.recurrenceDetails]);

  return (
    <div className={`relative bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col transition-all duration-300 ${isCompleted ? 'opacity-70 border-l-4 border-green-500' : 'border-l-4 border-blue-500'}`}>
      {isCompleted && (
        <div className="absolute top-0 right-0 m-3 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
          Completed
        </div>
      )}
      <h3 className={`text-xl font-semibold mb-2 ${isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'} flex items-center`}>
        {task.title}
        {isRecurring && (
          <span className="ml-2" title={recurrenceTooltip}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v1h4V3a1 1 0 012 0v1h4V3a1 1 0 112 0v1h1a1 1 0 011 1v2a1 1 0 01-1 1h-1v4a1 1 0 011 1v2a1 1 0 01-1 1h-1V17a1 1 0 01-1 1H7a1 1 0 01-1-1v-1H5a1 1 0 01-1-1v-2a1 1 0 011-1h1V7a1 1 0 01-1-1V4a1 1 0 011-1h1V2a1 1 0 011-1zm1 5h8v6H5V7z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </h3>
      <p className={`text-sm text-gray-600 dark:text-gray-300 mb-3 ${isCompleted ? 'line-through' : ''}`}>
        {task.description || 'No description provided.'}
      </p>

      <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-200 mb-4 mt-auto">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.01V6h3a1 1 0 010 2H9.97a1 1 0 01-.727-1.01V3.03c-.15-.15-.3-.268-.454-.37A1.99 1.99 0 005 3a2 2 0 00-2 2v6a2 2 0 002 2h3.03c.15.15.268.3.37.454A1.99 1.99 0 0015 17a2 2 0 002-2v-6a2 2 0 00-2-2h-3.03c-.15-.15-.268-.3-.37-.454A1.99 1.99 0 005 3zM6 8a1 1 0 100 2h.01a1 1 0 100-2H6zm6 0a1 1 0 100 2h.01a1 1 0 100-2H12z" clipRule="evenodd" />
          </svg>
          <strong>Category:</strong> <span className="ml-1 font-medium">{task.category}</span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <strong>Due Date:</strong> <span className="ml-1 font-medium">{dueDateFormatted}</span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <strong>Priority:</strong>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${priorityColorClass}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`p-2 rounded-full transition duration-200 ${isCompleted && !isRecurring ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
          title={isCompleted && !isRecurring ? 'Mark as Pending' : (isRecurring ? 'Complete & Reschedule' : 'Mark as Complete')}
          aria-label={isCompleted && !isRecurring ? 'Mark as Pending' : (isRecurring ? 'Complete and Reschedule' : 'Mark as Complete')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            {isCompleted && !isRecurring ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414L7 9.586 5.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            )}
          </svg>
        </button>
        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition duration-200"
          title="Edit Task"
          aria-label="Edit Task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-1.414 7.071L4.172 17.828A2 2 0 005.586 18H15a2 2 0 002-2V7.414a2 2 0 00-.586-1.414L13.586 8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition duration-200"
          title="Delete Task"
          aria-label="Delete Task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};