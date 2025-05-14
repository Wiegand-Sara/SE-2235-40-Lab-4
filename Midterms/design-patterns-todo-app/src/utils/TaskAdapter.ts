// src/utils/TaskAdapter.ts
import { Task, TaskType } from '../interfaces/Task';

// External API response type
interface ExternalTaskData {
  _id: string;
  name: string;
  desc?: string;
  deadline?: string;
  status?: string;
}

export class TaskAdapter {
  // Convert external API data to internal Task interface
  static adaptTask(externalTask: ExternalTaskData): Task {
    return {
      id: externalTask._id,
      title: externalTask.name,
      description: externalTask.desc,
      type: this.determineTaskType(externalTask),
      dueDate: externalTask.deadline,
      isCompleted: externalTask.status === 'completed'
    };
  }

  // Determine task type based on external data
  private static determineTaskType(externalTask: ExternalTaskData): TaskType {
    if (externalTask.deadline) return TaskType.TIMED;
    if (externalTask.status) return TaskType.CHECKLIST;
    return TaskType.BASIC;
  }

  // Adapt multiple tasks
  static adaptTasks(externalTasks: ExternalTaskData[]): Task[] {
    return externalTasks.map(this.adaptTask);
  }
}