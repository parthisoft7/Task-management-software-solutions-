import { Task } from '../types';
import { LOCAL_STORAGE_KEY } from '../constants';

export function getTasks(): Task[] {
  try {
    const tasksJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error('Error loading tasks from local storage:', error);
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to local storage:', error);
  }
}