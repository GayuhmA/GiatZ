"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/store/useTaskStore";
import { CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ClockIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (id: string, currentStatus: boolean) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

// 1. Decoupled UI Component for consistent look in list and overlay
interface TaskCardUIProps {
  task: Task;
  isDragging?: boolean;
  isOverlay?: boolean;
  onToggleComplete?: (id: string, currentStatus: boolean) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  listeners?: any;
  attributes?: any;
}

export function TaskCardUI({
  task,
  isDragging,
  isOverlay,
  onToggleComplete,
  onEdit,
  onDelete,
  listeners,
  attributes,
}: TaskCardUIProps) {
  return (
    <div
      {...attributes}
      {...listeners}
      className={`touch-none relative group select-none
        ${isDragging ? "opacity-0" : "opacity-100"} 
        ${task.completed && !isOverlay ? "opacity-60" : ""}
        ${isOverlay ? "z-50 cursor-grabbing scale-105" : "cursor-grab active:cursor-grabbing"}
        transition-all duration-400 cubic-bezier(0.4, 0, 0.2, 1)
      `}
    >
      <div
        className={`bg-white p-4 rounded-2xl border border-gray-100 relative
          transition-all duration-400 cubic-bezier(0.4, 0, 0.2, 1)
          ${isOverlay ? "shadow-2xl ring-2 ring-primary/20 scale-[1.02]" : "hover:shadow-lg hover:border-gray-200"}
        `}
        onClick={() => !isOverlay && onEdit?.(task)}
      >
        <div className="flex gap-3">
          <button
            type="button"
            className={`mt-1 shrink-0 ${task.completed ? "cursor-not-allowed" : ""}`}
            disabled={task.completed || isOverlay}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              if (!task.completed) {
                onToggleComplete?.(task.id, task.completed);
              }
            }}
          >
            <CheckCircleIcon
              className={`w-5 h-5 transition-colors duration-200 ${
                task.completed
                  ? "text-success fill-success/20"
                  : "text-gray-300 hover:text-success"
              }`}
            />
          </button>

          <div className="flex-1 min-w-0">
            <h4
              className={`font-extrabold text-sm md:text-base break-words tracking-tight
                ${task.completed ? "text-text-secondary line-through opacity-70" : "text-text-primary"}`}
            >
              {task.title}
            </h4>

            {task.description && (
              <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            {task.dueDate && (
              <div className="mt-3 flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-text-secondary bg-gray-50 border border-gray-100 w-fit px-2.5 py-1 rounded-full uppercase tracking-wider">
                <ClockIcon className="w-3.5 h-3.5" />
                {task.dueDate.toLocaleDateString()}
              </div>
            )}
          </div>

          <div
            className={`flex items-center justify-center shrink-0 gap-2 transition-opacity duration-200
            ${isOverlay ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          >
            {!isOverlay && (
              <button
                type="button"
                className="p-1 hover:bg-danger-light rounded-md transition-colors group/del"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(task.id);
                }}
              >
                <TrashIcon className="w-5 h-5 text-gray-400 group-hover/del:text-danger" />
              </button>
            )}
            <div className="p-1">
              <EllipsisVerticalIcon className="w-6 h-6 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Main Sortable Wrapper Component
export default function TaskCard(props: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.task.id,
    data: {
      type: "Task",
      task: props.task,
    },
  });

  const style = {
    // Standard dnd-kit cubic-bezier transition for buttery smooth movement
    transition: transition || undefined,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCardUI
        {...props}
        isDragging={isDragging}
        attributes={attributes}
        listeners={listeners}
      />
    </div>
  );
}
