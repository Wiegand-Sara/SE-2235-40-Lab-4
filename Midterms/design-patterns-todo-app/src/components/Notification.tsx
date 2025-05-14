import React, { useState, useEffect } from "react";
import { Task } from "../interfaces/Task";

interface NotificationProps {
  message: string;
  type?: "success" | "warning" | "error" | "info";
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type = "info",
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const typeStyles = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`fixed top-4 right-4 p-4 text-white rounded shadow-lg z-50 ${typeStyles[type]}`}
      role="alert"
    >
      {message}
    </div>
  );
};

// Observer for task notifications
export class TaskNotificationObserver {
  static checkOverdueTasks(tasks: Task[]): string[] {
    const now = new Date();
    return tasks
      .filter(
        (task) =>
          task.dueDate && new Date(task.dueDate) < now && !task.isCompleted
      )
      .map((task) => `Task "${task.title}" is overdue!`);
  }

  static checkUpcomingTasks(tasks: Task[], daysAhead: number = 1): string[] {
    const now = new Date();
    const futureDate = new Date(
      now.getTime() + daysAhead * 24 * 60 * 60 * 1000
    );

    return tasks
      .filter(
        (task) =>
          task.dueDate &&
          new Date(task.dueDate) <= futureDate &&
          new Date(task.dueDate) > now &&
          !task.isCompleted
      )
      .map((task) => `Task "${task.title}" is due soon!`);
  }
}
