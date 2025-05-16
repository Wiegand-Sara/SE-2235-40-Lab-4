  import { Task } from "../interfaces/Task";

  export class TaskSortingStrategy {
    static sortByDate(tasks: Task[]): Task[] {
      return [...tasks].sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }

    static sortByName(tasks: Task[]): Task[] {
      return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
    }

    static sortById(tasks: Task[]): Task[] {
      return [...tasks].sort((a, b) => a.id.localeCompare(b.id));
    }

    static sortByCompletion(tasks: Task[]): Task[] {
      return [...tasks].sort((a, b) =>
        a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1
      );
    }
  }
