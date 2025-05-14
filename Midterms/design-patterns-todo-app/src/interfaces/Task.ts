// src/interfaces/Task.ts

export enum TaskType {
  BASIC = 'basic',
  TIMED = 'timed',
  CHECKLIST = 'checklist',
}

// Define a SubTask interface
export interface SubTask {
  text: string;
  isDone: boolean;
}

// Updated Task interface using SubTask[]
export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  dueDate?: string;
  isCompleted?: boolean;
  subTasks?: SubTask[]; // Clearer structure using SubTask interface
}

export interface ITaskFactory {
  createTask(type: TaskType): React.ReactNode;
}

export interface ITaskManager {
  addTask(task: Task): void;
  removeTask(taskId: string): void;
  getTasks(): Task[];
  searchTask(query: string): Task[];
}

export interface ITaskSortStrategy {
  sort(tasks: Task[]): Task[];
}
