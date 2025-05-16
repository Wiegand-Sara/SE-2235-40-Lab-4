"use client";

import { useEffect, useState } from "react";
import { TaskFactory } from "../components/TaskFactory";
import { Task, TaskType } from "../interfaces/Task";
import { v4 as uuidv4 } from "uuid";
import {
  Notification,
  TaskNotificationObserver,
} from "../components/Notification";
import { TaskSortingStrategy } from "../components/TaskSortingStrategy"; // Import TaskSortingStrategy

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState<TaskType>(TaskType.BASIC);
  const [dueDate, setDueDate] = useState("");
  const [subTasks, setSubTasks] = useState<string[]>([]);
  const [newSubTaskText, setNewSubTaskText] = useState("");
  const [notifications, setNotifications] = useState<string[]>([]);
  const [sortStrategy, setSortStrategy] = useState<
    "sortByDate" | "sortByName" | "sortById" | "sortByCompletion"
  >("sortByDate"); // Add sortStrategy state

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Check for overdue and upcoming tasks
    const overdueTasks = TaskNotificationObserver.checkOverdueTasks(tasks);
    const upcomingTasks = TaskNotificationObserver.checkUpcomingTasks(tasks);

    const newNotifications: string[] = [];
    if (overdueTasks.length > 0) {
      newNotifications.push(...overdueTasks);
    }
    if (upcomingTasks.length > 0) {
      newNotifications.push(...upcomingTasks);
    }

    if (newNotifications.length > 0) {
      setNotifications(newNotifications);
    }
  }, [tasks]);

  // Handle task creation
  const handleAddTask = () => {
    if (!title.trim()) return;

    if (taskType === TaskType.TIMED && !dueDate) {
      alert("Please set a due date for timed tasks.");
      return;
    }

    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      type: taskType,
      isCompleted: false,
      dueDate: taskType === TaskType.TIMED ? dueDate : undefined,
      subTasks:
        taskType === TaskType.CHECKLIST
          ? subTasks.map((text) => ({ text, isDone: false }))
          : undefined,
    };

    setTasks((prev) => [...prev, newTask]);
    setTitle("");
    setDescription("");
    setDueDate("");
    setSubTasks([]);
    setNewSubTaskText("");
    setTaskType(TaskType.BASIC);
  };

  // Handle task completion toggle
  const handleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  // Handle task deletion
  const handleDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  // Handle subtask completion toggle
  const handleToggleSubTask = (taskId: string, subTaskIndex: number) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId && task.subTasks) {
          const updatedSubTasks = [...task.subTasks];
          updatedSubTasks[subTaskIndex] = {
            ...updatedSubTasks[subTaskIndex],
            isDone: !updatedSubTasks[subTaskIndex].isDone,
          };
          return { ...task, subTasks: updatedSubTasks };
        }
        return task;
      })
    );
  };

  // Sort tasks based on selected strategy
  let sortedTasks: Task[] = [...tasks];
  switch (sortStrategy) {
    case "sortByDate":
      sortedTasks = TaskSortingStrategy.sortByDate(tasks);
      break;
    case "sortByName":
      sortedTasks = TaskSortingStrategy.sortByName(tasks);
      break;
    case "sortById":
      sortedTasks = TaskSortingStrategy.sortById(tasks);
      break;
    case "sortByCompletion":
      sortedTasks = TaskSortingStrategy.sortByCompletion(tasks);
      break;
    default:
      sortedTasks = TaskSortingStrategy.sortByDate(tasks);
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">To-Do List</h1>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((message, index) => (
            <Notification key={index} message={message} type="info" />
          ))}
        </div>
      )}

      {/* Task Form */}
      <div className="space-y-4 bg-white p-4 rounded-xl shadow">
        <input
          type="text"
          placeholder="Task title"
          className="w-full px-3 py-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Task description"
          className="w-full px-3 py-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          data-testid="task-type-select"
          className="w-full px-3 py-2 border rounded"
          value={taskType}
          onChange={(e) => setTaskType(e.target.value as TaskType)}
        >
          <option value={TaskType.BASIC}>Basic</option>
          <option value={TaskType.TIMED}>Timed</option>
          <option value={TaskType.CHECKLIST}>Checklist</option>
        </select>

        {taskType === TaskType.TIMED && (
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border rounded"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        )}

        {taskType === TaskType.CHECKLIST && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter sub-task"
                className="flex-1 px-3 py-2 border rounded"
                value={newSubTaskText}
                onChange={(e) => setNewSubTaskText(e.target.value)}
              />
              <button
                onClick={() => {
                  if (newSubTaskText.trim()) {
                    setSubTasks([...subTasks, newSubTaskText.trim()]);
                    setNewSubTaskText("");
                  }
                }}
                className="bg-blue-500 text-white px-3 py-2 rounded"
              >
                Add
              </button>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {subTasks.map((text, index) => (
                <li key={index}>{text}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleAddTask}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Add Task
        </button>
      </div>

      {/* Sorting Controls */}
      <div className="space-x-4">
        <label htmlFor="sortSelect" className="font-medium text-gray-700">
          Sort By:
        </label>
        <select
          id="sortSelect"
          data-testid="sort-select"
          className="px-3 py-2 border rounded"
          value={sortStrategy}
          onChange={(e) =>
            setSortStrategy(
              e.target.value as
                | "sortByDate"
                | "sortByName"
                | "sortById"
                | "sortByCompletion"
            )
          }
        >
          <option value="sortByDate">Due Date</option>
          <option value="sortByName">Name</option>
          <option value="sortById">ID</option>
          <option value="sortByCompletion">Completion</option>
        </select>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {sortedTasks.map((task) => (
          <TaskFactory
            key={task.id}
            task={task}
            onComplete={() => handleComplete(task.id)}
            onDelete={() => handleDelete(task.id)}
            onToggleSubTask={handleToggleSubTask}
          />
        ))}
      </div>
    </main>
  );
}
