import React from "react";
import { Task, TaskType } from "../interfaces/Task";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react"; // Importing the check-circle icon from lucide-react

interface TaskProps {
  task: Task;
  onComplete?: () => void;
  onDelete?: () => void;
  onToggleSubTask?: (taskId: string, subTaskIndex: number) => void;
}

const TaskContainer: React.FC<React.PropsWithChildren<TaskProps>> = ({
  task,
  children,
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    data-testid="task-item"
    className={`p-4 rounded-xl shadow-md border flex justify-between items-start gap-4 ${
      task.type === TaskType.TIMED
        ? "bg-blue-50 border-blue-200"
        : task.type === TaskType.CHECKLIST
        ? "bg-green-50 border-green-200"
        : "bg-white border-gray-200"
    }`}
  >
    {children}
  </motion.div>
);

const ActionButtons: React.FC<{
  task: Task;
  onComplete?: () => void;
  onDelete?: () => void;
}> = ({ task, onComplete, onDelete }) => (
  <div className="flex flex-col gap-2 items-end">
    {!task.isCompleted && (
      <button
        onClick={onComplete}
        className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full transition"
      >
        Complete
      </button>
    )}
    <button
      data-testid="delete-button"
      onClick={onDelete}
      className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition"
    >
      Delete
    </button>
  </div>
);

const BasicTask: React.FC<TaskProps> = ({ task, onComplete, onDelete }) => (
  <TaskContainer task={task}>
    <div>
      <h3
        className={`text-lg font-semibold ${
          task.isCompleted ? "line-through text-gray-400" : ""
        }`}
      >
        {task.title}
      </h3>
      {task.description && (
        <p className="text-gray-600 text-sm">{task.description}</p>
      )}
    </div>
    {/* Show checkmark indicator when task is completed */}
    {task.isCompleted && (
      <div className="absolute top-4 right-4 text-green-500">
        <CheckCircle size={24} />
      </div>
    )}
    <ActionButtons task={task} onComplete={onComplete} onDelete={onDelete} />
  </TaskContainer>
);

const TimedTask: React.FC<TaskProps> = ({ task, onComplete, onDelete }) => (
  <TaskContainer task={task}>
    <div>
      <h3
        className={`text-lg font-semibold ${
          task.isCompleted ? "line-through text-gray-400" : ""
        }`}
      >
        {task.title}
      </h3>
      {task.description && (
        <p className="text-gray-600 text-sm">{task.description}</p>
      )}
      {task.dueDate && (
        <p className="text-xs text-blue-500 mt-1">
          Due:{" "}
          {new Date(task.dueDate).toLocaleString("en-PH", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          })}
        </p>
      )}
    </div>
    {/* Show checkmark indicator when task is completed */}
    {task.isCompleted && (
      <div className="absolute top-4 right-4 text-green-500">
        <CheckCircle size={24} />
      </div>
    )}
    <ActionButtons task={task} onComplete={onComplete} onDelete={onDelete} />
  </TaskContainer>
);

const ChecklistTask: React.FC<TaskProps> = ({
  task,
  onComplete,
  onDelete,
  onToggleSubTask,
}) => (
  <TaskContainer task={task}>
    <div className="flex-1">
      <h3
        className={`text-lg font-semibold ${
          task.isCompleted ? "line-through text-gray-400" : ""
        }`}
      >
        {task.title}
      </h3>
      {task.description && (
        <p className="text-gray-600 text-sm">{task.description}</p>
      )}

      {/* Render sub-tasks if present */}
      {task.subTasks && task.subTasks.length > 0 && (
        <ul className="mt-3 space-y-2">
          {task.subTasks.map((subTask, index) => (
            <li key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={subTask.isDone}
                onChange={() => onToggleSubTask?.(task.id, index)}
                className="form-checkbox h-4 w-4 text-green-600"
              />
              <span
                className={`text-sm ${
                  subTask.isDone ? "line-through text-gray-400" : ""
                }`}
              >
                {subTask.text}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={onComplete}
          className="form-checkbox h-5 w-5 text-green-600"
        />
        <span className="text-sm">Mark as Completed</span>
      </div>
    </div>

    {/* Checkmark icon if task is completed */}
    {task.isCompleted && (
      <div className="absolute top-4 right-4 text-green-500">
        <CheckCircle size={24} />
      </div>
    )}

    <ActionButtons task={task} onComplete={onComplete} onDelete={onDelete} />
  </TaskContainer>
);

export const TaskFactory: React.FC<{
  task: Task;
  onComplete?: () => void;
  onDelete?: () => void;
  onToggleSubTask?: (taskId: string, subTaskIndex: number) => void;
}> = ({ task, onComplete, onDelete, onToggleSubTask }) => {
  switch (task.type) {
    case TaskType.TIMED:
      return (
        <TimedTask task={task} onComplete={onComplete} onDelete={onDelete} />
      );
    case TaskType.CHECKLIST:
      return (
        <ChecklistTask
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
          onToggleSubTask={onToggleSubTask}
        />
      );
    case TaskType.BASIC:
    default:
      return (
        <BasicTask task={task} onComplete={onComplete} onDelete={onDelete} />
      );
  }
};
