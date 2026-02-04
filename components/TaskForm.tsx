import React, { useState, useEffect } from 'react';
import { Task, TaskCategory, TaskStatus, TaskPriority, SundayOfMonth, RecurrenceType } from '../types';
import { TASK_CATEGORIES, TASK_PRIORITIES, SUNDAY_OF_MONTH_OPTIONS, RECURRENCE_TYPE_OPTIONS } from '../constants';

interface TaskFormProps {
  initialTask?: Task | null;
  // onSave now expects a Task object directly, as App.tsx handles ID and final dueDate logic
  onSave: (task: Omit<Task, 'id' | 'status'> | Task) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialTask, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [category, setCategory] = useState<TaskCategory>(initialTask?.category || TaskCategory.OFFICE);
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || '');
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority || TaskPriority.MEDIUM);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(
    initialTask?.recurrenceDetails?.type || RecurrenceType.ONE_TIME
  );
  const [recurrenceDay, setRecurrenceDay] = useState<SundayOfMonth>(
    initialTask?.recurrenceDetails?.day || SundayOfMonth.FIRST
  );

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setCategory(initialTask.category);
      setDueDate(initialTask.dueDate);
      setPriority(initialTask.priority);
      setRecurrenceType(initialTask.recurrenceDetails.type);
      setRecurrenceDay(initialTask.recurrenceDetails.day || SundayOfMonth.FIRST);
    } else {
      setTitle('');
      setDescription('');
      setCategory(TaskCategory.OFFICE);
      setDueDate('');
      setPriority(TaskPriority.MEDIUM);
      setRecurrenceType(RecurrenceType.ONE_TIME);
      setRecurrenceDay(SundayOfMonth.FIRST);
    }
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required.');
      return;
    }
    if (recurrenceType === RecurrenceType.ONE_TIME && !dueDate) {
      alert('Due Date is required for one-time tasks.');
      return;
    }

    const taskData: Omit<Task, 'id' | 'status'> = {
      title,
      description,
      category,
      dueDate, // This will be overridden in App.tsx if recurring
      priority,
      recurrenceDetails: {
        type: recurrenceType,
        day: recurrenceType === RecurrenceType.MONTHLY_NTH_SUNDAY ? recurrenceDay : undefined,
      },
    };

    if (initialTask) {
      onSave({ ...initialTask, ...taskData });
    } else {
      onSave(taskData);
    }
  };

  const isDueDateDisabled = recurrenceType !== RecurrenceType.ONE_TIME;

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-y"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as TaskCategory)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          {TASK_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          {TASK_PRIORITIES.map((prio) => (
            <option key={prio} value={prio}>
              {prio.charAt(0).toUpperCase() + prio.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="recurrenceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recurrence Type</label>
        <select
          id="recurrenceType"
          value={recurrenceType}
          onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          {RECURRENCE_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {recurrenceType === RecurrenceType.MONTHLY_NTH_SUNDAY && (
        <div className="mb-4">
          <label htmlFor="recurrenceDay" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Which Sunday?</label>
          <select
            id="recurrenceDay"
            value={recurrenceDay}
            onChange={(e) => setRecurrenceDay(e.target.value as SundayOfMonth)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {SUNDAY_OF_MONTH_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isDueDateDisabled}
          className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white ${isDueDateDisabled ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed' : 'dark:bg-gray-700'}`}
          required={!isDueDateDisabled}
        />
        {isDueDateDisabled && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Due Date is automatically calculated for recurring tasks.</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 transition duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {initialTask ? 'Save Changes' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};