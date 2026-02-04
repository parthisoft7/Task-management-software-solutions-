import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskCategory, TaskStatus, TaskPriority, SundayOfMonth, RecurrenceType } from './types';
import { LOCAL_STORAGE_KEY } from './constants';
import * as localStorageService from './services/localStorageService';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { FilterSortControls } from './components/FilterSortControls';
import { Modal } from './components/Modal';
import { calculateNextRecurrenceDueDate } from './utils/dateUtils';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'dueDateAsc' | 'dueDateDesc' | 'priorityDesc'>('dueDateAsc');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const processRecurringTasksOnLoad = useCallback((loadedTasks: Task[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const updatedTasks = loadedTasks.map(task => {
      const taskDueDate = new Date(task.dueDate);
      taskDueDate.setHours(0, 0, 0, 0);

      if (task.recurrenceDetails.type !== RecurrenceType.ONE_TIME && taskDueDate < today) {
        // If a recurring task is past due, calculate the next occurrence and reset status
        const nextDueDate = calculateNextRecurrenceDueDate(
          task.recurrenceDetails.type,
          task.recurrenceDetails.day,
          task.dueDate // Pass current dueDate to find next occurrence after it
        );
        return {
          ...task,
          dueDate: nextDueDate,
          status: TaskStatus.PENDING, // Always reset to pending if auto-rescheduled
        };
      }
      return task;
    });
    return updatedTasks;
  }, []);

  useEffect(() => {
    const loadedTasks = localStorageService.getTasks();
    const processedTasks = processRecurringTasksOnLoad(loadedTasks);
    setTasks(processedTasks);
    localStorageService.saveTasks(processedTasks); // Save processed tasks back to local storage
  }, [processRecurringTasksOnLoad]);

  const saveTasks = useCallback((updatedTasks: Task[]) => {
    localStorageService.saveTasks(updatedTasks);
    setTasks(updatedTasks);
  }, []);

  const handleAddTask = useCallback((newTaskData: Omit<Task, 'id' | 'status'>) => {
    let finalDueDate = newTaskData.dueDate;
    let finalStatus = TaskStatus.PENDING;

    if (newTaskData.recurrenceDetails.type !== RecurrenceType.ONE_TIME) {
      finalDueDate = calculateNextRecurrenceDueDate(
        newTaskData.recurrenceDetails.type,
        newTaskData.recurrenceDetails.day,
        null // For new tasks, calculate from "now"
      );
    }

    const taskToAdd: Task = {
      ...newTaskData,
      id: crypto.randomUUID(),
      status: finalStatus,
      dueDate: finalDueDate,
      recurrenceDetails: newTaskData.recurrenceDetails,
    };
    const updatedTasks = [...tasks, taskToAdd];
    saveTasks(updatedTasks);
    setIsFormModalOpen(false);
  }, [tasks, saveTasks]);

  const handleEditTask = useCallback((updatedTaskData: Task) => {
    let finalDueDate = updatedTaskData.dueDate;

    if (updatedTaskData.recurrenceDetails.type !== RecurrenceType.ONE_TIME) {
      // For editing recurring tasks, recalculate due date based on current logic
      finalDueDate = calculateNextRecurrenceDueDate(
        updatedTaskData.recurrenceDetails.type,
        updatedTaskData.recurrenceDetails.day,
        updatedTaskData.dueDate // Recalculate based on current due date if needed
      );
    }

    const taskToSave: Task = {
      ...updatedTaskData,
      dueDate: finalDueDate,
    };

    const updatedTasks = tasks.map((task) =>
      task.id === taskToSave.id ? taskToSave : task
    );
    saveTasks(updatedTasks);
    setEditingTask(null);
    setIsFormModalOpen(false);
  }, [tasks, saveTasks]);

  const handleDeleteTask = useCallback((taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      saveTasks(updatedTasks);
    }
  }, [tasks, saveTasks]);

  const handleToggleComplete = useCallback((taskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        if (task.recurrenceDetails.type !== RecurrenceType.ONE_TIME) {
          // For recurring tasks, mark as complete, then immediately reset to pending
          // and advance the due date to the next occurrence.
          const nextDueDate = calculateNextRecurrenceDueDate(
            task.recurrenceDetails.type,
            task.recurrenceDetails.day,
            task.dueDate // Pass current dueDate to calculate the *next* one after this completion
          );
          return {
            ...task,
            status: TaskStatus.PENDING, // Reset to pending
            dueDate: nextDueDate, // Advance to next occurrence
          };
        } else {
          // For one-off tasks, simply toggle completion status
          return { ...task, status: task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED };
        }
      }
      return task;
    });
    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  const openEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
  }, []);

  const openAddModal = useCallback(() => {
    setEditingTask(null);
    setIsFormModalOpen(true);
  }, []);

  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingTask(null);
  }, []);

  const filteredAndSortedTasks = React.useMemo(() => {
    let filtered = tasks;

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter((task) => task.category === filterCategory);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          task.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === 'dueDateAsc') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortOrder === 'dueDateDesc') {
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      } else if (sortOrder === 'priorityDesc') {
        const priorityOrder: Record<TaskPriority, number> = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

    return sorted;
  }, [tasks, filterCategory, filterStatus, sortOrder, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Your Tasks</h2>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 w-full sm:w-auto flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Task
            </button>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white w-full sm:max-w-xs"
            />
          </div>

          <FilterSortControls
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>

        <TaskList
          tasks={filteredAndSortedTasks}
          onEdit={openEditModal}
          onDelete={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
        />
      </main>

      <Modal isOpen={isFormModalOpen} onClose={closeFormModal} title={editingTask ? 'Edit Task' : 'Add New Task'}>
        <TaskForm
          initialTask={editingTask}
          onSave={editingTask ? handleEditTask : handleAddTask}
          onCancel={closeFormModal}
        />
      </Modal>
    </div>
  );
}

export default App;