import React from 'react';
import { TaskCategory, TaskStatus, TaskPriority } from '../types';
import { TASK_CATEGORIES, TASK_STATUSES, TASK_PRIORITIES } from '../constants';

interface FilterSortControlsProps {
  filterCategory: TaskCategory | 'all';
  setFilterCategory: (category: TaskCategory | 'all') => void;
  filterStatus: TaskStatus | 'all';
  setFilterStatus: (status: TaskStatus | 'all') => void;
  sortOrder: 'dueDateAsc' | 'dueDateDesc' | 'priorityDesc';
  setSortOrder: (order: 'dueDateAsc' | 'dueDateDesc' | 'priorityDesc') => void;
}

export const FilterSortControls: React.FC<FilterSortControlsProps> = ({
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
      <div className="w-full sm:w-1/3">
        <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Category</label>
        <select
          id="categoryFilter"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as TaskCategory | 'all')}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
        >
          <option value="all">All Categories</option>
          {TASK_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-1/3">
        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Status</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
        >
          <option value="all">All Statuses</option>
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-1/3">
        <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'dueDateAsc' | 'dueDateDesc' | 'priorityDesc')}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
        >
          <option value="dueDateAsc">Due Date (Ascending)</option>
          <option value="dueDateDesc">Due Date (Descending)</option>
          <option value="priorityDesc">Priority (High to Low)</option>
        </select>
      </div>
    </div>
  );
};