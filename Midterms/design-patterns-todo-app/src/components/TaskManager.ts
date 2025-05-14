// src/components/TaskManager.ts
import { Task, TaskType } from '../interfaces/Task';
import { v4 as uuidv4 } from 'uuid';

class TaskManagerSingleton {
  private static instance: TaskManagerSingleton;
  private tasks: Task[] = [];

  private constructor() {}

  public static getInstance(): TaskManagerSingleton {
    if (!TaskManagerSingleton.instance) {
      TaskManagerSingleton.instance = new TaskManagerSingleton();
    }
    return TaskManagerSingleton.instance;
  }

  addTask(title: string, description?: string, type: TaskType = TaskType.BASIC, dueDate?: string): Task {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      type,
      dueDate,
      isCompleted: false
    };
    this.tasks.push(newTask);
    return newTask;
  }

  removeTask(taskId: string): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }

  getTasks(): Task[] {
    return [...this.tasks];
  }

  searchTask(query: string): Task[] {
    return this.tasks.filter(task => 
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(query.toLowerCase()))
    );
  }

  updateTask(taskId: string, updates: Partial<Task>): Task | undefined {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
      return this.tasks[taskIndex];
    }
    return undefined;
  }

  toggleTaskCompletion(taskId: string): Task | undefined {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.isCompleted = !task.isCompleted;
      return task;
    }
    return undefined;
  }
}

export const TaskManager = TaskManagerSingleton.getInstance();