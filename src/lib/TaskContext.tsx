'use client';

import { createContext, useContext, useCallback, ReactNode } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { tasks as defaultTasks, Task, TaskStatus, Priority } from './data';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (taskId: number, status: TaskStatus) => void;
  updateTask: (taskId: number, updates: Partial<Task>) => void;
  deleteTask: (taskId: number) => void;
  resetTasks: () => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskflow_tasks', defaultTasks);

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    setTasks((prev) => {
      const maxId = prev.reduce((max, t) => Math.max(max, t.id), 0);
      return [{ ...task, id: maxId + 1 }, ...prev];
    });
  }, [setTasks]);

  const updateTaskStatus = useCallback((taskId: number, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status,
              progress: status === 'completed' ? 100 : status === 'in_progress' ? Math.max(t.progress, 10) : t.progress,
            }
          : t
      )
    );
  }, [setTasks]);

  const updateTask = useCallback((taskId: number, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)));
  }, [setTasks]);

  const deleteTask = useCallback((taskId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, [setTasks]);

  const resetTasks = useCallback(() => {
    setTasks(defaultTasks);
  }, [setTasks]);

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus, updateTask, deleteTask, resetTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}
